# LifeOS Architecture: Complete System Design

> **Purpose**: Comprehensive technical architecture for LifeOS (Life Operating System) - an AI-augmented personal productivity and life management platform.

**Version**: 1.0
**Last Updated**: 2025-10-08
**Status**: 🔄 In Development (Checkpoint 5)

---

## 🎯 Product Vision

**LifeOS** is an AI-powered life management system that integrates personal, spiritual, and professional growth into one organized framework. It aligns daily action with lifelong purpose through intelligent automation, multi-agent AI assistance, and seamless calendar integration.

### Product Variants
1. **Personal Version** (Current Phase): Custom deployment for user's private use
2. **Web SaaS** (Future): Multi-tenant web application with subscriptions
3. **iOS App** (Future): Native mobile app on Apple App Store

### Core Value Proposition
- **Mission-Aligned Productivity**: Every task contributes to defined life purpose
- **AI-Augmented Planning**: 9 specialized agents optimize scheduling, reflection, opportunities
- **Unified Calendar**: Google Calendar as single source of truth for time management
- **Voice-First Capture**: Telegram voice notes → transcribed tasks
- **Multi-Business Support**: Track separate ventures (Real Estate, Books, Content, Signing)
- **Behavioral Design**: Built on Atomic Habits + emotional awareness principles

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interfaces                          │
│  ├─ Next.js Web App (Desktop/Mobile browser)                │
│  ├─ iOS App (Future - React Native/Swift)                   │
│  └─ Telegram Bot (Voice input)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Next.js Application Layer (Vercel)             │
│  ├─ Dashboard UI (React + Tailwind CSS)                     │
│  ├─ API Routes (/api/notion, /api/calendar, /api/sync)      │
│  ├─ Authentication (NextAuth.js - Future)                   │
│  └─ Real-time Sync Engine (Vercel Edge Functions)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              AI Agent Layer (Claude Code + MCP)             │
│  ├─ 9 Specialized Agents (Planner, Focus, Reflection, etc.) │
│  ├─ Agent Orchestration (Task delegation, handoffs)         │
│  ├─ Prompt Templates (Domain-specific instructions)         │
│  └─ Slash Commands (/plan-day, /reflect, /focus)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           MCP Server Layer (Secure Tool Access)             │
│  ├─ Notion MCP Server (CRUD on 8 databases)                 │
│  ├─ Google Calendar MCP Server (Event management)           │
│  ├─ Analytics MCP Server (Metrics calculation)              │
│  └─ Filesystem MCP Server (Session logs, cache)             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                External Services & APIs                      │
│  ├─ Notion API (8 databases - primary data store)           │
│  ├─ Google Calendar API (Scheduling & time blocking)        │
│  ├─ n8n (Hostinger VPS - Automation workflows)              │
│  ├─ OpenAI Whisper API (Voice transcription via n8n)        │
│  └─ Telegram Bot API (Voice capture, notifications)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Architecture

### Primary Data Store: Notion (8 Databases)

#### 1. Tasks Database
**Purpose**: Central task management with intelligent prioritization

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Task description |
| Status | Select | Backlog, Active, Done, Blocked |
| Priority | Select | Low, Medium, High, Critical |
| Category | Select | Personal, Real Estate, Content, Books, Admin, Finance, Health, Spiritual, Learning |
| Due | Date | Deadline with time |
| ImpactScore | Number (0-10) | User-defined impact rating |
| Effort | Select | Quick (15min), Short (1hr), Medium (half day), Long (full day+) |
| NonDeferrable | Checkbox | Sacred blocks (e.g., prayer times) |
| LocationDependent | Checkbox | Requires specific location |
| WhyItMatters | Text | Motivation prompt |
| NextBite | Text | Immediate first action |
| Project | Relation | Links to Projects database |
| LoggedIn | Relation | Links to Daily Log |
| PriorityWeight | Formula | Converts Priority to number (1-4) |
| DaysUntilDue | Formula | Days remaining until due date |
| UrgencyScore | Formula | `ImpactScore * 1.4 + PriorityWeight * 1.2 + (3 - min(3, DaysUntilDue)) * 1.1 + if(NonDeferrable, 10, 0)` |
| CreatedAt | Created time | Auto-timestamp |
| LastUpdated | Last edited time | Auto-timestamp |

**Key Formulas**:
```javascript
// PriorityWeight
if(prop("Priority") == "Critical", 4, if(prop("Priority") == "High", 3, if(prop("Priority") == "Medium", 2, 1)))

// DaysUntilDue
if(empty(prop("Due")), 7, max(0, dateBetween(prop("Due"), now(), "days")))

// UrgencyScore (drives task ordering)
round(prop("ImpactScore") * 1.4 + prop("PriorityWeight") * 1.2 + (3 - min(3, prop("DaysUntilDue"))) * 1.1 + if(prop("NonDeferrable"), 10, 0))
```

