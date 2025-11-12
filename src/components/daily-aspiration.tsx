"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Check, Edit3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BloomingFlower } from '@/components/blooming-flower';

interface DailyAspirationProps {
  userId?: string;
}

// Inspirational aspirations for wellness journey
const ASPIRATIONS = [
  "I am becoming stronger every day, inside and out.",
  "I listen to my body and honor what it needs.",
  "I choose nourishment that serves my highest good.",
  "I embrace this moment with grace and gratitude.",
  "I trust my journey and celebrate my progress.",
  "I am worthy of rest, care, and compassion.",
  "I move my body with joy and intention.",
  "I honor my cycle and the wisdom it brings.",
  "I create space for peace in my daily life.",
  "I am connected to my body's natural rhythms.",
  "I choose thoughts that uplift and empower me.",
  "I celebrate my body for all it does for me.",
  "I nurture myself with love and patience.",
  "I am present in this moment of my journey.",
  "I trust the process of becoming.",
];

export function DailyAspiration({ userId }: DailyAspirationProps) {
  const [aspiration, setAspiration] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load aspiration from localStorage or generate new one
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('aspiration-date');
    const storedAspiration = localStorage.getItem('daily-aspiration');
    const storedIsCustom = localStorage.getItem('aspiration-is-custom') === 'true';
    const storedCompleted = localStorage.getItem('aspiration-completed') === 'true';

    if (storedDate === today && storedAspiration) {
      // Use stored aspiration for today
      setAspiration(storedAspiration);
      setIsCustom(storedIsCustom);
      setIsCompleted(storedCompleted);
      if (storedIsCustom) {
        setCustomText(storedAspiration);
      }
    } else {
      // Generate new aspiration for today
      const randomAspiration = ASPIRATIONS[Math.floor(Math.random() * ASPIRATIONS.length)];
      setAspiration(randomAspiration);
      setIsCustom(false);
      setIsCompleted(false);
      localStorage.setItem('aspiration-date', today);
      localStorage.setItem('daily-aspiration', randomAspiration);
      localStorage.setItem('aspiration-is-custom', 'false');
      localStorage.setItem('aspiration-completed', 'false');
    }
  }, []);

  // Generate new random aspiration
  const handleRefresh = () => {
    const randomAspiration = ASPIRATIONS[Math.floor(Math.random() * ASPIRATIONS.length)];
    setAspiration(randomAspiration);
    setIsCustom(false);
    setIsCompleted(false);
    localStorage.setItem('daily-aspiration', randomAspiration);
    localStorage.setItem('aspiration-is-custom', 'false');
    localStorage.setItem('aspiration-completed', 'false');
  };

  // Toggle completed state
  const handleToggleComplete = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    localStorage.setItem('aspiration-completed', String(newCompleted));
  };

  // Start editing custom aspiration
  const handleStartEdit = () => {
    setIsEditing(true);
    setCustomText(isCustom ? aspiration : '');
  };

  // Save custom aspiration
  const handleSaveCustom = () => {
    if (customText.trim()) {
      setAspiration(customText.trim());
      setIsCustom(true);
      setIsEditing(false);
      setIsCompleted(false);
      localStorage.setItem('daily-aspiration', customText.trim());
      localStorage.setItem('aspiration-is-custom', 'true');
      localStorage.setItem('aspiration-completed', 'false');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCustomText('');
  };

  return (
    <div className="py-4">
      {/* Aspiration Content - No Card Wrapper */}
      {isEditing ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Daily Aspiration:</h3>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Write your personal aspiration for today..."
            className="w-full min-h-[100px] p-4 rounded-xl border border-border bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-serif text-lg"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSaveCustom}
              disabled={!customText.trim()}
              className="rounded-full"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Aspiration
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancelEdit}
              className="rounded-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Daily Aspiration Display - Just the text */}
          <blockquote className="text-xl md:text-2xl font-serif italic leading-relaxed text-foreground/90 text-center">
            "{aspiration}"
          </blockquote>
        </>
      )}
    </div>
  );
}
