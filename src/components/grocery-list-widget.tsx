"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  quantity?: string;
  checked: boolean;
}

export function GroceryListWidget() {
  const [items, setItems] = useState<GroceryItem[]>([
    { id: '1', name: 'Organic spinach', quantity: '1 bag', checked: false },
    { id: '2', name: 'Greek yogurt', quantity: '500g', checked: false },
    { id: '3', name: 'Quinoa', quantity: '1 lb', checked: false },
    { id: '4', name: 'Fresh salmon', quantity: '2 fillets', checked: true },
    { id: '5', name: 'Almonds', quantity: '200g', checked: false },
  ]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newItem,
          checked: false,
        },
      ]);
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const uncheckedCount = items.filter(item => !item.checked).length;

  return (
    <Card className="p-6 animate-fade-in-up widget-card">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-primary/10 mb-3">
          <ShoppingCart className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Grocery List</h3>
          <p className="text-[0.6875rem] text-muted-foreground leading-tight">
            {uncheckedCount} {uncheckedCount === 1 ? 'item' : 'items'} remaining
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              item.checked
                ? 'bg-muted/30 border-border/50'
                : 'bg-card border-border hover:border-primary/30'
            }`}
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p
                className={`font-medium text-xs ${
                  item.checked ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.name}
              </p>
              {item.quantity && (
                <p className="text-[0.625rem] text-muted-foreground">{item.quantity}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="flex-1"
        />
        <Button onClick={addItem} size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
