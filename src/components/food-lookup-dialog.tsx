"use client";

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Flame, Apple } from 'lucide-react';
import { ServingSize } from '@/lib/supabase/client';
import { SAMPLE_FOODS } from '@/lib/sample-foods';
import { calculateNutrition, formatServingSize } from '@/lib/serving-conversions';

interface FoodLookupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (food: {
    name: string;
    servingSize: ServingSize;
    quantity: number;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  }) => void;
}

export function FoodLookupDialog({ open, onOpenChange, onSelect }: FoodLookupDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFoodIndex, setSelectedFoodIndex] = useState<number | null>(null);
  const [selectedServing, setSelectedServing] = useState<ServingSize | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Filter foods based on search and category
  const filteredFoods = useMemo(() => {
    return SAMPLE_FOODS.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (food.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        food.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['all', 'protein', 'grains', 'vegetables', 'fruits', 'dairy', 'nuts'];

  const selectedFood = selectedFoodIndex !== null ? filteredFoods[selectedFoodIndex] : null;

  const handleSelectFood = (index: number) => {
    setSelectedFoodIndex(index);
    const food = filteredFoods[index];
    setSelectedServing(food.default_serving_size || food.serving_sizes[0]);
    setQuantity(1);
  };

  const handleAddFood = () => {
    if (!selectedFood || !selectedServing) return;

    const totalGrams = selectedServing.grams * quantity;
    const nutrition = calculateNutrition(totalGrams, {
      calories: selectedFood.calories_per_100g,
      protein: selectedFood.protein_per_100g,
      carbs: selectedFood.carbs_per_100g,
      fat: selectedFood.fat_per_100g,
      fiber: selectedFood.fiber_per_100g,
    });

    onSelect({
      name: selectedFood.name,
      servingSize: selectedServing,
      quantity,
      nutrition,
    });

    // Reset state
    setSearchQuery('');
    setSelectedFoodIndex(null);
    setSelectedServing(null);
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            Food Lookup
          </DialogTitle>
          <DialogDescription>
            Search for foods and add them to your meal plan
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search foods (e.g., chicken breast, banana)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
            {/* Food List */}
            <ScrollArea className="h-full border rounded-lg">
              <div className="p-2 space-y-2">
                {filteredFoods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Apple className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No foods found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectFood(index)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedFoodIndex === index
                          ? 'bg-primary/10 border-primary'
                          : 'bg-white hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-semibold">{food.name}</p>
                          {food.brand && (
                            <p className="text-xs text-muted-foreground">{food.brand}</p>
                          )}
                        </div>
                        {food.bloom_score && (
                          <Badge
                            variant={food.bloom_score >= 90 ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {food.bloom_score}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{food.calories_per_100g} cal</span>
                        <span>•</span>
                        <span>{food.protein_per_100g}g protein</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {food.category}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Food Details & Serving Selection */}
            <div className="border rounded-lg p-4 flex flex-col">
              {selectedFood ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">{selectedFood.name}</h3>
                    {selectedFood.brand && (
                      <p className="text-sm text-muted-foreground mb-2">{selectedFood.brand}</p>
                    )}
                    {selectedFood.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedFood.description}
                      </p>
                    )}

                    {/* Serving Size Selection */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Serving Size</label>
                        <Select
                          value={selectedServing?.label || ''}
                          onValueChange={(label) => {
                            const serving = selectedFood.serving_sizes.find(s => s.label === label);
                            if (serving) setSelectedServing(serving);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select serving size" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedFood.serving_sizes.map((serving, idx) => (
                              <SelectItem key={idx} value={serving.label}>
                                {formatServingSize(serving)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Quantity</label>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Preview */}
                  {selectedServing && (
                    <div className="mt-auto">
                      <div className="bg-primary/5 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Flame className="w-4 h-4 text-secondary" />
                          Nutrition Facts
                        </h4>
                        <div className="space-y-2 text-sm">
                          {(() => {
                            const totalGrams = selectedServing.grams * quantity;
                            const nutrition = calculateNutrition(totalGrams, {
                              calories: selectedFood.calories_per_100g,
                              protein: selectedFood.protein_per_100g,
                              carbs: selectedFood.carbs_per_100g,
                              fat: selectedFood.fat_per_100g,
                              fiber: selectedFood.fiber_per_100g,
                            });

                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Calories</span>
                                  <span>{nutrition.calories} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Protein</span>
                                  <span>{nutrition.protein}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Carbs</span>
                                  <span>{nutrition.carbs}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Fat</span>
                                  <span>{nutrition.fat}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Fiber</span>
                                  <span>{nutrition.fiber}g</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      <Button onClick={handleAddFood} className="w-full rounded-full">
                        Add to Meal
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Apple className="w-16 h-16 mx-auto mb-3 opacity-20" />
                    <p>Select a food to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
