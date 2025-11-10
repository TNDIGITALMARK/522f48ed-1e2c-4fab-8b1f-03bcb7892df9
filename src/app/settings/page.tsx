"use client";

import { ThemeCustomizer } from '@/components/theme-customizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette, Bell, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Customize your rooted experience</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Theme Customization */}
        <section>
          <ThemeCustomizer />
        </section>

        {/* Additional Settings Placeholder */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <CardTitle>Privacy</CardTitle>
              </div>
              <CardDescription>Control your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Additional display preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
