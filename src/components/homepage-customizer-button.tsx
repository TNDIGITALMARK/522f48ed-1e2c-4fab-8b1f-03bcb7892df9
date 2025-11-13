"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, X, Eye, Layout, Palette, Home, Utensils, Dumbbell, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import {
  type HomepageTemplateId,
  HOMEPAGE_TEMPLATES,
  getPremadeTemplates,
  getCurrentTemplate,
  saveTemplateSelection,
} from '@/types/homepage-templates';

/**
 * Homepage Customizer Button Component
 *
 * Displays a clickable customization spot at the bottom of the dashboard
 * Opens a modal with options to customize the homepage layout and appearance
 */
export function HomepageCustomizerButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<HomepageTemplateId>('custom');

  useEffect(() => {
    const current = getCurrentTemplate();
    setSelectedTemplate(current.id);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTemplateSelect = (templateId: HomepageTemplateId) => {
    setSelectedTemplate(templateId);
  };

  const handleSaveChanges = () => {
    saveTemplateSelection(selectedTemplate);
    closeModal();
    // Reload page to apply new template
    window.location.reload();
  };

  const premadeTemplates = getPremadeTemplates();

  const getIconForTemplate = (icon: string) => {
    switch (icon) {
      case 'utensils':
        return Utensils;
      case 'dumbbell':
        return Dumbbell;
      default:
        return Layout;
    }
  };

  return (
    <>
      {/* Clickable Customization Button - No Card Wrapper */}
      <div
        onClick={openModal}
        className="cursor-pointer group flex flex-col items-center gap-3 py-6 transition-all duration-300 animate-fade-in-up animation-delay-1000 hover:opacity-80"
      >
        <Settings className="w-8 h-8 text-primary group-hover:rotate-90 transition-transform duration-300" />
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity">
          Customize your homepage
        </p>
      </div>

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
              {/* Premade Templates Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Choose Your Homepage</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a premade homepage tailored to your focus, or build your own custom layout.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Custom Layout Option */}
                  <Card
                    className={`p-5 cursor-pointer transition-all ${
                      selectedTemplate === 'custom'
                        ? 'border-primary/70 bg-primary/5 shadow-lg'
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => handleTemplateSelect('custom')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Layout className="w-6 h-6 text-primary" />
                      </div>
                      {selectedTemplate === 'custom' && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold mb-2">Custom Layout</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {HOMEPAGE_TEMPLATES.custom.description}
                    </p>
                  </Card>

                  {/* Premade Templates */}
                  {premadeTemplates.map((template) => {
                    const IconComponent = getIconForTemplate(template.icon);
                    return (
                      <Card
                        key={template.id}
                        className={`p-5 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-primary/70 bg-primary/5 shadow-lg'
                            : 'hover:border-primary/30'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          {selectedTemplate === template.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {template.description}
                        </p>
                      </Card>
                    );
                  })}
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
                  onClick={handleSaveChanges}
                >
                  Apply Template
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
