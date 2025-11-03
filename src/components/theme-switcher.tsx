"use client";

import React from 'react';
import { useCustomTheme } from '@/lib/theme/provider';
import { DEFAULT_THEMES, ThemePreset } from '@/lib/theme/types';
import { hslToRgb } from '@/lib/theme/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';
import Link from 'next/link';

export function ThemeSwitcher() {
  const { currentScheme, applyPreset } = useCustomTheme();

  const defaultThemes = Object.entries(DEFAULT_THEMES);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title="Theme">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {defaultThemes.map(([key, theme]) => {
          const isActive = currentScheme?.id === theme.id;
          const rgb = hslToRgb(theme.colors.primary);

          return (
            <DropdownMenuItem key={key} onClick={() => applyPreset(key as ThemePreset)} className="cursor-pointer">
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-6 h-6 rounded border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                />
                <span className="flex-1">{theme.name}</span>
                {isActive && <Check className="w-4 h-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Palette className="w-4 h-4 mr-2" />
            Customize Theme...
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
