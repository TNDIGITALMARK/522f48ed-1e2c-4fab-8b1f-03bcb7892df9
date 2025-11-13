"use client";

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Smile,
  Frown,
  Meh,
  Sparkles,
  Zap,
  Moon,
  Heart,
  Droplets,
  Activity,
  Brain,
  Search,
  Check,
  TrendingUp,
  AlertCircle,
  ThermometerSun,
  Pill,
  HeartPulse,
  Users,
  Cookie,
  Wine,
  Coffee,
  Dumbbell,
  Baby,
  Shield,
  Cigarette,
  ArrowLeft,
  Scan,
  Package,
  Plus,
  X
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { createSymptomLog, createScannedItem } from '@/lib/supabase/symptom-queries';
import { toast } from 'sonner';

interface SymptomOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'mood' | 'symptoms' | 'energy' | 'sex' | 'beauty';
}

const symptomOptions: SymptomOption[] = [
  // Mood
  { id: 'happy', label: 'Happy', icon: Smile, category: 'mood' },
  { id: 'sad', label: 'Sad', icon: Frown, category: 'mood' },
  { id: 'anxious', label: 'Anxious', icon: AlertCircle, category: 'mood' },
  { id: 'calm', label: 'Calm', icon: Heart, category: 'mood' },
  { id: 'irritable', label: 'Irritable', icon: Meh, category: 'mood' },
  { id: 'stressed', label: 'Stressed', icon: Brain, category: 'mood' },

  // Symptoms
  { id: 'cramps', label: 'Cramps', icon: Activity, category: 'symptoms' },
  { id: 'headache', label: 'Headache', icon: Brain, category: 'symptoms' },
  { id: 'bloating', label: 'Bloating', icon: AlertCircle, category: 'symptoms' },
  { id: 'tender-breasts', label: 'Tender Breasts', icon: HeartPulse, category: 'symptoms' },
  { id: 'nausea', label: 'Nausea', icon: Pill, category: 'symptoms' },
  { id: 'fatigue', label: 'Fatigue', icon: Moon, category: 'symptoms' },
  { id: 'back-pain', label: 'Back Pain', icon: Activity, category: 'symptoms' },
  { id: 'hot-flashes', label: 'Hot Flashes', icon: ThermometerSun, category: 'symptoms' },

  // Energy
  { id: 'energized', label: 'Energized', icon: Zap, category: 'energy' },
  { id: 'tired', label: 'Tired', icon: Moon, category: 'energy' },
  { id: 'motivated', label: 'Motivated', icon: TrendingUp, category: 'energy' },
  { id: 'sluggish', label: 'Sluggish', icon: Meh, category: 'energy' },
  { id: 'restless', label: 'Restless', icon: Activity, category: 'energy' },

  // Sex
  { id: 'high-libido', label: 'High Libido', icon: Heart, category: 'sex' },
  { id: 'low-libido', label: 'Low Libido', icon: Meh, category: 'sex' },
  { id: 'intimate', label: 'Intimate', icon: Users, category: 'sex' },
  { id: 'protected', label: 'Protected Sex', icon: Shield, category: 'sex' },
  { id: 'unprotected', label: 'Unprotected Sex', icon: Baby, category: 'sex' },

  // Beauty
  { id: 'clear-skin', label: 'Clear Skin', icon: Sparkles, category: 'beauty' },
  { id: 'acne', label: 'Acne', icon: AlertCircle, category: 'beauty' },
  { id: 'oily-skin', label: 'Oily Skin', icon: Droplets, category: 'beauty' },
  { id: 'dry-skin', label: 'Dry Skin', icon: Droplets, category: 'beauty' },
  { id: 'good-hair', label: 'Good Hair Day', icon: Sparkles, category: 'beauty' },
  { id: 'bad-hair', label: 'Bad Hair Day', icon: Meh, category: 'beauty' },
];

