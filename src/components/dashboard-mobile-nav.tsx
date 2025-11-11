"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Utensils,
  Sparkles,
  Menu,
  X,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RootedLogo } from './rooted-logo';
import { Button } from './ui/button';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    iconColor: undefined,
  },
  {
    title: 'Cycle',
    href: '/cycle',
    icon: Heart,
    iconColor: 'hsl(var(--icon-cycle))', // Sage green
  },
  {
    title: 'Workouts',
    href: '/workout',
    icon: Activity,
    iconColor: 'hsl(var(--icon-workout))', // Brown
  },
  {
    title: 'Nutrition',
    href: '/nutrition',
    icon: Utensils,
    iconColor: 'hsl(var(--icon-nutrition))', // Navy
  },
  {
    title: 'Rituals',
    href: '/rituals',
    icon: Sparkles,
    iconColor: 'hsl(var(--icon-rituals))', // Dark green
  },
  {
    title: 'Community',
    href: '/community',
    icon: Users,
    iconColor: 'hsl(var(--icon-community))', // Light beige
  },
];

export function DashboardMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <RootedLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      {/* Tree Roots Mobile Menu - Growing from Top Right Corner */}
      {isOpen && (
        <>
          {/* Black Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Realistic Tree Root SVG - Inspired by Natural Root Systems - Spreading Across Screen */}
          <svg
            className="lg:hidden fixed inset-0 w-full h-full pointer-events-none z-45"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Natural wood texture gradient */}
              <linearGradient id="root-wood-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1410" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#2d1f1a" stopOpacity="0.90" />
                <stop offset="60%" stopColor="#1a1410" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#0d0805" stopOpacity="0.92" />
              </linearGradient>

              <linearGradient id="root-wood-2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1410" stopOpacity="0.88" />
                <stop offset="50%" stopColor="#2d1f1a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1a1410" stopOpacity="0.82" />
              </linearGradient>

              <linearGradient id="root-wood-thin" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a1410" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#3d2d24" stopOpacity="0.80" />
                <stop offset="100%" stopColor="#1a1410" stopOpacity="0.72" />
              </linearGradient>

              {/* Organic root node */}
              <radialGradient id="root-node">
                <stop offset="0%" stopColor="#2d1f1a" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#1a1410" stopOpacity="0.70" />
                <stop offset="100%" stopColor="#0d0805" stopOpacity="0.30" />
              </radialGradient>
            </defs>

            {/* ORIGIN: Top Right Corner (95, 3) - Natural spread pattern like real tree roots */}

            {/* ===== MAIN CENTRAL ROOT - Thick, twisting downward ===== */}
            <path
              d="M 95 3 C 93 8, 92 13, 90 18 C 88 24, 85 30, 82 36 C 79 43, 75 50, 71 57 C 68 63, 64 70, 60 77 C 57 83, 53 89, 50 95"
              stroke="url(#root-wood-1)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow"
              opacity="0.92"
            />
            <path
              d="M 95.5 3 C 93.5 8, 92.5 13, 90.5 18 C 88.5 24, 85.5 30, 82.5 36 C 79.5 43, 75.5 50, 71.5 57 C 68.5 63, 64.5 70, 60.5 77 C 57.5 83, 53.5 89, 50.5 95"
              stroke="#000000"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow"
              opacity="0.85"
            />

            {/* ===== MAJOR LATERAL ROOT - Spreading left horizontally ===== */}
            <path
              d="M 93 6 C 86 9, 78 11, 70 13 C 60 15, 48 17, 36 19 C 26 21, 15 23, 5 26"
              stroke="url(#root-wood-1)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.90"
            />
            <path
              d="M 93.5 6.5 C 86.5 9.5, 78.5 11.5, 70.5 13.5 C 60.5 15.5, 48.5 17.5, 36.5 19.5 C 26.5 21.5, 15.5 23.5, 5.5 26.5"
              stroke="#000000"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.82"
            />

            {/* ===== THICK DIAGONAL ROOT - Spreading left and down ===== */}
            <path
              d="M 91 12 C 82 18, 72 24, 62 30 C 50 37, 37 44, 25 51 C 16 57, 8 64, 2 72"
              stroke="url(#root-wood-1)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-150"
              opacity="0.88"
            />
            <path
              d="M 91.5 12.5 C 82.5 18.5, 72.5 24.5, 62.5 30.5 C 50.5 37.5, 37.5 44.5, 25.5 51.5 C 16.5 57.5, 8.5 64.5, 2.5 72.5"
              stroke="#000000"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-150"
              opacity="0.80"
            />

            {/* ===== CURVING ROOT - Wide horizontal sweep ===== */}
            <path
              d="M 88 20 C 75 23, 62 25, 48 27 C 35 29, 22 32, 10 36 C 5 38, 2 41, 0 45"
              stroke="url(#root-wood-2)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-200"
              opacity="0.85"
            />

            {/* ===== SNAKING ROOT - Organic curve pattern ===== */}
            <path
              d="M 85 28 C 73 33, 61 37, 49 41 C 38 45, 27 50, 17 56 C 10 60, 4 66, 1 73"
              stroke="url(#root-wood-2)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-250"
              opacity="0.82"
            />

            {/* ===== LOWER SPREADING ROOT ===== */}
            <path
              d="M 75 50 C 62 56, 49 61, 36 66 C 25 70, 14 75, 5 82"
              stroke="url(#root-wood-2)"
              strokeWidth="1.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-300"
              opacity="0.80"
            />

            {/* ===== DELICATE WISPY TENDRILS - Fine roots spreading ===== */}
            <path
              d="M 92 8 C 84 10, 76 11, 68 12 C 58 13, 47 14, 36 16 C 27 17, 18 19, 10 22"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-80"
              opacity="0.70"
            />

            <path
              d="M 89 16 C 78 20, 67 23, 55 26 C 43 29, 31 33, 20 38 C 12 42, 5 47, 1 53"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-180"
              opacity="0.68"
            />

            <path
              d="M 83 35 C 70 40, 56 44, 42 48 C 30 52, 18 57, 8 64"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-220"
              opacity="0.65"
            />

            <path
              d="M 78 44 C 65 49, 51 54, 37 59 C 25 63, 14 69, 5 77"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-280"
              opacity="0.62"
            />

            <path
              d="M 70 60 C 56 66, 41 71, 27 77 C 17 81, 8 87, 2 95"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-320"
              opacity="0.60"
            />

            {/* ===== ADDITIONAL BRANCHING ROOTS - Creating density ===== */}
            <path
              d="M 80 38 C 68 42, 55 45, 42 49 C 30 52, 18 57, 8 63"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-260"
              opacity="0.65"
            />

            <path
              d="M 65 65 C 52 70, 38 75, 24 81 C 15 85, 7 91, 2 98"
              stroke="url(#root-wood-thin)"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-350"
              opacity="0.58"
            />

            {/* ===== VERY FINE ROOT HAIRS - Delicate spread ===== */}
            <path
              d="M 90 10 C 81 12, 72 13, 62 14 C 51 15, 39 17, 28 20"
              stroke="#1a1410"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-120"
              opacity="0.55"
            />

            <path
              d="M 86 24 C 74 28, 62 31, 49 35 C 37 38, 25 43, 14 49"
              stroke="#1a1410"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-240"
              opacity="0.52"
            />

            <path
              d="M 72 55 C 58 61, 44 66, 30 72 C 19 76, 9 82, 3 90"
              stroke="#1a1410"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-340"
              opacity="0.50"
            />

            {/* ===== NATURAL ROOT NODES - Junction points ===== */}
            <ellipse cx="91" cy="12" rx="1.1" ry="0.9" fill="url(#root-node)" className="animate-root-pulse animation-delay-150" opacity="0.85" />
            <ellipse cx="88" cy="20" rx="0.95" ry="0.8" fill="url(#root-node)" className="animate-root-pulse animation-delay-200" opacity="0.80" />
            <ellipse cx="85" cy="28" rx="0.85" ry="0.75" fill="url(#root-node)" className="animate-root-pulse animation-delay-250" opacity="0.75" />
            <ellipse cx="82" cy="36" rx="0.8" ry="0.7" fill="url(#root-node)" className="animate-root-pulse animation-delay-300" opacity="0.72" />
            <ellipse cx="75" cy="50" rx="0.75" ry="0.65" fill="url(#root-node)" className="animate-root-pulse animation-delay-350" opacity="0.68" />
            <ellipse cx="70" cy="60" rx="0.7" ry="0.6" fill="url(#root-node)" className="animate-root-pulse animation-delay-400" opacity="0.65" />

            {/* Small junction nodes */}
            <circle cx="80" cy="38" r="0.55" fill="url(#root-node)" className="animate-root-pulse animation-delay-220" opacity="0.70" />
            <circle cx="65" cy="65" r="0.5" fill="url(#root-node)" className="animate-root-pulse animation-delay-320" opacity="0.65" />
            <circle cx="50" cy="41" r="0.45" fill="url(#root-node)" className="animate-root-pulse animation-delay-280" opacity="0.62" />
            <circle cx="36" cy="66" r="0.4" fill="url(#root-node)" className="animate-root-pulse animation-delay-360" opacity="0.60" />
          </svg>

          {/* Individual Menu Item Cards - Floating Down from Right */}
          <div className="lg:hidden fixed top-[80px] right-4 z-50 space-y-3 w-[280px] max-w-[calc(100vw-2rem)]">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200',
                    'bg-white shadow-bloom hover:shadow-bloom-lg hover:scale-[1.03]',
                    'animate-root-item border-2',
                    `animation-delay-${150 + index * 60}`,
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black/30'
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-all",
                    isActive
                      ? "bg-white/20"
                      : "bg-muted/30"
                  )}>
                    <Icon
                      className="w-6 h-6 flex-shrink-0"
                      style={!isActive && item.iconColor ? { color: item.iconColor } : undefined}
                    />
                  </div>
                  <span className="font-semibold text-base">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-1 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 flex-1 min-w-0',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon
                  className="w-5 h-5 flex-shrink-0"
                  style={!isActive && item.iconColor ? { color: item.iconColor } : undefined}
                />
                <span className="text-xs font-medium truncate w-full text-center">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
