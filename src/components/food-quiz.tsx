"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

// Comprehensive food groups quiz data
const foodGroups = [
  {
    id: 'proteins',
    name: 'Proteins',
    emoji: '🥩',
    description: 'Essential for muscle growth and repair',
    items: [
      { name: 'Chicken', icon: '🍗' },
      { name: 'Fish', icon: '🐟' },
      { name: 'Eggs', icon: '🥚' },
      { name: 'Tofu', icon: '🧀' },
      { name: 'Legumes', icon: '🫘' },
      { name: 'Greek Yogurt', icon: '🥛' },
      { name: 'Nuts', icon: '🥜' },
      { name: 'Seeds', icon: '🌰' },
    ]
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    emoji: '🥬',
    description: 'Packed with vitamins, minerals, and fiber',
    items: [
      { name: 'Leafy Greens', icon: '🥬' },
      { name: 'Broccoli', icon: '🥦' },
      { name: 'Carrots', icon: '🥕' },
      { name: 'Bell Peppers', icon: '🫑' },
      { name: 'Tomatoes', icon: '🍅' },
      { name: 'Cauliflower', icon: '🥦' },
      { name: 'Zucchini', icon: '🥒' },
      { name: 'Sweet Potato', icon: '🍠' },
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎',
    description: 'Natural sugars and antioxidants',
    items: [
      { name: 'Berries', icon: '🫐' },
      { name: 'Apples', icon: '🍎' },
      { name: 'Bananas', icon: '🍌' },
      { name: 'Citrus', icon: '🍊' },
      { name: 'Grapes', icon: '🍇' },
      { name: 'Melon', icon: '🍉' },
      { name: 'Stone Fruits', icon: '🍑' },
      { name: 'Tropical', icon: '🍍' },
    ]
  },
  {
    id: 'grains',
    name: 'Whole Grains',
    emoji: '🌾',
    description: 'Complex carbs for sustained energy',
    items: [
      { name: 'Oats', icon: '🥣' },
      { name: 'Brown Rice', icon: '🍚' },
      { name: 'Quinoa', icon: '🌾' },
      { name: 'Whole Wheat', icon: '🍞' },
      { name: 'Barley', icon: '🌾' },
      { name: 'Pasta', icon: '🍝' },
      { name: 'Buckwheat', icon: '🌾' },
      { name: 'Millet', icon: '🌾' },
    ]
  },
  {
    id: 'dairy',
    name: 'Dairy & Alternatives',
    emoji: '🥛',
    description: 'Calcium and protein sources',
    items: [
      { name: 'Milk', icon: '🥛' },
      { name: 'Yogurt', icon: '🥛' },
      { name: 'Cheese', icon: '🧀' },
      { name: 'Almond Milk', icon: '🥛' },
      { name: 'Oat Milk', icon: '🥛' },
      { name: 'Coconut Milk', icon: '🥥' },
      { name: 'Soy Milk', icon: '🥛' },
      { name: 'Kefir', icon: '🥛' },
    ]
  },
  {
    id: 'fats',
    name: 'Healthy Fats',
    emoji: '🥑',
    description: 'Essential fatty acids and hormones',
    items: [
      { name: 'Avocado', icon: '🥑' },
      { name: 'Olive Oil', icon: '🫒' },
      { name: 'Nuts', icon: '🥜' },
      { name: 'Seeds', icon: '🌰' },
      { name: 'Fatty Fish', icon: '🐟' },
      { name: 'Coconut Oil', icon: '🥥' },
      { name: 'Nut Butters', icon: '🥜' },
      { name: 'Dark Chocolate', icon: '🍫' },
    ]
  }
];

interface FoodQuizProps {
  onComplete: (preferences: any) => void;
  onSkip?: () => void;
}

export function FoodQuiz({ onComplete, onSkip }: FoodQuizProps) {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [preferences, setPreferences] = useState<Record<string, string[]>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const progress = ((currentGroup + 1) / foodGroups.length) * 100;
  const group = foodGroups[currentGroup];

  const toggleItem = (itemName: string) => {
    setSelectedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleNext = () => {
    // Save current selections
    setPreferences(prev => ({
      ...prev,
      [group.id]: selectedItems
    }));

    if (currentGroup < foodGroups.length - 1) {
      setCurrentGroup(prev => prev + 1);
      setSelectedItems(preferences[foodGroups[currentGroup + 1]?.id] || []);
    } else {
      // Quiz complete
      onComplete({
        ...preferences,
        [group.id]: selectedItems
      });
    }
  };

  const handleBack = () => {
    if (currentGroup > 0) {
      setPreferences(prev => ({
        ...prev,
        [group.id]: selectedItems
      }));
      setCurrentGroup(prev => prev - 1);
      setSelectedItems(preferences[foodGroups[currentGroup - 1].id] || []);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bloom-card p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              {currentGroup + 1} of {foodGroups.length}
            </Badge>
            {onSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground"
              >
                Skip Quiz
              </Button>
            )}
          </div>

          <Progress value={progress} className="h-2 mb-6" />

          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{group.emoji}</div>
            <h2 className="text-3xl mb-2">{group.name}</h2>
            <p className="text-muted-foreground text-lg">{group.description}</p>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Select all the {group.name.toLowerCase()} you enjoy eating
          </p>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {group.items.map((item) => {
            const isSelected = selectedItems.includes(item.name);
            return (
              <button
                key={item.name}
                onClick={() => toggleItem(item.name)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md scale-105'
                    : 'border-border bg-white hover:border-primary/50 hover:shadow-sm'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-center">{item.name}</p>
              </button>
            );
          })}
        </div>

        {/* Selection Summary */}
        <div className="mb-6 p-4 bg-muted/30 rounded-xl">
          <p className="text-sm text-center text-muted-foreground">
            {selectedItems.length === 0 ? (
              'No items selected yet'
            ) : (
              <>
                <strong>{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected:</strong>{' '}
                {selectedItems.join(', ')}
              </>
            )}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            onClick={handleBack}
            disabled={currentGroup === 0}
            variant="outline"
            className="flex-1 rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {currentGroup === foodGroups.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
