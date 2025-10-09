/**
 * LIFE OS SETUP VERIFICATION
 *
 * Checks that all required environment variables are configured
 * before running database creation or agents.
 */

require('dotenv').config();

function checkEnvVar(name, required = true) {
  const value = process.env[name];
  const exists = value && value.trim() !== '';

  if (exists) {
    console.log(`✅ ${name}: configured`);
    return true;
  } else {
    if (required) {
      console.log(`❌ ${name}: MISSING (required)`);
    } else {
      console.log(`⚠️  ${name}: not configured (optional)`);
    }
    return !required;
  }
}

console.log('\n🔍 LIFE OS SETUP VERIFICATION\n');
console.log('═'.repeat(50));

console.log('\n📋 NOTION CONFIGURATION:\n');
const notionOk = [
  checkEnvVar('NOTION_API_KEY'),
  checkEnvVar('NOTION_PARENT_PAGE_ID')
].every(Boolean);

console.log('\n📅 GOOGLE CALENDAR CONFIGURATION:\n');
const calendarOk = [
  checkEnvVar('GOOGLE_CLIENT_ID'),
  checkEnvVar('GOOGLE_CLIENT_SECRET'),
  checkEnvVar('GOOGLE_REFRESH_TOKEN')
].every(Boolean);

console.log('\n🗺️  GOOGLE MAPS CONFIGURATION:\n');
const mapsOk = checkEnvVar('GOOGLE_MAPS_API_KEY');

console.log('\n🤖 LIFE OS DATABASES (will be created by script):\n');
[
  'NOTION_DATABASE_CURRENT_SELF',
  'NOTION_DATABASE_BEST_SELF',
  'NOTION_DATABASE_RESISTANCE',
  'NOTION_DATABASE_OPPORTUNITIES',
  'NOTION_DATABASE_INCOME_STREAMS',
  'NOTION_DATABASE_PEOPLE',
  'NOTION_DATABASE_AI_AGENTS'
].forEach(name => checkEnvVar(name, false));

console.log('\n' + '═'.repeat(50));

if (notionOk && calendarOk && mapsOk) {
  console.log('\n✅ SETUP COMPLETE - Ready to create Life OS databases!\n');
  console.log('Next step: Run this command:\n');
  console.log('  node scripts/create-lifeos-databases.js\n');
  process.exit(0);
} else {
  console.log('\n❌ SETUP INCOMPLETE - Please fix the issues above\n');

  if (!notionOk) {
    console.log('📋 NOTION ISSUES:');
    if (!process.env.NOTION_API_KEY) {
      console.log('  - Get your Notion API key from: https://www.notion.so/my-integrations');
    }
    if (!process.env.NOTION_PARENT_PAGE_ID) {
      console.log('  - Create a "Life OS" page in Notion and copy the page ID from the URL');
      console.log('  - Share the page with your Notion integration');
    }
  }

  if (!calendarOk) {
    console.log('\n📅 GOOGLE CALENDAR ISSUES:');
    console.log('  - Run: node scripts/authorize-google-calendar.js');
  }

  if (!mapsOk) {
    console.log('\n🗺️  GOOGLE MAPS ISSUES:');
    console.log('  - Get API key from: https://console.cloud.google.com/google/maps-apis');
    console.log('  - Enable Distance Matrix API and Maps JavaScript API');
  }

  console.log('\nSee DEPLOYMENT.md for detailed instructions.\n');
  process.exit(1);
}
