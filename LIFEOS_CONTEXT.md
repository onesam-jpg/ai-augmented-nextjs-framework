# LifeOS Integration Context

> **Purpose**: Session continuity and context recovery for LifeOS integration work. Read this file first when resuming sessions.

**Last Updated**: 2025-10-08 (Session initiated)
**Current Checkpoint**: Checkpoint 5 - LifeOS Integration Foundation
**Status**: 🟡 In Progress (Calendar integration priority)

---

## 🎯 Current Mission

**Primary Goal**: Connect AI-Augmented Framework to existing Notion-based LifeOS with **Google Calendar as the foundation** for task organization.

**Why Calendar First?**
- User explicitly requested: "connect all features that connects me to my google calendar"
- Calendar is the central hub for task scheduling and time management
- Two-way sync enables: Notion Tasks → Calendar events → Status updates
- Foundation for all other LifeOS features (planning, reflection, analytics)

---

## 📊 Active Work (Checkpoint 5)

### Completed
- ✅ Added Checkpoints 5-8 to project_plan.md (LifeOS integration roadmap)
- ✅ Created LIFEOS_CONTEXT.md (this file) for session recovery
- ✅ Identified priority: Google Calendar integration

### In Progress
- 🔄 Documenting existing LifeOS architecture

### Next Tasks
1. Document LifeOS structure (8 Notion databases, formulas, n8n workflows)
2. Design Google Calendar MCP server specification
3. Design Notion MCP server specification
4. Create .env.example template for API credentials
5. Build MVP: Notion Task → Google Calendar event sync
6. Test end-to-end calendar integration

---

## 🏗️ LifeOS Architecture (Existing System)

### Notion Databases (8 Total)
1. **Tasks** - Main task management
   - Properties: Status, Priority, Category, Due, ImpactScore, UrgencyScore, NonDeferrable, NextBite
   - Formulas: PriorityWeight, DaysUntilDue, UrgencyScore
   - Relations: Project, Daily Log

2. **Projects** - Project tracking
   - Properties: Status, Goal, KPI, Deadline, Risks
   - Relations: Tasks, Ideas

3. **Ideas** - Opportunity capture
   - Properties: Status, Priority, ValidationStatus, MarketSignal, Source
   - Relations: Projects

4. **Daily Log** - Daily reflection & tracking
   - Properties: Date, Win_1, Win_2, Win_3, MinutesFocused, Mood, TomorrowFirstMove
   - Relations: Tasks (Focus Sprints)

5. **Content Calendar** - Content production
   - Properties: Status, Platform, PublishDate, Hook, CTA, ScriptLink
   - Relations: Tasks

6. **Finance** - Personal finance (Dave Ramsey Baby Steps)
   - Properties: BabyStep, Status, Amount
   - Baby Steps: 1-7 (Emergency fund → Debt snowball → Wealth building)

7. **CRM** - Relationship management
   - Properties: Status, Company/Role, Email/Phone, NextFollowUp, Tags
   - Categories: Lead, Prospect, Client, Past Client, Partner

8. **Habits** - Habit tracking
   - Properties: Frequency, Category
   - Frequencies: Daily, Weekly, Monthly

### Existing Integrations
- **n8n** (Hostinger VPS): Automation workflows
  - Telegram voice → OpenAI Whisper → Notion Tasks
  - Weekly project suggestions (planned)
  - Daily review automation (planned)

- **Google Calendar** (NOT YET CONNECTED): Primary scheduling tool
  - User's main calendar for time blocking
  - Needs two-way sync with Notion Tasks

- **Telegram Bot**: Voice capture via n8n workflow

### Key Workflows (From LifeOS Vision)
1. **Planning**: Evening review → tomorrow's priorities → calendar blocking
2. **Focus Mode**: Deep work sessions → auto-logging to Daily Log
3. **Reflection**: End-of-day wins → improvements → next move
4. **Opportunity Finder**: Trend scanning → Ideas database → validation
5. **Multi-Business**: Separate tracking for Real Estate, Books, Content, Signing

### Behavioral Principles
- **Non-Deferrables**: Spiritual duties (prayer) are immutable anchors
- **Tomorrow Starts Tonight**: Evening planning for next day
- **Focus Sprints**: Timed deep work with "Why it matters" prompts
- **Atomic Habits**: Small wins, environment design, habit loops
- **Mission Alignment**: Every task contributes to defined purpose

---

## 🔧 Technical Integration Plan

### Phase 1: Google Calendar MCP Server (Current Focus)
**Goal**: Enable AI agents to read/write Google Calendar events

**MCP Server Specification**:
- **Name**: `google-calendar`
- **Type**: Custom MCP server (Node.js)
- **Root**: Scoped to user's primary calendar
- **Permissions**: Read calendar events, Create events, Update events, Delete events
- **Security**: OAuth 2.0, sandboxed in Dev Container
- **Tools Exposed**:
  - `list_events(start_date, end_date)` - Get calendar events
  - `create_event(title, start, end, description)` - Create new event
  - `update_event(event_id, updates)` - Modify existing event
  - `delete_event(event_id)` - Remove event
  - `find_free_slots(date, duration)` - Find available time

