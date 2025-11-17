"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Plus, Check, Clock, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import {
  getDailyGoals,
  getWeeklyGoals,
  getMonthlyGoals,
  createDailyGoal,
  createWeeklyGoal,
  createMonthlyGoal,
  toggleDailyGoal,
  updateWeeklyGoal,
  updateMonthlyGoal,
  type DailyGoal,
  type WeeklyGoal,
  type MonthlyGoal
} from '@/lib/supabase/goals';

interface GoalsPanelProps {
  className?: string;
}

export function GoalsPanel({ className }: GoalsPanelProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const startOfWeek = getStartOfWeek(new Date()).toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  useEffect(() => {
    loadGoals();
  }, [activeTab]);

  async function loadGoals() {
    setIsLoading(true);
    try {
      if (activeTab === 'daily') {
        const goals = await getDailyGoals(today);
        setDailyGoals(goals);
      } else if (activeTab === 'weekly') {
        const goals = await getWeeklyGoals(startOfWeek);
        setWeeklyGoals(goals);
      } else {
        const goals = await getMonthlyGoals(startOfMonth);
        setMonthlyGoals(goals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddGoal() {
    if (!newGoalTitle.trim()) return;

    try {
      if (activeTab === 'daily') {
        await createDailyGoal({
          goal_date: today,
          title: newGoalTitle,
          category: 'personal',
          priority: 3,
          auto_generated: false,
          completed: false
        });
      } else if (activeTab === 'weekly') {
        const endOfWeek = getEndOfWeek(new Date()).toISOString().split('T')[0];
        await createWeeklyGoal({
          week_start: startOfWeek,
          week_end: endOfWeek,
          title: newGoalTitle,
          category: 'personal',
          priority: 3,
          auto_generated: false,
          completed: false
        });
      } else {
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
        await createMonthlyGoal({
          month_start: startOfMonth,
          month_end: endOfMonth,
          title: newGoalTitle,
          category: 'personal',
          priority: 3,
          auto_generated: false,
          completed: false
        });
      }

      setNewGoalTitle('');
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  }

  async function handleToggleGoal(goalId: string, completed: boolean) {
    try {
      if (activeTab === 'daily') {
        await toggleDailyGoal(goalId, !completed);
      } else if (activeTab === 'weekly') {
        await updateWeeklyGoal(goalId, { completed: !completed, completed_at: !completed ? new Date().toISOString() : undefined });
      } else {
        await updateMonthlyGoal(goalId, { completed: !completed, completed_at: !completed ? new Date().toISOString() : undefined });
      }
      loadGoals();
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  }

  const activeGoals = activeTab === 'daily' ? dailyGoals : activeTab === 'weekly' ? weeklyGoals : monthlyGoals;
  const completedCount = activeGoals.filter(g => g.completed).length;
  const totalCount = activeGoals.length;

  return (
    <Card className={`p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold font-['Cormorant_Garamond']">Goals & Plans</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-secondary" />
          <span className="font-medium">{completedCount}/{totalCount}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="daily" className="gap-2">
            <Clock className="w-4 h-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Monthly
          </TabsTrigger>
        </TabsList>

        {/* Daily Goals */}
        <TabsContent value="daily" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a daily goal..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              className="flex-1"
            />
            <Button onClick={handleAddGoal} size="icon" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Loading goals...</p>
            </div>
          ) : activeGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No daily goals yet</p>
              <p className="text-xs mt-1">Add events to automatically generate goals!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-lg border transition-all ${
                    goal.completed
                      ? 'bg-secondary/10 border-secondary/30 opacity-60'
                      : 'bg-background/50 border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleGoal(goal.id, goal.completed)}
                      className="mt-0.5 shrink-0"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {goal.auto_generated && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Auto</span>
                        )}
                        {goal.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary capitalize">
                            {goal.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Weekly Goals */}
        <TabsContent value="weekly" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a weekly goal..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              className="flex-1"
            />
            <Button onClick={handleAddGoal} size="icon" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Loading goals...</p>
            </div>
          ) : weeklyGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No weekly goals yet</p>
              <p className="text-xs mt-1">Your weekly goals will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {weeklyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-lg border transition-all ${
                    goal.completed
                      ? 'bg-secondary/10 border-secondary/30 opacity-60'
                      : 'bg-background/50 border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleGoal(goal.id, goal.completed)}
                      className="mt-0.5 shrink-0"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {goal.auto_generated && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Auto</span>
                        )}
                        {goal.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary capitalize">
                            {goal.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Monthly Goals */}
        <TabsContent value="monthly" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a monthly goal..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              className="flex-1"
            />
            <Button onClick={handleAddGoal} size="icon" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Loading goals...</p>
            </div>
          ) : monthlyGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No monthly goals yet</p>
              <p className="text-xs mt-1">Your monthly goals will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {monthlyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-lg border transition-all ${
                    goal.completed
                      ? 'bg-secondary/10 border-secondary/30 opacity-60'
                      : 'bg-background/50 border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleGoal(goal.id, goal.completed)}
                      className="mt-0.5 shrink-0"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {goal.auto_generated && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Auto</span>
                        )}
                        {goal.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary capitalize">
                            {goal.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  return new Date(start.setDate(start.getDate() + 6));
}
