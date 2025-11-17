# Events Sidebar - Dashboard Enhancement

## Overview

A new **expandable right sidebar** has been added to the dashboard, complementing the existing left sidebar. This sidebar provides intelligent event organization and AI-powered todo list generation for users with appointments, schedules, or students managing their time.

---

## Features

### 1. **Expandable Right Sidebar**
- **Position**: Fixed on the right side of the dashboard
- **Toggle Button**: Appears when sidebar is collapsed (mirroring the left sidebar design)
- **Responsive**: Automatically adjusts for mobile and desktop views
- **Backdrop**: Semi-transparent backdrop when expanded for focus

### 2. **Daily Events Widget**
- **Purpose**: Shows today's upcoming events
- **Displays**:
  - Event title and description
  - Event time (formatted as "h:mm a")
  - Event type badge (fitness, wellness, nutrition, personal, work, social)
  - Color-coded event cards based on type
- **Expandable**: Click to expand/collapse
- **Auto-expanded**: Defaults to expanded state

### 3. **Weekly Events Widget**
- **Purpose**: Shows all events for the current week (Sunday - Saturday)
- **Displays**:
  - Event date (formatted as "Today", "Tomorrow", or "MMM d")
  - Event time
  - Event title
  - Event type badge
- **Compact View**: Shows up to 10 events
- **Expandable**: Click to expand/collapse

### 4. **Monthly Events Widget**
- **Purpose**: Shows all events for the current month
- **Displays**:
  - Event date
  - Event title
  - Event type
- **Scrollable**: Up to 20 events displayed with scroll
- **Expandable**: Click to expand/collapse

### 5. **AI Task Planner**
- **Purpose**: Automatically generates intelligent todo lists based on calendar events
- **Smart Features**:
  - **Appointment Preparation**: Creates "Prepare for [event]" tasks 30 mins before appointments
  - **Workout Prep**: Generates "Pack gym bag" tasks before fitness events
  - **Meal Prep**: Creates "Prep ingredients" tasks 1 hour before nutrition events
  - **Daily Review**: Adds "Review today's schedule" task in morning
  - **Tomorrow Planning**: Adds "Plan tomorrow's tasks" task in evening
- **Interactive**:
  - Click "Generate" button to create todos from today's events
  - Check off tasks as completed
  - Time blocks shown for each task
- **Use Cases**:
  - Students managing class schedules and study time
  - Professionals with meetings and appointments
  - Anyone balancing multiple commitments

---

## Technical Implementation

### Components Created

**`src/components/events-sidebar.tsx`**
- Main expandable sidebar component
- Manages state for expanded/collapsed sections
- Loads events from calendar store
- Generates AI todos based on events
- Responsive design with backdrop overlay

**`src/lib/seed-sample-events.ts`**
- Seeds sample calendar events for demonstration
- Only runs once (checks if events already exist)
- Creates events for today, tomorrow, and this week
- Various event types for realistic testing

### Integration Points

**`src/app/dashboard/page.tsx`**
- Imported `EventsSidebar` component
- Added alongside existing `ExpandableSidebar` (left side)
- No layout conflicts - both sidebars work independently

### Data Flow

1. **Event Storage**: Uses existing `calendar-events-store.ts`
   - `getUserEvents()`: Fetches all user events
   - `getTodaysUpcomingEvents()`: Filters today's upcoming events
   - `getWeekEvents()`: Filters this week's events
   - Filters by date ranges for monthly events

2. **AI Todo Generation**:
   - Analyzes today's events
   - Applies intelligent rules based on event types
   - Generates contextual tasks with time blocks
   - Stores in local component state

3. **Real-time Updates**:
   - Events load when sidebar expands
   - Subscription-ready for future real-time event sync

---

## Usage Guide

### For Users

1. **Opening the Sidebar**:
   - Click the toggle button on the right side of the screen (appears as `<` chevron)
   - Sidebar slides in from the right

2. **Viewing Events**:
   - **Daily**: Automatically expanded - see today's schedule at a glance
   - **Weekly**: Click to expand - view this week's events
   - **Monthly**: Click to expand - see the full month

