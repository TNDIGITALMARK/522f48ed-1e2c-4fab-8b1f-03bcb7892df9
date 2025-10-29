"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Leaf, Flower2, Home, Fence, Plus, X, Sprout, TreeDeciduous,
  Droplets, Sun, Zap, Package, Sparkles, Award, Clock, Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TreeOfWisdom } from './tree-of-wisdom';

interface PlantCareStats {
  water: number; // 0-100
  sunlight: number; // 0-100
  fertilizer: number; // 0-100
  lastWatered: number;
  lastFertilized: number;
}

interface GardenItem {
  id: string;
  type: 'plant' | 'building' | 'decoration' | 'wisdom';
  name: string;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  growthStage: number; // 0-4 for plants
  careStats?: PlantCareStats;
  isHarvested: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  producesCoins?: number;
  buildingLevel?: number;
  emoji?: string;
  isSpecial?: boolean;
}

interface GardenGridProps {
  gridWidth?: number;
  gridHeight?: number;
  gardenLevel: number;
  coins: number;
  onCoinsChange?: (newCoins: number) => void;
}

const AVAILABLE_ITEMS = [
  // Special - Tree of Wisdom (Featured)
  { type: 'wisdom', name: 'Tree of Wisdom', icon: Brain, color: 'text-purple-600', cost: 200, width: 3, height: 3, emoji: '🌳', isSpecial: true, description: 'Sacred tree for meditation, journaling & daily wisdom' },

  // Basic Flowers
  { type: 'plant', name: 'Sunflower', icon: Flower2, color: 'text-yellow-500', cost: 10, width: 1, height: 1, producesCoins: 25, growthTime: 120 },
  { type: 'plant', name: 'Rose Bush', icon: Flower2, color: 'text-pink-500', cost: 15, width: 1, height: 1, producesCoins: 35, growthTime: 180 },
  { type: 'plant', name: 'Flower Bed', icon: Sprout, color: 'text-purple-500', cost: 20, width: 2, height: 1, producesCoins: 50, growthTime: 150 },
  { type: 'plant', name: 'Berry Bush', icon: Leaf, color: 'text-red-500', cost: 12, width: 1, height: 1, producesCoins: 30, growthTime: 100 },

  // Fruit Trees - Higher Value
  { type: 'plant', name: 'Apple Tree', icon: TreeDeciduous, color: 'text-red-600', cost: 50, width: 2, height: 2, producesCoins: 150, growthTime: 400, emoji: '🍎' },
  { type: 'plant', name: 'Peach Tree', icon: TreeDeciduous, color: 'text-orange-400', cost: 55, width: 2, height: 2, producesCoins: 160, growthTime: 420, emoji: '🍑' },
  { type: 'plant', name: 'Cherry Tree', icon: TreeDeciduous, color: 'text-pink-600', cost: 60, width: 2, height: 2, producesCoins: 170, growthTime: 450, emoji: '🍒' },
  { type: 'plant', name: 'Orange Tree', icon: TreeDeciduous, color: 'text-orange-500', cost: 65, width: 2, height: 2, producesCoins: 180, growthTime: 480, emoji: '🍊' },
  { type: 'plant', name: 'Lemon Tree', icon: TreeDeciduous, color: 'text-yellow-400', cost: 45, width: 2, height: 2, producesCoins: 140, growthTime: 380, emoji: '🍋' },

  // Regular Trees
  { type: 'plant', name: 'Oak Tree', icon: TreeDeciduous, color: 'text-green-600', cost: 30, width: 2, height: 2, producesCoins: 80, growthTime: 300 },

  // Decorations
  { type: 'decoration', name: 'Garden Fence', icon: Fence, color: 'text-amber-700', cost: 5, width: 1, height: 1 },

  // Buildings
  { type: 'building', name: 'Greenhouse', icon: Home, color: 'text-emerald-600', cost: 100, width: 3, height: 2 },
  { type: 'building', name: 'Storage Shed', icon: Package, color: 'text-blue-600', cost: 50, width: 2, height: 2 },
  { type: 'building', name: 'Workshop', icon: Zap, color: 'text-orange-600', cost: 75, width: 2, height: 2 },
] as const;