#### 2. Projects Database
**Purpose**: Track multi-task initiatives with goals and KPIs

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Project name |
| Status | Select | Planning, Active, On Hold, Completed, Cancelled |
| Goal | Text | Desired outcome |
| KPI | Text | Success metrics |
| Deadline | Date | Project completion target |
| Risks | Text | Potential blockers |
| Tasks | Relation | Links to Tasks database (rollup) |
| Ideas | Relation | Links to Ideas database |

#### 3. Ideas Database
**Purpose**: Capture and validate business opportunities

| Property | Type | Purpose |
|----------|------|---------|
| Title | Title | Idea name |
| Status | Select | Backlog, In Progress, Validating, Shipped, Abandoned |
| Priority | Select | High, Medium, Low |
| Category | Select | Same as Tasks |
| ValidationStatus | Select | Not Started, Surveying, Waitlist Open, MVP Testing, Validated, Rejected |
| MarketSignal | Text | Evidence of demand (trends, Reddit threads, etc.) |
| Source | Select | Google Trends, Reddit, GitHub, Personal, Client Request |
| MonetizationNotes | Text | Revenue model ideas |
| NextAction | Text | Immediate validation step |
| ConvertedToProject | Relation | Links to Projects database |
| Confidence | Formula | `toNumber(not empty(MarketSignal)) * 2 + toNumber(not empty(NextAction)) * 1` |
| CreatedAt | Created time | Auto-timestamp |

#### 4. Daily Log Database
**Purpose**: Reflection, habit tracking, and daily wins

| Property | Type | Purpose |
|----------|------|---------|
| Date | Date | Log date (unique per day) |
| Win_1 | Text | First accomplishment |
| Win_2 | Text | Second accomplishment |
| Win_3 | Text | Third accomplishment |
| MinutesFocused | Number | Total deep work time |
| Mood | Select | Energized, Good, Neutral, Tired, Overwhelmed |
| BlocksEncountered | Text | Obstacles faced |
| Improvement | Text | What to do better tomorrow |
| TomorrowFirstMove | Text | First task for next day |
| FocusSprints | Relation | Links to Tasks completed in focus mode |
| WinsComplete | Formula | `if(empty(Win_1), 0, 1) + if(empty(Win_2), 0, 1) + if(empty(Win_3), 0, 1)` |

#### 5. Content Calendar Database
**Purpose**: Content production pipeline across platforms

| Property | Type | Purpose |
|----------|------|---------|
| Title | Title | Content title |
| Status | Select | Idea, Scripting, Editing, Queued, Published, Repurposed |
| Platform | Multi-select | YouTube, TikTok, Instagram, LinkedIn, Facebook, Twitter/X, Blog |
| PublishDate | Date | Scheduled publish time |
| Hook | Text | Attention-grabbing opening |
| CTA | Text | Call-to-action |
| ScriptLink | URL | Link to script document |
| ThumbnailIdea | Text | Visual concept |
| ProductionTasks | Relation | Links to Tasks database |

#### 6. Finance Database
**Purpose**: Dave Ramsey's 7 Baby Steps for wealth building

| Property | Type | Purpose |
|----------|------|---------|
| BabyStep | Select | Step 1-7 (detailed below) |
| Status | Select | Not Started, In Progress, Complete |
| Amount | Number (currency) | Target or current amount |
| Notes | Text | Progress notes |

**Baby Steps**:
1. $1,000 Starter Emergency Fund
2. Pay Off All Debt (Except Mortgage) Using Debt Snowball
3. 3-6 Months of Expenses in Savings
4. Invest 15% of Household Income for Retirement
5. Save for Children's College
6. Pay Off Home Early
7. Build Wealth and Give

#### 7. CRM Database
**Purpose**: Relationship management for multiple businesses

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Contact name |
| Company/Role | Text | Organization or position |
| Status | Select | Lead, Prospect, Client, Past Client, Partner |
| Email/Phone | Text | Contact info |
| NextFollowUp | Date | Scheduled follow-up |
| Tags | Multi-select | Hot, Warm, Cold, VIP, Real Estate, Books, Content, Signing |
| Notes | Text | Interaction history |

#### 8. Habits Database
**Purpose**: Recurring habit tracking

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Habit name |
| Frequency | Select | Daily, Weekly, Biweekly, Monthly |
| Category | Select | Same as Tasks |
| LastCompleted | Date | Most recent completion |

