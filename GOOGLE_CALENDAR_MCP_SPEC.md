# Google Calendar MCP Server Specification

> **Purpose**: Model Context Protocol (MCP) server providing secure, sandboxed access to Google Calendar API for AI agents.

**Version**: 1.0
**Status**: 🔄 Design Phase
**Priority**: ⭐ CRITICAL (Calendar integration is MVP foundation)

---

## 🎯 Overview

This MCP server enables AI agents (via Claude Code) to interact with Google Calendar for:
- Reading calendar events
- Creating new events (task scheduling)
- Updating existing events (rescheduling)
- Finding free time slots
- Managing event metadata (descriptions, colors, reminders)

**Security Model**: OAuth 2.0 with minimal scopes, sandboxed in Dev Container

---

## 🔧 Server Configuration

### mcp.config.json Entry
```json
{
  "servers": [
    {
      "name": "google-calendar",
      "type": "custom",
      "command": "node",
      "args": ["./mcp-servers/google-calendar/index.js"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}",
        "GOOGLE_CALENDAR_ID": "primary"
      },
      "permissions": {
        "scopes": ["calendar.readonly", "calendar.events"],
        "rate_limit": "60/minute"
      },
      "notes": "Run only in Dev Container. Uses OAuth 2.0 with refresh token."
    }
  ]
}
```

### Environment Variables Required
```bash
# Google Calendar OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_ID=primary  # or specific calendar ID

# Optional: Timezone
CALENDAR_TIMEZONE=America/New_York  # User's timezone
```

---

## 🛠️ MCP Tools Exposed

### Tool 1: list_events
**Purpose**: Retrieve calendar events within a date range

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "startDate": {
      "type": "string",
      "format": "date-time",
      "description": "Start of date range (ISO 8601)"
    },
    "endDate": {
      "type": "string",
      "format": "date-time",
      "description": "End of date range (ISO 8601)"
    },
    "maxResults": {
      "type": "integer",
      "default": 50,
      "maximum": 250,
      "description": "Max events to return"
    },
    "singleEvents": {
      "type": "boolean",
      "default": true,
      "description": "Expand recurring events"
    }
  },
  "required": ["startDate", "endDate"]
}
```

**Output Schema**:
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "summary": { "type": "string" },
      "description": { "type": "string" },
      "start": { "type": "string", "format": "date-time" },
      "end": { "type": "string", "format": "date-time" },
      "colorId": { "type": "string" },
      "status": { "type": "string", "enum": ["confirmed", "tentative", "cancelled"] },
      "attendees": { "type": "array" },
      "reminders": { "type": "object" }
    }
  }
}
```

**Example Usage**:
```javascript
// Get today's events
const today = new Date().toISOString();
const tomorrow = new Date(Date.now() + 86400000).toISOString();

const events = await mcp.use_tool("google-calendar", "list_events", {
  startDate: today,
  endDate: tomorrow
});
```

---

### Tool 2: create_event
**Purpose**: Create a new calendar event (for task scheduling)

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "summary": {
      "type": "string",
      "description": "Event title (e.g., '[Work] Complete project proposal')"
    },
    "description": {
      "type": "string",
      "description": "Event details (e.g., 'Why it matters: ...')"
    },
    "start": {
      "type": "string",
      "format": "date-time",
      "description": "Event start time (ISO 8601)"
    },
    "end": {
      "type": "string",
      "format": "date-time",
      "description": "Event end time (ISO 8601)"
    },
    "colorId": {
      "type": "string",
      "enum": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      "description": "Color ID (1=Lavender, 2=Sage, 3=Grape, 4=Flamingo, 5=Banana, 6=Tangerine, 7=Peacock, 8=Graphite, 9=Blueberry, 10=Basil, 11=Tomato)"
    },
    "reminders": {
      "type": "object",
      "properties": {
        "useDefault": { "type": "boolean", "default": false },
        "overrides": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "method": { "type": "string", "enum": ["email", "popup"] },
              "minutes": { "type": "integer" }
            }
          }
        }
      }
    },
    "location": {
      "type": "string",
      "description": "Event location (optional)"
    }
  },
  "required": ["summary", "start", "end"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "description": "Created event ID" },
    "htmlLink": { "type": "string", "description": "Google Calendar link" },
    "status": { "type": "string", "enum": ["confirmed"] }
  }
}
```

**Example Usage**:
```javascript
// Create task block
const event = await mcp.use_tool("google-calendar", "create_event", {
  summary: "[Work] Write project proposal",
  description: "Why it matters: Secure $50k contract\nNext bite: Draft executive summary",
  start: "2025-10-09T09:00:00-05:00",
  end: "2025-10-09T11:00:00-05:00",
  colorId: "4",  // Flamingo (red) for high priority
  reminders: {
    useDefault: false,
    overrides: [
      { method: "popup", minutes: 10 }
    ]
  }
});
```

---

### Tool 3: update_event
**Purpose**: Modify an existing calendar event (reschedule, change details)

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "eventId": {
      "type": "string",
      "description": "ID of event to update"
    },
    "updates": {
      "type": "object",
      "properties": {
        "summary": { "type": "string" },
        "description": { "type": "string" },
        "start": { "type": "string", "format": "date-time" },
        "end": { "type": "string", "format": "date-time" },
        "colorId": { "type": "string" },
        "status": { "type": "string", "enum": ["confirmed", "tentative", "cancelled"] }
      }
    }
  },
  "required": ["eventId", "updates"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "updated": { "type": "string", "format": "date-time" },
    "status": { "type": "string" }
  }
}
```

