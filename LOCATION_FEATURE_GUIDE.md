# Location Intelligence & Travel Time Feature Guide

## ✅ Phase 1 Complete (Deployed)

### What's Been Implemented

1. **UI Improvements**
   - ✅ Fixed light mode contrast (calendar icons now visible)
   - ✅ Enhanced input field visibility
   - ✅ Better placeholder and border colors
   - ✅ WCAG AA compliant contrast ratios

2. **Location Field**
   - ✅ Added to create-task form
   - ✅ Optional location input with helper text
   - ✅ Form state management updated

3. **Google Maps Service**
   - ✅ Distance Matrix API integration
   - ✅ Travel time calculation functions
   - ✅ Geocoding support
   - ✅ Direction link generator

4. **Deployment Fixes**
   - ✅ Vercel routing rewrites added
   - ✅ Should resolve 404 errors

### Test Now

**Local**: http://localhost:3000/lifeos/create-task
**Production**: https://ai-augmented-nextjs-framework.vercel.app/lifeos/create-task

## 📋 Required Manual Steps

### Step 1: Update Notion Database Schema

Add these properties to your **Tasks** database:

1. **Location** (Type: Rich Text)
   - Purpose: Store physical address or place name
   - Example: "123 Main St, Tampa, FL" or "Downtown Office"

2. **TravelTime** (Type: Rich Text)
   - Purpose: Calculated travel duration
   - Example: "15 min" or "1 hr 30 min"

3. **TravelFrom** (Type: Rich Text)
   - Purpose: Origin location (from previous task)
   - Example: "Home" or "Previous meeting location"

**How to add:**
1. Open your Tasks database in Notion
2. Click "+ Add a property"
3. Name it exactly as shown above
4. Set type to "Rich Text"
5. Repeat for all three fields

### Step 2: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Distance Matrix API** (for travel time)
   - **Geocoding API** (for address validation)
4. Create API key in Credentials section
5. Add to your `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=your-api-key-here
   ```

**API Restrictions (Recommended):**
- Application restrictions: HTTP referrers
- API restrictions: Distance Matrix API, Geocoding API only

### Step 3: Configure Environment Variable

Add to `.env` (NOT .env.example):
```bash
GOOGLE_MAPS_API_KEY=AIzaSyD...your-actual-key
```

Restart your dev server after adding.

## 🔄 Phase 2 Implementation (Next Session)

The following features are designed but not yet implemented:

### Travel Time Calculation Logic

```javascript
// Pseudocode for next implementation
1. User creates task with location
2. Query Notion for most recent task with location
3. Calculate travel time: previousLocation → newLocation
4. Adjust task start time to account for travel
5. Store all metadata in Notion:
   - Location: "New task address"
   - TravelFrom: "Previous task address"
   - TravelTime: "15 min"
6. Add to calendar description:
   - Location address
   - Google Maps direction link
   - Travel time estimate
```

### API Updates Needed

**File**: `app/api/lifeos/create-task/route.ts`

```typescript
// Add to route handler:
import { calculateTravelTime, getDirectionsLink } from '@/lib/google-maps-service';

// After extracting location from request body:
let travelInfo = null;

if (location) {
  // Query previous task
  const previousTasks = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_TASKS,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 1,
    filter: {
      property: 'Location',
      rich_text: { is_not_empty: true }
    }
  });

  if (previousTasks.results.length > 0) {
    const prevLocation = previousTasks.results[0].properties.Location?.rich_text?.[0]?.plain_text;

    if (prevLocation) {
      // Calculate travel time
      travelInfo = await calculateTravelTime(prevLocation, location);
    }
  }
}

// Add to Notion properties:
if (location) {
  taskProperties.Location = {
    rich_text: [{ text: { content: location } }]
  };

  if (travelInfo) {
    taskProperties.TravelTime = {
      rich_text: [{ text: { content: travelInfo.durationText } }]
    };
    taskProperties.TravelFrom = {
      rich_text: [{ text: { content: previousLocation } }]
    };
  }
}

// Update calendar event description:
const mapLink = location ? getDirectionsLink(previousLocation || 'Current Location', location) : '';
description = `${description}\n\nLocation: ${location}\nTravel Time: ${travelInfo?.durationText || 'N/A'}\n\nDirections: ${mapLink}`;
```

### Notion MCP Server Update

**File**: `mcp-servers/notion-lifeos/lib/notion-client.js`

Add location fields to `_formatTaskProperties`:

```javascript
if (props.location) {
  properties.Location = {
    rich_text: [{ text: { content: props.location } }]
  };
}
// ... similar for TravelTime and TravelFrom
```

## 🎯 Complete Feature Vision

### What Location Intelligence Provides:

1. **Smart Scheduling**
   - Automatically accounts for travel time
   - Suggests realistic start times
   - Prevents overlapping commitments

2. **Rich Context**
   - All location data stored in Notion
   - Only essential info synced to Calendar
   - Complete audit trail of movements

3. **Travel Optimization**
   - Identifies back-to-back tasks at same location
   - Flags long commutes between tasks
   - Suggests task reordering for efficiency

4. **Mapping Integration**
   - One-click directions in Google Maps
   - Real-time traffic consideration
   - Multiple transport modes (drive, walk, transit)

## 📊 Data Flow

```
User Input → Form
           ↓
Task Created in Notion (ALL data)
├── Task name
├── Due date/time
├── Location ← NEW
├── TravelTime ← CALCULATED
├── TravelFrom ← PREVIOUS TASK
├── Priority, Category, etc.
           ↓
Google Calendar Event (ESSENTIAL only)
├── Title: [Category] Task Name
├── Start: Due - TravelTime
├── End: Due + Effort Duration
├── Description: Why + Next + Location + Map Link
```

## 🔗 Resources

- [Google Distance Matrix API Docs](https://developers.google.com/maps/documentation/distance-matrix)
- [Notion API Database Properties](https://developers.notion.com/reference/property-value-object)
- [LifeOS Architecture](./LIFEOS_ARCHITECTURE.md)

## 🚀 Next Steps

1. **Test Phase 1** (Current)
   - Verify light mode improvements
   - Test location field input
   - Confirm Vercel deployment

2. **Complete Manual Setup**
   - Add Notion fields
   - Get Maps API key
   - Update .env

3. **Implement Phase 2** (Next Session)
   - Travel time calculation
   - API integration
   - Calendar description updates
   - Full end-to-end testing

---

**Questions or Issues?**
- Check console for API errors
- Verify .env variables loaded
- Ensure Notion fields added correctly
- Test with simple addresses first ("Tampa, FL" vs full street address)
