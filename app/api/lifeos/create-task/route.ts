import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { google } from 'googleapis';
import { calculateTravelTime, formatTravelDuration, getDirectionsLink } from '../../../../lib/google-maps-service';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/oauth2callback'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, priority, category, due, impactScore, effort, whyItMatters, nextBite, nonDeferrable, location } = body;

    // Calculate task duration
    const durationMinutes = {
      'Quick (15min)': 30,
      'Short (1hr)': 60,
      'Medium (half day)': 240,
      'Long (full day+)': 480
    }[effort] || 60;

    // STEP 1: Find previous task with location (sorted by ActualEndTime DESC)
    let previousTask = null;
    let travelTimeMinutes = 0;
    let travelFrom = '';
    let schedulingStatus = 'Scheduled';
    let conflictDetails = '';

    if (location) {
      const previousTasksQuery = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_TASKS!,
        filter: {
          and: [
            {
              property: 'Location',
              rich_text: { is_not_empty: true }
            },
            {
              property: 'ActualEndTime',
              date: { is_not_empty: true }
            }
          ]
        },
        sorts: [
          {
            property: 'ActualEndTime',
            direction: 'descending'
          }
        ],
        page_size: 1
      });

      if (previousTasksQuery.results.length > 0) {
        previousTask = previousTasksQuery.results[0];
        const prevLocation = (previousTask.properties as any).Location?.rich_text?.[0]?.plain_text;

        if (prevLocation) {
          // Calculate travel time
          const travelInfo = await calculateTravelTime(prevLocation, location);

          if (travelInfo) {
            travelTimeMinutes = Math.ceil(travelInfo.duration / 60); // Convert seconds to minutes
            travelFrom = prevLocation;
          }
        }
      }
    }

    // STEP 2: Calculate actual start and end times
    let actualStartTime: Date;
    let actualEndTime: Date;

    if (previousTask && travelTimeMinutes > 0) {
      // Get previous task's actual end time
      const prevEndTime = new Date((previousTask.properties as any).ActualEndTime.date.start);

      // New task starts after previous task ends + travel time
      actualStartTime = new Date(prevEndTime.getTime() + travelTimeMinutes * 60000);
      actualEndTime = new Date(actualStartTime.getTime() + durationMinutes * 60000);
    } else {
      // No previous task or no travel needed - use requested due time
      actualStartTime = new Date(due);
      actualEndTime = new Date(actualStartTime.getTime() + durationMinutes * 60000);
    }

    // STEP 3: Check for conflicts with next task
    const nextTasksQuery = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_TASKS!,
      filter: {
        property: 'ActualStartTime',
        date: {
          after: actualStartTime.toISOString()
        }
      },
      sorts: [
        {
          property: 'ActualStartTime',
          direction: 'ascending'
        }
      ],
      page_size: 1
    });

    if (nextTasksQuery.results.length > 0) {
      const nextTask = nextTasksQuery.results[0];
      const nextTaskStartTime = new Date((nextTask.properties as any).ActualStartTime.date.start);

      // Check if new task ends before next task starts
      if (actualEndTime > nextTaskStartTime) {
        schedulingStatus = 'Conflict';
        const overlapMinutes = Math.ceil((actualEndTime.getTime() - nextTaskStartTime.getTime()) / 60000);
        const nextTaskName = (nextTask.properties as any).Task?.title?.[0]?.plain_text || 'Untitled';

        conflictDetails = `Conflicts with "${nextTaskName}" by ${overlapMinutes} minutes. Next task starts at ${nextTaskStartTime.toLocaleTimeString()}, but this task would end at ${actualEndTime.toLocaleTimeString()}.`;

        // Return conflict error
        return NextResponse.json({
          success: false,
          error: 'SCHEDULING_CONFLICT',
          conflict: {
            message: conflictDetails,
            suggestedStartTime: nextTaskStartTime.toISOString(),
            requestedStartTime: actualStartTime.toISOString(),
            calculatedEndTime: actualEndTime.toISOString(),
            conflictingTask: nextTaskName
          }
        }, { status: 409 });
      }
    }

    // Build Notion task properties
    const taskProperties: any = {
      Task: {
        title: [{ text: { content: name } }]
      },
      Status: {
        rich_text: [{ text: { content: 'Active' } }]
      },
      Priority: {
        rich_text: [{ text: { content: priority } }]
      },
      Category: {
        rich_text: [{ text: { content: category } }]
      },
      Due: {
        date: { start: due }
      },
      ActualStartTime: {
        date: { start: actualStartTime.toISOString() }
      },
      ActualEndTime: {
        date: { start: actualEndTime.toISOString() }
      },
      ImpactScore: {
        rich_text: [{ text: { content: impactScore.toString() } }]
      },
      Effort: {
        rich_text: [{ text: { content: effort } }]
      },
      NonDeferrable: {
        rich_text: [{ text: { content: nonDeferrable === 'true' ? 'Yes' : 'No' } }]
      },
      SchedulingStatus: {
        select: { name: schedulingStatus }
      }
    };

    // Add location fields if provided
    if (location) {
      taskProperties.Location = {
        rich_text: [{ text: { content: location } }]
      };

      if (travelTimeMinutes > 0) {
        taskProperties.TravelTimeMinutes = {
          number: travelTimeMinutes
        };
        taskProperties.TravelTime = {
          rich_text: [{ text: { content: formatTravelDuration(travelTimeMinutes * 60) } }]
        };
        taskProperties.TravelFrom = {
          rich_text: [{ text: { content: travelFrom } }]
        };
      }
    }

    // Add optional fields
    if (whyItMatters) {
      taskProperties.WhyItMatters = {
        rich_text: [{ text: { content: whyItMatters } }]
      };
    }

    if (conflictDetails) {
      taskProperties.ConflictDetails = {
        rich_text: [{ text: { content: conflictDetails } }]
      };
    }

    // Create task in Notion
    const notionTask = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_TASKS! },
      properties: taskProperties
    });

    // Create calendar event
    const colorId = {
      'Critical': '11',
      'High': '6',
      'Medium': '5',
      'Low': '2'
    }[priority] || '5';

    let calendarDescription = `Why it matters: ${whyItMatters}\n\nNext bite: ${nextBite}\n\n🔗 Synced from LifeOS`;

    if (location) {
      calendarDescription += `\n\n📍 Location: ${location}`;

      if (travelTimeMinutes > 0 && travelFrom) {
        const directionsLink = getDirectionsLink(travelFrom, location);
        calendarDescription += `\n🚗 Travel from: ${travelFrom}\n⏱️ Travel time: ${formatTravelDuration(travelTimeMinutes * 60)}\n🗺️ Directions: ${directionsLink}`;
      }
    }

    const calendarEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `[${category}] ${name}`,
        description: calendarDescription,
        start: {
          dateTime: actualStartTime.toISOString()
        },
        end: {
          dateTime: actualEndTime.toISOString()
        },
        location: location || undefined,
        colorId: colorId,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: travelTimeMinutes > 0 ? travelTimeMinutes + 10 : 10 }
          ]
        }
      }
    });

    // Update Notion task with calendar event ID
    await notion.pages.update({
      page_id: notionTask.id,
      properties: {
        calendar_event_id: {
          rich_text: [{ text: { content: calendarEvent.data.id! } }]
        }
      }
    });

    return NextResponse.json({
      success: true,
      notionTask: notionTask.id,
      calendarEvent: calendarEvent.data.htmlLink,
      scheduling: {
        actualStartTime: actualStartTime.toISOString(),
        actualEndTime: actualEndTime.toISOString(),
        travelTimeMinutes,
        travelFrom,
        status: schedulingStatus
      }
    });

  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
