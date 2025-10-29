"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { ServingSize } from '@/lib/supabase/client';

interface CustomServingInputProps {
  onAdd: (serving: ServingSize) => void;
}

// Common serving units with gram conversions
const SERVING_UNITS = [
  { unit: 'g', label: 'Grams', conversionFactor: 1 },
  { unit: 'oz', label: 'Ounces', conversionFactor: 28.35 },
  { unit: 'cup', label: 'Cup', conversionFactor: 240 },
  { unit: 'tbsp', label: 'Tablespoon', conversionFactor: 15 },
  { unit: 'tsp', label: 'Teaspoon', conversionFactor: 5 },
  { unit: 'piece', label: 'Piece', conversionFactor: 100 }, // Default, user will specify grams
  { unit: 'ml', label: 'Milliliters', conversionFactor: 1 },
  { unit: 'lb', label: 'Pounds', conversionFactor: 453.59 },
];

export function CustomServingInput({ onAdd }: CustomServingInputProps) {
  const [amount, setAmount] = useState<string>('1');
  const [unit, setUnit] = useState<string>('g');
  const [customGrams, setCustomGrams] = useState<string>('');
  const [showCustomGrams, setShowCustomGrams] = useState(false);

  const handleAdd = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const selectedUnit = SERVING_UNITS.find(u => u.unit === unit);
    if (!selectedUnit) return;

    let grams: number;
    if (unit === 'piece' || showCustomGrams) {
      const customGramsNum = parseFloat(customGrams);
      if (isNaN(customGramsNum) || customGramsNum <= 0) {
        alert('Please enter valid grams for this serving');
        return;
      }
      grams = customGramsNum;
    } else {
      grams = amountNum * selectedUnit.conversionFactor;
    }

    const serving: ServingSize = {
      unit: unit,
      amount: amountNum,
      grams: grams,
      label: `${amountNum} ${selectedUnit.label.toLowerCase()} (${grams.toFixed(1)}g)`,
    };

    onAdd(serving);

    // Reset form
    setAmount('1');
    setUnit('g');
    setCustomGrams('');
    setShowCustomGrams(false);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    if (newUnit === 'piece') {
      setShowCustomGrams(true);
    } else {
      setShowCustomGrams(false);
    }
  };

  return (
    <div className="bg-muted/20 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold">Add Custom Serving Size</h4>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amount" className="text-xs mb-1 block">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0.1"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            className="h-9"
          />
        </div>

        <div>
          <Label htmlFor="unit" className="text-xs mb-1 block">Unit</Label>
          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger id="unit" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVING_UNITS.map((u) => (
                <SelectItem key={u.unit} value={u.unit}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(showCustomGrams || unit === 'piece') && (
        <div>
          <Label htmlFor="customGrams" className="text-xs mb-1 block">
            Grams per {SERVING_UNITS.find(u => u.unit === unit)?.label.toLowerCase()}
          </Label>
          <Input
            id="customGrams"
            type="number"
            min="1"
            step="1"
            value={customGrams}
            onChange={(e) => setCustomGrams(e.target.value)}
            placeholder="Enter grams"
            className="h-9"
          />
        </div>
      )}

      <Button onClick={handleAdd} className="w-full h-9 text-sm" variant="secondary">
        <Plus className="w-4 h-4 mr-2" />
        Add Serving Size
      </Button>
    </div>
  );
}