### Phase 2: Notion MCP Server
**Goal**: Enable AI agents to read/write Notion databases

**MCP Server Specification**:
- **Name**: `notion-lifeos`
- **Type**: Custom MCP server (Node.js)
- **Root**: Scoped to LifeOS workspace databases
- **Permissions**: Read pages, Create pages, Update pages (no delete initially)
- **Security**: Notion API token, sandboxed in Dev Container
- **Tools Exposed**:
  - `query_tasks(filters, sorts)` - Query Tasks database
  - `create_task(properties)` - Create new task
  - `update_task(page_id, properties)` - Update task
  - `get_daily_log(date)` - Fetch daily log entry
  - `add_idea(properties)` - Create idea
  - `list_projects(status)` - Get active projects

### Phase 3: MVP Sync Flow
**Workflow**: Notion Task (with Due date) → Google Calendar event

```
1. User creates task in Notion with Due date
2. n8n webhook detects new task (or scheduled check)
3. AI agent via MCP:
   - Reads task properties (title, due date, duration, category)
   - Checks calendar for free slots near due date
   - Creates calendar event with:
     - Title: [Category] Task Name
     - Time: Auto-scheduled in free slot
     - Description: "Why it matters" + Next Bite
4. Links calendar event ID back to Notion task
5. Reverse sync: Calendar changes → Update Notion status
```

---

## 🤖 AI Agent System (9 Specialized Agents)

### Agent Roles & Priorities

**Phase 1 (Checkpoint 5-6)**: Core agents for calendar integration
1. **Planner Agent** 🗓️ (PRIORITY 1)
   - Tool access: Notion Tasks, Google Calendar, Analytics
   - Responsibilities: Daily planning, calendar blocking, priority optimization
   - Slash commands: `/plan-day`, `/plan-week`, `/reschedule`

2. **Focus Agent** 🔥 (PRIORITY 2)
   - Tool access: Notion Tasks, Daily Log, Timer
   - Responsibilities: Deep work sessions, distraction blocking, flow state
   - Slash commands: `/focus`, `/start-sprint`, `/log-session`

3. **Reflection Agent** 🪞 (PRIORITY 3)
   - Tool access: Notion Daily Log, Tasks (read-only)
   - Responsibilities: Daily/weekly reviews, pattern analysis, growth insights
   - Slash commands: `/reflect`, `/daily-review`, `/weekly-review`

**Phase 2 (Checkpoint 7)**: Advanced agents
4. **Opportunity Agent** 💡
   - Tool access: Web Search, Notion Ideas, Trends APIs
   - Responsibilities: Market scanning, idea validation, opportunity scoring

5. **Analytics Agent** 📊
   - Tool access: Notion (all DBs), Calculation engine
   - Responsibilities: Time tracking, efficiency metrics, progress dashboards

6. **Finance Agent** 💰
   - Tool access: Notion Finance
   - Responsibilities: Baby Steps tracking, budgeting, debt snowball

7. **Content Agent** 🎨
   - Tool access: Notion Content Calendar
   - Responsibilities: Content pipeline, repurposing, platform optimization

8. **CRM Agent** 🤝
   - Tool access: Notion CRM
   - Responsibilities: Follow-up automation, relationship scoring

9. **Spiritual Agent** 🕌
   - Tool access: Notion Tasks (prayer category), Calendar
   - Responsibilities: Prayer reminders, Quran tracking, spiritual goals

---

## 🔐 Security & Privacy

### API Credentials (Required)
- **Google Calendar API**:
  - OAuth 2.0 credentials (Client ID, Client Secret)
  - Refresh token for continuous access
  - Scope: `https://www.googleapis.com/auth/calendar`

- **Notion API**:
  - Integration token (Internal integration)
  - Database IDs for all 8 LifeOS databases
  - Scope: Read + Write access

### Environment Variables
```bash
# Google Calendar
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary

# Notion
NOTION_API_KEY=
NOTION_DATABASE_TASKS=
NOTION_DATABASE_PROJECTS=
NOTION_DATABASE_IDEAS=
NOTION_DATABASE_DAILY_LOG=
NOTION_DATABASE_CONTENT=
NOTION_DATABASE_FINANCE=
NOTION_DATABASE_CRM=
NOTION_DATABASE_HABITS=

# n8n Integration
N8N_WEBHOOK_URL=
```

### Security Best Practices
1. All MCP servers run in Dev Container (sandboxed)
2. API tokens stored in `.env` (never committed to git)
3. Least privilege: MCP servers only access needed databases
4. Audit logging: Track all API calls for debugging
5. Rate limiting: Prevent API quota exhaustion

---

## 📁 File Structure (LifeOS-Specific)

