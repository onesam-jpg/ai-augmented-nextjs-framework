require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function addSchedulingFields() {
  try {
    console.log('\n📋 Adding scheduling fields to Tasks database...\n');

    const databaseId = process.env.NOTION_DATABASE_TASKS;

    // Add ActualStartTime (Date)
    console.log('Adding ActualStartTime (Date)...');
    await notion.databases.update({
      database_id: databaseId,
      properties: {
        ActualStartTime: {
          date: {}
        }
      }
    });

    // Add ActualEndTime (Date)
    console.log('Adding ActualEndTime (Date)...');
    await notion.databases.update({
      database_id: databaseId,
      properties: {
        ActualEndTime: {
          date: {}
        }
      }
    });

    // Add TravelTimeMinutes (Number)
    console.log('Adding TravelTimeMinutes (Number)...');
    await notion.databases.update({
      database_id: databaseId,
      properties: {
        TravelTimeMinutes: {
          number: { format: 'number' }
        }
      }
    });

    // Add SchedulingStatus (Select)
    console.log('Adding SchedulingStatus (Select)...');
    await notion.databases.update({
      database_id: databaseId,
      properties: {
        SchedulingStatus: {
          select: {
            options: [
              { name: 'Scheduled', color: 'green' },
              { name: 'Conflict', color: 'red' },
              { name: 'NeedsReview', color: 'yellow' }
            ]
          }
        }
      }
    });

    // Add ConflictDetails (Rich Text)
    console.log('Adding ConflictDetails (Rich Text)...');
    await notion.databases.update({
      database_id: databaseId,
      properties: {
        ConflictDetails: {
          rich_text: {}
        }
      }
    });

    console.log('\n✅ All scheduling fields added successfully!\n');

    // Verify
    const database = await notion.databases.retrieve({
      database_id: databaseId
    });

    console.log('Updated schema includes:');
    console.log('- ActualStartTime:', database.properties.ActualStartTime?.type);
    console.log('- ActualEndTime:', database.properties.ActualEndTime?.type);
    console.log('- TravelTimeMinutes:', database.properties.TravelTimeMinutes?.type);
    console.log('- SchedulingStatus:', database.properties.SchedulingStatus?.type);
    console.log('- ConflictDetails:', database.properties.ConflictDetails?.type);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
  }
}

addSchedulingFields();
