"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface FoodItem {
  id: string;
  emoji: string;
  name: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { id: '1', emoji: '🥑', name: 'Avocado' },
  { id: '2', emoji: '🥗', name: 'Salad' },
  { id: '3', emoji: '🍓', name: 'Strawberry' },
  { id: '4', emoji: '🥦', name: 'Broccoli' },
  { id: '5', emoji: '🍎', name: 'Apple' },
  { id: '6', emoji: '🥕', name: 'Carrot' },
  { id: '7', emoji: '🫐', name: 'Blueberries' },
  { id: '8', emoji: '🥜', name: 'Nuts' },
  { id: '9', emoji: '🍊', name: 'Orange' },
  { id: '10', emoji: '🥒', name: 'Cucumber' },
  { id: '11', emoji: '🍌', name: 'Banana' },
  { id: '12', emoji: '🥬', name: 'Leafy Greens' },
  { id: '13', emoji: '🫑', name: 'Bell Pepper' },
  { id: '14', emoji: '🍇', name: 'Grapes' },
  { id: '15', emoji: '🥚', name: 'Egg' },
  { id: '16', emoji: '🍋', name: 'Lemon' },
  { id: '17', emoji: '🍅', name: 'Tomato' },
  { id: '18', emoji: '🥝', name: 'Kiwi' },
  { id: '19', emoji: '🌽', name: 'Corn' },
  { id: '20', emoji: '🥔', name: 'Potato' },
  { id: '21', emoji: '🍠', name: 'Sweet Potato' },
];

export function FoodSearchAnimation() {
  const [magnifierX, setMagnifierX] = useState(0);

  // Continuous magnifier horizontal movement
  useEffect(() => {
    const interval = setInterval(() => {
      setMagnifierX(Math.random() * 80 + 10); // Random position between 10-90%
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Split items into 3 rows
  const itemsPerRow = 7;
  const row1Items = [...FOOD_ITEMS.slice(0, itemsPerRow), ...FOOD_ITEMS.slice(0, itemsPerRow)]; // Duplicate for seamless loop
  const row2Items = [...FOOD_ITEMS.slice(itemsPerRow, itemsPerRow * 2), ...FOOD_ITEMS.slice(itemsPerRow, itemsPerRow * 2)];
  const row3Items = [...FOOD_ITEMS.slice(itemsPerRow * 2), ...FOOD_ITEMS.slice(itemsPerRow * 2)];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 via-background to-muted/30 border border-border/40">
      {/* Calming background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-textile-subtle" />
      </div>

      {/* Container for 3 rows */}
      <div className="relative py-8 space-y-4">
        {/* Row 1 - Scrolling left to right */}
        <div className="relative h-16 overflow-hidden">
          <motion.div
            className="absolute flex items-center gap-8"
            animate={{
              x: ['-50%', '0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              willChange: 'transform',
            }}
          >
            {row1Items.map((food, index) => (
              <motion.div
                key={`row1-${food.id}-${index}`}
                className="flex-shrink-0 text-5xl select-none"
                style={{
                  filter: 'grayscale(100%) contrast(1.2)',
                  opacity: 0.7,
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              >
                {food.emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Scrolling right to left (slower) */}
        <div className="relative h-16 overflow-hidden">
          <motion.div
            className="absolute flex items-center gap-8"
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              willChange: 'transform',
            }}
          >
            {row2Items.map((food, index) => (
              <motion.div
                key={`row2-${food.id}-${index}`}
                className="flex-shrink-0 text-5xl select-none"
                style={{
                  filter: 'grayscale(100%) contrast(1.2)',
                  opacity: 0.7,
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              >
                {food.emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Row 3 - Scrolling left to right (medium speed) */}
        <div className="relative h-16 overflow-hidden">
          <motion.div
            className="absolute flex items-center gap-8"
            animate={{
              x: ['-50%', '0%'],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              willChange: 'transform',
            }}
          >
            {row3Items.map((food, index) => (
              <motion.div
                key={`row3-${food.id}-${index}`}
                className="flex-shrink-0 text-5xl select-none"
                style={{
                  filter: 'grayscale(100%) contrast(1.2)',
                  opacity: 0.7,
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              >
                {food.emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Magnifying glass overlay - moves horizontally */}
        <motion.div
          className="absolute top-1/2 pointer-events-none z-10"
          style={{
            left: '10%',
          }}
          animate={{
            x: `${magnifierX}vw`,
            y: '-50%',
          }}
          transition={{
            x: { duration: 2.5, ease: 'easeInOut' },
            y: { duration: 0 },
          }}
        >
          {/* Magnifying glass lens */}
          <div className="relative">
            {/* Main lens circle */}
            <motion.div
              className="w-28 h-28 rounded-full border-4 border-foreground/60 bg-background/20 backdrop-blur-sm shadow-lg"
              animate={{
                scale: [1, 1.08, 1],
                borderColor: [
                  'hsl(var(--foreground) / 0.6)',
                  'hsl(var(--foreground) / 0.8)',
                  'hsl(var(--foreground) / 0.6)',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Inner lens highlight for depth */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-background/60 to-transparent" />

              {/* Search icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-10 h-10 text-foreground/70" strokeWidth={2.5} />
              </div>

              {/* Gentle scanning effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, hsl(var(--foreground) / 0.15) 15%, transparent 30%)',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>

            {/* Magnifying glass handle */}
            <motion.div
              className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-14 bg-foreground/60 rounded-full origin-top shadow-md"
              animate={{
                rotate: [-8, 8, -8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Subtle sparkle effects */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-foreground/40 rounded-full"
                style={{
                  top: `${Math.sin((i * Math.PI * 2) / 4) * 55 + 50}%`,
                  left: `${Math.cos((i * Math.PI * 2) / 4) * 55 + 50}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom text overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center px-4">
        <motion.p
          className="text-sm font-medium text-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          AI learning your nutrition patterns...
        </motion.p>
      </div>
    </div>
  );
}
