# Notion Database Schema Review & Fixes

> **Action Required**: Update your Notion databases with these corrected schemas

**Priority**: 🔴 CRITICAL - Must be done before web dashboard will work properly

---

## 🔧 Issues Found

1. **Tasks Database**: "Due" property is TEXT instead of DATE
2. **Missing Property**: "calendar_event_id" doesn't exist yet (need to add)
3. **Property Names**: Need to verify exact naming matches

---

## 📋 Database 1: Tasks

**Current Issues**:
- ❌ "Due" is configured as TEXT (should be DATE with time)
- ❌ Missing "calendar_event_id" property

### Required Properties

| Property Name | Type | Configuration | Purpose |
|--------------|------|---------------|---------|
| **Name** | Title | N/A | Task description |
| **Status** | Select | Options: Backlog, Active, In Progress, Done, Blocked, Archived | Task state |
| **Priority** | Select | Options: Low, Medium, High, Critical | Urgency level |
| **Category** | Select | Options: Personal, Real Estate, Content, Books, Admin, Finance, Health, Spiritual, Learning | Task category |
| **Due** | Date | ✅ **Enable time** | Deadline with specific time |
| **ImpactScore** | Number | Format: Number (0-10) | User-defined impact rating |
| **Effort** | Select | Options: Quick (15min), Short (1hr), Medium (half day), Long (full day+) | Time estimate |
| **NonDeferrable** | Checkbox | N/A | Sacred blocks (prayer, family) |
| **LocationDependent** | Checkbox | N/A | Requires specific location |
| **WhyItMatters** | Text | N/A | Motivation prompt |
| **NextBite** | Text | N/A | Immediate first action |
| **calendar_event_id** | Text | ⭐ **NEW - Add this** | Google Calendar event ID |
| **Project** | Relation | → Projects database | Links to project |
| **LoggedIn** | Relation | → Daily Log database | Links to focus sessions |
| **PriorityWeight** | Formula | `if(prop("Priority") == "Critical", 4, if(prop("Priority") == "High", 3, if(prop("Priority") == "Medium", 2, 1)))` | Numeric priority |
| **DaysUntilDue** | Formula | `if(empty(prop("Due")), 7, max(0, dateBetween(prop("Due"), now(), "days")))` | Days remaining |
| **UrgencyScore** | Formula | `round(prop("ImpactScore") * 1.4 + prop("PriorityWeight") * 1.2 + (3 - min(3, prop("DaysUntilDue"))) * 1.1 + if(prop("NonDeferrable"), 10, 0))` | Auto-calculated priority |
| **CreatedAt** | Created time | Auto | Creation timestamp |
| **LastUpdated** | Last edited time | Auto | Last edit timestamp |

### 🔧 How to Fix:

1. **Fix "Due" property**:
   - Click on "Due" property header → Edit property
   - Change type from "Text" to "Date"
   - ✅ Check "Include time"
   - Click "Save"

2. **Add "calendar_event_id" property**:
   - Click "+ Add property" at the end of columns
   - Name: `calendar_event_id`
   - Type: Text
   - Click "Create"

3. **Verify formulas exist**:
   - Check if PriorityWeight, DaysUntilDue, UrgencyScore exist
   - If missing, add them with the formulas above

---

## 📋 Database 2: Projects

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Name** | Title | Project name |
| **Status** | Select | Planning, Active, On Hold, Completed, Cancelled |
| **Goal** | Text | Desired outcome |
| **KPI** | Text | Success metrics |
| **Deadline** | Date | Project completion target |
| **Risks** | Text | Potential blockers |
| **Tasks** | Relation | → Tasks database (bi-directional) |
| **Ideas** | Relation | → Ideas database |

---

## 📋 Database 3: Ideas

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Title** | Title | Idea name |
| **Status** | Select | Backlog, In Progress, Validating, Shipped, Abandoned |
| **Priority** | Select | High, Medium, Low |
| **Category** | Select | Same options as Tasks |
| **ValidationStatus** | Select | Not Started, Surveying, Waitlist Open, MVP Testing, Validated, Rejected |
| **MarketSignal** | Text | Evidence of demand |
| **Source** | Select | Google Trends, Reddit, GitHub, Personal, Client Request |
| **MonetizationNotes** | Text | Revenue model ideas |
| **NextAction** | Text | Immediate validation step |
| **ConvertedToProject** | Relation | → Projects database |
| **Confidence** | Formula | `toNumber(not empty(MarketSignal)) * 2 + toNumber(not empty(NextAction)) * 1` |
| **CreatedAt** | Created time | Auto |

