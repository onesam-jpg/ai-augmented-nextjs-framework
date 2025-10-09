import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { google } from 'googleapis';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Initialize Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/oauth2callback'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function GET() {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch tasks from Notion
    const notionResponse = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_TASKS!,
      page_size: 100,
    });

    // Filter and format tasks
    // Note: Most properties are rich_text, not select in the actual database
    const tasks = notionResponse.results
      .filter((page: any) => {
        const status = page.properties.Status?.rich_text?.[0]?.plain_text;
        return status === 'Active' || status === 'In Progress';
      })
      .map((page: any) => {
        const props = page.properties;

        return {
          id: page.id,
          name: props.Task?.title?.[0]?.plain_text || 'Untitled',
          status: props.Status?.rich_text?.[0]?.plain_text || 'Unknown',
          priority: props.Priority?.rich_text?.[0]?.plain_text || 'Medium',
          category: props.Category?.rich_text?.[0]?.plain_text || 'Personal',
          due: props.Due?.date?.start || null,
          impactScore: parseInt(props.ImpactScore?.rich_text?.[0]?.plain_text || '0') || null,
          effort: props.Effort?.rich_text?.[0]?.plain_text || null,
          whyItMatters: props.WhyItMatters?.rich_text?.[0]?.plain_text || null,
          nextBite: props.NextBite?.rich_text?.[0]?.plain_text || null,
          nonDeferrable: props.NonDeferrable?.rich_text?.[0]?.plain_text === 'Yes',
          calendarEventId: props.calendar_event_id?.rich_text?.[0]?.plain_text || null,
          calendarEventLink: props.calendar_event_id?.rich_text?.[0]?.plain_text
            ? `https://calendar.google.com/calendar/event?eid=${encodeURIComponent(props.calendar_event_id.rich_text[0].plain_text)}`
            : null,
        };
      })
      .sort((a: any, b: any) => {
        // Sort by priority
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;

        if (aPriority !== bPriority) return aPriority - bPriority;

        // Then by due date
        if (a.due && !b.due) return -1;
        if (!a.due && b.due) return 1;
        if (a.due && b.due) {
          return new Date(a.due).getTime() - new Date(b.due).getTime();
        }

        return 0;
      });

    // Fetch events from Google Calendar
    const calendarResponse = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    const events = (calendarResponse.data.items || []).map((event: any) => ({
      id: event.id,
      summary: event.summary || 'No Title',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description || null,
      htmlLink: event.htmlLink,
      colorId: event.colorId || null,
    }));

    return NextResponse.json({
      success: true,
      tasks,
      events,
      stats: {
        totalTasks: tasks.length,
        totalEvents: events.length,
        nonDeferrableTasks: tasks.filter((t: any) => t.nonDeferrable).length,
        criticalTasks: tasks.filter((t: any) => t.priority === 'Critical').length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch tasks',
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}
