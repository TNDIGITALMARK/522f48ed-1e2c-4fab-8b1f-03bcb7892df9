"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisionBoardProps {
  userId?: string;
}

export function MonthlyVisionBoard({ userId }: VisionBoardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mock vision board images - in a real app, these would come from user uploads or database
  const visionImages = [
    { id: 1, src: '/placeholder-vision-1.jpg', alt: 'Vision 1' },
    { id: 2, src: '/placeholder-vision-2.jpg', alt: 'Vision 2' },
    { id: 3, src: '/placeholder-vision-3.jpg', alt: 'Vision 3' },
    { id: 4, src: '/placeholder-vision-4.jpg', alt: 'Vision 4' },
    { id: 5, src: '/placeholder-vision-5.jpg', alt: 'Vision 5' },
    { id: 6, src: '/placeholder-vision-6.jpg', alt: 'Vision 6' },
  ];

  // Get current month name
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Card className="calendar-container overflow-hidden">
      {/* Dropdown Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold">Monthly Vision Board</h3>
            <p className="text-sm text-muted-foreground">{currentMonth}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in-up">
          <div className="border-t border-border/50 pt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create a visual representation of your goals and aspirations for this month.
            </p>

            {/* Vision Board Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {visionImages.map((image, index) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg bg-muted/30 overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Placeholder for images - in real app, render actual images */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Image Button */}
            <Button
              variant="outline"
              className="w-full rounded-full border-dashed"
              onClick={() => {
                // In a real app, this would open an image picker
                console.log('Add image to vision board');
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>

          {/* Optional: Monthly Intention */}
          <div className="border-t border-border/50 pt-4">
            <h4 className="text-sm font-semibold mb-2">Monthly Intention</h4>
            <div className="bg-card/50 rounded-lg p-3 border border-border/30">
              <p className="text-sm text-muted-foreground italic">
                "This month, I am focusing on growth, balance, and inner peace."
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
