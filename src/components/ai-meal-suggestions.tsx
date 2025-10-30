"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Sparkles, Clock, Heart, Info, Package } from 'lucide-react';
import { PantryItemsManager, PantryItem } from '@/components/pantry-items-manager';

interface MealSuggestion {
  id: string;
  meal_name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  estimated_calories: number;
  estimated_protein: number;
  estimated_carbs: number;
  estimated_fat: number;
  is_balanced: boolean;
  source: string;
  prep_time?: string;
}

interface AIMealSuggestionsProps {
  mealType: string;
  groceryItems: string[];
  onAddToMeal?: (suggestion: MealSuggestion) => void;
  pantryItems?: PantryItem[];
  onPantryItemsChange?: (items: PantryItem[]) => void;
}

export function AIMealSuggestions({
  mealType,
  groceryItems,
  onAddToMeal,
  pantryItems = [],
  onPantryItemsChange
}: AIMealSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<MealSuggestion | null>(null);

  // Combine grocery items and pantry items for suggestions
  const allAvailableItems = [
    ...groceryItems,
    ...pantryItems.map(item => item.name)
  ].filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates

  const generateSuggestions = () => {
    setLoading(true);

    // Simulate AI generation - in production, this would call an AI API
    setTimeout(() => {
      const mockSuggestions = getMockSuggestions(mealType, allAvailableItems);
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1500);
  };

  const getMockSuggestions = (type: string, items: string[]): MealSuggestion[] => {
    const suggestionsByType: Record<string, MealSuggestion[]> = {
      breakfast: [
        {
          id: '1',
          meal_name: 'Energizing Breakfast Bowl',
          description: 'A nutritious bowl combining your available ingredients for sustained energy',
          ingredients: items.slice(0, 4),
          instructions: 'Cook oats with almond milk. Top with fresh berries, nuts, and a drizzle of honey. Serve warm.',
          estimated_calories: 350,
          estimated_protein: 15,
          estimated_carbs: 45,
          estimated_fat: 10,
          is_balanced: true,
          source: 'AI Generated',
          prep_time: '10 min',
        },
        {
          id: '2',
          meal_name: 'Green Power Smoothie',
          description: 'Nutrient-dense smoothie using pantry staples',
          ingredients: items.slice(0, 3),
          instructions: 'Blend spinach, banana, protein powder, and almond milk until smooth. Add ice for thickness.',
          estimated_calories: 280,
          estimated_protein: 20,
          estimated_carbs: 35,
          estimated_fat: 8,
          is_balanced: true,
          source: 'Pinterest Inspired',
          prep_time: '5 min',
        },
      ],
      lunch: [
        {
          id: '3',
          meal_name: 'Mediterranean Buddha Bowl',
          description: 'Well-rounded lunch combining protein and vegetables',
          ingredients: items.slice(0, 5),
          instructions: 'Arrange quinoa, chickpeas, cucumber, tomatoes, and feta in a bowl. Drizzle with olive oil and lemon.',
          estimated_calories: 450,
          estimated_protein: 18,
          estimated_carbs: 55,
          estimated_fat: 15,
          is_balanced: true,
          source: 'AI Generated',
          prep_time: '15 min',
        },
        {
          id: '4',
          meal_name: 'Protein-Packed Wrap',
          description: 'Quick and filling lunch option',
          ingredients: items.slice(0, 4),
          instructions: 'Fill whole wheat tortilla with grilled chicken, mixed greens, avocado, and hummus. Roll tightly and slice.',
          estimated_calories: 420,
          estimated_protein: 32,
          estimated_carbs: 40,
          estimated_fat: 12,
          is_balanced: true,
          source: 'Google Recipes',
          prep_time: '8 min',
        },
      ],
      dinner: [
        {
          id: '5',
          meal_name: 'Balanced Dinner Plate',
          description: 'Complete dinner using available groceries',
          ingredients: items.slice(0, 6),
          instructions: 'Grill salmon with herbs. Steam broccoli and prepare brown rice. Serve together with lemon wedges.',
          estimated_calories: 550,
          estimated_protein: 40,
          estimated_carbs: 50,
          estimated_fat: 18,
          is_balanced: true,
          source: 'AI Generated',
          prep_time: '25 min',
        },
        {
          id: '6',
          meal_name: 'Vegetarian Stir-Fry',
          description: 'Colorful and nutritious plant-based dinner',
          ingredients: items.slice(0, 5),
          instructions: 'Stir-fry mixed vegetables with tofu in sesame oil. Season with soy sauce and ginger. Serve over rice.',
          estimated_calories: 480,
          estimated_protein: 25,
          estimated_carbs: 60,
          estimated_fat: 15,
          is_balanced: true,
          source: 'Pinterest Inspired',
          prep_time: '20 min',
        },
      ],
      snack: [
        {
          id: '7',
          meal_name: 'Energy Bites',
          description: 'Quick and nutritious snack',
          ingredients: items.slice(0, 3),
          instructions: 'Mix oats, nut butter, honey, and chocolate chips. Roll into balls and refrigerate.',
          estimated_calories: 150,
          estimated_protein: 6,
          estimated_carbs: 18,
          estimated_fat: 7,
          is_balanced: true,
          source: 'AI Generated',
          prep_time: '5 min',
        },
      ],
      dessert: [
        {
          id: '8',
          meal_name: 'Guilt-Free Yogurt Parfait',
          description: 'Healthy dessert option',
          ingredients: items.slice(0, 3),
          instructions: 'Layer Greek yogurt with berries, granola, and a drizzle of honey. Chill before serving.',
          estimated_calories: 220,
          estimated_protein: 12,
          estimated_carbs: 30,
          estimated_fat: 6,
          is_balanced: true,
          source: 'Google Recipes',
          prep_time: '5 min',
        },
      ],
    };

    return suggestionsByType[type.toLowerCase()] || suggestionsByType.lunch;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="suggestions" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="pantry" className="gap-2">
            <Package className="w-4 h-4" />
            My Pantry ({pantryItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <ChefHat className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">AI Meal Planning</span>
            </div>

            <h2 className="text-2xl font-semibold">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Ideas
            </h2>

            <p className="text-muted-foreground">
              {allAvailableItems.length > 0
                ? `Based on ${allAvailableItems.length} items available`
                : 'Add items to your pantry to get personalized suggestions'}
            </p>

            {allAvailableItems.length > 0 && (
              <Button
                onClick={generateSuggestions}
                disabled={loading}
                size="lg"
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'Generating Ideas...' : 'Generate Meal Ideas'}
              </Button>
            )}

            {allAvailableItems.length === 0 && (
              <Card className="p-6 bg-muted/20 border-dashed">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-2">
                  Start by adding items to your pantry!
                </p>
                <p className="text-sm text-muted-foreground">
                  Switch to the "My Pantry" tab to add ingredients you have on hand.
                </p>
              </Card>
            )}
          </div>

      {suggestions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{suggestion.meal_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                  {suggestion.is_balanced && (
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="w-3 h-3" />
                      Balanced
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {suggestion.prep_time}
                  </Badge>
                  <Badge variant="outline">{suggestion.estimated_calories} cal</Badge>
                  <Badge variant="outline">{suggestion.estimated_protein}g protein</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Using:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.ingredients.slice(0, 3).map((ingredient, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {suggestion.ingredients.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{suggestion.ingredients.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => setSelectedSuggestion(suggestion)}
                  >
                    <Info className="w-4 h-4" />
                    View Recipe
                  </Button>
                  {onAddToMeal && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => onAddToMeal(suggestion)}
                    >
                      Add to Meal Plan
                    </Button>
                  )}
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  {suggestion.source}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>

        <TabsContent value="pantry" className="space-y-6">
          {onPantryItemsChange ? (
            <PantryItemsManager
              items={pantryItems}
              onItemsChange={onPantryItemsChange}
            />
          ) : (
            <Card className="p-8 text-center bg-muted/20">
              <p className="text-muted-foreground">
                Pantry management is not available in this view.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSuggestion && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSuggestion.meal_name}</DialogTitle>
                <DialogDescription>{selectedSuggestion.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedSuggestion.estimated_calories}
                    </div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedSuggestion.estimated_protein}g
                    </div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedSuggestion.estimated_carbs}g
                    </div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedSuggestion.estimated_fat}g
                    </div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Ingredients:</h4>
                  <ul className="space-y-2">
                    {selectedSuggestion.ingredients.map((ingredient, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Instructions:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedSuggestion.instructions}
                  </p>
                </div>
              </div>

              <DialogFooter>
                {onAddToMeal && (
                  <Button
                    onClick={() => {
                      onAddToMeal(selectedSuggestion);
                      setSelectedSuggestion(null);
                    }}
                    className="gap-2"
                  >
                    <ChefHat className="w-4 h-4" />
                    Add to Meal Plan
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
