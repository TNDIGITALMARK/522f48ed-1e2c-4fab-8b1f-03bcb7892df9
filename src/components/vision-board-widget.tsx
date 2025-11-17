"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisionBoardWidgetProps {
  className?: string;
}

export function VisionBoardWidget({ className }: VisionBoardWidgetProps) {
  const [isNovemberExpanded, setIsNovemberExpanded] = useState(false);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Monthly vision statement
  const visionStatement = "Embrace growth, nourish your body, and cultivate inner strength through consistent self-care and mindful living.";

  // Important tasks for November with descriptions
  const novemberTasks = [
    {
      title: "Complete Cycle Tracking Setup",
      description: "Set up your menstrual cycle tracking to understand your body's natural rhythms and optimize wellness routines accordingly.",
      completed: false,
    },
    {
      title: "Establish Morning Ritual Consistency",
      description: "Practice your morning ritual 20 out of 30 days to build a sustainable foundation for daily wellness and mental clarity.",
      completed: false,
    },
    {
      title: "Nutrition Planning Framework",
      description: "Create a personalized meal planning system aligned with your cycle phases to support energy levels and hormonal balance.",
      completed: false,
    },
    {
      title: "Movement Practice 4x/Week",
      description: "Engage in intentional movement four times weekly, adapting intensity to your cycle phase for optimal results and recovery.",
      completed: true,
    },
    {
      title: "Community Connection Goals",
      description: "Join three community discussions and share one personal wellness insight to build supportive connections.",
      completed: false,
    },
  ];

  return (
    <Card className={cn("p-8 bg-gradient-to-br from-secondary/10 to-accent/5 border-secondary/30 shadow-bloom", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold font-['Cormorant_Garamond'] text-foreground">
          {currentMonth} Vision Board
        </h2>
      </div>

      {/* Vision Statement */}
      <div className="mb-8 p-6 bg-background/60 rounded-2xl border border-border/40">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-['DM_Sans']">
          Monthly Vision
        </h3>
        <p className="text-foreground text-base leading-relaxed italic font-['Inter']">
          "{visionStatement}"
        </p>
      </div>

      {/* Important Tasks Section */}
      <div className="space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsNovemberExpanded(!isNovemberExpanded)}
        >
          <h3 className="text-lg font-semibold text-foreground font-['Cormorant_Garamond'] group-hover:text-primary transition-colors">
            Important Tasks for {currentMonth}
          </h3>
          <button
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            aria-label={isNovemberExpanded ? "Collapse tasks" : "Expand tasks"}
          >
            {isNovemberExpanded ? (
              <ChevronUp className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>

        {/* Expandable Tasks List */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            isNovemberExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-3 pt-2">
            {novemberTasks.map((task, index) => (
              <div
                key={index}
                className={cn(
                  "p-5 rounded-xl border transition-all duration-300",
                  task.completed
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background/50 border-border/40 hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      task.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40 hover:border-primary/50"
                    )}
                  >
                    {task.completed && (
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 space-y-1.5">
                    <h4
                      className={cn(
                        "font-semibold text-sm font-['DM_Sans']",
                        task.completed ? "text-muted-foreground line-through" : "text-foreground"
                      )}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-['Inter']">
                      {task.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary when collapsed */}
        {!isNovemberExpanded && (
          <div className="text-sm text-muted-foreground font-['Inter'] pt-1">
            {novemberTasks.filter((t) => t.completed).length} of {novemberTasks.length} tasks completed
          </div>
        )}
      </div>
    </Card>
  );
}
