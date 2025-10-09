require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function checkSchema() {
  try {
    console.log('\n📋 Fetching Tasks database schema...\n');

    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_TASKS
    });

    console.log('Database Title:', database.title[0]?.plain_text || 'No title');
    console.log('\n=== PROPERTIES ===\n');

    for (const [propName, propData] of Object.entries(database.properties)) {
      console.log(`${propName}:`);
      console.log(`  Type: ${propData.type}`);

      if (propData.type === 'select' && propData.select?.options) {
        console.log(`  Options: ${propData.select.options.map(o => o.name).join(', ')}`);
      }

      if (propData.type === 'title') {
        console.log(`  (This is the title property)`);
      }

      console.log('');
    }

    console.log('\n✅ Schema check complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('Details:', error.body);
    }
  }
}

checkSchema();
