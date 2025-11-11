"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ColorScheme, DEFAULT_THEMES, ThemePreset } from './types';
import { applyColorScheme, getCurrentColorScheme } from './utils';

interface ThemeContextType {
  currentScheme: ColorScheme | null;
  availableSchemes: ColorScheme[];
  applyScheme: (scheme: ColorScheme) => void;
  applyPreset: (preset: ThemePreset) => void;
  createCustomScheme: (scheme: ColorScheme) => void;
  deleteScheme: (schemeId: string) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentScheme, setCurrentScheme] = useState<ColorScheme | null>(null);
  const [availableSchemes, setAvailableSchemes] = useState<ColorScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom schemes from localStorage
  const loadCustomSchemes = useCallback((): ColorScheme[] => {
    try {
      const stored = localStorage.getItem('bloom-custom-themes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load custom themes:', error);
    }
    return [];
  }, []);

  // Initialize with default themes
  useEffect(() => {
    const defaultSchemes = Object.values(DEFAULT_THEMES);
    const customSchemes = loadCustomSchemes();
    setAvailableSchemes([...defaultSchemes, ...customSchemes]);

    // Load saved theme from localStorage
    const savedSchemeId = localStorage.getItem('bloom-theme-scheme');
    if (savedSchemeId) {
      const allSchemes = [...defaultSchemes, ...customSchemes];
      const savedScheme = allSchemes.find((s) => s.id === savedSchemeId);
      if (savedScheme) {
        setCurrentScheme(savedScheme);
        applyColorScheme(savedScheme);
      } else {
        // Fallback to default - Force reapply with new color scheme
        const defaultScheme = DEFAULT_THEMES.brownBeige;
        setCurrentScheme(defaultScheme);
        applyColorScheme(defaultScheme);
        // Save the new scheme ID to force refresh
        localStorage.setItem('bloom-theme-scheme', defaultScheme.id);
      }
    } else {
      // Apply default sage/olive/brown theme - Force fresh application
      const defaultScheme = DEFAULT_THEMES.brownBeige;
      setCurrentScheme(defaultScheme);
      applyColorScheme(defaultScheme);
      localStorage.setItem('bloom-theme-scheme', defaultScheme.id);
    }

    setIsLoading(false);
  }, [loadCustomSchemes]);

  // Save custom schemes to localStorage
  const saveCustomSchemes = useCallback((schemes: ColorScheme[]) => {
    try {
      localStorage.setItem('bloom-custom-themes', JSON.stringify(schemes));
    } catch (error) {
      console.error('Failed to save custom themes:', error);
    }
  }, []);

  // Apply a color scheme
  const applyScheme = useCallback((scheme: ColorScheme) => {
    setCurrentScheme(scheme);
    applyColorScheme(scheme);
    localStorage.setItem('bloom-theme-scheme', scheme.id);
  }, []);

  // Apply a preset theme
  const applyPreset = useCallback(
    (preset: ThemePreset) => {
      const scheme = DEFAULT_THEMES[preset];
      if (scheme) {
        applyScheme(scheme);
      }
    },
    [applyScheme]
  );

  // Create a custom color scheme
  const createCustomScheme = useCallback(
    (scheme: ColorScheme) => {
      const customSchemes = loadCustomSchemes();
      const updatedSchemes = [...customSchemes, scheme];
      saveCustomSchemes(updatedSchemes);
      setAvailableSchemes((prev) => [...prev, scheme]);
      applyScheme(scheme);
    },
    [loadCustomSchemes, saveCustomSchemes, applyScheme]
  );

  // Delete a custom scheme
  const deleteScheme = useCallback(
    (schemeId: string) => {
      // Don't allow deleting default themes
      if (Object.keys(DEFAULT_THEMES).some((key) => DEFAULT_THEMES[key as ThemePreset].id === schemeId)) {
        console.warn('Cannot delete default themes');
        return;
      }

      const customSchemes = loadCustomSchemes();
      const updatedSchemes = customSchemes.filter((s) => s.id !== schemeId);
      saveCustomSchemes(updatedSchemes);
      setAvailableSchemes((prev) => prev.filter((s) => s.id !== schemeId));

      // If deleting current scheme, switch to default
      if (currentScheme?.id === schemeId) {
        applyPreset('brownBeige');
      }
    },
    [loadCustomSchemes, saveCustomSchemes, currentScheme, applyPreset]
  );


  return (
    <ThemeContext.Provider
      value={{
        currentScheme,
        availableSchemes,
        applyScheme,
        applyPreset,
        createCustomScheme,
        deleteScheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within CustomThemeProvider');
  }
  return context;
}
