"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface OnboardingQuizProps {
  onComplete: (data: HealthProfileData) => void;
  onSkip?: () => void;
}

export interface HealthProfileData {
  dietary_restrictions: string[];
  allergies: string[];
  diseases: string[];
  medications: string[];
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  diet_type: string;
  health_goals: string[];
  custom_dietary: string;
  custom_allergies: string;
  custom_diseases: string;
  custom_medications: string;
  custom_goals: string;
}

const COMMON_DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Low-Fat',
  'Halal',
  'Kosher'
];

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
  'Sulfites'
];

const COMMON_DISEASES = [
  'Celiac Disease',
  'Diabetes Type 1',
  'Diabetes Type 2',
  'Hypertension',
  'Heart Disease',
  'Thyroid Disorder',
  'PCOS',
  'IBS',
  'Crohn\'s Disease',
  'Food Intolerance'
];

const COMMON_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Improve Energy',
  'Better Sleep',
  'Reduce Stress',
  'Improve Digestion',
  'Build Strength',
  'Increase Flexibility',
  'Better Nutrition',
  'Overall Wellness'
];

export function OnboardingQuiz({ onComplete, onSkip }: OnboardingQuizProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<HealthProfileData>({
    dietary_restrictions: [],
    allergies: [],
    diseases: [],
    medications: [],
    fitness_level: 'beginner',
    diet_type: '',
    health_goals: [],
    custom_dietary: '',
    custom_allergies: '',
    custom_diseases: '',
    custom_medications: '',
    custom_goals: ''
  });

  const totalSteps = 6;

  const toggleArrayItem = (field: keyof Pick<HealthProfileData, 'dietary_restrictions' | 'allergies' | 'diseases' | 'health_goals'>, item: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Combine custom entries with selected options
      const finalData: HealthProfileData = {
        ...data,
        dietary_restrictions: [...data.dietary_restrictions, ...data.custom_dietary.split(',').map(s => s.trim()).filter(Boolean)],
        allergies: [...data.allergies, ...data.custom_allergies.split(',').map(s => s.trim()).filter(Boolean)],
        diseases: [...data.diseases, ...data.custom_diseases.split(',').map(s => s.trim()).filter(Boolean)],
        medications: data.custom_medications.split(',').map(s => s.trim()).filter(Boolean),
        health_goals: [...data.health_goals, ...data.custom_goals.split(',').map(s => s.trim()).filter(Boolean)]
      };
      onComplete(finalData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'hsl(var(--background))' }}>
      <Card className="bloom-card w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to rooted</h1>
          <p className="text-muted-foreground">Let's personalize your health journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6 min-h-[400px]">
          {/* Step 1: Dietary Restrictions */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Dietary Preferences</h2>
              <p className="text-muted-foreground">Select any dietary restrictions or preferences you follow</p>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_DIETARY_RESTRICTIONS.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`diet-${item}`}
                      checked={data.dietary_restrictions.includes(item)}
                      onCheckedChange={() => toggleArrayItem('dietary_restrictions', item)}
                    />
                    <Label htmlFor={`diet-${item}`} className="cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-diet">Other (comma-separated)</Label>
                <Input
                  id="custom-diet"
                  placeholder="e.g., Low-sodium, Mediterranean"
                  value={data.custom_dietary}
                  onChange={(e) => setData({ ...data, custom_dietary: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Allergies */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Food Allergies</h2>
              <p className="text-muted-foreground">Select any food allergies you have</p>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_ALLERGIES.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergy-${item}`}
                      checked={data.allergies.includes(item)}
                      onCheckedChange={() => toggleArrayItem('allergies', item)}
                    />
                    <Label htmlFor={`allergy-${item}`} className="cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-allergies">Other allergies (comma-separated)</Label>
                <Input
                  id="custom-allergies"
                  placeholder="e.g., Tomatoes, Avocado"
                  value={data.custom_allergies}
                  onChange={(e) => setData({ ...data, custom_allergies: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Health Conditions */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Health Conditions</h2>
              <p className="text-muted-foreground">Select any health conditions that may affect your nutrition</p>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_DISEASES.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`disease-${item}`}
                      checked={data.diseases.includes(item)}
                      onCheckedChange={() => toggleArrayItem('diseases', item)}
                    />
                    <Label htmlFor={`disease-${item}`} className="cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-diseases">Other conditions (comma-separated)</Label>
                <Input
                  id="custom-diseases"
                  placeholder="e.g., High cholesterol, Anemia"
                  value={data.custom_diseases}
                  onChange={(e) => setData({ ...data, custom_diseases: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Medications */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Current Medications</h2>
              <p className="text-muted-foreground">List any medications you're currently taking</p>
              <Textarea
                placeholder="Enter medications, one per line or comma-separated&#10;e.g., Metformin, Vitamin D, Thyroid medication"
                className="min-h-[200px]"
                value={data.custom_medications}
                onChange={(e) => setData({ ...data, custom_medications: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">This helps us provide safe dietary recommendations</p>
            </div>
          )}

          {/* Step 5: Fitness Level */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Fitness Level</h2>
              <p className="text-muted-foreground">How would you describe your current fitness level?</p>
              <RadioGroup
                value={data.fitness_level}
                onValueChange={(value) => setData({ ...data, fitness_level: value as typeof data.fitness_level })}
              >
                <Card className="p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="cursor-pointer flex-1">
                      <div className="font-semibold">Beginner</div>
                      <div className="text-sm text-muted-foreground">New to exercise or getting back into it</div>
                    </Label>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="cursor-pointer flex-1">
                      <div className="font-semibold">Intermediate</div>
                      <div className="text-sm text-muted-foreground">Exercise regularly, comfortable with basic movements</div>
                    </Label>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="cursor-pointer flex-1">
                      <div className="font-semibold">Advanced</div>
                      <div className="text-sm text-muted-foreground">Consistent training, experienced with various workouts</div>
                    </Label>
                  </div>
                </Card>
              </RadioGroup>
            </div>
          )}

          {/* Step 6: Health Goals */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Health Goals</h2>
              <p className="text-muted-foreground">What are you hoping to achieve? (Select all that apply)</p>
              <div className="grid grid-cols-2 gap-3">
                {COMMON_GOALS.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`goal-${item}`}
                      checked={data.health_goals.includes(item)}
                      onCheckedChange={() => toggleArrayItem('health_goals', item)}
                    />
                    <Label htmlFor={`goal-${item}`} className="cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-goals">Other goals (comma-separated)</Label>
                <Input
                  id="custom-goals"
                  placeholder="e.g., Run a 5K, Improve posture"
                  value={data.custom_goals}
                  onChange={(e) => setData({ ...data, custom_goals: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {onSkip && step === 1 && (
              <Button
                variant="ghost"
                onClick={onSkip}
              >
                Skip for now
              </Button>
            )}
          </div>
          <Button
            onClick={handleNext}
            className="min-w-[120px]"
          >
            {step === totalSteps ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
