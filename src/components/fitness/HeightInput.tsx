'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeightUnit, HeightValue, convertToInches, convertFromInches, formatHeight } from '@/lib/height-conversions';

interface HeightInputProps {
  value?: HeightValue;
  onChange: (height: HeightValue) => void;
  label?: string;
  className?: string;
}

export function HeightInput({ value, onChange, label = 'Height', className = '' }: HeightInputProps) {
  const [selectedUnit, setSelectedUnit] = useState<HeightUnit>(value?.unit || 'ft');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [singleValue, setSingleValue] = useState<string>('');

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const heightInInches = convertToInches(value);
      const converted = convertFromInches(heightInInches, selectedUnit);
      
      if (selectedUnit === 'ft') {
        setFeet((converted.feet || 0).toString());
        setInches((converted.inches || 0).toFixed(1));
      } else {
        setSingleValue(converted.value.toFixed(1));
      }
    }
  }, [value, selectedUnit]);

  const handleUnitChange = (unit: HeightUnit) => {
    // Convert current value to new unit
    if (value) {
      const heightInInches = convertToInches(value);
      const converted = convertFromInches(heightInInches, unit);
      
      setSelectedUnit(unit);
      
      if (unit === 'ft') {
        setFeet((converted.feet || 0).toString());
        setInches((converted.inches || 0).toFixed(1));
      } else {
        setSingleValue(converted.value.toFixed(1));
      }
      
      onChange(converted);
    } else {
      setSelectedUnit(unit);
    }
  };

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFeet(val);
    
    const feetNum = parseInt(val) || 0;
    const inchesNum = parseFloat(inches) || 0;
    const totalInches = feetNum * 12 + inchesNum;
    
    onChange({
      value: totalInches,
      unit: 'ft',
      feet: feetNum,
      inches: inchesNum
    });
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInches(val);
    
    const feetNum = parseInt(feet) || 0;
    const inchesNum = parseFloat(val) || 0;
    const totalInches = feetNum * 12 + inchesNum;
    
    onChange({
      value: totalInches,
      unit: 'ft',
      feet: feetNum,
      inches: inchesNum
    });
  };

  const handleSingleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSingleValue(val);
    
    const numValue = parseFloat(val) || 0;
    onChange({
      value: numValue,
      unit: selectedUnit
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-base font-medium">{label}</Label>
      
      {/* Unit selector */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={selectedUnit === 'ft' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleUnitChange('ft')}
          className="flex-1"
        >
          Feet & Inches
        </Button>
        <Button
          type="button"
          variant={selectedUnit === 'in' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleUnitChange('in')}
          className="flex-1"
        >
          Inches
        </Button>
        <Button
          type="button"
          variant={selectedUnit === 'cm' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleUnitChange('cm')}
          className="flex-1"
        >
          Centimeters
        </Button>
      </div>

      {/* Input fields */}
      {selectedUnit === 'ft' ? (
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="feet" className="text-sm text-muted-foreground">Feet</Label>
            <Input
              id="feet"
              type="number"
              min="0"
              max="8"
              value={feet}
              onChange={handleFeetChange}
              placeholder="5"
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="inches" className="text-sm text-muted-foreground">Inches</Label>
            <Input
              id="inches"
              type="number"
              min="0"
              max="11.9"
              step="0.1"
              value={inches}
              onChange={handleInchesChange}
              placeholder="10"
              className="mt-1"
            />
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="height-value" className="text-sm text-muted-foreground">
            {selectedUnit === 'in' ? 'Inches' : 'Centimeters'}
          </Label>
          <Input
            id="height-value"
            type="number"
            min="0"
            step="0.1"
            value={singleValue}
            onChange={handleSingleValueChange}
            placeholder={selectedUnit === 'in' ? '70' : '178'}
            className="mt-1"
          />
        </div>
      )}

      {/* Display formatted height */}
      {value && (
        <p className="text-sm text-muted-foreground">
          Height: <span className="font-medium text-foreground">{formatHeight(value)}</span>
        </p>
      )}
    </div>
  );
}
