/**
 * Homepage Template System
 * Premade homepage layouts for different user focus areas
 */

export type HomepageTemplateId = 'custom' | 'nutrition-focus' | 'fitness-focus';

export interface HomepageWidgetConfig {
  id: string;
  enabled: boolean;
  order: number;
  size?: 'small' | 'medium' | 'large';
}

export interface HomepageTemplate {
  id: HomepageTemplateId;
  name: string;
  description: string;
  icon: string;
  focusArea: 'nutrition' | 'fitness' | 'custom';
  widgets: HomepageWidgetConfig[];
  isPremade: boolean;
}

export const HOMEPAGE_TEMPLATES: Record<HomepageTemplateId, HomepageTemplate> = {
  custom: {
    id: 'custom',
    name: 'Custom Layout',
    description: 'Build your own personalized homepage from scratch',
    icon: 'layout',
    focusArea: 'custom',
    isPremade: false,
    widgets: [
      { id: 'cycle-phase-banner', enabled: true, order: 1, size: 'large' },
      { id: 'smart-scanner', enabled: true, order: 2, size: 'medium' },
      { id: 'shared-calendar', enabled: true, order: 3, size: 'large' },
      { id: 'quick-access', enabled: true, order: 4, size: 'medium' },
      { id: 'goals-todo', enabled: true, order: 5, size: 'medium' },
      { id: 'daily-aspiration', enabled: true, order: 6, size: 'small' },
      { id: 'circular-navigation', enabled: true, order: 7, size: 'large' },
    ],
  },
  'nutrition-focus': {
    id: 'nutrition-focus',
    name: 'Nutrition Focus',
    description: 'AI meal planning, grocery lists, and nutrition insights for optimal health',
    icon: 'utensils',
    focusArea: 'nutrition',
    isPremade: true,
    widgets: [
      { id: 'cycle-phase-banner', enabled: true, order: 1, size: 'large' },
      { id: 'ai-meal-suggestions', enabled: true, order: 2, size: 'large' },
      { id: 'smart-scanner', enabled: true, order: 3, size: 'medium' },
      { id: 'nutrition-carousel', enabled: true, order: 4, size: 'large' },
      { id: 'grocery-list', enabled: true, order: 5, size: 'medium' },
      { id: 'shared-calendar', enabled: true, order: 6, size: 'large' },
      { id: 'meal-planner', enabled: true, order: 7, size: 'medium' },
      { id: 'macro-tracker', enabled: true, order: 8, size: 'medium' },
      { id: 'ai-nutrition-insights', enabled: true, order: 9, size: 'large' },
      { id: 'daily-aspiration', enabled: true, order: 10, size: 'small' },
      { id: 'circular-navigation', enabled: true, order: 11, size: 'large' },
    ],
  },
  'fitness-focus': {
    id: 'fitness-focus',
    name: 'Fitness & Workout Goals',
    description: 'Track workouts, set fitness goals, and optimize your training routine',
    icon: 'dumbbell',
    focusArea: 'fitness',
    isPremade: true,
    widgets: [
      { id: 'cycle-phase-banner', enabled: true, order: 1, size: 'large' },
      { id: 'workout-summary', enabled: true, order: 2, size: 'large' },
      { id: 'fitness-goals', enabled: true, order: 3, size: 'medium' },
      { id: 'cycle-workout-insights', enabled: true, order: 4, size: 'large' },
      { id: 'shared-calendar', enabled: true, order: 5, size: 'large' },
      { id: 'exercise-log', enabled: true, order: 6, size: 'medium' },
      { id: 'cardio-tracker', enabled: true, order: 7, size: 'medium' },
      { id: 'strength-progress', enabled: true, order: 8, size: 'medium' },
      { id: 'goals-todo', enabled: true, order: 9, size: 'medium' },
      { id: 'daily-aspiration', enabled: true, order: 10, size: 'small' },
      { id: 'circular-navigation', enabled: true, order: 11, size: 'large' },
    ],
  },
};

/**
 * Get template by ID
 */
export function getTemplateById(id: HomepageTemplateId): HomepageTemplate {
  return HOMEPAGE_TEMPLATES[id];
}

/**
 * Get all premade templates (excluding custom)
 */
export function getPremadeTemplates(): HomepageTemplate[] {
  return Object.values(HOMEPAGE_TEMPLATES).filter(template => template.isPremade);
}

/**
 * Get template from localStorage or default
 */
export function getCurrentTemplate(): HomepageTemplate {
  if (typeof window === 'undefined') {
    return HOMEPAGE_TEMPLATES.custom;
  }

  const savedTemplateId = localStorage.getItem('rooted-homepage-template') as HomepageTemplateId;
  return savedTemplateId ? getTemplateById(savedTemplateId) : HOMEPAGE_TEMPLATES.custom;
}

/**
 * Save template selection to localStorage
 */
export function saveTemplateSelection(templateId: HomepageTemplateId): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rooted-homepage-template', templateId);
  }
}