3. **Generating AI Todos**:
   - Ensure you have events scheduled for today
   - Click the **"Generate"** button in the AI Task Planner card
   - Review generated tasks with time blocks
   - Check off tasks as you complete them

4. **Closing the Sidebar**:
   - Click the `<` chevron button in the top-right corner
   - Click anywhere on the backdrop overlay

### For Developers

**Adding New Events Programmatically**:
```typescript
import { createEvent } from '@/lib/calendar-events-store';

createEvent('user-id', {
  title: 'Team Standup',
  description: 'Daily sync meeting',
  eventType: 'work',
  startDatetime: new Date('2025-11-17T10:00:00').toISOString(),
  allDay: false,
});
```

**Customizing AI Todo Generation**:
- Modify `generateAITodos()` function in `events-sidebar.tsx`
- Add new rules based on event types or metadata
- Adjust time blocks and preparation times

**Styling**:
- Event type colors defined in `getEventTypeColor()` function
- Uses Tailwind CSS classes
- Follows Rooted design system (sage green, olive, brown palette)

---

## Event Types and Color Coding

| Event Type | Color | Use Case |
|------------|-------|----------|
| **fitness** | Green | Workouts, exercise, yoga sessions |
| **wellness** | Purple | Doctor appointments, therapy, meditation |
| **nutrition** | Orange | Meal prep, cooking classes, nutritionist visits |
| **personal** | Pink | Personal appointments, errands, self-care |
| **work** | Blue | Meetings, deadlines, work events |
| **social** | Yellow | Social gatherings, coffee dates, events |

---

## Future Enhancements

- [ ] **Calendar Integration**: Sync with Google Calendar, Apple Calendar
- [ ] **Recurring Events**: Full support for RRULE format
- [ ] **Event Editing**: In-sidebar event creation and editing
- [ ] **AI Improvements**: Machine learning for personalized todo suggestions
- [ ] **Notifications**: Push notifications for upcoming events
- [ ] **Time Blocking**: Drag-and-drop todo scheduling
- [ ] **Progress Tracking**: Analytics on task completion rates

---

## Files Modified

### New Files
- `src/components/events-sidebar.tsx` - Main events sidebar component
- `src/lib/seed-sample-events.ts` - Sample event seeding utility
- `EVENTS_SIDEBAR_README.md` - This documentation

### Modified Files
- `src/app/dashboard/page.tsx` - Added EventsSidebar import and component

### Existing Files Used (No Changes)
- `src/lib/calendar-events-store.ts` - Event storage and retrieval
- `src/app/globals.css` - Global design system (already configured)
- `src/lib/theme/types.ts` - Theme system (already synchronized)

---

## Design Principles

✅ **Consistent with Existing UI**: Mirrors the left sidebar design pattern
✅ **Non-Intrusive**: Collapsed by default, doesn't block main content
✅ **Intelligent Automation**: AI-powered todo generation saves time
✅ **Rooted Design System**: Uses sage green, olive, brown color palette
✅ **Responsive**: Works seamlessly on desktop and mobile
✅ **Accessible**: Keyboard navigation and screen reader friendly

---

## Testing

### Manual Testing Checklist

- [x] Sidebar toggle button appears when collapsed
- [x] Sidebar expands/collapses smoothly
- [x] Daily events display correctly
- [x] Weekly events display with proper date formatting
- [x] Monthly events display and scroll
- [x] AI todo generation creates relevant tasks
- [x] Todo checkboxes toggle completion state
- [x] Event type colors display correctly
- [x] Backdrop closes sidebar when clicked
- [x] Sample events seed on first load
- [x] No layout conflicts with left sidebar

### Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)

---

## Support

For questions or issues:
1. Check the calendar events store: `src/lib/calendar-events-store.ts`
2. Review component state management in `events-sidebar.tsx`
3. Verify sample events are seeding correctly in browser console

---

**Built with ❤️ using the Rooted design system**