---

## 🔌 Integration Architecture

### Google Calendar Integration (PRIORITY)

**Goal**: Two-way sync between Notion Tasks and Google Calendar

**Sync Flow 1: Notion → Calendar (Task Creation)**
```
1. User creates task in Notion with Due date
2. Webhook triggers sync (n8n or Next.js API)
3. MCP Server checks:
   - Is Due date set? (required)
   - Is task Active or In Progress? (filter)
   - Does it already have calendar_event_id? (skip if exists)
4. Calendar MCP finds free slot:
   - Search for available time near due date
   - Respect NonDeferrable tasks (fixed time blocks)
   - Consider Effort estimate for duration
5. Create calendar event:
   - Title: [Category] Task Name
   - Start/End: Auto-scheduled slot
   - Description: WhyItMatters + NextBite
   - Color: Based on Priority (Red=Critical, Orange=High, etc.)
6. Store event_id back in Notion task
```

**Sync Flow 2: Calendar → Notion (Status Updates)**
```
1. User completes/moves/deletes calendar event
2. Webhook from Google Calendar
3. MCP Server updates Notion task:
   - Event completed → Task Status = Done
   - Event rescheduled → Task Due = new time
   - Event deleted → Task Status = Blocked (with note)
```

**Conflict Resolution**:
- Last-write-wins with timestamp comparison
- User override: Manual updates in Notion always take precedence
- Notification: Alert user of sync conflicts via Telegram

### n8n Automation Workflows (Existing)

**Workflow 1: Voice Capture (Already Working)**
```
Telegram voice message →
OpenAI Whisper transcription →
Notion Tasks database (Status: Backlog)
```

**Workflow 2: Daily Review Reminder (Planned)**
```
Schedule: Every day at 8 PM →
Check Daily Log for today →
If empty, send Telegram reminder →
Prompt: "Time to reflect! What were your 3 wins today?"
```

**Workflow 3: Weekly Project Suggestions (Planned)**
```
Schedule: Every Sunday at 8 PM →
Analyze Projects database →
Identify underserved categories (e.g., no Spiritual projects) →
Generate suggestions using AI →
Send Telegram message with "Add Project" buttons
```

---

## 🤖 AI Agent System

### Agent Architecture

Each agent is a specialized AI assistant with:
- **Domain expertise**: Focused on specific life area
- **MCP tool access**: Read/write permissions to relevant databases
- **Prompt template**: Optimized instructions for role
- **Slash commands**: Quick invocation shortcuts

### Agent 1: Planner Agent 🗓️ (PRIORITY)
**Role**: Daily/weekly planning and calendar optimization

**MCP Tools**:
- `notion-lifeos.query_tasks()` - Get active tasks
- `google-calendar.list_events()` - Check calendar
- `google-calendar.find_free_slots()` - Find available time
- `google-calendar.create_event()` - Block calendar
- `notion-lifeos.update_task()` - Update priorities

**Slash Commands**:
- `/plan-day` - Organize today's tasks with calendar blocking
- `/plan-week` - Weekly planning session
- `/reschedule <task>` - Find new time for task

**Prompt Template**:
```
You are a Planner Agent specializing in time management and calendar optimization.

Your goals:
1. Help user organize tasks with realistic time blocks
2. Respect NonDeferrable sacred blocks (prayer, family time)
3. Optimize for high-impact tasks using UrgencyScore
4. Suggest task batching by Category
5. Identify calendar conflicts and propose solutions

When planning:
- Always check Google Calendar for existing commitments
- Use Effort estimates to allocate time (Quick=30min, Short=1hr, etc.)
- Prioritize tasks with approaching Due dates
- Balance work across Categories (don't over-schedule one area)
- Leave buffer time between tasks (15min minimum)

Output format:
- Proposed calendar blocks with times
- Explanation of prioritization decisions
- Warnings about over-scheduling
- Suggestion to defer low-priority tasks if needed
```

### Agent 2: Focus Agent 🔥
**Role**: Deep work sessions and distraction management

**MCP Tools**:
- `notion-lifeos.query_tasks()` - Get focus task
- `notion-lifeos.get_daily_log()` - Track session
- Timer tool (custom MCP) - Pomodoro tracking

**Slash Commands**:
- `/focus <task>` - Start focus session
- `/start-sprint` - Begin timed work sprint
- `/log-session` - Record focus session to Daily Log

