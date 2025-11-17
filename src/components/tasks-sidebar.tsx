"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TasksSidebarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TasksSidebar({ isOpen, onOpenChange }: TasksSidebarProps = {}) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isExpanded = isOpen !== undefined ? isOpen : internalIsExpanded;
  const setIsExpanded = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsExpanded(value);
    }
  };

  const [dailyExpanded, setDailyExpanded] = useState(true);
  const [weeklyExpanded, setWeeklyExpanded] = useState(true);

  // Task state management
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    { id: '1', title: 'Morning meditation', completed: false, createdAt: new Date() },
    { id: '2', title: 'Review vision board', completed: true, createdAt: new Date() },
    { id: '3', title: 'Plan healthy meals', completed: false, createdAt: new Date() },
  ]);

  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([
    { id: '4', title: 'Complete 3 workouts', completed: false, createdAt: new Date() },
    { id: '5', title: 'Meal prep for the week', completed: true, createdAt: new Date() },
    { id: '6', title: 'Track cycle insights', completed: false, createdAt: new Date() },
  ]);

  const [newDailyTask, setNewDailyTask] = useState('');
  const [newWeeklyTask, setNewWeeklyTask] = useState('');

  // Task actions
  const toggleTask = (taskId: string, isDaily: boolean) => {
    if (isDaily) {
      setDailyTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } else {
      setWeeklyTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const addTask = (isDaily: boolean) => {
    const taskText = isDaily ? newDailyTask : newWeeklyTask;
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskText.trim(),
      completed: false,
      createdAt: new Date(),
    };

    if (isDaily) {
      setDailyTasks(prev => [...prev, newTask]);
      setNewDailyTask('');
    } else {
      setWeeklyTasks(prev => [...prev, newTask]);
      setNewWeeklyTask('');
    }
  };

  const deleteTask = (taskId: string, isDaily: boolean) => {
    if (isDaily) {
      setDailyTasks(prev => prev.filter(task => task.id !== taskId));
    } else {
      setWeeklyTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, isDaily: boolean) => {
    if (e.key === 'Enter') {
      addTask(isDaily);
    }
  };

  // Calculate completion stats
  const dailyCompleted = dailyTasks.filter(t => t.completed).length;
  const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;

  return (
    <>
      {/* Sidebar Toggle Button - Hidden when expanded */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-full rounded-r-none bg-white hover:bg-gray-50 border border-gray-200 shadow-bloom z-50 px-2 py-6"
          size="sm"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </Button>
      )}

      {/* Expandable Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-sm transition-all duration-300 z-40 overflow-y-auto",
          isExpanded ? "w-96" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="p-5 space-y-3">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 font-['Cormorant_Garamond']">Daily & Weekly Tasks</h2>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 text-black" />
              </Button>
            </div>

            {/* Daily Tasks Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setDailyExpanded(!dailyExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-gray-800 font-['Cormorant_Garamond']">Daily Tasks</h3>
                  <span className="text-xs text-gray-500">
                    ({dailyCompleted}/{dailyTasks.length})
                  </span>
                </div>
                {dailyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {dailyExpanded && (
                <div className="space-y-2 mt-2">
                  {/* Task List */}
                  {dailyTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No daily tasks yet
                    </p>
                  ) : (
                    dailyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 p-2 rounded-md border border-border/40 hover:bg-gray-50 group transition-colors"
                      >
                        <button
                          onClick={() => toggleTask(task.id, true)}
                          className="flex-shrink-0"
                          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <span
                          className={cn(
                            "flex-1 text-sm",
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          )}
                        >
                          {task.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteTask(task.id, true)}
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}

                  {/* Add New Task Input */}
                  <div className="flex gap-2 mt-3">
                    <Input
                      type="text"
                      placeholder="Add a daily task..."
                      value={newDailyTask}
                      onChange={(e) => setNewDailyTask(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, true)}
                      className="flex-1 text-sm h-9"
                    />
                    <Button
                      onClick={() => addTask(true)}
                      size="sm"
                      className="h-9 px-3"
                      disabled={!newDailyTask.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Weekly Tasks Section */}
            <Card className="p-3 bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => setWeeklyExpanded(!weeklyExpanded)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-medium text-gray-800 font-['Cormorant_Garamond']">Weekly Tasks</h3>
                  <span className="text-xs text-gray-500">
                    ({weeklyCompleted}/{weeklyTasks.length})
                  </span>
                </div>
                {weeklyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-black/70" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/70" />
                )}
              </button>

              {weeklyExpanded && (
                <div className="space-y-2 mt-2">
                  {/* Task List */}
                  {weeklyTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No weekly tasks yet
                    </p>
                  ) : (
                    weeklyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 p-2 rounded-md border border-border/40 hover:bg-gray-50 group transition-colors"
                      >
                        <button
                          onClick={() => toggleTask(task.id, false)}
                          className="flex-shrink-0"
                          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <span
                          className={cn(
                            "flex-1 text-sm",
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          )}
                        >
                          {task.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteTask(task.id, false)}
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}

                  {/* Add New Task Input */}
                  <div className="flex gap-2 mt-3">
                    <Input
                      type="text"
                      placeholder="Add a weekly task..."
                      value={newWeeklyTask}
                      onChange={(e) => setNewWeeklyTask(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, false)}
                      className="flex-1 text-sm h-9"
                    />
                    <Button
                      onClick={() => addTask(false)}
                      size="sm"
                      className="h-9 px-3"
                      disabled={!newWeeklyTask.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Progress Summary */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="text-sm font-semibold mb-3 font-['Cormorant_Garamond']">
                Weekly Progress
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">Daily Tasks</span>
                    <span className="text-gray-600">
                      {dailyTasks.length > 0
                        ? `${Math.round((dailyCompleted / dailyTasks.length) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: dailyTasks.length > 0
                          ? `${(dailyCompleted / dailyTasks.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">Weekly Goals</span>
                    <span className="text-gray-600">
                      {weeklyTasks.length > 0
                        ? `${Math.round((weeklyCompleted / weeklyTasks.length) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-300"
                      style={{
                        width: weeklyTasks.length > 0
                          ? `${(weeklyCompleted / weeklyTasks.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Backdrop when sidebar is expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
        />
      )}
    </>
  );
}
