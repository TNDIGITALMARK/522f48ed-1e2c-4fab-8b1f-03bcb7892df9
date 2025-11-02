# Period Calendar & Cycle Insights - Feature Documentation

## Overview

A comprehensive period tracking and calendar system integrated into the Bloom wellness dashboard. This feature enables users to:

- **Track menstrual cycles** with automatic phase calculations
- **View cycle insights** with personalized recommendations
- **Schedule wellness events** on an interactive calendar
- **Monitor weekly balance** with smart activity distribution
- **Integrate events** with the smart weekly balance feature

## Features Implemented

### 1. **Interactive Period Calendar** (`src/components/period-calendar.tsx`)

A full-featured calendar component with:

- **Monthly calendar view** with navigation controls
- **Cycle phase visualization** - each day colored by phase:
  - 🌸 **Menstruation** (Pale pink rose) - Days 1-5
  - 💜 **Follicular** (Soft lilac) - Days 6-13
  - 🌿 **Ovulation** (Soft mint) - Days 14-16
  - 🧡 **Luteal** (Peach blossom) - Days 17-28
- **Period day indicators** with droplet icons
- **Event dots** showing scheduled activities
- **Day selection** to view/edit events
- **Event management** with full CRUD operations
- **Calendar legend** explaining phase colors

**Key Features**:
- Click any day to view details and add events
- Visual phase indicators automatically calculated
- Event type categorization (fitness, wellness, nutrition, personal)
- Balance impact assignment for weekly integration

### 2. **Cycle Insights Widget** (`src/components/cycle-insights-widget.tsx`)

Provides comprehensive cycle information:

- **Current phase display** with phase-specific styling
- **Phase progress indicator** showing days in current phase
- **Energy level tracking** based on cycle phase:
  - Low (menstruation)
  - High (follicular)
  - Elevated (ovulation)
  - Moderate (luteal)
- **Next period prediction** with countdown
- **Personalized recommendations** for each phase
- **Common symptoms** to expect
- **Cycle setup dialog** for first-time users
- **Edit functionality** to update cycle parameters

**Phase-Specific Recommendations**:
- **Menstruation**: Rest, gentle movement, self-care
- **Follicular**: Challenging workouts, important meetings
- **Ovulation**: High-intensity exercise, social activities
- **Luteal**: Yoga, stress management, nutrition focus

### 3. **Weekly Balance Widget** (`src/components/weekly-balance-widget.tsx`)

Smart activity distribution tracker:

- **Weekly overview** of scheduled events
- **Balance score** calculation (0-100%)
- **Activity breakdown**:
  - 🌙 Rest days
  - 💚 Moderate activity days
  - ⚡ Active days
- **7-day schedule view** with event listings
- **Smart recommendations** for optimal balance
- **Week navigation** controls
- **Automatic integration** with calendar events

**Balance Logic**:
- Events automatically affect weekly balance based on impact type
- Ideal balance: 1-3 rest days, 2-4 active days, 2-4 moderate days
- AI-powered recommendations for adjustments

### 4. **Cycle Calculation Utilities** (`src/lib/period-calendar.ts`)

Comprehensive period tracking logic:

**Core Functions**:
- `calculateCyclePhase()` - Determine phase from cycle day
- `getDayOfCycle()` - Calculate current cycle day
- `predictNextPeriod()` - Forecast next period start
- `getFertileWindow()` - Calculate fertile days
- `getCycleInsights()` - Generate comprehensive insights
- `generateCalendarDays()` - Build calendar with phase data

**Data Management**:
- `saveCycle()` / `getCycles()` - Period cycle persistence
- `saveEvent()` / `getEvents()` - Event management
- `deleteEvent()` - Remove events
- `calculateWeeklyBalance()` - Balance calculations

**Storage**: All data stored in localStorage with user isolation

### 5. **Database Schema** (Ready for Supabase)

Migration file created: `/app/temp/.../supabase/migrations/20251102021338_create_period_calendar_tables.sql`

**Tables**:

1. **period_cycles**
   - Tracks menstrual cycle information
   - Stores start/end dates, cycle length, period length
   - Includes flow intensity and notes
   - Multi-tenant isolated

2. **calendar_events**
   - Stores wellness events
   - Event categorization (fitness, wellness, nutrition, personal)
   - Weekly balance integration fields
   - Completion tracking
   - Multi-tenant isolated

3. **cycle_symptoms**
   - Detailed symptom tracking
   - Linked to specific cycles
   - Severity ratings
   - Multi-tenant isolated

