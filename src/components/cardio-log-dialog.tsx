"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, Clock, Plus, CheckCircle2, Bike, TrendingUp, Waves, Activity, Zap } from 'lucide-react';
import { CARDIO_MACHINES, calculateCalories, getMachinesByCategory, type CardioLog } from '@/lib/cardio-machines';
import { toast } from 'sonner';

interface CardioLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogCardio: (log: Omit<CardioLog, 'id' | 'createdAt'>) => void;
}

const categoryIcons = {
  Treadmill: Activity,
  Bike: Bike,
  Elliptical: Activity,
  Rowing: Waves,
  Stair: TrendingUp,
  Other: Zap
};

export function CardioLogDialog({ open, onOpenChange, onLogCardio }: CardioLogDialogProps) {
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [calculatedCalories, setCalculatedCalories] = useState<number>(0);
  const [manualCalories, setManualCalories] = useState<string>('');
  const [useManualCalories, setUseManualCalories] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>('');
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km' | 'meters'>('miles');
  const [heartRate, setHeartRate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const machinesByCategory = getMachinesByCategory();

  // Calculate calories whenever duration or machine changes
  const handleDurationChange = (value: string) => {
    setDurationMinutes(value);
    const duration = parseInt(value);
    if (selectedMachineId && !isNaN(duration) && duration > 0) {
      const calculated = calculateCalories(selectedMachineId, duration);
      setCalculatedCalories(calculated);
    } else {
      setCalculatedCalories(0);
    }
  };

  const handleMachineSelect = (machineId: string) => {
    setSelectedMachineId(machineId);
    const duration = parseInt(durationMinutes);
    if (!isNaN(duration) && duration > 0) {
      const calculated = calculateCalories(machineId, duration);
      setCalculatedCalories(calculated);
    }
  };

  const handleSubmit = () => {
    if (!selectedMachineId || !durationMinutes) {
      toast.error('Please select a machine and enter duration');
      return;
    }

    const machine = CARDIO_MACHINES.find(m => m.id === selectedMachineId);
    if (!machine) return;

    const duration = parseInt(durationMinutes);
    if (isNaN(duration) || duration <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    const finalCalories = useManualCalories && manualCalories
      ? parseFloat(manualCalories)
      : calculatedCalories;

    const log: Omit<CardioLog, 'id' | 'createdAt'> = {
      machineId: selectedMachineId,
      machineName: machine.name,
      durationMinutes: duration,
      caloriesBurned: finalCalories,
      caloriesManualOverride: useManualCalories,
      distance: distance ? parseFloat(distance) : undefined,
      distanceUnit: distance ? distanceUnit : undefined,
      averageHeartRate: heartRate ? parseInt(heartRate) : undefined,
      notes: notes || undefined,
      workoutDate: new Date().toISOString().split('T')[0]
    };

    onLogCardio(log);

    // Reset form
    setSelectedMachineId('');
    setDurationMinutes('');
    setCalculatedCalories(0);
    setManualCalories('');
    setUseManualCalories(false);
    setDistance('');
    setHeartRate('');
    setNotes('');
    onOpenChange(false);

    toast.success('Cardio workout logged!', {
      description: `${machine.name} - ${duration} min, ${Math.round(finalCalories)} calories burned`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Flame className="w-6 h-6 text-secondary" />
            Log Cardio Workout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Machine Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Cardio Machine</Label>
            <Tabs defaultValue="Treadmill" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-4">
                {Object.keys(machinesByCategory).map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      <Icon className="w-4 h-4 mr-1" />
                      {category}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(machinesByCategory).map(([category, machines]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="grid grid-cols-2 gap-2">
                      {machines.map((machine) => (
                        <Card
                          key={machine.id}
                          className={`p-3 cursor-pointer transition-all hover:shadow-sm ${
                            selectedMachineId === machine.id
                              ? 'border-primary border-2 bg-primary/5'
                              : 'border-border'
                          }`}
                          onClick={() => handleMachineSelect(machine.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              selectedMachineId === machine.id
                                ? 'bg-primary/20'
                                : 'bg-muted/50'
                            }`}>
                              {selectedMachineId === machine.id ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : (
                                <Flame className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight mb-1">{machine.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {machine.baseCaloriesPerMinute} cal/min
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Duration Input */}
          <div>
            <Label htmlFor="duration" className="text-base font-semibold mb-2 block">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 30"
              value={durationMinutes}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="text-lg"
              min="1"
            />
          </div>

          {/* Calories Display/Override */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Calories Burned</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUseManualCalories(!useManualCalories)}
                className="text-xs"
              >
                {useManualCalories ? 'Use Auto-Calculate' : 'Enter Manually'}
              </Button>
            </div>

            {!useManualCalories ? (
              <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="flex items-center justify-center gap-3">
                  <Flame className="w-8 h-8 text-secondary" />
                  <div>
                    <div className="text-3xl font-bold text-secondary">
                      {calculatedCalories}
                    </div>
                    <p className="text-sm text-muted-foreground">Estimated calories</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Input
                type="number"
                placeholder="Enter calories burned"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                className="text-lg"
                min="0"
              />
            )}
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="distance" className="text-sm font-medium mb-2 block">
                  Distance (optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="distance"
                    type="number"
                    placeholder="0.0"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    step="0.1"
                    min="0"
                  />
                  <select
                    value={distanceUnit}
                    onChange={(e) => setDistanceUnit(e.target.value as any)}
                    className="px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="miles">mi</option>
                    <option value="km">km</option>
                    <option value="meters">m</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="heartRate" className="text-sm font-medium mb-2 block">
                  Avg Heart Rate (optional)
                </Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="e.g., 145"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  min="40"
                  max="220"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Notes (optional)
              </Label>
              <textarea
                id="notes"
                placeholder="How did it feel? Any observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedMachineId || !durationMinutes}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Log Cardio Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