export function EnhancedGardenGrid({ gridWidth = 12, gridHeight = 12, gardenLevel, coins, onCoinsChange }: GardenGridProps) {
  const [items, setItems] = useState<GardenItem[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GardenItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<GardenItem | null>(null);
  const [time, setTime] = useState(Date.now());
  const [showWisdomTree, setShowWisdomTree] = useState(false);

  // Simulate time passing for plant growth
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());

      // Decrease care stats over time
      setItems(prevItems =>
        prevItems.map(item => {
          if (item.type === 'plant' && item.careStats) {
            const timeSinceWater = (Date.now() - item.careStats.lastWatered) / 1000;
            const timeSinceFertilizer = (Date.now() - item.careStats.lastFertilized) / 1000;

            return {
              ...item,
              careStats: {
                ...item.careStats,
                water: Math.max(0, item.careStats.water - (timeSinceWater > 60 ? 1 : 0)),
                sunlight: Math.min(100, item.careStats.sunlight + 0.5), // Sun recharges naturally
                fertilizer: Math.max(0, item.careStats.fertilizer - (timeSinceFertilizer > 120 ? 0.5 : 0)),
              }
            };
          }
          return item;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const isOccupied = useCallback((x: number, y: number, width = 1, height = 1, excludeId?: string) => {
    return items.some((item) => {
      if (excludeId && item.id === excludeId) return false;

      return (
        x < item.gridX + item.width &&
        x + width > item.gridX &&
        y < item.gridY + item.height &&
        y + height > item.gridY
      );
    });
  }, [items]);

  const handleCellClick = (x: number, y: number) => {
    if (draggedItem) return;

    const clickedItem = items.find(
      (item) =>
        x >= item.gridX &&
        x < item.gridX + item.width &&
        y >= item.gridY &&
        y < item.gridY + item.height
    );

    if (clickedItem) {
      // Special handling for Tree of Wisdom
      if (clickedItem.type === 'wisdom') {
        setShowWisdomTree(true);
      } else {
        setSelectedItem(clickedItem);
      }
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

    const careStats = itemTemplate.type === 'plant' ? {
      water: 50,
      sunlight: 80,
      fertilizer: 0,
      lastWatered: Date.now(),
      lastFertilized: Date.now(),
    } : undefined;

    const newItem: GardenItem = {
      id: Date.now().toString(),
      type: itemTemplate.type,
      name: itemTemplate.name,
      gridX: selectedCell.x,
      gridY: selectedCell.y,
      width: itemTemplate.width,
      height: itemTemplate.height,
      growthStage: 0,
      careStats,
      isHarvested: false,
      icon: itemTemplate.icon,
      color: itemTemplate.color,
      producesCoins: itemTemplate.producesCoins,
      buildingLevel: 1,
      emoji: 'emoji' in itemTemplate ? itemTemplate.emoji : undefined,
      isSpecial: 'isSpecial' in itemTemplate ? itemTemplate.isSpecial : false,
    };

    setItems([...items, newItem]);
    onCoinsChange?.(coins - itemTemplate.cost);
    setShowItemSelector(false);
    setSelectedCell(null);
  };

  const removeItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Refund 50% of cost
      const template = AVAILABLE_ITEMS.find(t => t.name === item.name);
      if (template) {
        onCoinsChange?.(coins + Math.floor(template.cost / 2));
      }
    }
    setItems(items.filter((item) => item.id !== itemId));
    setSelectedItem(null);
  };

  const waterPlant = (itemId: string) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId && item.careStats) {
          return {
            ...item,
            careStats: {
              ...item.careStats,
              water: 100,
              lastWatered: Date.now(),
            }
          };
        }
        return item;
      })
    );
  };

  const fertilizePlant = (itemId: string) => {
    if (coins < 5) return;

    onCoinsChange?.(coins - 5);
    setItems(
      items.map((item) => {
        if (item.id === itemId && item.careStats) {
          return {
            ...item,
            careStats: {
              ...item.careStats,
              fertilizer: 100,
              lastFertilized: Date.now(),
            }
          };
        }
        return item;
      })
    );
  };

  const harvestItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || item.type !== 'plant' || item.growthStage < 4) return;

    const coinsEarned = item.producesCoins || 15;

    setItems(
      items.map((i) =>
        i.id === itemId ? { ...i, isHarvested: true, growthStage: 0, careStats: {
          water: 50,
          sunlight: 80,
          fertilizer: 0,
          lastWatered: Date.now(),
          lastFertilized: Date.now(),
        } } : i
      )
    );
    onCoinsChange?.(coins + coinsEarned);
    setSelectedItem(null);
  };

  const calculateGrowthProgress = (item: GardenItem) => {
    if (item.type !== 'plant' || !item.careStats) return 0;

    // Growth is influenced by care stats
    const careAverage = (item.careStats.water + item.careStats.sunlight + item.careStats.fertilizer) / 3;
    return careAverage;
  };

  const autoGrowPlants = useCallback(() => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.type === 'plant' && item.careStats && item.growthStage < 4) {
          const growthProgress = calculateGrowthProgress(item);

          // If care is above 60%, plant can grow
          if (growthProgress > 60 && Math.random() > 0.7) {
            return { ...item, growthStage: item.growthStage + 1 };
          }
        }
        return item;
      })
    );
  }, []);

  useEffect(() => {
    const growthInterval = setInterval(autoGrowPlants, 10000); // Check growth every 10 seconds
    return () => clearInterval(growthInterval);
  }, [autoGrowPlants]);

  const handleDragStart = (item: GardenItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
  };

  const handleDrop = (x: number, y: number) => {
    if (!draggedItem) return;

    if (!isOccupied(x, y, draggedItem.width, draggedItem.height, draggedItem.id)) {
      setItems(items.map(item =>
        item.id === draggedItem.id
          ? { ...item, gridX: x, gridY: y }
          : item
      ));
    }

    setDraggedItem(null);
  };

  const needsCare = (item: GardenItem) => {
    if (item.type !== 'plant' || !item.careStats) return false;
    return item.careStats.water < 30 || item.careStats.fertilizer < 20;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2 gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Level {gardenLevel}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2 gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            {coins} coins
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1 gap-2">
            <Sprout className="w-4 h-4 text-green-500" />
            {items.filter(i => i.type === 'plant').length} plants
          </Badge>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setSelectedCell({ x: 0, y: 0 });
            setShowItemSelector(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card className="p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-bloom">
        <div
          className="grid gap-2"
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

              const isDropTarget = draggedItem && !isOccupied(x, y, draggedItem.width, draggedItem.height, draggedItem.id);

              return (
                <div
                  key={`${x}-${y}`}
                  className={cn(
                    'garden-grid-cell aspect-square relative',
                    selectedCell?.x === x && selectedCell?.y === y && 'selected',
                    isDropTarget && 'drop-target',
                    item && 'occupied'
                  )}
                  style={{
                    gridColumn: item ? `span ${item.width}` : undefined,
                    gridRow: item ? `span ${item.height}` : undefined,
                  }}
                  onClick={() => handleCellClick(x, y)}
                  onDragOver={(e) => handleDragOver(e, x, y)}
                  onDrop={() => handleDrop(x, y)}
                >
                  {item && (
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center rounded-lg cursor-move transition-all",
                        draggedItem?.id === item.id && "dragging",
                        item.type === 'plant' && item.growthStage === 4 && "plant-interactive",
                        item.type === 'wisdom' ? "bg-gradient-to-br from-purple-100 via-indigo-100 to-violet-100 border-2 border-purple-300 shadow-lg" : "bg-white/90"
                      )}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                    >
                      {item.type === 'wisdom' ? (
                        <div className="text-center relative">
                          <div
                            className="text-6xl animate-pulse"
                            style={{
                              filter: 'drop-shadow(0 4px 8px rgba(124, 58, 237, 0.3))'
                            }}
                          >
                            {item.emoji}
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-xs font-medium text-purple-700 mt-2">Wisdom</p>
                        </div>
                      ) : item.emoji && item.growthStage >= 3 ? (
                        <div
                          className="text-4xl transition-all"
                          style={{
                            fontSize: `${2 + item.growthStage * 0.3}rem`,
                            opacity: 0.3 + item.growthStage * 0.17
                          }}
                        >
                          {item.emoji}
                        </div>
                      ) : (
                        <item.icon
                          className={cn(
                            'w-10 h-10 transition-all',
                            item.color,
                            item.type === 'plant' && item.growthStage < 4 && `opacity-${30 + item.growthStage * 15}`
                          )}
                          style={{
                            fontSize: `${1 + item.growthStage * 0.2}rem`
                          }}
                        />
                      )}

                      {item.type === 'plant' && item.careStats && (
                        <div className="text-xs mt-1 space-y-1 w-full px-2">
                          <div className="flex items-center gap-1 justify-center">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <Progress value={item.careStats.water} className="h-1 w-12" />
                          </div>
                          <div className="text-center font-medium">
                            {item.growthStage === 4 ? '🌟 Ready!' : `${item.growthStage}/4`}
                          </div>
                        </div>
                      )}

                      {needsCare(item) && (
                        <div className="care-indicator">
                          ⚠️
                        </div>
                      )}

                      {item.type === 'building' && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Lv.{item.buildingLevel}
                        </Badge>
                      )}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose an Item to Place</DialogTitle>
            <DialogDescription>
              Click on an item to place it in your garden
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {AVAILABLE_ITEMS.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  'p-4 cursor-pointer hover:shadow-bloom transition-all',
                  coins < item.cost && 'opacity-50 cursor-not-allowed',
                  'isSpecial' in item && item.isSpecial && 'bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 relative'
                )}
                onClick={() => coins >= item.cost && selectedCell && placeItem(item)}
              >
                {'isSpecial' in item && item.isSpecial && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center z-10">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  {'emoji' in item && item.emoji ? (
                    <div className="text-5xl">{item.emoji}</div>
                  ) : (
                    <item.icon className={cn('w-12 h-12', item.color)} />
                  )}
                  <div className="text-center">
                    <div className="font-medium text-sm">{item.name}</div>
                    {'description' in item && item.description && (
                      <div className="text-xs text-muted-foreground mt-1 mb-2">
                        {item.description}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {item.width}x{item.height} tiles
                    </div>
                    <Badge variant="outline" className="mt-2 gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      {item.cost}
                    </Badge>
                    {item.producesCoins && (
                      <div className="text-xs text-green-600 mt-1">
                        Earns {item.producesCoins} coins
                      </div>
                    )}
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
                <DialogTitle className="flex items-center gap-2">
                  <selectedItem.icon className={cn('w-6 h-6', selectedItem.color)} />
                  {selectedItem.name}
                </DialogTitle>
                <DialogDescription>
                  Position: ({selectedItem.gridX}, {selectedItem.gridY})
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 py-6">
                <selectedItem.icon className={cn('w-24 h-24', selectedItem.color)} />

                {selectedItem.type === 'plant' && selectedItem.careStats && (
                  <div className="w-full space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Water</span>
                          </div>
                          <span className="text-sm">{Math.round(selectedItem.careStats.water)}%</span>
                        </div>
                        <Progress value={selectedItem.careStats.water} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Sunlight</span>
                          </div>
                          <span className="text-sm">{Math.round(selectedItem.careStats.sunlight)}%</span>
                        </div>
                        <Progress value={selectedItem.careStats.sunlight} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Fertilizer</span>
                          </div>
                          <span className="text-sm">{Math.round(selectedItem.careStats.fertilizer)}%</span>
                        </div>
                        <Progress value={selectedItem.careStats.fertilizer} className="h-2" />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Growth Stage: {selectedItem.growthStage}/4
                      </div>
                      <Progress value={(selectedItem.growthStage / 4) * 100} className="h-3" />

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => waterPlant(selectedItem.id)}
                          disabled={selectedItem.careStats.water > 80}
                          className="flex-1"
                        >
                          <Droplets className="w-4 h-4 mr-2" />
                          Water
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fertilizePlant(selectedItem.id)}
                          disabled={selectedItem.careStats.fertilizer > 80 || coins < 5}
                          className="flex-1"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Fertilize (5 coins)
                        </Button>
                      </div>

                      {selectedItem.growthStage === 4 && !selectedItem.isHarvested && (
                        <Button
                          onClick={() => harvestItem(selectedItem.id)}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Harvest (+{selectedItem.producesCoins} coins)
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {selectedItem.type === 'building' && (
                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Level {selectedItem.buildingLevel}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Buildings boost nearby plant growth
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => removeItem(selectedItem.id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove (50% refund)
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tree of Wisdom Dialog */}
      <TreeOfWisdom
        open={showWisdomTree}
        onOpenChange={setShowWisdomTree}
        onComplete={() => {
          // Award coins for completing wisdom activities
          onCoinsChange?.(coins + 20);
        }}
      />
    </div>
  );
}
