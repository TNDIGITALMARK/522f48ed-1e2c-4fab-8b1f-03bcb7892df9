# Calendar Events Implementation

## Overview

A comprehensive calendar event management system with color-coded categories (School, Work, Personal) integrated into the dashboard calendar and sidebar.

## Features Implemented

### 🎨 Color-Coded Event Categories

- **School** (🎓): Blue color palette
- **Work** (💼): Amber/Orange color palette
- **Personal** (🌟): Green color palette
- Users can select from multiple color variations within each category

### 📅 Calendar Integration

- **Monthly Calendar Display**: Shows events as colored dots on each date
- **Click to Add**: Click any date to create a new event for that day
- **Event Indicators**: Up to 3 colored dots per day, with overflow counter
- **Hover Tooltips**: Event titles shown on hover

### 📋 Events Sidebar

- **Upcoming Events**: Shows next 20 upcoming events with full details
- **This Month**: Collapsible section showing all events for current month
- **Color-Coded Display**: Events shown with their custom colors
- **Delete Functionality**: Hover to reveal delete button for each event
- **Category Icons**: Visual emoji indicators for each category

### ✨ Event Management

- **Add Events**: Full-featured dialog with all event properties
- **Title & Description**: Rich text input for event details
- **Category Selection**: Choose between School, Work, Personal
- **Color Picker**: Select from predefined color palette per category
- **Date & Time**: Set start date and optional time
- **All-Day Events**: Toggle for full-day events

## File Structure

```
src/
├── lib/
│   ├── types/
│   │   └── calendar-events.ts          # TypeScript types and interfaces
│   └── supabase/
│       ├── client.ts                   # Supabase client (existing)
│       └── calendar-events.ts          # CRUD query functions
├── components/
│   ├── add-calendar-event-dialog.tsx   # Event creation modal
│   ├── monthly-calendar.tsx            # Updated calendar with events
│   └── events-sidebar.tsx              # Updated sidebar with calendar events
└── scripts/
    └── create-calendar-events-table.sql # Database schema
```

## Database Schema

### Table: `calendar_events`

```sql
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenantid TEXT NOT NULL,
  projectid UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('school', 'work', 'personal')),
  color TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Database Setup

**IMPORTANT**: The table needs to be created in Supabase before the features will work.

### Option 1: Run SQL Manually

1. Open Supabase SQL Editor
2. Copy contents from `scripts/create-calendar-events-table.sql`
3. Execute the SQL script

### Option 2: Via Supabase CLI (if available)

```bash
supabase db push
```

## API Functions

### Query Functions (`lib/supabase/calendar-events.ts`)

- `getCalendarEvents()` - Get all events for current user/project
- `getCalendarEventsByMonth(year, month)` - Get events for specific month
- `getCalendarEventsByDay(date)` - Get events for specific day
- `getCalendarEventsByCategory(category)` - Filter by category
- `getUpcomingCalendarEvents(limit)` - Get next N upcoming events
- `createCalendarEvent(input)` - Create new event
- `updateCalendarEvent(id, updates)` - Update existing event
- `deleteCalendarEvent(id)` - Delete event

## Usage Examples

### Creating an Event

```typescript
import { createCalendarEvent } from '@/lib/supabase/calendar-events';

await createCalendarEvent({
  title: 'Math Exam',
  description: 'Final exam for Calculus II',
  category: 'school',
  color: '#60A5FA',
  start_date: '2025-12-15T10:00:00Z',
  all_day: false,
});
```

### Querying Events

```typescript
import { getCalendarEventsByMonth } from '@/lib/supabase/calendar-events';

const events = await getCalendarEventsByMonth(2025, 11); // December 2025
```

## Component Integration

### Using the Add Event Dialog

```tsx
import { AddCalendarEventDialog } from '@/components/add-calendar-event-dialog';

<AddCalendarEventDialog
  onEventCreated={() => {
    // Reload events or update UI
  }}
  selectedDate={new Date('2025-12-15')}
  trigger={<Button>Add Event</Button>}
/>
```

### Calendar with Events

The MonthlyCalendar component automatically:
- Loads events for displayed month
- Shows colored dots for each event
- Opens add dialog when clicking dates
- Refreshes on month navigation

### Events Sidebar

The EventsSidebar component:
- Automatically loads upcoming events when opened
- Shows events with color-coded backgrounds
- Allows deletion with hover button
- Groups events by time period

## Color System

### Default Colors by Category

```typescript
school: '#60A5FA'    // Light Blue
work: '#F59E0B'      // Amber
personal: '#10B981'  // Green
```

### Extended Palettes

Each category has 4 color variations users can choose from, providing visual variety while maintaining category recognition.

## Security

- **Row Level Security (RLS)**: Automatic tenant/project isolation
- **JWT Authentication**: Uses scoped tokens with tenant/project claims
- **Automatic Filtering**: All queries filtered by tenant and project ID
- **Secure Delete**: Only owners can delete their events

## Performance Optimizations

- **Indexed Queries**: Database indexes on tenant, project, category, and date
- **Efficient Loading**: Only loads events for visible time periods
- **Optimistic UI**: Immediate UI updates with background sync

## Future Enhancements

Potential additions:
- Event editing dialog (currently delete-only)
- Recurring events support
- Event reminders/notifications
- Calendar sharing between users
- Import/export functionality (iCal, Google Calendar)
- Event categories customization
- Drag-and-drop event rescheduling

## Troubleshooting

### Events Not Showing

1. **Check Database**: Verify `calendar_events` table exists
2. **Check RLS Policies**: Ensure policies are created for anon/authenticated roles
3. **Check Console**: Look for Supabase errors in browser console
4. **Check Token**: Verify scoped token is valid and not expired

### Can't Create Events

1. **Check Permissions**: Verify INSERT policy exists for authenticated role
2. **Check Foreign Keys**: Ensure tenant and project IDs are valid
3. **Check Constraints**: Verify category is one of: school, work, personal

### Events Not Filtering Correctly

1. **Check RLS**: Verify JWT claims include correct tenant_id and project_id
2. **Check Indexes**: Ensure indexes on tenantid and projectid exist
3. **Check Token**: Scoped token must be fresh (45-minute lifetime)

## Technical Details

### Multi-Tenant Architecture

All events are automatically isolated by:
- `tenantid`: Ensures data separation between different tenants
- `projectid`: Ensures data separation between different projects

RLS policies enforce these constraints at the database level, making it impossible to access other users' events.

### Date Handling

- All dates stored as ISO 8601 timestamps in UTC
- Client-side formatting uses `date-fns` library
- All-day events stored with time component for consistency

### Type Safety

Full TypeScript support with:
- Strict event type definitions
- Category type enforcement
- Compile-time type checking for all operations

## Credits

Built with:
- **Next.js 15** - React framework
- **Supabase** - PostgreSQL database with RLS
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **date-fns** - Date utilities
- **Sonner** - Toast notifications
