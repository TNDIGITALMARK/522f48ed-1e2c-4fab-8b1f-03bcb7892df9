/**
 * Seed sample calendar events for demo purposes
 */

import { createEvent } from './calendar-events-store';

const DEMO_USER_ID = 'demo-user';

export function seedSampleEvents() {
  // Only seed if no events exist
  if (typeof window === 'undefined') return;

  const existingData = localStorage.getItem('bloom_calendar_events');
  if (existingData && JSON.parse(existingData)[DEMO_USER_ID]?.length > 0) {
    return; // Events already exist
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Today's events
  const todayMorning = new Date(today);
  todayMorning.setHours(9, 0, 0, 0);

  const todayAfternoon = new Date(today);
  todayAfternoon.setHours(14, 30, 0, 0);

  const todayEvening = new Date(today);
  todayEvening.setHours(18, 0, 0, 0);

  // Tomorrow's events
  const tomorrowMorning = new Date(tomorrow);
  tomorrowMorning.setHours(8, 0, 0, 0);

  // This week's events
  const weekEvents = [];
  for (let i = 2; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    date.setHours(10 + i, 0, 0, 0);
    weekEvents.push(date);
  }

  // Create sample events
  try {
    // Today
    createEvent(DEMO_USER_ID, {
      title: 'Morning Yoga Session',
      description: 'Start the day with energizing flow',
      eventType: 'fitness',
      startDatetime: todayMorning.toISOString(),
      allDay: false,
    });

    createEvent(DEMO_USER_ID, {
      title: 'Healthy Lunch Prep',
      description: 'Prepare quinoa bowl with roasted veggies',
      eventType: 'nutrition',
      startDatetime: todayAfternoon.toISOString(),
      allDay: false,
    });

    createEvent(DEMO_USER_ID, {
      title: 'Team Meeting',
      description: 'Weekly sync with the team',
      eventType: 'work',
      startDatetime: todayEvening.toISOString(),
      allDay: false,
    });

    // Tomorrow
    createEvent(DEMO_USER_ID, {
      title: 'Doctor Appointment',
      description: 'Annual checkup at clinic',
      eventType: 'wellness',
      startDatetime: tomorrowMorning.toISOString(),
      allDay: false,
    });

    // This week
    weekEvents.forEach((date, i) => {
      const eventTypes: Array<'fitness' | 'wellness' | 'nutrition' | 'personal' | 'work' | 'social'> =
        ['fitness', 'wellness', 'nutrition', 'personal', 'social'];
      const titles = [
        'Strength Training',
        'Meditation Session',
        'Meal Planning',
        'Study Time',
        'Coffee with Friends'
      ];

      createEvent(DEMO_USER_ID, {
        title: titles[i],
        eventType: eventTypes[i],
        startDatetime: date.toISOString(),
        allDay: false,
      });
    });

    console.log('✅ Sample events seeded successfully');
  } catch (error) {
    console.error('Failed to seed sample events:', error);
  }
}
