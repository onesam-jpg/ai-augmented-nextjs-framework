#!/usr/bin/env node

/**
 * MVP: Notion Task → Google Calendar Sync
 *
 * This script syncs tasks with due dates from Notion to Google Calendar
 *
 * Usage: node scripts/sync-notion-to-calendar.js
 */

require('dotenv').config();
const { google } = require('googleapis');
const { Client } = require('@notionhq/client');

// Initialize clients
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

console.log('\n🔄 LifeOS Sync: Notion Tasks → Google Calendar\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function syncTasksToCalendar() {
  try {
    // 1. Query Notion for Active tasks with Due dates (no calendar event yet)
    console.log('📋 Fetching tasks from Notion...');

    // Get all tasks (no filter - we'll filter in code)
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_TASKS,
      page_size: 50
    });

    // Filter for tasks with due dates, Active status, and no calendar event
    const tasksToSync = response.results.filter(task => {
      const status = task.properties.Status?.select?.name || task.properties.Status?.status?.name || '';
      const dueDate = task.properties.Due?.date?.start || task.properties.Due?.rich_text?.[0]?.plain_text || '';
      const calendarEventId = task.properties.calendar_event_id?.rich_text?.[0]?.plain_text;

      return dueDate && status === 'Active' && !calendarEventId;
    });

    console.log(`   Found ${tasksToSync.length} tasks to sync\n`);

    if (tasksToSync.length === 0) {
      console.log('✅ All tasks are already synced!\n');
      return;
    }

    // 2. For each task, create calendar event
    let syncedCount = 0;

    for (const task of tasksToSync) {
      const props = task.properties;
      const taskName = props.Name?.title?.[0]?.plain_text || 'Untitled Task';
      const dueDate = props.Due?.date?.start;
      const category = props.Category?.select?.name || '';
      const priority = props.Priority?.select?.name || 'Medium';
      const whyItMatters = props.WhyItMatters?.rich_text?.[0]?.plain_text || '';
      const nextBite = props.NextBite?.rich_text?.[0]?.plain_text || '';
      const effort = props.Effort?.select?.name || 'Short (1hr)';

      // Determine duration based on effort
      const durationMinutes = {
        'Quick (15min)': 30,
        'Short (1hr)': 60,
        'Medium (half day)': 240,
        'Long (full day+)': 480
      }[effort] || 60;

      // Parse due date and create start/end times
      const dueDateTime = new Date(dueDate);
      const startTime = new Date(dueDateTime);

      // If due date has no time, default to 9 AM
      if (!dueDate.includes('T')) {
        startTime.setHours(9, 0, 0, 0);
      }

      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      // Determine color based on priority
      const colorId = {
        'Critical': '11', // Red
        'High': '6',      // Orange
        'Medium': '5',    // Yellow
        'Low': '2'        // Green
      }[priority] || '5';

      // Create calendar event
      console.log(`   Creating event: [${category}] ${taskName}`);

      try {
        const event = await calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: `[${category}] ${taskName}`,
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

        // Save event ID back to Notion
        await notion.pages.update({
          page_id: task.id,
          properties: {
            calendar_event_id: {
              rich_text: [{ text: { content: event.data.id } }]
            }
          }
        });

        console.log(`   ✅ Synced: ${event.data.htmlLink}\n`);
        syncedCount++;

      } catch (calError) {
        console.error(`   ❌ Error creating event: ${calError.message}\n`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`🎉 Sync complete! ${syncedCount}/${tasksToSync.length} tasks synced to calendar\n`);

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    if (error.code === 'object_not_found') {
      console.error('   💡 Make sure you shared the Tasks database with your Notion integration');
    }
    process.exit(1);
  }
}

// Run sync
syncTasksToCalendar();