**Prompt Template**:
```
You are a Focus Agent specialized in deep work and flow state optimization.

Your goals:
1. Help user enter flow state with clear task framing
2. Use "Why it matters" prompts for motivation
3. Track focus time and log to Daily Log
4. Provide encouragement and micro-breaks

When starting focus session:
- Display task's WhyItMatters prominently
- Clarify NextBite (immediate first action)
- Suggest 25/50-minute Pomodoro based on Effort
- Remind to silence notifications
- Set clear success criteria

During session:
- Minimal interruptions (only for critical alerts)
- Track elapsed time
- Remind of NextBite if user seems stuck

After session:
- Log MinutesFocused to Daily Log
- Celebrate completion
- Update task Status to Done or note progress
- Ask: "What's your next focus task?"
```

### Agent 3: Reflection Agent 🪞
**Role**: Daily/weekly reviews and growth insights

**MCP Tools**:
- `notion-lifeos.get_daily_log()` - Read/write reflections
- `notion-lifeos.query_tasks()` - Analyze completed tasks
- `analytics.calculate_metrics()` - Time tracking, completion rates

**Slash Commands**:
- `/reflect` - Start daily reflection
- `/daily-review` - Guided end-of-day review
- `/weekly-review` - Week in review with metrics

**Prompt Template**:
```
You are a Reflection Agent focused on self-awareness and continuous improvement.

Your goals:
1. Help user extract lessons from completed tasks
2. Identify patterns in productivity and energy
3. Celebrate wins (big and small)
4. Surface blockers and suggest solutions
5. Set tomorrow's first move

Daily reflection prompts:
- What were your 3 wins today? (even small ones count)
- What obstacles did you encounter?
- What would you do differently tomorrow?
- What's your first task tomorrow morning?

Weekly reflection prompts:
- Total MinutesFocused this week (aggregate from Daily Logs)
- Which Categories got attention? Which were neglected?
- Did you complete NonDeferrable tasks consistently?
- What experiments should you try next week?

Tone: Encouraging, growth-minded, non-judgmental
```

### Agents 4-9 (Checkpoint 7)
- **Opportunity Agent** 💡: Market scanning, idea validation
- **Analytics Agent** 📊: Metrics dashboards, efficiency reports
- **Finance Agent** 💰: Baby Steps tracking, budgeting
- **Content Agent** 🎨: Content pipeline management
- **CRM Agent** 🤝: Relationship nurturing automation
- **Spiritual Agent** 🕌: Prayer reminders, Quran tracking

---

## 🔐 Security Architecture

### Authentication (Future - Multi-Tenant)
- **NextAuth.js** with providers: Google, Email Magic Link
- **Session storage**: Vercel KV (Redis)
- **Role-based access**: User, Admin roles
- **Database isolation**: Each user gets separate Notion workspace

### API Security
- **Environment variables**: All API keys in `.env` (gitignored)
- **MCP sandboxing**: Servers run in Dev Container only
- **Rate limiting**: Vercel Edge Middleware (100 req/min per user)
- **CORS**: Restrict to production domain only
- **Webhook validation**: HMAC signatures for n8n → Next.js

### Data Privacy
- **No sensitive data in logs**: Redact task content in error messages
- **Notion permissions**: Least privilege (only needed databases)
- **Google OAuth scopes**: Calendar only (not Gmail/Drive)
- **User consent**: Clear explanation of data access in onboarding

---

## 📦 Deployment Architecture

