#!/usr/bin/env node

/**
 * Google Calendar MCP Server
 * Provides calendar access tools for AI agents
 */

import dotenv from 'dotenv';
import { CalendarClient } from './lib/calendar-client.js';

dotenv.config({ path: '../../.env' });

// Initialize calendar client
const client = new CalendarClient({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  redirectUri: 'http://localhost:3001/oauth2callback',
});

console.error('Google Calendar MCP Server started');

// MCP Protocol: Read JSON-RPC requests from stdin
process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk) => {
  buffer += chunk;

  // Process complete JSON messages
  const lines = buffer.split('\n');
  buffer = lines.pop(); // Keep incomplete line in buffer

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const request = JSON.parse(line);
      const response = await handleRequest(request);
      console.log(JSON.stringify(response));
    } catch (error) {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: 'Parse error: ' + error.message,
        },
        id: null,
      }));
    }
  }
});

async function handleRequest(request) {
  const { jsonrpc, method, params, id } = request;

  try {
    let result;

    switch (method) {
      case 'tools/list':
        result = {
          tools: [
            {
              name: 'list_events',
              description: 'List calendar events in a date range',
              inputSchema: {
                type: 'object',
                properties: {
                  startDate: { type: 'string', description: 'Start date (ISO 8601)' },
                  endDate: { type: 'string', description: 'End date (ISO 8601)' },
                  maxResults: { type: 'integer', default: 50 },
                },
                required: ['startDate', 'endDate'],
              },
            },
            {
              name: 'create_event',
              description: 'Create a new calendar event',
              inputSchema: {
                type: 'object',
                properties: {
                  summary: { type: 'string', description: 'Event title' },
                  description: { type: 'string', description: 'Event details' },
                  start: { type: 'string', description: 'Start time (ISO 8601)' },
                  end: { type: 'string', description: 'End time (ISO 8601)' },
                  colorId: { type: 'string', description: 'Color ID (1-11)' },
                  location: { type: 'string', description: 'Event location' },
                },
                required: ['summary', 'start', 'end'],
              },
            },
            {
              name: 'update_event',
              description: 'Update an existing calendar event',
              inputSchema: {
                type: 'object',
                properties: {
                  eventId: { type: 'string', description: 'Event ID' },
                  updates: { type: 'object', description: 'Fields to update' },
                },
                required: ['eventId', 'updates'],
              },
            },
            {
              name: 'delete_event',
              description: 'Delete a calendar event',
              inputSchema: {
                type: 'object',
                properties: {
                  eventId: { type: 'string', description: 'Event ID to delete' },
                },
                required: ['eventId'],
              },
            },
            {
              name: 'find_free_slots',
              description: 'Find available time slots for scheduling',
              inputSchema: {
                type: 'object',
                properties: {
                  date: { type: 'string', description: 'Target date (YYYY-MM-DD)' },
                  durationMinutes: { type: 'integer', description: 'Required duration' },
                  preferredTimeRanges: {
                    type: 'array',
                    description: 'Preferred time ranges',
                    default: [{ start: '09:00', end: '17:00' }],
                  },
                  bufferMinutes: { type: 'integer', default: 15 },
                },
                required: ['date', 'durationMinutes'],
              },
            },
            {
              name: 'get_event',
              description: 'Get details of a specific event',
              inputSchema: {
                type: 'object',
                properties: {
                  eventId: { type: 'string', description: 'Event ID' },
                },
                required: ['eventId'],
              },
            },
          ],
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;

        switch (name) {
          case 'list_events':
            result = await client.listEvents(args);
            break;
          case 'create_event':
            result = await client.createEvent(args);
            break;
          case 'update_event':
            result = await client.updateEvent(args.eventId, args.updates);
            break;
          case 'delete_event':
            result = await client.deleteEvent(args.eventId);
            break;
          case 'find_free_slots':
            result = await client.findFreeSlots(args);
            break;
          case 'get_event':
            result = await client.getEvent(args.eventId);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        if (!result.success) {
          throw new Error(result.error);
        }
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }

    return {
      jsonrpc,
      result,
      id,
    };
  } catch (error) {
    return {
      jsonrpc,
      error: {
        code: -32603,
        message: error.message,
      },
      id,
    };
  }
}
