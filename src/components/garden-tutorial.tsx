"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Leaf, Droplets, Sun, Zap, Hand, Move, Coins, Trophy,
  CheckCircle2, ArrowRight, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Garden!',
    description: 'Build and customize your garden just like in Hay Day! Place plants, buildings, and decorations anywhere you want.',
    icon: Leaf,
    color: 'text-green-500',
  },
  {
    id: 'placement',
    title: 'Place Items Freely',
    description: 'Click "Add Item" to browse available plants and buildings. Click any empty cell to place your selection. Drag items to move them around!',
    icon: Hand,
    color: 'text-blue-500',
  },
  {
    id: 'care',
    title: 'Care for Your Plants',
    description: 'Plants need water, sunlight, and fertilizer to grow! Click on any plant to see its care needs and help it grow through 4 stages.',
    icon: Droplets,
    color: 'text-cyan-500',
  },
  {
    id: 'growth',
    title: 'Watch Them Grow',
    description: 'Plants automatically grow when their care stats are above 60%. Keep them healthy to reach stage 4 and harvest for coins!',
    icon: Sun,
    color: 'text-yellow-500',
  },
  {
    id: 'buildings',
    title: 'Build Structures',
    description: 'Greenhouses, workshops, and storage sheds boost your garden! Buildings take up more space but provide valuable benefits.',
    icon: Move,
    color: 'text-purple-500',
  },
  {
    id: 'activities',
    title: 'Join Activities',
    description: 'Complete multiplayer activities like HYROX workouts, hikes, and runs to earn coins and XP! Compete with friends on the leaderboard.',
    icon: Trophy,
    color: 'text-orange-500',
  },
  {
    id: 'harvest',
    title: 'Harvest & Expand',
    description: 'Harvest fully grown plants for coins! Use coins to buy more plants, buildings, and unlock new garden themes. Build your dream garden!',
    icon: Coins,
    color: 'text-yellow-600',
  },
];

interface GardenTutorialProps {
  onComplete?: () => void;
}

export function GardenTutorial({ onComplete }: GardenTutorialProps) {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    setOpen(false);
    onComplete?.();
  };

  const currentTutorialStep = TUTORIAL_STEPS[currentStep];
  const StepIcon = currentTutorialStep.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Garden Tutorial</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Learn how to build and grow your garden like a pro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {TUTORIAL_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'h-2 flex-1 rounded-full transition-all',
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>

          {/* Current Step Content */}
          <div className="flex flex-col items-center text-center space-y-4 py-8">
            <div className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-primary/20 to-secondary/20'
            )}>
              <StepIcon className={cn('w-12 h-12', currentTutorialStep.color)} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">{currentTutorialStep.title}</h3>
              <p className="text-muted-foreground text-lg max-w-md">
                {currentTutorialStep.description}
              </p>
            </div>

            <Badge variant="secondary" className="text-sm px-4 py-2">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </Badge>
          </div>

          {/* Quick Tips */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Quick Tip</h4>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 0 && "Your garden is a reflection of your wellness journey!"}
                  {currentStep === 1 && "Drag items around to reorganize your garden anytime."}
                  {currentStep === 2 && "Water is free, but fertilizer costs 5 coins per use."}
                  {currentStep === 3 && "Sunlight recharges naturally over time!"}
                  {currentStep === 4 && "Larger buildings require more space but offer better benefits."}
                  {currentStep === 5 && "Join activities with friends to earn bonus rewards!"}
                  {currentStep === 6 && "Higher level gardens unlock exclusive plants and themes."}
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 min-w-32"
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* All Steps Preview */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Tutorial Overview
          </p>
          <div className="grid grid-cols-7 gap-2">
            {TUTORIAL_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:bg-muted',
                    index === currentStep && 'bg-primary/10 ring-2 ring-primary'
                  )}
                >
                  <Icon className={cn('w-4 h-4', index <= currentStep ? step.color : 'text-muted-foreground')} />
                  {index <= currentStep && (
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
