"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Coins, Flower2, Sparkles, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiftOption {
  id: string;
  type: 'coins' | 'seeds' | 'decoration' | 'boost';
  name: string;
  description: string;
  value: number;
  cost: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const GIFT_OPTIONS: GiftOption[] = [
  {
    id: '1',
    type: 'coins',
    name: '50 Coins',
    description: 'Help your friend grow their garden',
    value: 50,
    cost: 25,
    icon: Coins,
    color: 'text-yellow-500',
  },
  {
    id: '2',
    type: 'seeds',
    name: 'Flower Seeds Pack',
    description: 'Assorted flower seeds',
    value: 5,
    cost: 15,
    icon: Flower2,
    color: 'text-pink-500',
  },
  {
    id: '3',
    type: 'decoration',
    name: 'Garden Decoration',
    description: 'Beautiful garden ornament',
    value: 1,
    cost: 30,
    icon: Sparkles,
    color: 'text-purple-500',
  },
  {
    id: '4',
    type: 'boost',
    name: '24hr Growth Boost',
    description: 'Speed up plant growth',
    value: 1,
    cost: 40,
    icon: Heart,
    color: 'text-red-500',
  },
];

interface SendGiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendName: string;
  userCoins: number;
  onSend?: (gift: GiftOption, message: string) => void;
}

export function SendGiftDialog({
  open,
  onOpenChange,
  friendName,
  userCoins,
  onSend,
}: SendGiftDialogProps) {
  const [selectedGift, setSelectedGift] = useState<GiftOption | null>(null);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!selectedGift) return;

    if (userCoins < selectedGift.cost) {
      alert('Not enough coins!');
      return;
    }

    onSend?.(selectedGift, message);
    setSelectedGift(null);
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Send Gift to {friendName}
          </DialogTitle>
          <DialogDescription>
            Choose a gift to send to your friend. You have {userCoins} coins.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {GIFT_OPTIONS.map((gift) => (
              <Card
                key={gift.id}
                className={cn(
                  'p-4 cursor-pointer transition-all',
                  selectedGift?.id === gift.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:shadow-md',
                  userCoins < gift.cost && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => userCoins >= gift.cost && setSelectedGift(gift)}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      <gift.icon className={cn('w-6 h-6', gift.color)} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{gift.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {gift.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="gap-1">
                      <Coins className="w-3 h-3" />
                      {gift.cost}
                    </Badge>
                    {selectedGift?.id === gift.id && (
                      <Badge className="gap-1 bg-primary">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedGift && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Add a personal message (optional)
              </label>
              <Textarea
                placeholder="Write a nice message to your friend..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedGift || userCoins < (selectedGift?.cost || 0)}
            className="gap-2"
          >
            <Gift className="w-4 h-4" />
            Send Gift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
