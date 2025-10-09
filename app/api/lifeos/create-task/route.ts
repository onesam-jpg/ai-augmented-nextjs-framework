import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { google } from 'googleapis';

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
    const { name, priority, category, due, impactScore, effort, whyItMatters, nextBite, nonDeferrable } = body;

    // Build properties based on actual Notion database schema
    // Title property is "Task" (not "Name")
    // Most properties are rich_text, except Due (date)
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
      ImpactScore: {
        rich_text: [{ text: { content: impactScore.toString() } }]
      },
      Effort: {
        rich_text: [{ text: { content: effort } }]
      },
      NonDeferrable: {
        rich_text: [{ text: { content: nonDeferrable === 'true' ? 'Yes' : 'No' } }]
      }
    };

    // Add optional fields only if they have values
    if (whyItMatters) {
      taskProperties.WhyItMatters = {
        rich_text: [{ text: { content: whyItMatters } }]
      };
    }

    // 1. Create task in Notion
    const notionTask = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_TASKS! },
      properties: taskProperties
    });

    // 2. Create calendar event
    const durationMinutes = {
      'Quick (15min)': 30,
      'Short (1hr)': 60,
      'Medium (half day)': 240,
      'Long (full day+)': 480
    }[effort] || 60;

    const startTime = new Date(due);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const colorId = {
      'Critical': '11',
      'High': '6',
      'Medium': '5',
      'Low': '2'
    }[priority] || '5';

    const calendarEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `[${category}] ${name}`,
        description: `Why it matters: ${whyItMatters}\n\nNext bite: ${nextBite}\n\n🔗 Synced from LifeOS`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: process.env.CALENDAR_TIMEZONE || 'America/New_York'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: process.env.CALENDAR_TIMEZONE || 'America/New_York'
        },
        colorId: colorId,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 }
          ]
        }
      }
    });

    // 3. Update Notion task with calendar event ID
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
      calendarEvent: calendarEvent.data.htmlLink
    });

  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
