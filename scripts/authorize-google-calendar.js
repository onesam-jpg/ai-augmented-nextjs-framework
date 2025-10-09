#!/usr/bin/env node

/**
 * Google Calendar OAuth 2.0 Authorization Script
 *
 * This script helps you get a refresh token for Google Calendar API access.
 * Run once during initial setup to authorize the app and get the refresh token.
 *
 * Usage:
 *   node scripts/authorize-google-calendar.js
 */

const { google } = require('googleapis');
const readline = require('readline');
const http = require('http');
const url = require('url');

// Load environment variables
require('dotenv').config();

// Load credentials from environment
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1048193436113-uuov2s3rcn9urimfu2c607rl1n4e8j80.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';

// Calendar API scope
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

console.log('\n🔐 Google Calendar Authorization\n');
console.log('This script will help you authorize LifeOS to access your Google Calendar.\n');

// Generate authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent' // Force to get refresh token
});

console.log('Step 1: Authorize this app by visiting this URL:\n');
console.log(authUrl);
console.log('\n');

// Start local server to capture callback
const server = http.createServer(async (req, res) => {
  if (req.url.indexOf('/oauth2callback') > -1) {
    const qs = new url.URL(req.url, `http://localhost:3001`).searchParams;
    const code = qs.get('code');

    if (code) {
      res.end('Authorization successful! You can close this window and return to the terminal.');

      try {
        console.log('\n✅ Authorization code received!');
        console.log('Exchanging code for tokens...\n');

        const { tokens } = await oauth2Client.getToken(code);

        console.log('✅ Success! Your Google Calendar is now connected.\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Add these to your .env file:\n');
        console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
        console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log(`GOOGLE_CALENDAR_ID=primary\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Test the connection
        oauth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        console.log('Testing connection...');
        const calendarList = await calendar.calendarList.list();
        console.log(`✅ Found ${calendarList.data.items.length} calendar(s):\n`);

        calendarList.data.items.forEach((cal, idx) => {
          console.log(`  ${idx + 1}. ${cal.summary} (ID: ${cal.id})`);
        });

        console.log('\n🎉 Setup complete! Your calendar is ready to use.\n');

      } catch (error) {
        console.error('❌ Error exchanging code for tokens:', error.message);
      }

      server.close();
      process.exit(0);
    } else {
      res.end('Authorization failed. Please try again.');
      server.close();
      process.exit(1);
    }
  }
});

server.listen(3001, () => {
  console.log('Step 2: Waiting for authorization...');
  console.log('(A browser window should open automatically. If not, copy the URL above.)\n');

  // Try to open browser automatically
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';

  require('child_process').exec(`${start} "${authUrl}"`);
});

// Handle errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  console.log('\nTip: If port 3001 is busy, close other applications and try again.');
  process.exit(1);
});

// Timeout after 5 minutes
setTimeout(() => {
  console.log('\n⏱️  Authorization timeout. Please run the script again.');
  server.close();
  process.exit(1);
}, 5 * 60 * 1000);
