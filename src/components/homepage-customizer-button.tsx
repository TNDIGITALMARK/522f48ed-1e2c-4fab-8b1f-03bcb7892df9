"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, X, Eye, Layout, Palette, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Homepage Customizer Button Component
 *
 * Displays a clickable customization spot at the bottom of the dashboard
 * Opens a modal with options to customize the homepage layout and appearance
 */
export function HomepageCustomizerButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Clickable Customization Button */}
      <Card
        onClick={openModal}
        className="bloom-card textile-overlay-cream cursor-pointer group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-1000"
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
              <Settings className="w-7 h-7 text-primary group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Customize Your Homepage</h3>
              <p className="text-sm text-muted-foreground">
                Personalize your dashboard layout, widgets, and appearance
              </p>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="rounded-full">
              Customize
            </Button>
          </div>
        </div>
      </Card>

      {/* Customization Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <Card
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 z-10">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Customize Your Homepage</h2>
                  <p className="text-sm text-muted-foreground">
                    Make your dashboard truly yours
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Layout Customization Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Layout Options</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-primary/20 rounded mx-auto mb-2"></div>
                        <div className="space-y-1">
                          <div className="w-16 h-2 bg-primary/20 rounded mx-auto"></div>
                          <div className="w-20 h-2 bg-primary/20 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">Compact View</h4>
                    <p className="text-xs text-muted-foreground">
                      Dense layout with smaller widgets
                    </p>
                  </Card>

                  <Card className="p-4 cursor-pointer border-primary/50 bg-primary/5 hover:border-primary transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/30 rounded-lg mx-auto mb-3"></div>
                        <div className="space-y-2">
                          <div className="w-20 h-2 bg-primary/30 rounded mx-auto"></div>
                          <div className="w-24 h-2 bg-primary/30 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium mb-1">Standard View</h4>
                        <p className="text-xs text-muted-foreground">
                          Balanced layout (current)
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-xl mx-auto mb-4"></div>
                        <div className="space-y-2">
                          <div className="w-24 h-3 bg-primary/20 rounded mx-auto"></div>
                          <div className="w-28 h-2 bg-primary/20 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">Spacious View</h4>
                    <p className="text-xs text-muted-foreground">
                      Generous spacing, larger elements
                    </p>
                  </Card>

                  <Card className="p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg mb-3 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-2 p-2">
                        <div className="bg-primary/20 rounded h-12"></div>
                        <div className="bg-primary/20 rounded h-12"></div>
                        <div className="bg-primary/20 rounded h-12 col-span-2"></div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">Grid View</h4>
                    <p className="text-xs text-muted-foreground">
                      Widget-based modular layout
                    </p>
                  </Card>
                </div>
              </div>

              {/* Widget Visibility Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Widget Visibility</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Cycle Phase Banner', enabled: true },
                    { name: 'Daily Aspiration', enabled: true },
                    { name: 'Shared Calendar', enabled: true },
                    { name: 'Goals & Todo List', enabled: true },
                    { name: 'Health Metrics', enabled: true },
                    { name: 'Sleep Tracker', enabled: true },
                  ].map((widget, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{widget.name}</span>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          widget.enabled ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            widget.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Customization Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Theme & Colors</h3>
                </div>
                <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <p className="text-sm mb-4">
                    Want to change your color scheme? Visit the theme customization page.
                  </p>
                  <Link href="/settings/theme">
                    <Button className="w-full rounded-full">
                      Go to Theme Settings
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-full"
                  onClick={() => {
                    // Save customization logic here
                    closeModal();
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