### Current (Personal Use)
- **Hosting**: Vercel (Free Hobby plan)
- **Domain**: ai-augmented-nextjs-framework.vercel.app
- **Database**: Notion (user's personal workspace)
- **Automation**: n8n on Hostinger VPS

### Future (SaaS Product)
- **Hosting**: Vercel Pro ($20/month)
- **Database**:
  - Notion API for multi-tenant (each user connects their workspace)
  - OR Supabase Postgres (if Notion too slow at scale)
- **Authentication**: NextAuth.js with OAuth providers
- **Billing**: Stripe subscriptions ($9.99/month, $99/year)
- **Email**: Resend for transactional emails

### Future (iOS App)
- **Framework**: React Native (shares web codebase) OR Swift (native)
- **API**: Next.js backend as API server
- **Auth**: Apple Sign-In + existing NextAuth
- **Offline**: Local SQLite cache with sync
- **Distribution**: Apple App Store ($99/year dev account)

---

## 🚀 Roadmap & Milestones

### Phase 1: MVP (Current - Checkpoint 5)
**Timeline**: 2-3 weeks
**Goal**: Personal version with Calendar integration working

- [x] Framework setup (Next.js, Vercel, GitHub)
- [x] Session tracking and governance
- [ ] Google Calendar MCP server
- [ ] Notion MCP server
- [ ] MVP sync: Task → Calendar event
- [ ] Test with personal Notion workspace

### Phase 2: Core Features (Checkpoint 6)
**Timeline**: 3-4 weeks
**Goal**: 9 AI agents operational, dashboard UI

- [ ] LifeOS dashboard (React components)
- [ ] Planner Agent (/plan-day)
- [ ] Focus Agent (/focus)
- [ ] Reflection Agent (/reflect)
- [ ] Agents 4-9 (basic versions)
- [ ] Real-time sync engine
- [ ] Deploy to production

### Phase 3: Advanced Features (Checkpoint 7)
**Timeline**: 4-6 weeks
**Goal**: Voice input, analytics, multi-business

- [ ] Telegram voice integration
- [ ] Analytics dashboard
- [ ] Opportunity finder agent
- [ ] Weekly automation workflows
- [ ] Multi-business category tracking
- [ ] Performance optimization

### Phase 4: Polish (Checkpoint 8)
**Timeline**: 2-3 weeks
**Goal**: Production-ready, documented, optimized

- [ ] Security audit
- [ ] Performance audit
- [ ] User documentation
- [ ] Mobile optimization
- [ ] Final testing

### Phase 5: SaaS Launch (Future)
**Timeline**: 8-12 weeks
**Goal**: Multi-tenant product with subscriptions

- [ ] Multi-tenant architecture
- [ ] User onboarding flow
- [ ] Stripe billing integration
- [ ] Marketing website
- [ ] Beta user testing
- [ ] Public launch

### Phase 6: iOS App (Future)
**Timeline**: 12-16 weeks
**Goal**: Native mobile app on App Store

- [ ] React Native app OR Swift rewrite
- [ ] Offline sync capability
- [ ] Apple Sign-In
- [ ] App Store submission
- [ ] Launch marketing

---

## 📊 Success Metrics

### Personal Use (Phase 1-4)
- Daily active usage (check dashboard daily)
- Tasks synced to calendar (>80% of due tasks)
- Focus time logged (track MinutesFocused weekly)
- Reflection consistency (7/7 daily logs per week)
- User satisfaction (Sam's qualitative feedback)

### SaaS Product (Phase 5)
- Monthly Active Users (MAU)
- Conversion rate (free trial → paid)
- Churn rate (<5% monthly)
- Net Promoter Score (NPS > 50)
- MRR (Monthly Recurring Revenue)

### iOS App (Phase 6)
- App Store rating (>4.5 stars)
- Daily Active Users (DAU)
- Retention (D7, D30)
- In-app purchase conversion
- App Store feature (goal)

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Web UI |
| **Styling** | Tailwind CSS | Component styling |
| **Hosting** | Vercel | Deployment, Edge Functions |
| **Database** | Notion API | Primary data store |
| **Calendar** | Google Calendar API | Scheduling |
| **Automation** | n8n (self-hosted) | Workflows |
| **AI Agents** | Claude Code + MCP | Agent orchestration |
| **MCP Servers** | Node.js (custom) | Tool access layer |
| **Voice** | OpenAI Whisper API | Transcription |
| **Messaging** | Telegram Bot API | Notifications, voice input |
| **Testing** | Playwright | E2E tests |
| **CI/CD** | GitHub Actions | Automated testing |
| **Auth (future)** | NextAuth.js | User authentication |
| **Billing (future)** | Stripe | Subscriptions |
| **Mobile (future)** | React Native OR Swift | iOS app |

---

## 📝 Notes for Future Development

### Multi-Tenant Considerations
- Each user connects their own Notion workspace (OAuth)
- Separate Notion API tokens per user (encrypted in DB)
- Rate limiting per user to prevent abuse
- Pricing tiers: Free (100 tasks), Pro ($9.99 - unlimited), Team ($29.99)

### iOS App Architecture
- **Option A (React Native)**: Share web codebase, faster development
- **Option B (Swift)**: Native performance, better UX, more dev time
- Offline-first: Local SQLite database with background sync
- Push notifications: Prayer reminders, task deadlines
- Widgets: Today's tasks, Focus timer, Wins

### Scalability Considerations
- Notion API rate limits: 3 requests/second (throttle in MCP server)
- Google Calendar API: 1M requests/day (generous, unlikely to hit)
- Vercel Edge Functions: Fast response times (<50ms)
- Caching strategy: Redis for frequently accessed data
- Webhook processing: Queue system (Vercel + Upstash) for reliability

---

**Next Steps**: Design Google Calendar MCP server specification (see Checkpoint 5 tasks)