---

## 📋 Database 4: Daily Log

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Date** | Date | **Date only** (no time) - Make unique |
| **Win_1** | Text | First accomplishment |
| **Win_2** | Text | Second accomplishment |
| **Win_3** | Text | Third accomplishment |
| **MinutesFocused** | Number | Total deep work time |
| **Mood** | Select | Energized, Good, Neutral, Tired, Overwhelmed |
| **BlocksEncountered** | Text | Obstacles faced |
| **Improvement** | Text | What to do better tomorrow |
| **TomorrowFirstMove** | Text | First task for next day |
| **FocusSprints** | Relation | → Tasks (bi-directional with LoggedIn) |
| **WinsComplete** | Formula | `if(empty(Win_1), 0, 1) + if(empty(Win_2), 0, 1) + if(empty(Win_3), 0, 1)` |

---

## 📋 Database 5: Content Calendar

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Title** | Title | Content title |
| **Status** | Select | Idea, Scripting, Editing, Queued, Published, Repurposed |
| **Platform** | Multi-select | YouTube, TikTok, Instagram, LinkedIn, Facebook, Twitter/X, Blog |
| **PublishDate** | Date | With time |
| **Hook** | Text | Attention-grabbing opening |
| **CTA** | Text | Call-to-action |
| **ScriptLink** | URL | Link to script document |
| **ThumbnailIdea** | Text | Visual concept |
| **ProductionTasks** | Relation | → Tasks |

---

## 📋 Database 6: Finance

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Name** | Title | Item name |
| **BabyStep** | Select | Step 1: $1,000 Starter Emergency Fund<br>Step 2: Pay Off All Debt (Except Mortgage) Using Debt Snowball<br>Step 3: 3-6 Months of Expenses in Savings<br>Step 4: Invest 15% of Household Income for Retirement<br>Step 5: Save for Children's College<br>Step 6: Pay Off Home Early<br>Step 7: Build Wealth and Give |
| **Status** | Select | Not Started, In Progress, Complete |
| **Amount** | Number | Format: Dollar (currency) |
| **Notes** | Text | Progress notes |
| **TargetDate** | Date | Completion target |

---

## 📋 Database 7: CRM

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Name** | Title | Contact name |
| **Company** | Text | Organization |
| **Role** | Text | Position/Title |
| **Status** | Select | Lead, Prospect, Client, Past Client, Partner |
| **Email** | Email | Contact email |
| **Phone** | Phone | Contact number |
| **NextFollowUp** | Date | With time |
| **Tags** | Multi-select | Hot, Warm, Cold, VIP, Real Estate, Books, Content, Signing |
| **Notes** | Text | Interaction history |
| **LastContact** | Date | Most recent interaction |

---

## 📋 Database 8: Habits

### Required Properties

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Name** | Title | Habit name |
| **Frequency** | Select | Daily, Weekly, Biweekly, Monthly |
| **Category** | Select | Same as Tasks |
| **LastCompleted** | Date | Most recent completion |
| **Streak** | Number | Current streak count |
| **BestStreak** | Number | Record streak |

---

## ✅ Verification Checklist

After making changes, verify:

- [ ] Tasks "Due" property is **Date with time** (not text)
- [ ] Tasks has "calendar_event_id" as **Text** property
- [ ] All formulas are added (PriorityWeight, DaysUntilDue, UrgencyScore in Tasks)
- [ ] All Select properties have the exact options listed above
- [ ] All Relations are bi-directional where noted
- [ ] Daily Log "Date" property is **Date only** (no time)
- [ ] Finance "Amount" property is formatted as **Currency**
- [ ] CRM "Email" property is type **Email** (not text)
- [ ] CRM "Phone" property is type **Phone** (not text)

---

## 🔄 After Fixing

Once you've made these changes:

1. **Re-run the test script**: `npm run sync:calendar`
2. **Create a test task**: Name it "Test Sync", Status = "Active", Due = Tomorrow 2pm
3. **Run sync again**: Should create calendar event
4. **Check Google Calendar**: Event should appear

---

## 📝 Notes

- The web dashboard relies on these exact property names and types
- Incorrect types will cause sync failures
- Missing properties will show as blank in the UI
- Formulas are optional but highly recommended for auto-prioritization

**Estimated time to fix**: 10-15 minutes

**Priority order**:
1. Fix Tasks "Due" to Date type (CRITICAL)
2. Add Tasks "calendar_event_id" property (CRITICAL)
3. Fix other property types (HIGH)
4. Add formulas (MEDIUM)
5. Verify relations (LOW - can do later)