const categories = [
  {
    id: 'mood',
    name: 'Mood',
    icon: Smile,
    color: 'from-purple-400/20 to-purple-500/10',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'symptoms',
    name: 'Symptoms',
    icon: Activity,
    color: 'from-red-400/20 to-red-500/10',
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: Zap,
    color: 'from-yellow-400/20 to-yellow-500/10',
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'sex',
    name: 'Sex',
    icon: Heart,
    color: 'from-pink-400/20 to-pink-500/10',
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: Sparkles,
    color: 'from-blue-400/20 to-blue-500/10',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
];

interface ScannedItemData {
  id: string;
  name: string;
  type: string;
  brand?: string;
}

export default function LogSymptomPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItemData[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const filteredSymptoms = symptomOptions.filter(symptom => {
    const matchesSearch = symptom.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || symptom.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!itemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    const newItem: ScannedItemData = {
      id: Date.now().toString(),
      name: itemName,
      type: itemType || 'Other',
      brand: itemBrand || undefined
    };

    setScannedItems(prev => [...prev, newItem]);
    setItemName('');
    setItemType('');
    setItemBrand('');
    setShowScanner(false);
    toast.success('Item added successfully');
  };

  const handleRemoveItem = (id: string) => {
    setScannedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (selectedSymptoms.length === 0 && scannedItems.length === 0) {
      toast.error('Please select at least one symptom or add a scanned item');
      return;
    }

    setIsSaving(true);

    try {
      // Create symptom log
      const symptomLog = await createSymptomLog({
        symptom_ids: selectedSymptoms,
        notes: notes || undefined,
        logged_at: new Date().toISOString()
      });

      // Create scanned items linked to symptom log
      for (const item of scannedItems) {
        await createScannedItem({
          item_name: item.name,
          item_type: item.type,
          brand: item.brand,
          symptom_log_id: symptomLog.id,
          scanned_at: new Date().toISOString()
        });
      }

      toast.success('Symptom log saved successfully!');

      // Reset form
      setSelectedSymptoms([]);
      setScannedItems([]);
      setNotes('');

    } catch (error) {
      console.error('Error saving symptom log:', error);
      toast.error('Failed to save symptom log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12 px-6">
        {/* Header */}
        <div className="pt-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Log a Symptom</h1>
          <p className="text-muted-foreground">
            Track how you're feeling today to better understand your cycle patterns
          </p>
        </div>

        {/* Search Bar */}
        <Card className="glass-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </Card>

        {/* Scanned Items Section with Black Outline */}
        <Card className="border-2 border-black bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl border-2 border-black bg-foreground flex items-center justify-center">
                <Scan className="w-6 h-6 text-background" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Scanned Items</h2>
                <p className="text-sm text-muted-foreground">
                  Add items that may be related to your symptoms
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-2 border-black hover:bg-foreground hover:text-background"
              onClick={() => setShowScanner(!showScanner)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {showScanner && (
            <Card className="border-2 border-black mb-6 bg-muted/20">
              <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Item Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Chocolate Bar, Face Cream, Medication"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="border-2 border-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Item Type
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Food, Product, Medication"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="border-2 border-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Brand (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Dove, Neutrogena"
                    value={itemBrand}
                    onChange={(e) => setItemBrand(e.target.value)}
                    className="border-2 border-black"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddItem}
                    className="border-2 border-black bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowScanner(false);
                      setItemName('');
                      setItemType('');
                      setItemBrand('');
                    }}
                    className="border-2 border-black"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {scannedItems.length > 0 && (
            <div className="space-y-3">
              {scannedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-black bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-foreground" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type}
                        {item.brand && ` · ${item.brand}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="border-2 border-black hover:bg-destructive hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {scannedItems.length === 0 && !showScanner && (
            <div className="text-center py-8 border-2 border-dashed border-black rounded-2xl">
              <Scan className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-sm text-muted-foreground">
                No items scanned yet. Click "Add Item" to start.
              </p>
            </div>
          )}
        </Card>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="mr-2 w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Symptoms by Category */}
        {categories.map((category) => {
          const categorySymptoms = filteredSymptoms.filter(s => s.category === category.id);

          if (categorySymptoms.length === 0) return null;

          const CategoryIcon = category.icon;

          return (
            <Card key={category.id} className="bloom-card">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <CategoryIcon className={`w-6 h-6 ${category.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {categorySymptoms.length} {categorySymptoms.length === 1 ? 'option' : 'options'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categorySymptoms.map((symptom) => {
                  const SymptomIcon = symptom.icon;
                  const isSelected = selectedSymptoms.includes(symptom.id);

                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`
                        relative p-4 rounded-2xl border-2 transition-all duration-300
                        ${isSelected
                          ? `${category.bgColor} border-${category.iconColor.replace('text-', '')} shadow-bloom`
                          : 'bg-card border-border hover:border-primary/30 hover:shadow-bloom-sm'
                        }
                        hover:scale-105 active:scale-100
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2 text-center">
                        <SymptomIcon className={`w-8 h-8 ${isSelected ? category.iconColor : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {symptom.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {/* Empty State */}
        {filteredSymptoms.length === 0 && (
          <Card className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No symptoms found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </Card>
        )}

        {/* Notes Section */}
        <Card className="border-2 border-black bg-card">
          <h3 className="text-lg font-semibold mb-4">Additional Notes (Optional)</h3>
          <Textarea
            placeholder="Add any additional notes about your symptoms or items..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-32 border-2 border-black resize-none"
          />
        </Card>

        {/* Save Button - Fixed at bottom with Black Outline */}
        <div className="sticky bottom-6 z-10">
          <Card className="glass-card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-black backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Symptoms</p>
                    <p className="text-2xl font-bold">{selectedSymptoms.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="text-2xl font-bold">{scannedItems.length}</p>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="rounded-full border-2 border-black bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-bloom"
                onClick={handleSave}
                disabled={isSaving || (selectedSymptoms.length === 0 && scannedItems.length === 0)}
              >
                <Check className="mr-2 w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Log'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