**Note**: Currently using localStorage for demo purposes. Migration ready to apply for production.

### 6. **Design System Integration**

**Custom CSS Classes** (in `globals.css`):

```css
/* Calendar Grid */
.calendar-grid - 7-column calendar layout
.calendar-day - Individual day cell styling
.today - Highlights current day
.selected - Selected day state

/* Cycle Phases */
.menstruation - Pink rose gradient
.follicular - Lilac gradient
.ovulation - Mint gradient
.luteal - Peach gradient

/* Events */
.event-dots - Event indicator container
.event-dot.fitness - Green event dot
.event-dot.wellness - Lavender event dot
.event-dot.nutrition - Peach event dot
.event-dot.personal - Rose event dot

/* Insights */
.cycle-insight-card - Gradient header bar
.phase-progress - Phase progress bar
.calendar-legend - Color legend display
```

**Color System**:
```css
--cycle-menstruation: 345 50% 88%
--cycle-follicular: 280 45% 82%
--cycle-ovulation: 135 25% 85%
--cycle-luteal: 15 70% 90%

--event-fitness: 135 35% 75%
--event-wellness: 280 50% 80%
--event-nutrition: 15 60% 85%
--event-personal: 345 45% 85%
```

## Usage Examples

### Setting Up Period Tracking

1. Navigate to the dashboard
2. Click "Set Up Period Tracking" in the Cycle Insights widget
3. Enter last period start date
4. Adjust cycle length (default: 28 days) and period length (default: 5 days)
5. Click "Save & Start Tracking"

### Adding Calendar Events

1. Click any day on the calendar
2. Click "Add Event" button
3. Fill in event details:
   - Title (required)
   - Description
   - Event type (fitness, wellness, nutrition, personal, other)
   - Time and duration
   - Balance impact (rest, moderate, active, none)
4. Click "Add Event"

### Viewing Cycle Insights

The Cycle Insights widget automatically displays:
- Current phase and day in phase
- Phase progress percentage
- Energy level for the phase
- Next period prediction
- Personalized recommendations
- Expected symptoms

### Monitoring Weekly Balance

The Weekly Balance widget shows:
- Current week's scheduled events
- Distribution of rest/moderate/active days
- Balance score (0-100%)
- Smart recommendations for adjustments
- Navigation to view past/future weeks

## Technical Architecture

### Component Hierarchy

```
DashboardPage
├── PeriodCalendar
│   ├── Calendar Grid
│   ├── Selected Day Details
│   └── Event Dialog (Add/Edit)
├── CycleInsightsWidget
│   ├── Phase Information
│   ├── Recommendations Card
│   └── Symptoms Card
└── WeeklyBalanceWidget
    ├── Balance Score
    ├── Activity Breakdown
    └── Week Schedule View
```

### Data Flow

1. **User inputs period start** → Saved to localStorage
2. **Cycle calculations** → Phase determined based on day
3. **Calendar generation** → Days mapped with phase colors
4. **Events created** → Stored with balance impact
5. **Weekly balance** → Auto-calculated from events
6. **Insights updated** → Recommendations based on phase

### State Management

- **Local state** (useState) for UI interactions
- **localStorage** for data persistence
- **useEffect** for data loading and sync
- **Automatic recalculation** when data changes

## Integration with Existing Features

### Dashboard Integration

Period calendar positioned prominently:
- **Top section**: After weight/goals, before daily rituals
- **Full-width layout**: Calendar spans 2/3 width
- **Side column**: Cycle insights in 1/3 width
- **Full-width balance**: Weekly balance below calendar

### Weekly Balance Connection

Events from calendar automatically populate weekly balance:
- Each event has a `balanceImpactType` (rest/moderate/active/none)
- `affectsWeeklyBalance` flag controls inclusion
- Weekly widget queries events for current week
- Balance score calculated from event distribution
- Recommendations generated based on balance

## Responsive Design

### Mobile (< 768px)
- Calendar cells: 40px min-height, smaller text
- Event dots: 4px diameter
- Stacked layout for all sections
- Touch-friendly interaction areas

### Tablet (768px - 1023px)
- Calendar cells: 48px min-height
- 2-column layout where appropriate
- Balanced spacing

### Desktop (≥ 1024px)
- Full calendar grid with 48px cells
- 3-column dashboard layout
- Maximum readability and interaction space

## Accessibility Features

- **Keyboard navigation**: Full keyboard support for calendar
- **ARIA labels**: Screen reader descriptions
- **Focus indicators**: Clear visual focus states
- **Color contrast**: WCAG AA compliant colors
- **Touch targets**: Minimum 44px for mobile