**Example Usage**:
```javascript
// Reschedule event
const updated = await mcp.use_tool("google-calendar", "update_event", {
  eventId: "abc123xyz",
  updates: {
    start: "2025-10-09T14:00:00-05:00",
    end: "2025-10-09T16:00:00-05:00"
  }
});
```

---

### Tool 4: delete_event
**Purpose**: Remove a calendar event (task cancelled/completed)

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "eventId": {
      "type": "string",
      "description": "ID of event to delete"
    },
    "sendUpdates": {
      "type": "string",
      "enum": ["all", "externalOnly", "none"],
      "default": "none",
      "description": "Send cancellation emails"
    }
  },
  "required": ["eventId"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": { "type": "boolean" },
    "eventId": { "type": "string" }
  }
}
```

---

### Tool 5: find_free_slots
**Purpose**: Find available time slots for scheduling (CRITICAL for auto-scheduling)

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date",
      "description": "Target date to search (YYYY-MM-DD)"
    },
    "durationMinutes": {
      "type": "integer",
      "description": "Required duration in minutes"
    },
    "preferredTimeRanges": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "start": { "type": "string", "description": "HH:MM (24hr)" },
          "end": { "type": "string", "description": "HH:MM (24hr)" }
        }
      },
      "description": "Preferred time ranges (e.g., morning 9-12)",
      "default": [{ "start": "09:00", "end": "17:00" }]
    },
    "bufferMinutes": {
      "type": "integer",
      "default": 15,
      "description": "Buffer between events"
    }
  },
  "required": ["date", "durationMinutes"]
}
```

**Output Schema**:
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "start": { "type": "string", "format": "date-time" },
      "end": { "type": "string", "format": "date-time" },
      "score": {
        "type": "integer",
        "description": "Quality score 0-100 (higher = better fit)"
      }
    }
  }
}
```

**Example Usage**:
```javascript
// Find 2-hour slot for deep work
const slots = await mcp.use_tool("google-calendar", "find_free_slots", {
  date: "2025-10-09",
  durationMinutes: 120,
  preferredTimeRanges: [
    { start: "09:00", end: "12:00" },  // Morning preferred
    { start: "14:00", end: "17:00" }   // Afternoon backup
  ],
  bufferMinutes: 15
});

// Returns: [
//   { start: "2025-10-09T09:00:00-05:00", end: "2025-10-09T11:00:00-05:00", score: 95 },
//   { start: "2025-10-09T14:30:00-05:00", end: "2025-10-09T16:30:00-05:00", score: 80 }
// ]
```

---

### Tool 6: get_event_by_id
**Purpose**: Retrieve details of a specific event (for verification)

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "eventId": {
      "type": "string",
      "description": "Calendar event ID"
    }
  },
  "required": ["eventId"]
}
```

**Output Schema**: Same as `list_events` item

---

## 🔒 Security Implementation

### OAuth 2.0 Flow

**Initial Setup** (One-time, manual):
1. Create Google Cloud Project
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials (Desktop app)
4. Run authorization script to get refresh token
5. Store refresh token in `.env`

**Authorization Script** (`scripts/authorize-google-calendar.js`):
```javascript
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback'  // Redirect URI
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting:', authUrl);

// Get authorization code from user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', async (code) => {
  rl.close();
  const { tokens } = await oauth2Client.getToken(code);
  console.log('Refresh token:', tokens.refresh_token);
  console.log('Add this to your .env file as GOOGLE_REFRESH_TOKEN');
});
```

**Runtime Token Refresh** (Automatic in MCP server):
```javascript
// Auto-refresh access token using refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Google API client handles token refresh automatically
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
```

