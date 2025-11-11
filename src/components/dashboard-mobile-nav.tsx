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

          {/* Decorative Tree Root SVG Background - Growing from TOP RIGHT */}
          <svg
            className="lg:hidden fixed inset-0 w-full h-full pointer-events-none z-45"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* ORIGIN POINT: Top Right Corner (95, 5) */}

            {/* Main trunk growing downward from top-right */}
            <path
              d="M 95 5 Q 93 12, 90 20 T 85 35 Q 82 45, 78 55 T 70 75"
              stroke="#000000"
              strokeWidth="1.2"
              fill="none"
              className="animate-root-grow"
              vectorEffect="non-scaling-stroke"
              opacity="0.9"
            />

            {/* Primary branch extending down-left */}
            <path
              d="M 93 8 Q 85 15, 75 22 T 60 32 Q 50 38, 40 45"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
              className="animate-root-branch-1 animation-delay-100"
              vectorEffect="non-scaling-stroke"
              opacity="0.85"
            />

            {/* Secondary branch curving left */}
            <path
              d="M 90 18 Q 80 25, 65 30 T 45 38"
              stroke="#000000"
              strokeWidth="0.9"
              fill="none"
              className="animate-root-branch-2 animation-delay-150"
              vectorEffect="non-scaling-stroke"
              opacity="0.8"
            />

            {/* Thinner branch spreading far left */}
            <path
              d="M 85 30 Q 70 35, 50 40 T 25 48"
              stroke="#000000"
              strokeWidth="0.7"
              fill="none"
              className="animate-root-branch-1 animation-delay-200"
              vectorEffect="non-scaling-stroke"
              opacity="0.75"
            />

            {/* Lower spreading branch */}
            <path
              d="M 78 48 Q 65 55, 50 60 T 30 68"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              className="animate-root-branch-2 animation-delay-250"
              vectorEffect="non-scaling-stroke"
              opacity="0.7"
            />

            {/* Deep lower branch */}
            <path
              d="M 70 68 Q 55 75, 35 82 T 15 90"
              stroke="#000000"
              strokeWidth="0.6"
              fill="none"
              className="animate-root-branch-1 animation-delay-300"
              vectorEffect="non-scaling-stroke"
              opacity="0.65"
            />

            {/* Wispy upper branch to left */}
            <path
              d="M 92 10 Q 82 12, 70 14 T 50 18"
              stroke="#000000"
              strokeWidth="0.5"
              fill="none"
              className="animate-root-grow animation-delay-80"
              vectorEffect="non-scaling-stroke"
              opacity="0.6"
            />

            {/* Fine tendril reaching far down */}
            <path
              d="M 75 55 Q 60 65, 40 75 T 20 88"
              stroke="#000000"
              strokeWidth="0.5"
              fill="none"
              className="animate-root-branch-2 animation-delay-350"
              vectorEffect="non-scaling-stroke"
              opacity="0.55"
            />

            {/* Subtle side branch */}
            <path
              d="M 88 22 Q 78 28, 65 35 T 48 44"
              stroke="#000000"
              strokeWidth="0.6"
              fill="none"
              className="animate-root-branch-1 animation-delay-180"
              vectorEffect="non-scaling-stroke"
              opacity="0.7"
            />

            {/* Root nodes - organic knots */}
            <circle cx="90" cy="20" r="0.5" fill="#000000" className="animate-root-pulse animation-delay-150" opacity="0.8" />
            <circle cx="75" cy="30" r="0.4" fill="#000000" className="animate-root-pulse animation-delay-250" opacity="0.7" />
            <circle cx="65" cy="45" r="0.45" fill="#000000" className="animate-root-pulse animation-delay-350" opacity="0.75" />
            <circle cx="50" cy="60" r="0.35" fill="#000000" className="animate-root-pulse animation-delay-400" opacity="0.65" />
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
