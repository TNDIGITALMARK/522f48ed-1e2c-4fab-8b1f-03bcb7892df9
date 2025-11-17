"use client";

import { useState, useEffect } from 'react';

export function useWellnessGoals() {
  const [goals, setGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load goals from localStorage
    const saved = localStorage.getItem('wellness-goals');
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wellness goals:', e);
        setGoals(['holistic']);
      }
    } else {
      setGoals(['holistic']);
    }
    setIsLoading(false);

    // Listen for custom event from dashboard-settings
    const handleGoalsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ goals: string[] }>;
      if (customEvent.detail?.goals) {
        setGoals(customEvent.detail.goals);
      }
    };

    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wellness-goals' && e.newValue) {
        try {
          setGoals(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to parse wellness goals:', err);
        }
      }
    };

    window.addEventListener('wellness-goals-changed', handleGoalsChanged);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('wellness-goals-changed', handleGoalsChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const hasGoal = (goalId: string) => goals.includes(goalId);

  const isGoalActive = (goalIds: string | string[]) => {
    const ids = Array.isArray(goalIds) ? goalIds : [goalIds];
    return ids.some(id => goals.includes(id));
  };

  return {
    goals,
    hasGoal,
    isGoalActive,
    isLoading,
  };
}
