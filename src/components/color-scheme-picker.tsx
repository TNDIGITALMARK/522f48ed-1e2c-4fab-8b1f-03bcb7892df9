"use client";

import { useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  ColorScheme,
  COLOR_SCHEMES,
  getColorsForScheme,
} from '@/lib/types/calendar-events';

interface ColorSchemePickerProps {
  value: string;
  onChange: (color: string) => void;
  selectedScheme?: ColorScheme;
  onSchemeChange?: (scheme: ColorScheme) => void;
}

const SCHEME_NAMES: Record<ColorScheme, string> = {
  brown: 'Brown',
  blue: 'Blue',
  pink: 'Pink',
  green: 'Green',
  custom: 'Custom',
};

export function ColorSchemePicker({
  value,
  onChange,
  selectedScheme = 'brown',
  onSchemeChange,
}: ColorSchemePickerProps) {
  const [activeScheme, setActiveScheme] = useState<ColorScheme>(selectedScheme);
  const [customColor, setCustomColor] = useState(value);

  const handleSchemeChange = (scheme: ColorScheme) => {
    setActiveScheme(scheme);
    if (onSchemeChange) {
      onSchemeChange(scheme);
    }
    // Auto-select first color from scheme
    if (scheme !== 'custom') {
      const colors = getColorsForScheme(scheme);
      if (colors.length > 0) {
        onChange(colors[0]);
      }
    }
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          type="button"
        >
          <div
            className="w-4 h-4 rounded border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm">Choose Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold mb-3 block">
              Color Schemes
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(COLOR_SCHEMES) as ColorScheme[]).map((scheme) => (
                <button
                  key={scheme}
                  type="button"
                  onClick={() => handleSchemeChange(scheme)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    activeScheme === scheme
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background'
                  }`}
                  title={SCHEME_NAMES[scheme]}
                >
                  <div className="flex flex-col items-center gap-1">
                    {scheme === 'custom' ? (
                      <Palette className="w-4 h-4 text-foreground" />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full border border-border"
                        style={{
                          backgroundColor: getColorsForScheme(scheme)[0],
                        }}
                      />
                    )}
                    <span className="text-[10px] font-medium text-foreground">
                      {SCHEME_NAMES[scheme]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {activeScheme !== 'custom' && (
            <div>
              <Label className="text-xs font-semibold mb-3 block">
                {SCHEME_NAMES[activeScheme]} Colors
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {getColorsForScheme(activeScheme).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 relative ${
                      value === color
                        ? 'border-foreground ring-2 ring-primary ring-offset-2'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {value === color && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeScheme === 'custom' && (
            <div>
              <Label className="text-xs font-semibold mb-3 block">
                Custom Color
              </Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-20 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
                <div
                  className="w-full h-12 rounded-lg border border-border"
                  style={{ backgroundColor: customColor }}
                />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
