"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Edit2, Check, Package, Search } from 'lucide-react';

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
  notes?: string;
}

interface PantryItemsManagerProps {
  items: PantryItem[];
  onItemsChange: (items: PantryItem[]) => void;
}

const CATEGORIES = [
  'Produce',
  'Protein',
  'Dairy',
  'Grains',
  'Canned Goods',
  'Condiments',
  'Spices',
  'Beverages',
  'Snacks',
  'Frozen',
  'Other'
];

export function PantryItemsManager({ items, onItemsChange }: PantryItemsManagerProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [newItem, setNewItem] = useState<Partial<PantryItem>>({
    name: '',
    category: 'Other',
    quantity: '',
    unit: '',
    notes: ''
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    if (!newItem.name?.trim()) return;

    const item: PantryItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      category: newItem.category || 'Other',
      quantity: newItem.quantity?.trim(),
      unit: newItem.unit?.trim(),
      notes: newItem.notes?.trim()
    };

    onItemsChange([...items, item]);
    setNewItem({ name: '', category: 'Other', quantity: '', unit: '', notes: '' });
    setIsAddingItem(false);
  };

  const handleUpdateItem = (id: string) => {
    if (!newItem.name?.trim()) return;

    onItemsChange(items.map(item =>
      item.id === id
        ? {
            ...item,
            name: newItem.name!.trim(),
            category: newItem.category || item.category,
            quantity: newItem.quantity?.trim(),
            unit: newItem.unit?.trim(),
            notes: newItem.notes?.trim()
          }
        : item
    ));

    setEditingItemId(null);
    setNewItem({ name: '', category: 'Other', quantity: '', unit: '', notes: '' });
  };

  const handleDeleteItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const startEdit = (item: PantryItem) => {
    setEditingItemId(item.id);
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity || '',
      unit: item.unit || '',
      notes: item.notes || ''
    });
    setIsAddingItem(false);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setIsAddingItem(false);
    setNewItem({ name: '', category: 'Other', quantity: '', unit: '', notes: '' });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Produce': 'bg-green-100 text-green-800 border-green-200',
      'Protein': 'bg-red-100 text-red-800 border-red-200',
      'Dairy': 'bg-blue-100 text-blue-800 border-blue-200',
      'Grains': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Canned Goods': 'bg-orange-100 text-orange-800 border-orange-200',
      'Condiments': 'bg-purple-100 text-purple-800 border-purple-200',
      'Spices': 'bg-pink-100 text-pink-800 border-pink-200',
      'Beverages': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Snacks': 'bg-amber-100 text-amber-800 border-amber-200',
      'Frozen': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            My Pantry Items
          </h3>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your pantry
          </p>
        </div>
        <Button
          onClick={() => {
            setIsAddingItem(true);
            setEditingItemId(null);
            setNewItem({ name: '', category: 'Other', quantity: '', unit: '', notes: '' });
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search pantry items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-lg"
        />
      </div>

      {/* Add/Edit Form */}
      {(isAddingItem || editingItemId) && (
        <Card className="p-6 bg-muted/30 border-2 border-primary/20">
          <h4 className="font-semibold mb-4">
            {editingItemId ? 'Edit Item' : 'Add New Item'}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 block">Item Name *</label>
                <Input
                  placeholder="e.g., Bananas, Chicken Breast"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (editingItemId ? handleUpdateItem(editingItemId) : handleAddItem())}
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Quantity</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Amount"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="rounded-lg flex-1"
                  />
                  <Input
                    placeholder="Unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="rounded-lg w-24"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
                <Input
                  placeholder="Any additional notes..."
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => editingItemId ? handleUpdateItem(editingItemId) : handleAddItem()}
                className="flex-1 rounded-lg gap-2"
                disabled={!newItem.name?.trim()}
              >
                <Check className="w-4 h-4" />
                {editingItemId ? 'Update' : 'Add'}
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Items List */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 transition-all hover:shadow-md ${
                editingItemId === item.id ? 'border-2 border-primary' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-lg truncate">{item.name}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {item.quantity && (
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {item.quantity} {item.unit}
                      </span>
                    )}
                    {item.notes && (
                      <span className="text-xs italic">• {item.notes}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    onClick={() => startEdit(item)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-muted/20">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No items found matching your search' : 'Your pantry is empty'}
          </p>
          {!searchQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              Add items to get personalized meal suggestions
            </p>
          )}
        </Card>
      )}

      {/* Quick Tips */}
      {items.length > 0 && !isAddingItem && !editingItemId && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-center">
            <strong>💡 Tip:</strong> Add your pantry items to get AI-generated meal ideas based on what you already have!
          </p>
        </Card>
      )}
    </div>
  );
}
