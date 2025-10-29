"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Leaf, Flower2, Home, Fence, Plus, X, Sprout, TreeDeciduous } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GardenItem {
  id: string;
  type: 'plant' | 'building' | 'decoration';
  name: string;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  growthStage: number; // 0-4 for plants
  isHarvested: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface GardenGridProps {
  gridWidth?: number;
  gridHeight?: number;
  gardenLevel: number;
  coins: number;
  onCoinsChange?: (newCoins: number) => void;
}

const AVAILABLE_ITEMS = [
  { type: 'plant', name: 'Sunflower', icon: Flower2, color: 'text-yellow-500', cost: 10, width: 1, height: 1 },
  { type: 'plant', name: 'Rose Bush', icon: Flower2, color: 'text-pink-500', cost: 15, width: 1, height: 1 },
  { type: 'plant', name: 'Oak Tree', icon: TreeDeciduous, color: 'text-green-600', cost: 30, width: 2, height: 2 },
  { type: 'decoration', name: 'Garden Fence', icon: Fence, color: 'text-amber-700', cost: 5, width: 1, height: 1 },
  { type: 'building', name: 'Greenhouse', icon: Home, color: 'text-emerald-600', cost: 50, width: 2, height: 2 },
  { type: 'plant', name: 'Flower Bed', icon: Sprout, color: 'text-purple-500', cost: 20, width: 2, height: 1 },
] as const;

export function GardenGrid({ gridWidth = 10, gridHeight = 10, gardenLevel, coins, onCoinsChange }: GardenGridProps) {
  const [items, setItems] = useState<GardenItem[]>([
    {
      id: '1',
      type: 'plant',
      name: 'Sunflower',
      gridX: 2,
      gridY: 3,
      width: 1,
      height: 1,
      growthStage: 3,
      isHarvested: false,
      icon: Flower2,
      color: 'text-yellow-500',
    },
    {
      id: '2',
      type: 'plant',
      name: 'Rose Bush',
      gridX: 5,
      gridY: 5,
      width: 1,
      height: 1,
      growthStage: 4,
      isHarvested: false,
      icon: Flower2,
      color: 'text-pink-500',
    },
  ]);

  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GardenItem | null>(null);

  const isOccupied = (x: number, y: number, width = 1, height = 1, excludeId?: string) => {
    return items.some((item) => {
      if (excludeId && item.id === excludeId) return false;

      return (
        x < item.gridX + item.width &&
        x + width > item.gridX &&
        y < item.gridY + item.height &&
        y + height > item.gridY
      );
    });
  };

  const handleCellClick = (x: number, y: number) => {
    const clickedItem = items.find(
      (item) =>
        x >= item.gridX &&
        x < item.gridX + item.width &&
        y >= item.gridY &&
        y < item.gridY + item.height
    );

    if (clickedItem) {
      setSelectedItem(clickedItem);
    } else {
      setSelectedCell({ x, y });
      setShowItemSelector(true);
    }
  };

  const placeItem = (itemTemplate: typeof AVAILABLE_ITEMS[number]) => {
    if (!selectedCell || coins < itemTemplate.cost) return;

    if (isOccupied(selectedCell.x, selectedCell.y, itemTemplate.width, itemTemplate.height)) {
      alert('This space is occupied!');
      return;
    }

    const newItem: GardenItem = {
      id: Date.now().toString(),
      type: itemTemplate.type,
      name: itemTemplate.name,
      gridX: selectedCell.x,
      gridY: selectedCell.y,
      width: itemTemplate.width,
      height: itemTemplate.height,
      growthStage: 0,
      isHarvested: false,
      icon: itemTemplate.icon,
      color: itemTemplate.color,
    };

    setItems([...items, newItem]);
    onCoinsChange?.(coins - itemTemplate.cost);
    setShowItemSelector(false);
    setSelectedCell(null);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
    setSelectedItem(null);
  };

  const harvestItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || item.type !== 'plant' || item.growthStage < 4) return;

    setItems(
      items.map((i) =>
        i.id === itemId ? { ...i, isHarvested: true, growthStage: 0 } : i
      )
    );
    onCoinsChange?.(coins + 15); // Reward for harvesting
    setSelectedItem(null);
  };

  const growPlant = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId && item.type === 'plant' && item.growthStage < 4
          ? { ...item, growthStage: item.growthStage + 1 }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2 gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Level {gardenLevel}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {coins} coins
          </Badge>
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowItemSelector(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridHeight }).map((_, y) =>
            Array.from({ length: gridWidth }).map((_, x) => {
              const item = items.find(
                (i) =>
                  x >= i.gridX &&
                  x < i.gridX + i.width &&
                  y >= i.gridY &&
                  y < i.gridY + i.height &&
                  x === i.gridX &&
                  y === i.gridY
              );

              return (
                <div
                  key={`${x}-${y}`}
                  className={cn(
                    'aspect-square rounded border-2 border-dashed border-green-200/50 hover:border-primary/50 transition-all cursor-pointer relative',
                    selectedCell?.x === x && selectedCell?.y === y && 'border-primary bg-primary/10'
                  )}
                  style={{
                    gridColumn: item ? `span ${item.width}` : undefined,
                    gridRow: item ? `span ${item.height}` : undefined,
                  }}
                  onClick={() => handleCellClick(x, y)}
                >
                  {item && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                      <div className="text-center">
                        <item.icon
                          className={cn(
                            'w-8 h-8 mx-auto',
                            item.color,
                            item.type === 'plant' && item.growthStage < 4 && 'opacity-50'
                          )}
                        />
                        {item.type === 'plant' && (
                          <div className="text-xs mt-1">
                            {item.growthStage === 4 ? '✓' : `${item.growthStage}/4`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Item Selector Dialog */}
      <Dialog open={showItemSelector} onOpenChange={setShowItemSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose an Item to Place</DialogTitle>
            <DialogDescription>
              Click on an item to place it in your garden
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {AVAILABLE_ITEMS.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  'p-4 cursor-pointer hover:shadow-md transition-all',
                  coins < item.cost && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => coins >= item.cost && placeItem(item)}
              >
                <div className="flex flex-col items-center gap-2">
                  <item.icon className={cn('w-10 h-10', item.color)} />
                  <div className="text-center">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.width}x{item.height} grid
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {item.cost} coins
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  Placed at position ({selectedItem.gridX}, {selectedItem.gridY})
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 py-6">
                <selectedItem.icon className={cn('w-20 h-20', selectedItem.color)} />

                {selectedItem.type === 'plant' && (
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Growth Stage: {selectedItem.growthStage}/4
                    </div>
                    {selectedItem.growthStage < 4 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => growPlant(selectedItem.id)}
                      >
                        <Sprout className="w-4 h-4 mr-2" />
                        Grow (Test)
                      </Button>
                    )}
                    {selectedItem.growthStage === 4 && !selectedItem.isHarvested && (
                      <Button onClick={() => harvestItem(selectedItem.id)}>
                        Harvest (+15 coins)
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => removeItem(selectedItem.id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
