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

      {/* Tree Roots Mobile Menu - Full Screen with Roots */}
      {isOpen && (
        <>
          {/* Decorative Tree Root SVG Background - FULL SCREEN */}
          <svg
            className="lg:hidden fixed inset-0 w-full h-full pointer-events-none z-40 top-[60px]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Main central trunk spreading downward */}
            <path
              d="M 50 0 Q 48 15, 45 30 T 40 50 Q 38 60, 35 70 T 30 90"
              stroke="hsl(var(--rooted-brown))"
              strokeWidth="0.8"
              fill="none"
              className="animate-root-grow"
              vectorEffect="non-scaling-stroke"
            />

            {/* Left spreading roots */}
            <path
              d="M 48 10 Q 40 15, 30 20 T 10 30"
              stroke="hsl(var(--rooted-olive))"
              strokeWidth="0.6"
              fill="none"
              className="animate-root-branch-1 animation-delay-100"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 45 25 Q 35 30, 20 35 T 5 45"
              stroke="hsl(var(--rooted-sage))"
              strokeWidth="0.5"
              fill="none"
              className="animate-root-branch-2 animation-delay-200"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 40 40 Q 30 45, 15 50 T 0 60"
              stroke="hsl(var(--rooted-olive))"
              strokeWidth="0.5"
              fill="none"
              className="animate-root-branch-1 animation-delay-300"
              vectorEffect="non-scaling-stroke"
            />

            {/* Right spreading roots */}
            <path
              d="M 52 10 Q 60 15, 70 20 T 90 30"
              stroke="hsl(var(--rooted-sage))"
              strokeWidth="0.6"
              fill="none"
              className="animate-root-branch-2 animation-delay-150"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 55 25 Q 65 30, 80 35 T 95 45"
              stroke="hsl(var(--rooted-olive))"
              strokeWidth="0.5"
              fill="none"
              className="animate-root-branch-1 animation-delay-250"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 60 40 Q 70 45, 85 50 T 100 60"
              stroke="hsl(var(--rooted-brown))"
              strokeWidth="0.5"
              fill="none"
              className="animate-root-branch-2 animation-delay-350"
              vectorEffect="non-scaling-stroke"
            />

            {/* Upper spreading branches */}
            <path
              d="M 50 5 Q 35 8, 20 10 T 0 15"
              stroke="hsl(var(--rooted-brown))"
              strokeWidth="0.4"
              fill="none"
              className="animate-root-grow animation-delay-50"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 50 5 Q 65 8, 80 10 T 100 15"
              stroke="hsl(var(--rooted-sage))"
              strokeWidth="0.4"
              fill="none"
              className="animate-root-grow animation-delay-100"
              vectorEffect="non-scaling-stroke"
            />

            {/* Lower spreading branches */}
            <path
              d="M 35 60 Q 25 70, 10 80 T 0 90"
              stroke="hsl(var(--rooted-olive))"
              strokeWidth="0.4"
              fill="none"
              className="animate-root-branch-1 animation-delay-400"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 30 75 Q 20 85, 5 92 T 0 100"
              stroke="hsl(var(--rooted-sage))"
              strokeWidth="0.3"
              fill="none"
              className="animate-root-branch-2 animation-delay-450"
              vectorEffect="non-scaling-stroke"
            />

            {/* Organic root nodes */}
            <circle cx="45" cy="30" r="0.4" fill="hsl(var(--rooted-brown))" className="animate-root-pulse animation-delay-200" />
            <circle cx="40" cy="50" r="0.3" fill="hsl(var(--rooted-olive))" className="animate-root-pulse animation-delay-350" />
            <circle cx="55" cy="25" r="0.35" fill="hsl(var(--rooted-sage))" className="animate-root-pulse animation-delay-300" />
          </svg>

          {/* Menu Rectangle - Right Side Dropdown */}
          <nav className="lg:hidden fixed top-[60px] right-0 w-[85%] max-w-[320px] h-[calc(100vh-60px)] bg-white z-50 shadow-bloom-lg overflow-hidden">
            {/* Menu Items with Staggered Animation */}
            <div className="relative z-10 p-6 pt-8 space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200',
                      'hover:bg-primary/10 hover:text-primary hover:shadow-bloom-sm hover:scale-[1.02]',
                      'animate-root-item',
                      `animation-delay-${100 + index * 50}`,
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-bloom-sm scale-[1.02]'
                        : 'text-muted-foreground bg-muted/10'
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-all",
                      isActive
                        ? "bg-primary-foreground/20"
                        : "bg-muted/30"
                    )}>
                      <Icon
                        className="w-5 h-5 flex-shrink-0"
                        style={!isActive && item.iconColor ? { color: item.iconColor } : undefined}
                      />
                    </div>
                    <span className="font-semibold text-base">{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Decorative bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--rooted-sage))]/10 to-transparent pointer-events-none" />
          </nav>
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
