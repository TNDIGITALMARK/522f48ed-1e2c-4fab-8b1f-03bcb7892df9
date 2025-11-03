"use client";

import React, { useState } from 'react';
import { useCustomTheme } from '@/lib/theme/provider';
import { ColorScheme, DEFAULT_THEMES, ThemePreset } from '@/lib/theme/types';
import { generateComplementaryScheme, generateSchemeName, hslToRgb } from '@/lib/theme/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Plus, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeCustomizer() {
  const { currentScheme, availableSchemes, applyScheme, applyPreset, createCustomScheme, deleteScheme } =
    useCustomTheme();

  const [customColors, setCustomColors] = useState({
    primary: '30 35% 45%',
    background: '42 38% 93%',
  });

  const [customName, setCustomName] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleApplyPreset = (preset: ThemePreset) => {
    applyPreset(preset);
  };

  const handleCreateCustom = () => {
    if (!customColors.primary) return;

    const generatedColors = generateComplementaryScheme(customColors.primary);
    const name = customName || generateSchemeName(customColors.primary);

    const newScheme: ColorScheme = {
      id: `custom-${Date.now()}`,
      name,
      description: 'Custom color scheme',
      colors: {
        primary: customColors.primary,
        primaryForeground: '60 20% 98%',
        secondary: generatedColors.secondary || '40 40% 75%',
        secondaryForeground: generatedColors.foreground || '25 30% 20%',
        background: customColors.background || generatedColors.background || '42 38% 93%',
        foreground: generatedColors.foreground || '25 30% 20%',
        card: '35 35% 88%',
        cardForeground: '25 30% 20%',
        accent: generatedColors.accent || '25 30% 55%',
        accentForeground: '60 20% 98%',
        muted: generatedColors.muted || '35 30% 80%',
        mutedForeground: '25 30% 35%',
        border: '35 25% 82%',
        input: '35 25% 82%',
        ring: customColors.primary,
        destructive: '12 50% 55%',
        destructiveForeground: '60 20% 98%',
        popover: '42 38% 96%',
        popoverForeground: '25 30% 20%',
      },
      createdAt: new Date().toISOString(),
    };

    createCustomScheme(newScheme);
    setCustomName('');
  };

  const ColorPreview = ({ hsl, label }: { hsl: string; label: string }) => {
    const rgb = hslToRgb(hsl);
    const bgColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-md border-2 border-border shadow-sm" style={{ backgroundColor: bgColor }} />
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hsl}</p>
        </div>
      </div>
    );
  };

  const defaultThemes = Object.values(DEFAULT_THEMES);
  const customThemes = availableSchemes.filter((s) => !defaultThemes.some((d) => d.id === s.id));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <CardTitle>Theme Customizer</CardTitle>
        </div>
        <CardDescription>Personalize your color scheme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Create Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Default Themes</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {defaultThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => applyScheme(theme)}
                    className={cn(
                      'relative p-4 rounded-lg border-2 transition-all text-left hover:border-primary/50',
                      currentScheme?.id === theme.id ? 'border-primary bg-primary/5' : 'border-border'
                    )}
                  >
                    {currentScheme?.id === theme.id && (
                      <Badge className="absolute top-2 right-2" variant="default">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    <div className="space-y-2">
                      <div className="flex gap-2 mb-3">
                        {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map((color, i) => {
                          const rgb = hslToRgb(color);
                          return (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-md border shadow-sm"
                              style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                            />
                          );
                        })}
                      </div>
                      <p className="font-semibold text-sm">{theme.name}</p>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {customThemes.length > 0 && (
              <div className="space-y-2 mt-6">
                <Label>Your Custom Themes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={cn(
                        'relative p-4 rounded-lg border-2 transition-all',
                        currentScheme?.id === theme.id ? 'border-primary bg-primary/5' : 'border-border'
                      )}
                    >
                      {currentScheme?.id === theme.id && (
                        <Badge className="absolute top-2 right-10" variant="default">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => deleteScheme(theme.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <button onClick={() => applyScheme(theme)} className="w-full text-left">
                        <div className="space-y-2">
                          <div className="flex gap-2 mb-3">
                            {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map((color, i) => {
                              const rgb = hslToRgb(color);
                              return (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-md border shadow-sm"
                                  style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                                />
                              );
                            })}
                          </div>
                          <p className="font-semibold text-sm">{theme.name}</p>
                          <p className="text-xs text-muted-foreground">{theme.description}</p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-name">Theme Name (optional)</Label>
                <Input
                  id="theme-name"
                  placeholder="My Custom Theme"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color (HSL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    placeholder="30 35% 45%"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPreview(!showPreview)}
                    title="Toggle preview"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: hue saturation% lightness% (e.g., "30 35% 45%" for brown)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-color">Background Color (HSL)</Label>
                <Input
                  id="background-color"
                  placeholder="42 38% 93%"
                  value={customColors.background}
                  onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                />
              </div>

              {showPreview && (
                <Card className="p-4 space-y-3 bg-card/50">
                  <Label>Color Preview</Label>
                  <div className="space-y-2">
                    <ColorPreview hsl={customColors.primary} label="Primary" />
                    <ColorPreview hsl={customColors.background} label="Background" />
                  </div>
                </Card>
              )}

              <Button onClick={handleCreateCustom} className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Theme
              </Button>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-semibold">Quick Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    <strong>Hue (0-360):</strong> Red=0, Orange=30, Yellow=60, Green=120, Blue=240, Purple=280
                  </li>
                  <li>
                    <strong>Saturation (0-100%):</strong> 0% is grayscale, 100% is fully saturated
                  </li>
                  <li>
                    <strong>Lightness (0-100%):</strong> 0% is black, 50% is pure color, 100% is white
                  </li>
                  <li>Other colors will be automatically generated to complement your choices</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {currentScheme && (
          <div className="pt-4 border-t space-y-2">
            <Label>Current Theme: {currentScheme.name}</Label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(currentScheme.colors)
                .slice(0, 6)
                .map(([key, hsl]) => {
                  const rgb = hslToRgb(hsl);
                  return (
                    <div
                      key={key}
                      className="w-10 h-10 rounded-md border shadow-sm"
                      style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
                      title={key}
                    />
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
