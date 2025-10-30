"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeightInput } from '@/components/height-input';
import { FitnessGoals } from '@/components/fitness-goals';
import { User, Save, Scale, Ruler, Calendar, Activity } from 'lucide-react';
import { type HeightValue } from '@/lib/height-conversions';
import { type WeightUnit, type ActivityLevel } from '@/lib/weight-tracking';
import { useUserProfile } from '@/hooks/use-user-profile';

const MOCK_USER_ID = 'demo-user-001';

export default function ProfilePage() {
  // Use centralized profile hook - auto-syncs with dashboard and nutrition!
  const { profile, updatePhysical, updateProfile, isLoading } = useUserProfile(MOCK_USER_ID);

  // Local state for form
  const [height, setHeight] = useState<HeightValue>({
    value: 67,
    unit: 'in'
  });
  const [weight, setWeight] = useState<number>(152.4);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [age, setAge] = useState<number>(30);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setHeight(profile.height);
      setWeight(profile.weight);
      setWeightUnit(profile.weightUnit);
      setAge(profile.age);
      setActivityLevel(profile.activityLevel);
    }
  }, [profile]);

  const handleSaveProfile = () => {
    // Update physical attributes - automatically syncs everywhere!
    updatePhysical({
      height,
      weight,
      weightUnit,
      age
    });

    // Update activity level
    updateProfile({
      activityLevel
    });

    alert('Profile saved and synced across all pages!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl mb-2 flex items-center gap-3">
            <User className="w-10 h-10 text-primary" />
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Form */}
        <Card className="bloom-card max-w-2xl">
          <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

          <div className="space-y-6">
            {/* Height Input */}
            <HeightInput
              value={height}
              onChange={setHeight}
              label="Height"
            />

            {/* Weight Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  Weight
                </Label>
                <Select
                  value={weightUnit}
                  onValueChange={(v) => setWeightUnit(v as WeightUnit)}
                >
                  <SelectTrigger className="w-28 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">Pounds</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                placeholder="152.4"
                className="text-lg"
              />
            </div>

            {/* Age Input */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Age
              </Label>
              <Input
                type="number"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                placeholder="30"
                className="text-lg"
              />
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Activity Level
              </Label>
              <Select
                value={activityLevel}
                onValueChange={(v) => setActivityLevel(v as ActivityLevel)}
              >
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">
                    <div>
                      <p className="font-medium">Sedentary</p>
                      <p className="text-xs text-muted-foreground">Little to no exercise</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div>
                      <p className="font-medium">Light</p>
                      <p className="text-xs text-muted-foreground">Light exercise 1-3 days/week</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div>
                      <p className="font-medium">Moderate</p>
                      <p className="text-xs text-muted-foreground">Moderate exercise 3-5 days/week</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="active">
                    <div>
                      <p className="font-medium">Active</p>
                      <p className="text-xs text-muted-foreground">Heavy exercise 6-7 days/week</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="very_active">
                    <div>
                      <p className="font-medium">Very Active</p>
                      <p className="text-xs text-muted-foreground">Very heavy exercise or physical job</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Profile
            </Button>
          </div>
        </Card>

        {/* Profile Summary */}
        <Card className="bloom-card max-w-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Height</p>
              <p className="text-xl font-bold text-primary">
                {height.unit === 'ft' && height.feet !== undefined
                  ? `${height.feet}' ${(height.inches || 0).toFixed(1)}"`
                  : `${height.value.toFixed(1)} ${height.unit}`}
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Weight</p>
              <p className="text-xl font-bold text-secondary">
                {weight.toFixed(1)} {weightUnit}
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Age</p>
              <p className="text-xl font-bold text-accent-foreground">{age} years</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Activity</p>
              <p className="text-base font-bold capitalize text-primary">
                {activityLevel.replace('_', ' ')}
              </p>
            </div>
          </div>
        </Card>

        {/* Fitness Goals Section */}
        <div className="max-w-2xl">
          <FitnessGoals
            userId={MOCK_USER_ID}
            currentHeight={height}
            currentWeight={weight}
            currentWeightUnit={weightUnit}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
