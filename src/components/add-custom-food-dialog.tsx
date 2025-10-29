"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Check, Info } from 'lucide-react';
import { ServingSize } from '@/lib/supabase/client';
import { CustomServingInput } from './custom-serving-input';

interface AddCustomFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (food: {
    name: string;
    brand?: string;
    category: string;
    description?: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g: number;
    sugar_per_100g: number;
    sodium_per_100g: number;
    serving_sizes: ServingSize[];
    default_serving_size: ServingSize;
  }) => void;
}

const CATEGORIES = [
  { value: 'protein', label: 'Protein' },
  { value: 'grains', label: 'Grains' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'nuts', label: 'Nuts & Seeds' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'meals', label: 'Meals' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'sides', label: 'Sides' },
  { value: 'other', label: 'Other' },
];

export function AddCustomFoodDialog({ open, onOpenChange, onSubmit }: AddCustomFoodDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'other',
    description: '',
    calories_per_100g: '',
    protein_per_100g: '',
    carbs_per_100g: '',
    fat_per_100g: '',
    fiber_per_100g: '',
    sugar_per_100g: '',
    sodium_per_100g: '',
  });

  const [servingSizes, setServingSizes] = useState<ServingSize[]>([
    { unit: 'g', amount: 100, grams: 100, label: '100g' },
  ]);
  const [defaultServingIndex, setDefaultServingIndex] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddServing = (serving: ServingSize) => {
    setServingSizes((prev) => [...prev, serving]);
  };

  const handleRemoveServing = (index: number) => {
    if (servingSizes.length <= 1) {
      alert('You must have at least one serving size');
      return;
    }
    setServingSizes((prev) => prev.filter((_, i) => i !== index));
    if (defaultServingIndex === index) {
      setDefaultServingIndex(0);
    } else if (defaultServingIndex > index) {
      setDefaultServingIndex(defaultServingIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a food name');
      return;
    }

    const calories = parseFloat(formData.calories_per_100g);
    const protein = parseFloat(formData.protein_per_100g);
    const carbs = parseFloat(formData.carbs_per_100g);
    const fat = parseFloat(formData.fat_per_100g);

    if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
      alert('Please fill in all required nutrition fields (calories, protein, carbs, fat)');
      return;
    }

    if (calories < 0 || protein < 0 || carbs < 0 || fat < 0) {
      alert('Nutrition values cannot be negative');
      return;
    }

    // Submit the food
    onSubmit({
      name: formData.name,
      brand: formData.brand || undefined,
      category: formData.category,
      description: formData.description || undefined,
      calories_per_100g: calories,
      protein_per_100g: protein,
      carbs_per_100g: carbs,
      fat_per_100g: fat,
      fiber_per_100g: parseFloat(formData.fiber_per_100g) || 0,
      sugar_per_100g: parseFloat(formData.sugar_per_100g) || 0,
      sodium_per_100g: parseFloat(formData.sodium_per_100g) || 0,
      serving_sizes: servingSizes,
      default_serving_size: servingSizes[defaultServingIndex],
    });

    // Reset form
    setFormData({
      name: '',
      brand: '',
      category: 'other',
      description: '',
      calories_per_100g: '',
      protein_per_100g: '',
      carbs_per_100g: '',
      fat_per_100g: '',
      fiber_per_100g: '',
      sugar_per_100g: '',
      sodium_per_100g: '',
    });
    setServingSizes([{ unit: 'g', amount: 100, grams: 100, label: '100g' }]);
    setDefaultServingIndex(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary" />
            Add Custom Food
          </DialogTitle>
          <DialogDescription>
            Add a food item to the community database. All users will be able to see and use this entry.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Basic Information</h3>

            <div>
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Grilled Chicken Breast"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="brand">Brand (Optional)</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="e.g., Tyson"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Skinless, boneless, grilled"
                className="mt-1"
              />
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Nutrition per 100g *
              <Badge variant="secondary" className="text-xs">
                <Info className="w-3 h-3 mr-1" />
                All values per 100g
              </Badge>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.calories_per_100g}
                  onChange={(e) => handleInputChange('calories_per_100g', e.target.value)}
                  placeholder="165"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="protein">Protein (g) *</Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.protein_per_100g}
                  onChange={(e) => handleInputChange('protein_per_100g', e.target.value)}
                  placeholder="31"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="carbs">Carbs (g) *</Label>
                <Input
                  id="carbs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.carbs_per_100g}
                  onChange={(e) => handleInputChange('carbs_per_100g', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fat">Fat (g) *</Label>
                <Input
                  id="fat"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.fat_per_100g}
                  onChange={(e) => handleInputChange('fat_per_100g', e.target.value)}
                  placeholder="3.6"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.fiber_per_100g}
                  onChange={(e) => handleInputChange('fiber_per_100g', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input
                  id="sugar"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.sugar_per_100g}
                  onChange={(e) => handleInputChange('sugar_per_100g', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sodium">Sodium (mg)</Label>
                <Input
                  id="sodium"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.sodium_per_100g}
                  onChange={(e) => handleInputChange('sodium_per_100g', e.target.value)}
                  placeholder="74"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Serving Sizes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Serving Sizes</h3>

            <div className="space-y-2">
              {servingSizes.map((serving, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    defaultServingIndex === index
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/20 border-border'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{serving.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {serving.amount} {serving.unit} = {serving.grams}g
                    </p>
                  </div>
                  {defaultServingIndex === index && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  {defaultServingIndex !== index && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefaultServingIndex(index)}
                      className="h-8 px-2 text-xs"
                    >
                      Set Default
                    </Button>
                  )}
                  {servingSizes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveServing(index)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <CustomServingInput onAdd={handleAddServing} />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            <Check className="w-4 h-4 mr-2" />
            Add Food
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