### Rate Limiting
- **Google Calendar API Limit**: 1,000,000 requests/day (generous)
- **MCP Server Limit**: 60 requests/minute (prevent abuse)
- **Strategy**: Token bucket algorithm with 60 tokens, refill 1/second

### Error Handling
```javascript
// All tools return standardized errors
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 30 seconds.",
    "retryAfter": 30
  }
}

// Error codes:
// - AUTH_FAILED: Invalid OAuth token
// - RATE_LIMIT_EXCEEDED: Too many requests
// - EVENT_NOT_FOUND: Event ID doesn't exist
// - INVALID_INPUT: Malformed request
// - CALENDAR_UNAVAILABLE: Google API down
```

---

## 📦 Implementation Structure

### File Structure
```
mcp-servers/google-calendar/
├── index.js                  # Main MCP server entry point
├── package.json              # Dependencies
├── lib/
│   ├── auth.js               # OAuth 2.0 token management
│   ├── calendar-client.js    # Google Calendar API wrapper
│   ├── free-slots.js         # Free slot finding algorithm
│   ├── rate-limiter.js       # Rate limiting logic
│   └── error-handler.js      # Standardized error responses
├── tools/
│   ├── list-events.js        # Tool: list_events
│   ├── create-event.js       # Tool: create_event
│   ├── update-event.js       # Tool: update_event
│   ├── delete-event.js       # Tool: delete_event
│   ├── find-free-slots.js    # Tool: find_free_slots
│   └── get-event.js          # Tool: get_event_by_id
└── tests/
    ├── auth.test.js
    ├── calendar-client.test.js
    └── free-slots.test.js
```

### Dependencies (package.json)
```json
{
  "name": "lifeos-google-calendar-mcp",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "googleapis": "^128.0.0",
    "dotenv": "^16.3.1",
    "date-fns": "^2.30.0",
    "date-fns-tz": "^2.0.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// tests/free-slots.test.js
describe('findFreeSlots', () => {
  test('finds 2-hour slot in morning', async () => {
    const existingEvents = [
      { start: '2025-10-09T10:00:00Z', end: '2025-10-09T11:00:00Z' }
    ];

    const slots = await findFreeSlots({
      date: '2025-10-09',
      durationMinutes: 120,
      existingEvents
    });

    expect(slots[0].start).toBe('2025-10-09T11:15:00Z');  // After buffer
    expect(slots[0].end).toBe('2025-10-09T13:15:00Z');
  });
});
```

### Integration Tests
```javascript
// tests/calendar-client.test.js
describe('CalendarClient', () => {
  test('creates event and retrieves it', async () => {
    const event = await client.createEvent({
      summary: 'Test Event',
      start: new Date('2025-10-09T10:00:00Z'),
      end: new Date('2025-10-09T11:00:00Z')
    });

    expect(event.id).toBeDefined();

    const retrieved = await client.getEvent(event.id);
    expect(retrieved.summary).toBe('Test Event');

    await client.deleteEvent(event.id);  // Cleanup
  });
});
```

---

## 🚀 Usage in AI Agents

### Example: Planner Agent
```javascript
// Agent uses MCP tools to schedule a task

// 1. Get task from Notion
const task = await notion.getTask('task-id-123');
// { name: "Write proposal", due: "2025-10-09", effort: "Medium" }

// 2. Find free slots on due date
const slots = await mcp.use_tool('google-calendar', 'find_free_slots', {
  date: '2025-10-09',
  durationMinutes: 120,  // Medium effort = 2 hours
  preferredTimeRanges: [{ start: '09:00', end: '12:00' }]
});

// 3. Create calendar event in best slot
const event = await mcp.use_tool('google-calendar', 'create_event', {
  summary: '[Work] Write proposal',
  description: task.whyItMatters,
  start: slots[0].start,
  end: slots[0].end,
  colorId: '4'  // Red for high priority
});

// 4. Save event ID to Notion task
await notion.updateTask('task-id-123', {
  calendar_event_id: event.id
});
```

---

## 📝 Next Steps

1. **Create authorization script** (`scripts/authorize-google-calendar.js`)
2. **Build MCP server skeleton** (`mcp-servers/google-calendar/index.js`)
3. **Implement auth module** (`lib/auth.js`)
4. **Implement calendar client** (`lib/calendar-client.js`)
5. **Implement free slot finder** (`lib/free-slots.js`)
6. **Wire up MCP tools** (`tools/*.js`)
7. **Write tests** (`tests/*.test.js`)
8. **Update mcp.config.json** (add server)
9. **Test in Dev Container**
10. **Document API credentials setup for user**

---

**Status**: Ready for implementation (waiting for user's Google Calendar API credentials)