```
VSCode_AI_Framework_Setup/
├── LIFEOS_CONTEXT.md          # This file (session recovery)
├── LIFEOS_ARCHITECTURE.md     # Full system design (to be created)
├── mcp.config.json            # MCP server configuration
├── .env                       # API credentials (gitignored)
├── .env.example               # Template for credentials
├── app/
│   ├── lifeos/                # LifeOS dashboard pages
│   │   ├── page.tsx           # Main dashboard
│   │   ├── tasks/             # Task management UI
│   │   ├── calendar/          # Calendar view
│   │   └── analytics/         # Metrics dashboard
│   └── api/
│       ├── notion/            # Notion API routes
│       │   ├── tasks/route.ts
│       │   ├── projects/route.ts
│       │   └── sync/route.ts
│       └── calendar/          # Calendar API routes
│           ├── events/route.ts
│           └── sync/route.ts
├── lib/
│   ├── notion.ts              # Notion API client
│   ├── calendar.ts            # Google Calendar client
│   └── sync.ts                # Sync logic between systems
└── mcp-servers/               # Custom MCP servers
    ├── notion-lifeos/         # Notion MCP server
    │   ├── index.js
    │   └── package.json
    └── google-calendar/       # Calendar MCP server
        ├── index.js
        └── package.json
```

---

## 🚨 Known Blockers & Risks

### Current Blockers
- ⚠️ **No Google Calendar API credentials yet** - Need OAuth setup
- ⚠️ **No Notion API token yet** - Need internal integration creation
- ⚠️ **No MCP server implementations** - Need to build custom servers

### Risks
- 🟡 **API Rate Limits**: Google Calendar (1M requests/day), Notion (3 requests/second)
- 🟡 **OAuth Token Expiry**: Need refresh token handling
- 🟡 **Sync Conflicts**: What happens if task updated in both systems simultaneously?
- 🟡 **Time Zone Handling**: Ensure consistent timezone across systems

### Mitigation Strategies
1. **Rate Limiting**: Implement request throttling in MCP servers
2. **Token Refresh**: Auto-refresh OAuth tokens before expiry
3. **Conflict Resolution**: Last-write-wins with timestamp comparison
4. **Timezone**: Store all times in UTC, convert for display

---

## 🎯 Success Criteria (Checkpoint 5)

- [ ] LIFEOS_CONTEXT.md created (session recovery system)
- [ ] Existing LifeOS architecture documented
- [ ] Google Calendar MCP server designed and implemented
- [ ] Notion MCP server designed and implemented
- [ ] .env.example template created
- [ ] MVP sync flow working: Notion Task → Calendar event
- [ ] End-to-end test: Create task in Notion → See event in Google Calendar
- [ ] Reverse sync working: Update calendar → Update Notion task status

---

## 🔄 Session Recovery Commands

**If session disconnects, run these commands to recover context:**

```bash
# Navigate to project
cd "C:\Users\OneSa\OneDrive\Documents\Life Planner\VSCode_AI_Framework_Setup"

# Read all context files
cat LIFEOS_CONTEXT.md
cat project_plan.md
cat SESSION_NOTES.md
cat PROGRESS.md

# Check current checkpoint status
grep "Checkpoint 5" project_plan.md -A 20

# Verify dev server is running
npm run dev  # Should be on http://localhost:3000
```

**Quick Status Check:**
- Current Checkpoint: **5 (LifeOS Integration Foundation)**
- Current Task: **Documenting LifeOS architecture + Calendar integration design**
- Blockers: **Need API credentials (Google Calendar + Notion)**
- Next Step: **Design Google Calendar MCP server specification**

---

## 📝 Decision Log

### 2025-10-08: Calendar-First Approach
**Decision**: Prioritize Google Calendar integration before other LifeOS features
**Rationale**: User explicitly requested calendar organization as most important. Calendar serves as foundation for all time-based workflows (planning, focus, reflection).
**Impact**: Checkpoint 5 focuses entirely on Calendar + Notion Tasks sync. Other databases (Projects, Ideas, etc.) deferred to later checkpoints.

### 2025-10-08: MCP Server Architecture
**Decision**: Build custom MCP servers for Notion and Google Calendar instead of using generic HTTP MCP
**Rationale**: Custom servers provide better security (scoped permissions), optimized tools (domain-specific operations), and easier debugging.
**Impact**: Requires additional development time but provides better foundation for AI agents.

### 2025-10-08: Simplified MVP Workflow
**Decision**: Start with one-way sync (Notion → Calendar) before implementing reverse sync
**Rationale**: Reduces complexity, allows testing of core sync logic, aligns with "simplicity first" principle.
**Impact**: Users can create tasks in Notion and see calendar events, but calendar changes won't update Notion initially.

---

## 🎓 Learning & Optimization

### What's Working Well
- Plan-first workflow (project_plan.md) prevents scope creep
- Session tracking files enable seamless context recovery
- Checkpoint-based structure breaks down complex work into manageable phases

### Areas for Improvement
- Need faster API credential setup process (automate OAuth flow?)
- Consider caching strategy for Notion API (reduce duplicate queries)
- Add health check endpoint for MCP servers (verify they're running)

---

**Next Session Start Here:**
1. Read this file first (LIFEOS_CONTEXT.md)
2. Check project_plan.md for latest Checkpoint 5 status
3. Continue with next pending task (likely: Document LifeOS architecture OR Design Calendar MCP server)