## Performance Considerations

- **Lazy rendering**: Calendar days only generated for visible month
- **Memoization**: Cycle calculations cached
- **Event filtering**: Only load events for relevant date ranges
- **localStorage**: Fast local data access
- **Optimistic updates**: Immediate UI feedback

## Future Enhancements

### Potential Additions

1. **Symptom tracking** - Detailed symptom logging per day
2. **Mood tracking** - Emotional state throughout cycle
3. **Fertility predictions** - Ovulation and fertile window alerts
4. **Data visualization** - Charts showing cycle patterns over time
5. **Export functionality** - PDF reports of cycle data
6. **Reminders** - Push notifications for period predictions
7. **Sharing** - Share cycle info with healthcare providers
8. **Historical analysis** - Pattern detection over multiple cycles
9. **Integration with wearables** - Sync with fitness trackers
10. **Medication reminders** - Track supplements/medications by phase

## Files Created/Modified

### New Files
- `src/lib/period-calendar.ts` - Core utilities and types
- `src/components/period-calendar.tsx` - Interactive calendar component
- `src/components/cycle-insights-widget.tsx` - Insights display
- `src/components/weekly-balance-widget.tsx` - Balance tracker
- `supabase/migrations/20251102021338_create_period_calendar_tables.sql` - Database schema

### Modified Files
- `src/app/globals.css` - Added calendar styling system
- `src/app/dashboard/page.tsx` - Integrated calendar components

## Testing Recommendations

### Manual Testing Checklist

- [ ] Set up period tracking with various cycle lengths
- [ ] Navigate between months in calendar
- [ ] Add events of different types
- [ ] Edit and delete events
- [ ] Verify phase colors update correctly
- [ ] Check weekly balance calculations
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Verify localStorage persistence across page reloads
- [ ] Test edge cases (first day, last day of month)
- [ ] Confirm event dots display correctly (1, 2, 3+ events)

### Browser Testing

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## API Reference

### Period Calendar Functions

```typescript
// Cycle calculations
calculateCyclePhase(dayOfCycle: number, cycleLength: number, periodLength: number): CyclePhase
getDayOfCycle(lastPeriodStart: Date, currentDate: Date): number
predictNextPeriod(lastPeriodStart: Date, cycleLength: number): Date
getFertileWindow(lastPeriodStart: Date, cycleLength: number): { start: Date; end: Date }
getCycleInsights(cycle: PeriodCycle, currentDate: Date): CycleInsight

// Calendar generation
generateCalendarDays(year: number, month: number, cycle: PeriodCycle | null, events: CalendarEvent[], selectedDate: Date | null): CalendarDay[]

// Data management
saveCycle(cycle: PeriodCycle): void
getCycles(userId: string): PeriodCycle[]
getActiveCycle(userId: string): PeriodCycle | null
saveEvent(event: CalendarEvent): void
getEvents(userId: string, startDate?: Date, endDate?: Date): CalendarEvent[]
deleteEvent(eventId: string, userId: string): void

// Weekly balance
calculateWeeklyBalance(events: CalendarEvent[], weekStart: Date): WeeklyBalanceData
```

## TypeScript Types

```typescript
type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';
type EventType = 'fitness' | 'wellness' | 'nutrition' | 'personal' | 'other';
type BalanceImpact = 'rest' | 'active' | 'moderate' | 'none';

interface PeriodCycle {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  cycleLength: number;
  periodLength: number;
  currentPhase?: CyclePhase;
  flowIntensity?: FlowIntensity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  durationMinutes?: number;
  eventType: EventType;
  eventColor?: string;
  allDay: boolean;
  recurrencePattern: 'none' | 'daily' | 'weekly' | 'monthly';
  affectsWeeklyBalance: boolean;
  balanceImpactType: BalanceImpact;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Summary

The Period Calendar & Cycle Insights feature is a comprehensive wellness tracking system that:

✅ **Tracks menstrual cycles** with automatic phase calculations
✅ **Visualizes cycle phases** on an interactive calendar
✅ **Provides personalized insights** based on current phase
✅ **Manages wellness events** with full CRUD operations
✅ **Integrates with weekly balance** for holistic planning
✅ **Uses localStorage** for demo (Supabase-ready for production)
✅ **Follows design system** with beautiful pastel aesthetics
✅ **Fully responsive** across all device sizes
✅ **Accessible** with keyboard navigation and screen reader support

**Implementation Status**: ✅ **Complete and fully functional**
