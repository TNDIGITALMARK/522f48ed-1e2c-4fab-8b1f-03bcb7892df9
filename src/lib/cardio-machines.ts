// Comprehensive cardio machine database with calorie calculations

export interface CardioMachine {
  id: string;
  name: string;
  category: 'Treadmill' | 'Bike' | 'Elliptical' | 'Rowing' | 'Stair' | 'Other';
  baseCaloriesPerMinute: number;
  description: string;
  iconName: string;
}

export interface CardioLog {
  id: string;
  machineId: string;
  machineName: string;
  durationMinutes: number;
  caloriesBurned: number;
  caloriesManualOverride: boolean;
  distance?: number;
  distanceUnit?: 'miles' | 'km' | 'meters';
  averageHeartRate?: number;
  notes?: string;
  workoutDate: string;
  createdAt: string;
}

// Comprehensive list of cardio machines with base calorie burn rates (per minute)
// Based on average 155 lb (70 kg) person - actual burn varies by weight and intensity
export const CARDIO_MACHINES: CardioMachine[] = [
  // TREADMILL VARIATIONS
  {
    id: 'treadmill-walking-35',
    name: 'Treadmill - Walking (3.5 mph)',
    category: 'Treadmill',
    baseCaloriesPerMinute: 4.5,
    description: 'Light walking pace, great for recovery days',
    iconName: 'Walking'
  },
  {
    id: 'treadmill-jogging-5',
    name: 'Treadmill - Jogging (5 mph)',
    category: 'Treadmill',
    baseCaloriesPerMinute: 8.0,
    description: 'Moderate jogging pace for steady cardio',
    iconName: 'Run'
  },
  {
    id: 'treadmill-running-6plus',
    name: 'Treadmill - Running (6+ mph)',
    category: 'Treadmill',
    baseCaloriesPerMinute: 11.5,
    description: 'Fast running pace for high-intensity cardio',
    iconName: 'Zap'
  },
  {
    id: 'treadmill-incline-walking',
    name: 'Treadmill - Incline Walking',
    category: 'Treadmill',
    baseCaloriesPerMinute: 6.5,
    description: 'Walking on incline to increase intensity',
    iconName: 'TrendingUp'
  },
  {
    id: 'treadmill-sprint-intervals',
    name: 'Treadmill - Sprint Intervals',
    category: 'Treadmill',
    baseCaloriesPerMinute: 15.0,
    description: 'High-intensity interval sprints',
    iconName: 'Flame'
  },

  // STATIONARY BIKES
  {
    id: 'bike-light',
    name: 'Stationary Bike - Light',
    category: 'Bike',
    baseCaloriesPerMinute: 5.5,
    description: 'Easy pedaling, low resistance',
    iconName: 'Bike'
  },
  {
    id: 'bike-moderate',
    name: 'Stationary Bike - Moderate',
    category: 'Bike',
    baseCaloriesPerMinute: 7.5,
    description: 'Moderate pace and resistance',
    iconName: 'Bike'
  },
  {
    id: 'bike-vigorous',
    name: 'Stationary Bike - Vigorous',
    category: 'Bike',
    baseCaloriesPerMinute: 10.0,
    description: 'High resistance, intense effort',
    iconName: 'Flame'
  },
  {
    id: 'spin-bike',
    name: 'Spin Bike',
    category: 'Bike',
    baseCaloriesPerMinute: 12.0,
    description: 'High-intensity spin class style workout',
    iconName: 'Flame'
  },
  {
    id: 'recumbent-bike',
    name: 'Recumbent Bike',
    category: 'Bike',
    baseCaloriesPerMinute: 6.0,
    description: 'Seated bike with back support',
    iconName: 'Bike'
  },
  {
    id: 'air-bike',
    name: 'Air Bike (Assault Bike)',
    category: 'Bike',
    baseCaloriesPerMinute: 13.0,
    description: 'Full body bike with arm motion',
    iconName: 'Wind'
  },
  {
    id: 'cycling-outdoor',
    name: 'Cycling - Outdoor',
    category: 'Bike',
    baseCaloriesPerMinute: 8.5,
    description: 'Outdoor cycling at moderate pace',
    iconName: 'Bike'
  },

  // ELLIPTICAL VARIATIONS
  {
    id: 'elliptical-light',
    name: 'Elliptical - Light',
    category: 'Elliptical',
    baseCaloriesPerMinute: 6.0,
    description: 'Low resistance, comfortable pace',
    iconName: 'Activity'
  },
  {
    id: 'elliptical-moderate',
    name: 'Elliptical - Moderate',
    category: 'Elliptical',
    baseCaloriesPerMinute: 8.5,
    description: 'Medium resistance and pace',
    iconName: 'Activity'
  },
  {
    id: 'elliptical-high-resistance',
    name: 'Elliptical - High Resistance',
    category: 'Elliptical',
    baseCaloriesPerMinute: 11.0,
    description: 'High resistance for strength and cardio',
    iconName: 'Zap'
  },
  {
    id: 'elliptical-intervals',
    name: 'Elliptical - Intervals',
    category: 'Elliptical',
    baseCaloriesPerMinute: 12.5,
    description: 'High-intensity interval training',
    iconName: 'Flame'
  },

  // ROWING MACHINES
  {
    id: 'rowing-light',
    name: 'Rowing Machine - Light',
    category: 'Rowing',
    baseCaloriesPerMinute: 7.0,
    description: 'Easy rowing pace, full body motion',
    iconName: 'Waves'
  },
  {
    id: 'rowing-moderate',
    name: 'Rowing Machine - Moderate',
    category: 'Rowing',
    baseCaloriesPerMinute: 9.5,
    description: 'Steady rowing pace with good form',
    iconName: 'Waves'
  },
  {
    id: 'rowing-vigorous',
    name: 'Rowing Machine - Vigorous',
    category: 'Rowing',
    baseCaloriesPerMinute: 12.5,
    description: 'High-intensity rowing for power',
    iconName: 'Flame'
  },
  {
    id: 'rowing-race-pace',
    name: 'Rowing Machine - Race Pace',
    category: 'Rowing',
    baseCaloriesPerMinute: 15.0,
    description: 'Maximum effort rowing sprints',
    iconName: 'Zap'
  },

  // STAIR MACHINES
  {
    id: 'stair-climber-slow',
    name: 'Stair Climber - Slow',
    category: 'Stair',
    baseCaloriesPerMinute: 7.5,
    description: 'Slow and steady stair climbing',
    iconName: 'TrendingUp'
  },
  {
    id: 'stair-climber-moderate',
    name: 'Stair Climber - Moderate',
    category: 'Stair',
    baseCaloriesPerMinute: 9.5,
    description: 'Moderate pace stair climbing',
    iconName: 'TrendingUp'
  },
  {
    id: 'stair-climber-fast',
    name: 'Stair Climber - Fast',
    category: 'Stair',
    baseCaloriesPerMinute: 12.0,
    description: 'Fast-paced stair climbing',
    iconName: 'Flame'
  },
  {
    id: 'stepmill',
    name: 'StepMill',
    category: 'Stair',
    baseCaloriesPerMinute: 10.0,
    description: 'Rotating staircase machine',
    iconName: 'TrendingUp'
  },

  // OTHER CARDIO EXERCISES
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'Other',
    baseCaloriesPerMinute: 12.0,
    description: 'Continuous jump rope for cardio',
    iconName: 'Zap'
  },
  {
    id: 'battle-ropes',
    name: 'Battle Ropes',
    category: 'Other',
    baseCaloriesPerMinute: 10.5,
    description: 'Full body battle rope intervals',
    iconName: 'Waves'
  },
  {
    id: 'box-jumps',
    name: 'Box Jumps',
    category: 'Other',
    baseCaloriesPerMinute: 11.0,
    description: 'Explosive box jump training',
    iconName: 'Zap'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'Other',
    baseCaloriesPerMinute: 12.5,
    description: 'Full body burpee intervals',
    iconName: 'Flame'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'Other',
    baseCaloriesPerMinute: 10.0,
    description: 'High-intensity mountain climbers',
    iconName: 'TrendingUp'
  },
  {
    id: 'swimming-freestyle',
    name: 'Swimming - Freestyle',
    category: 'Other',
    baseCaloriesPerMinute: 11.0,
    description: 'Freestyle swimming laps',
    iconName: 'Waves'
  },
  {
    id: 'swimming-breaststroke',
    name: 'Swimming - Breaststroke',
    category: 'Other',
    baseCaloriesPerMinute: 9.5,
    description: 'Breaststroke swimming',
    iconName: 'Waves'
  },
  {
    id: 'swimming-butterfly',
    name: 'Swimming - Butterfly',
    category: 'Other',
    baseCaloriesPerMinute: 13.0,
    description: 'High-intensity butterfly stroke',
    iconName: 'Zap'
  },
  {
    id: 'running-outdoor',
    name: 'Running - Outdoor Track',
    category: 'Other',
    baseCaloriesPerMinute: 10.5,
    description: 'Outdoor running on track',
    iconName: 'Run'
  },
  {
    id: 'hiking',
    name: 'Hiking',
    category: 'Other',
    baseCaloriesPerMinute: 6.5,
    description: 'Outdoor hiking on trails',
    iconName: 'Mountain'
  },
  {
    id: 'kickboxing',
    name: 'Kickboxing',
    category: 'Other',
    baseCaloriesPerMinute: 11.5,
    description: 'High-intensity kickboxing workout',
    iconName: 'Flame'
  }
];

// Helper function to calculate calories based on duration
export function calculateCalories(machineId: string, durationMinutes: number): number {
  const machine = CARDIO_MACHINES.find(m => m.id === machineId);
  if (!machine) return 0;
  return Math.round(machine.baseCaloriesPerMinute * durationMinutes);
}

// Helper function to get machine by ID
export function getMachineById(id: string): CardioMachine | undefined {
  return CARDIO_MACHINES.find(m => m.id === id);
}

// Helper function to group machines by category
export function getMachinesByCategory() {
  return CARDIO_MACHINES.reduce((acc, machine) => {
    if (!acc[machine.category]) {
      acc[machine.category] = [];
    }
    acc[machine.category].push(machine);
    return acc;
  }, {} as Record<string, CardioMachine[]>);
}
