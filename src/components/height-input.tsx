"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  convertHeight,
  formatHeight,
  parseHeightInput,
  isValidHeight,
  type HeightValue,
  type HeightUnit
} from '@/lib/height-conversions';
import { Ruler, ArrowLeftRight } from 'lucide-react';

interface HeightInputProps {
  value: HeightValue;
  onChange: (height: HeightValue) => void;
  label?: string;
  className?: string;
}

export function HeightInput({ value, onChange, label = "Height", className = "" }: HeightInputProps) {
  const [unit, setUnit] = useState<HeightUnit>(value.unit);
  const [displayValue, setDisplayValue] = useState<HeightValue>(value);
  const [inputValue, setInputValue] = useState<string>('');
  const [feetValue, setFeetValue] = useState<string>('');
  const [inchesValue, setInchesValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Initialize input values
  useEffect(() => {
    const converted = convertHeight(value, unit);
    setDisplayValue(converted);

    if (unit === 'ft') {
      setFeetValue(converted.feet?.toString() || '');
      setInchesValue(converted.inches?.toFixed(1) || '');
    } else {
      setInputValue(converted.value.toFixed(1));
    }
  }, [value, unit]);

  const handleUnitChange = (newUnit: HeightUnit) => {
    setUnit(newUnit);
    const converted = convertHeight(displayValue, newUnit);
    setDisplayValue(converted);

    if (newUnit === 'ft') {
      setFeetValue(converted.feet?.toString() || '');
      setInchesValue(converted.inches?.toFixed(1) || '');
    } else {
      setInputValue(converted.value.toFixed(1));
    }

    onChange(converted);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setError('');

    const parsed = parseHeightInput(newValue, unit);
    if (parsed && isValidHeight(parsed)) {
      setDisplayValue(parsed);
      onChange(parsed);
    } else if (newValue && parseFloat(newValue) > 0) {
      setError('Please enter a valid height');
    }
  };

  const handleFeetChange = (feet: string) => {
    setFeetValue(feet);
    setError('');

    const feetNum = parseInt(feet, 10) || 0;
    const inchesNum = parseFloat(inchesValue) || 0;

    if (feetNum >= 0 && inchesNum >= 0) {
      const totalInches = feetNum * 12 + inchesNum;
      const newHeight: HeightValue = {
        value: totalInches,
        unit: 'ft',
        feet: feetNum,
        inches: inchesNum
      };

      if (isValidHeight(newHeight)) {
        setDisplayValue(newHeight);
        onChange(newHeight);
      } else if (totalInches > 0) {
        setError('Please enter a valid height');
      }
    }
  };

  const handleInchesChange = (inches: string) => {
    setInchesValue(inches);
    setError('');

    const feetNum = parseInt(feetValue, 10) || 0;
    const inchesNum = parseFloat(inches) || 0;

    if (feetNum >= 0 && inchesNum >= 0) {
      const totalInches = feetNum * 12 + inchesNum;
      const newHeight: HeightValue = {
        value: totalInches,
        unit: 'ft',
        feet: feetNum,
        inches: inchesNum
      };

      if (isValidHeight(newHeight)) {
        setDisplayValue(newHeight);
        onChange(newHeight);
      } else if (totalInches > 0) {
        setError('Please enter a valid height');
      }
    }
  };

  const getConversionPreview = () => {
    if (!isValidHeight(displayValue)) return null;

    const previews: string[] = [];

    if (unit !== 'in') {
      const inInches = convertHeight(displayValue, 'in');
      previews.push(formatHeight(inInches));
    }
    if (unit !== 'cm') {
      const inCm = convertHeight(displayValue, 'cm');
      previews.push(formatHeight(inCm));
    }
    if (unit !== 'ft') {
      const inFeet = convertHeight(displayValue, 'ft');
      previews.push(formatHeight(inFeet));
    }

    return previews.join(' = ');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <Ruler className="w-4 h-4 text-primary" />
          {label}
        </Label>
        <Select value={unit} onValueChange={(v) => handleUnitChange(v as HeightUnit)}>
          <SelectTrigger className="w-32 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in">Inches</SelectItem>
            <SelectItem value="cm">Centimeters</SelectItem>
            <SelectItem value="ft">Feet + Inches</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {unit === 'ft' ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Feet</Label>
            <Input
              type="number"
              min="0"
              max="8"
              step="1"
              value={feetValue}
              onChange={(e) => handleFeetChange(e.target.value)}
              placeholder="5"
              className="text-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Inches</Label>
            <Input
              type="number"
              min="0"
              max="11.9"
              step="0.1"
              value={inchesValue}
              onChange={(e) => handleInchesChange(e.target.value)}
              placeholder="10"
              className="text-lg"
            />
          </div>
        </div>
      ) : (
        <Input
          type="number"
          min="0"
          step="0.1"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={unit === 'cm' ? '170' : '67'}
          className="text-lg"
        />
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!error && isValidHeight(displayValue) && getConversionPreview() && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
          <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
          <span>{getConversionPreview()}</span>
        </div>
      )}
    </div>
  );
}
