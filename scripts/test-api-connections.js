#!/usr/bin/env node

/**
 * Test API Connections
 * Verifies Google Calendar and Notion API connectivity
 */

require('dotenv').config();
const { google } = require('googleapis');
const { Client } = require('@notionhq/client');

console.log('\n🧪 Testing API Connections\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test Google Calendar
async function testGoogleCalendar() {
  console.log('📅 Testing Google Calendar API...');

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3001/oauth2callback'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // List calendars
    const calendarList = await calendar.calendarList.list();
    console.log(`✅ Connected! Found ${calendarList.data.items.length} calendar(s):`);

    calendarList.data.items.forEach((cal, idx) => {
      const isPrimary = cal.id === 'onesam69@gmail.com' ? ' (PRIMARY)' : '';
      console.log(`   ${idx + 1}. ${cal.summary}${isPrimary}`);
    });

    // Get today's events from primary calendar
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log(`   📌 Today's events: ${events.data.items.length}`);

    return true;
  } catch (error) {
    console.error('❌ Google Calendar Error:', error.message);
    return false;
  }
}

// Test Notion
async function testNotion() {
  console.log('\n📝 Testing Notion API...');

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    // Test each database
    const databases = {
      'Tasks': process.env.NOTION_DATABASE_TASKS,
      'Projects': process.env.NOTION_DATABASE_PROJECTS,
      'Ideas': process.env.NOTION_DATABASE_IDEAS,
      'Daily Log': process.env.NOTION_DATABASE_DAILY_LOG,
      'Content': process.env.NOTION_DATABASE_CONTENT,
      'Finance': process.env.NOTION_DATABASE_FINANCE,
      'CRM': process.env.NOTION_DATABASE_CRM,
      'Habits': process.env.NOTION_DATABASE_HABITS,
    };

    console.log('✅ Connected! Testing databases:\n');

    let allSuccess = true;
    for (const [name, dbId] of Object.entries(databases)) {
      try {
        // Query database (limit 1 to test connection)
        const response = await notion.databases.retrieve({ database_id: dbId });

        console.log(`   ✅ ${name.padEnd(12)} - Database accessible`);
      } catch (dbError) {
        console.log(`   ❌ ${name.padEnd(12)} - ${dbError.message}`);
        allSuccess = false;
      }
    }

    if (!allSuccess) {
      console.log('\n⚠️  Some databases failed. Make sure you shared them with the integration!');
      console.log('   Go to each database → "..." → "Connections" → Select "LifeOS Integration"');
      return false;
    }

    // Query one task as example
    const tasksResponse = await notion.databases.retrieve({ database_id: databases.Tasks });
    console.log(`\n   📋 Tasks database: "${tasksResponse.title[0]?.plain_text}" ready`);

    return true;
  } catch (error) {
    console.error('❌ Notion Error:', error.message);
    if (error.code === 'unauthorized') {
      console.log('   💡 Check that your integration token is correct');
    }
    return false;
  }
}

// Run tests
(async () => {
  const googleOk = await testGoogleCalendar();
  const notionOk = await testNotion();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (googleOk && notionOk) {
    console.log('🎉 All API connections successful!');
    console.log('✅ Ready to build MCP servers and MVP sync\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some connections failed. Fix errors above before proceeding.\n');
    process.exit(1);
  }
})();
