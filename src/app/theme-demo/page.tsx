"use client";

import { ThemeCustomizer } from '@/components/theme-customizer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Palette, Home } from 'lucide-react';
import Link from 'next/link';

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with theme switcher */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container max-w-6xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Theme System Demo</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl py-8 space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Custom Color Schemes</h2>
            <p className="text-muted-foreground">
              Experience Bloom with your own personalized color palette. Choose from our curated presets or create
              your own custom theme.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Brown & Beige Default</Badge>
            <Badge variant="outline">6 Preset Themes</Badge>
            <Badge variant="outline">Unlimited Custom Themes</Badge>
            <Badge variant="outline">Instant Preview</Badge>
          </div>
        </section>

        <Separator />

        {/* Theme Customizer */}
        <section>
          <ThemeCustomizer />
        </section>

        <Separator />

        {/* Component Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Component Preview</h2>
            <p className="text-muted-foreground">See how your theme affects different UI elements</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
                <CardDescription>Main action colors and emphasis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Primary Button</Button>
                <Button variant="secondary" className="w-full">
                  Secondary Button
                </Button>
                <Button variant="outline" className="w-full">
                  Outline Button
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Surface Colors</CardTitle>
                <CardDescription>Cards and containers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">Muted background</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm">Accent background</p>
                </div>
                <div className="p-4 border-2 border-border rounded-lg">
                  <p className="text-sm">Border emphasis</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Text hierarchy and styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <h1 className="text-3xl">Heading 1</h1>
                <h2 className="text-2xl">Heading 2</h2>
                <h3 className="text-xl">Heading 3</h3>
                <p className="text-base">Body text paragraph with normal weight</p>
                <p className="text-sm text-muted-foreground">Muted secondary text</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges & Status</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Instructions */}
        <section className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold mb-1">Quick Switch (Header)</p>
                <p className="text-sm text-muted-foreground">
                  Click the palette icon in the header to quickly switch between preset themes
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Create Custom Themes</p>
                <p className="text-sm text-muted-foreground">
                  Use the "Create Custom" tab above to design your own color scheme using HSL values
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Persistent Storage</p>
                <p className="text-sm text-muted-foreground">
                  Your theme preference is saved automatically and will persist across sessions
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Access Settings</p>
                <p className="text-sm text-muted-foreground">
                  Visit <Link href="/settings" className="underline font-semibold">Settings</Link> page anytime to
                  customize your theme
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
