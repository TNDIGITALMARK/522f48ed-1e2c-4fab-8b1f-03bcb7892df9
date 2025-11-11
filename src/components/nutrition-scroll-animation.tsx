"use client";

import { motion } from 'framer-motion';

// Line-art food icon components inspired by the reference image
// Baby-sized icons for visually appealing presentation
const FoodIcon = ({ path, viewBox = "0 0 24 24" }: { path: string; viewBox?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-foreground/70"
  >
    {path}
  </svg>
);

// Extensive collection of line-art food icons based on reference image
const FOOD_ICONS = [
  // Row 1 - Fruits & Vegetables
  { id: 'apple', path: <path d="M12 2.5c-1.5 0-2.5 1-2.5 2.5 0 0-1 0-1.5.5s-.5 1.5-.5 2.5c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5c0-1-.5-2-.5-2.5s-1-.5-1.5-.5c0-1.5-1-2.5-2.5-2.5zm0 0c0-1-1-1.5-1-1.5M16 6c.5-.5 1-.5 1-.5" /> },
  { id: 'banana', path: <path d="M4 14c0-4 2-7 5-9 1-1 2-1.5 3-1.5s2 .5 3 1.5c1.5 1 2.5 2.5 2.5 4.5 0 3-2 5.5-4.5 7-1 .5-2 1-3 1-2.5 0-4.5-1-5.5-2.5-.5-.5-.5-1-.5-1z" /> },
  { id: 'carrot', path: <path d="M9 4l1 1M5 8l1 1M20 12c-3 3-8 7-11 8-2 0-3-1-3-3 1-3 5-8 8-11 1-1 2-1 3 0l3 3c1 1 1 2 0 3z" /> },
  { id: 'broccoli', path: <path d="M8 18v3M16 18v3M12 2c3 0 5 2 5 5 0 1-.5 2-1 3h1c1 0 2 1 2 2 0 2-1 3-3 3H8c-2 0-3-1-3-3 0-1 1-2 2-2h1c-.5-1-1-2-1-3 0-3 2-5 5-5z" /> },
  { id: 'tomato', path: <path d="M12 3c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zM12 3v-2M10 3l-1-2M14 3l1-2" /> },
  { id: 'pepper', path: <path d="M12 2v3M12 5c-3 0-5 2-5 5v5c0 2 1 3 3 3h4c2 0 3-1 3-3v-5c0-3-2-5-5-5zM8 10h8" /> },
  { id: 'onion', path: <path d="M12 3c-3 0-5 2-5 5v3c0 3 2 5 5 5s5-2 5-5V8c0-3-2-5-5-5zM12 3V1M9 6c.5-1 1.5-1.5 3-1.5S14.5 5 15 6" /> },
  { id: 'garlic', path: <path d="M12 2c-2 0-3 1-3 3v3c0 2 1 3 3 3s3-1 3-3V5c0-2-1-3-3-3zM12 11v10M9 15l3-4 3 4" /> },

  // Row 2 - Dairy & Protein
  { id: 'milk', path: <path d="M6 2h12v6l-2 14H8L6 8V2zM6 8h12M9 5h6" /> },
  { id: 'cheese', path: <path d="M3 8l9-5 9 5v8c0 2-1 3-3 3H6c-2 0-3-1-3-3V8zM8 12h1M12 14h1M15 11h1M9 16h1" /> },
  { id: 'egg', path: <path d="M12 3c-3 0-5 3-5 7s2 7 5 7 5-3 5-7-2-7-5-7z" /> },
  { id: 'chicken', path: <path d="M8 8c0-2 2-4 4-4s4 2 4 4M8 8v4c0 2 2 4 4 4s4-2 4-4V8M8 8H6M16 8h2M10 16v5M14 16v5" /> },
  { id: 'fish', path: <path d="M3 12h10l5-3v6l-5-3H3zM13 9l2-2M13 15l2 2M3 10v4M7 12h2" /> },
  { id: 'meat', path: <path d="M4 6h16v12H4V6zM8 6v12M12 6v12M16 6v12M4 10h16M4 14h16" /> },
  { id: 'bacon', path: <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /> },

  // Row 3 - Grains & Bread
  { id: 'bread', path: <path d="M4 8h16c1 0 2 1 2 2v8c0 1-1 2-2 2H4c-1 0-2-1-2-2v-8c0-1 1-2 2-2zM4 8c0-2 2-4 4-4h8c2 0 4 2 4 4" /> },
  { id: 'croissant', path: <path d="M4 14c0-3 2-6 5-8 1-1 2-1 3-1s2 0 3 1c3 2 5 5 5 8 0 2-1 3-3 4-1 1-3 1-5 1s-4 0-5-1c-2-1-3-2-3-4z" /> },
  { id: 'pizza', path: <><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" /></> },
  { id: 'pasta', path: <path d="M3 10c3 0 3-3 6-3s3 3 6 3 3-3 6-3M3 14c3 0 3-3 6-3s3 3 6 3 3-3 6-3M3 18c3 0 3-3 6-3s3 3 6 3 3-3 6-3" /> },
  { id: 'rice', path: <path d="M8 8V5M12 8V4M16 8V5M6 8h12v10c0 1-1 2-2 2h-8c-1 0-2-1-2-2V8z" /> },
  { id: 'cereal', path: <path d="M8 6h8v12H8V6zM6 10h12M8 14h8M10 6V4M14 6V4" /> },

  // Row 4 - Beverages
  { id: 'coffee', path: <path d="M6 8h12v8c0 2-2 4-4 4h-4c-2 0-4-2-4-4V8zM6 8V6c0-1 1-2 2-2h8c1 0 2 1 2 2v2M18 10h2c1 0 2 1 2 2s-1 2-2 2h-2" /> },
  { id: 'tea', path: <path d="M6 8h10v7c0 2-1 3-3 3h-4c-2 0-3-1-3-3V8zM6 8V7c0-1 1-2 2-2h6c1 0 2 1 2 2v1M16 10h3c1 0 2 1 2 2s-1 2-2 2h-3M10 2l2 3M14 2l-2 3" /> },
  { id: 'juice', path: <path d="M8 2h8l1 18H7L8 2zM8 8h8M10 2h4" /> },
  { id: 'water', path: <path d="M12 2c-4 4-6 8-6 12 0 3 2 6 6 6s6-3 6-6c0-4-2-8-6-12z" /> },
  { id: 'smoothie', path: <path d="M6 8h12l-1 10c0 1-1 2-2 2H9c-1 0-2-1-2-2L6 8zM7 3h10l1 5H6l1-5zM10 3l1 5M14 3l-1 5" /> },
  { id: 'wine', path: <path d="M8 2h8v6c0 2-2 4-4 4s-4-2-4-4V2zM12 12v10M9 22h6" /> },

  // Row 5 - Snacks & Sweets
  { id: 'cookie', path: <><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /><circle cx="12" cy="14" r="1" fill="currentColor" /><circle cx="9" cy="15" r="1" fill="currentColor" /><circle cx="15" cy="15" r="1" fill="currentColor" /></> },
  { id: 'cake', path: <path d="M4 15h16v5c0 1-1 2-2 2H6c-1 0-2-1-2-2v-5zM4 15l2-8h12l2 8M8 7V4M12 7V3M16 7V4M4 11h16" /> },
  { id: 'donut', path: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M8 6l1 1M16 6l-1 1M18 12h-1M6 12h1M16 18l-1-1M8 18l1-1" /></> },
  { id: 'icecream', path: <path d="M8 10c0-2 2-4 4-4s4 2 4 4M8 10v1c0 2 2 4 4 4s4-2 4-4v-1M12 15l-2 7h4l-2-7" /> },
  { id: 'candy', path: <path d="M8 8l8 8M8 16l8-8M6 6c-1 1-1 3 0 4l8 8c1 1 3 1 4 0s1-3 0-4l-8-8c-1-1-3-1-4 0z" /> },
  { id: 'chocolate', path: <path d="M4 4h16v16H4V4zM12 4v16M4 12h16M8 4v16M16 4v16M4 8h16M4 16h16" /> },

  // Row 6 - Additional items
  { id: 'avocado', path: <><path d="M12 3c-4 0-7 3-7 7v4c0 3 2 5 5 5h4c3 0 5-2 5-5v-4c0-4-3-7-7-7z" /><circle cx="12" cy="13" r="2" /></> },
  { id: 'pineapple', path: <path d="M8 2l1 2M12 2v2M16 2l-1 2M7 6h10c1 0 2 1 2 2v8c0 3-2 5-5 5h-4c-3 0-5-2-5-5V8c0-1 1-2 2-2z" /> },
  { id: 'strawberry', path: <path d="M12 3l-7 7c0 4 3 7 7 7s7-3 7-7l-7-7zM9 3h6M10 8h1M13 8h1M10 11h1M13 11h1M11 14h2" /> },
  { id: 'lemon', path: <><circle cx="12" cy="12" r="8" /><path d="M18 6l2-2M6 6L4 4M12 12V8M12 12h4" /></> },
  { id: 'orange', path: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16M8 7l8 10M16 7L8 17" /></> },
  { id: 'grapes', path: <><circle cx="12" cy="10" r="2" /><circle cx="9" cy="13" r="2" /><circle cx="15" cy="13" r="2" /><circle cx="10" cy="16" r="2" /><circle cx="14" cy="16" r="2" /><path d="M12 8V4M11 4h2" /></> },
  { id: 'watermelon', path: <><path d="M3 15c0-5 4-9 9-9s9 4 9 9H3z" /><path d="M7 11l2 2M12 10l1 2M17 11l-2 2M9 15h1M12 14h1M15 15h1" /></> },
  { id: 'kiwi', path: <><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8M9 9l6 6M15 9l-6 6M10 7l1 1M14 7l-1 1M7 10l1 1M17 10l-1 1" /></> },

  // Row 7 - More variety
  { id: 'corn', path: <><path d="M8 4h8c1 0 2 1 2 2v12c0 1-1 2-2 2H8c-1 0-2-1-2-2V6c0-1 1-2 2-2z" /><path d="M10 7v10M14 7v10M8 10h8M8 14h8" /></> },
  { id: 'mushroom', path: <><path d="M12 6c-4 0-7 2-7 5h14c0-3-3-5-7-5z" /><path d="M10 11v8h4v-8" /></> },
  { id: 'nuts', path: <><path d="M7 10c-1 1-1 3 0 4s3 1 4 0l4-4c1-1 1-3 0-4s-3-1-4 0l-4 4z" /><path d="M13 18c1-1 1-3 0-4s-3-1-4 0l-4 4c-1 1-1 3 0 4s3 1 4 0l4-4z" /></> },
  { id: 'salad', path: <><path d="M3 15h18v3c0 1-1 2-2 2H5c-1 0-2-1-2-2v-3z" /><path d="M6 15C6 9 9 5 12 5s6 4 6 10M9 11c1-2 2-3 3-3s2 1 3 3" /></> },
  { id: 'burger', path: <><path d="M4 14h16M4 18h16c1 0 2-1 2-2H2c0 1 1 2 2 2z" /><path d="M20 8H4c0-3 2-5 5-5h6c3 0 5 2 5 5z" /><circle cx="8" cy="11" r="0.5" fill="currentColor" /><circle cx="12" cy="11" r="0.5" fill="currentColor" /><circle cx="16" cy="11" r="0.5" fill="currentColor" /></> },
  { id: 'hotdog', path: <><path d="M4 12c0-2 1-3 3-3h10c2 0 3 1 3 3s-1 3-3 3H7c-2 0-3-1-3-3z" /><path d="M6 10l12 4M6 14l12-4" /></> },
  { id: 'taco', path: <><path d="M4 18c0-6 3-10 8-10s8 4 8 10H4z" /><path d="M8 14h8M10 11h4M9 17h6" /></> },
  { id: 'sushi', path: <><rect x="4" y="10" width="16" height="4" rx="1" /><circle cx="8" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="16" cy="12" r="1.5" fill="currentColor" /></> },
];

export function NutritionScrollAnimation() {
  // Create 3 rows with different icon sets
  const row1Icons = FOOD_ICONS.slice(0, 15);
  const row2Icons = FOOD_ICONS.slice(15, 30);
  const row3Icons = FOOD_ICONS.slice(30, 45);

  // Duplicate arrays for seamless looping
  const row1Complete = [...row1Icons, ...row1Icons, ...row1Icons];
  const row2Complete = [...row2Icons, ...row2Icons, ...row2Icons];
  const row3Complete = [...row3Icons, ...row3Icons, ...row3Icons];

  return (
    <div className="w-full relative -mx-6">
      {/* Full-width container - clean background without gradient */}
      <div className="relative py-8 overflow-hidden"
           style={{ backgroundColor: 'transparent' }}>

        {/* Row 1 - Scroll left to right */}
        <div className="relative h-16 overflow-hidden mb-4">
          <motion.div
            className="absolute flex items-center gap-12 whitespace-nowrap"
            animate={{
              x: ['-33.33%', '0%'],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              willChange: 'transform',
            }}
          >
            {row1Complete.map((food, index) => (
              <div
                key={`row1-${food.id}-${index}`}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <FoodIcon path={food.path} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Scroll right to left (opposite direction) */}
        <div className="relative h-16 overflow-hidden mb-4">
          <motion.div
            className="absolute flex items-center gap-12 whitespace-nowrap"
            animate={{
              x: ['0%', '-33.33%'],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              willChange: 'transform',
            }}
          >
            {row2Complete.map((food, index) => (
              <div
                key={`row2-${food.id}-${index}`}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <FoodIcon path={food.path} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 3 - Scroll left to right (medium speed) */}
        <div className="relative h-16 overflow-hidden">
          <motion.div
            className="absolute flex items-center gap-12 whitespace-nowrap"
            animate={{
              x: ['-33.33%', '0%'],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              willChange: 'transform',
            }}
          >
            {row3Complete.map((food, index) => (
              <div
                key={`row3-${food.id}-${index}`}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <FoodIcon path={food.path} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Magnifying glass overlay - searching effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary/30 drop-shadow-lg"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            {/* Scanning beam effect inside magnifying glass */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
