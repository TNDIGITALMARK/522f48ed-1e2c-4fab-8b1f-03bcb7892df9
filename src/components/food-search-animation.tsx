"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface FoodItem {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
  delay: number;
}

const FOOD_ITEMS: Omit<FoodItem, 'x' | 'y' | 'delay'>[] = [
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
];

export function FoodSearchAnimation() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [animationPhase, setAnimationPhase] = useState(0);

  // Initialize food positions randomly
  useEffect(() => {
    const items = FOOD_ITEMS.map((item, index) => ({
      ...item,
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 80 + 10, // 10-90% of container height
      delay: index * 0.1,
    }));
    setFoodItems(items);

    // Animation sequence
    const phase1 = setTimeout(() => setAnimationPhase(1), 500);
    const phase2 = setTimeout(() => setAnimationPhase(2), 2000);
    const phase3 = setTimeout(() => setAnimationPhase(3), 4000);

    // Continuous magnifier movement
    const magnifierInterval = setInterval(() => {
      setMagnifierPosition({
        x: Math.random() * 70 + 15,
        y: Math.random() * 70 + 15,
      });
    }, 2000);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearInterval(magnifierInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl overflow-hidden border border-border/50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-textile-subtle" />
      </div>

      {/* Animated food items */}
      <AnimatePresence>
        {foodItems.map((food) => (
          <motion.div
            key={food.id}
            className="absolute text-4xl md:text-5xl select-none"
            initial={{
              opacity: 0,
              scale: 0,
              x: `${food.x}%`,
              y: `${food.y}%`,
            }}
            animate={{
              opacity: animationPhase >= 1 ? 1 : 0,
              scale: animationPhase >= 1 ? 1 : 0,
              x: `${food.x}%`,
              y: `${food.y}%`,
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              opacity: { delay: food.delay, duration: 0.4 },
              scale: { delay: food.delay, duration: 0.4, type: 'spring' },
              rotate: {
                delay: food.delay + 0.5,
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            {food.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Magnifying glass overlay */}
      <AnimatePresence>
        {animationPhase >= 2 && (
          <motion.div
            className="absolute pointer-events-none"
            initial={{
              opacity: 0,
              scale: 0,
              x: '50%',
              y: '50%',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: `${magnifierPosition.x}%`,
              y: `${magnifierPosition.y}%`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3, type: 'spring' },
              x: { duration: 1.5, ease: 'easeInOut' },
              y: { duration: 1.5, ease: 'easeInOut' },
            }}
          >
            {/* Magnifying glass lens */}
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              {/* Lens circle */}
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary bg-background/10 backdrop-blur-sm"
                animate={{
                  scale: [1, 1.05, 1],
                  borderColor: [
                    'hsl(var(--primary))',
                    'hsl(var(--secondary))',
                    'hsl(var(--primary))',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Inner lens highlight */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />

                {/* Search icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 md:w-10 md:h-10 text-primary" strokeWidth={2.5} />
                </div>

                {/* Scanning effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, hsl(var(--primary) / 0.3) 10%, transparent 20%)',
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>

              {/* Magnifying glass handle */}
              <motion.div
                className="absolute top-full left-1/2 w-1 h-12 md:h-16 bg-primary rounded-full origin-top"
                style={{
                  transformOrigin: 'top center',
                }}
                animate={{
                  rotate: [-10, 10, -10],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Sparkle effects around magnifier */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    top: `${Math.sin((i * Math.PI * 2) / 3) * 50 + 50}%`,
                    left: `${Math.cos((i * Math.PI * 2) / 3) * 50 + 50}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning beam effect */}
      <AnimatePresence>
        {animationPhase >= 3 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.2) 50%, transparent 100%)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center px-4">
        <motion.p
          className="text-sm md:text-base font-medium text-foreground/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: animationPhase >= 3 ? 1 : 0, y: animationPhase >= 3 ? 0 : 10 }}
          transition={{ delay: 0.5 }}
        >
          AI analyzing your food preferences...
        </motion.p>
      </div>
    </div>
  );
}
