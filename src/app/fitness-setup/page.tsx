'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeightInput } from '@/components/fitness/HeightInput';
import { HeightValue, convertToInches } from '@/lib/height-conversions';
import { UserProfile, FitnessGoal, GoalType, ActivityLevel, calculateDailyCalorieTarget, CalorieStorage } from '@/lib/ai-calorie-system';

export default function FitnessSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [height, setHeight] = useState<HeightValue | undefined>();
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  
  const [goalType, setGoalType] = useState<GoalType>('lose_weight');
  const [targetWeight, setTargetWeight] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState('');

  const handleSubmit = () => {
    if (!height || !age || !weight || !targetWeight || !weeklyGoal) {
      alert('Please fill in all fields');
      return;
    }

    const weightLbs = weightUnit === 'kg' ? parseFloat(weight) * 2.20462 : parseFloat(weight);
    const targetWeightLbs = weightUnit === 'kg' ? parseFloat(targetWeight) * 2.20462 : parseFloat(targetWeight);

    const profile: UserProfile = {
      userId: 'user_1',
      age: parseInt(age),
      sex,
      heightInches: convertToInches(height),
      heightUnit: height.unit,
      weightLbs,
      weightUnit,
      activityLevel
    };

    const goal: FitnessGoal = {
      goalType,
      targetWeightLbs,
      weeklyGoalLbs: parseFloat(weeklyGoal),
      startDate: new Date()
    };

    const calorieTarget = calculateDailyCalorieTarget(profile, goal);

    CalorieStorage.saveProfile(profile);
    CalorieStorage.saveGoal(goal);

    alert(`Your daily calorie target: ${calorieTarget.dailyTarget} calories`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Fitness Profile Setup</h1>
          <p className="text-muted-foreground">AI-powered calorie tracking</p>
        </div>

        {step === 1 && (
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className="mt-1" />
                </div>
                <div>
                  <Label>Sex</Label>
                  <Select value={sex} onValueChange={(v: 'male' | 'female') => setSex(v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <HeightInput value={height} onChange={setHeight} label="Height" />

              <div>
                <Label>Current Weight</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="150" className="flex-1" />
                  <Select value={weightUnit} onValueChange={(v: 'lbs' | 'kg') => setWeightUnit(v)}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Activity Level</Label>
                <Select value={activityLevel} onValueChange={(v: ActivityLevel) => setActivityLevel(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="very_active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setStep(2)} className="w-full" size="lg">Next</Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Fitness Goal</h2>
            
            <div className="space-y-6">
              <div>
                <Label>Goal</Label>
                <Select value={goalType} onValueChange={(v: GoalType) => setGoalType(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                    <SelectItem value="gain_weight">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Target Weight ({weightUnit})</Label>
                <Input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="140" className="mt-1" />
              </div>

              <div>
                <Label>Weekly Goal (lbs/week)</Label>
                <Input type="number" step="0.5" value={weeklyGoal} onChange={(e) => setWeeklyGoal(e.target.value)} placeholder="1.0" className="mt-1" />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">Back</Button>
                <Button onClick={handleSubmit} className="flex-1" size="lg">Complete Setup</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
