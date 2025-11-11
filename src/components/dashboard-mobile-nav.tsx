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

      {/* Tree Roots Mobile Menu - Right Side Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[60px]"
            onClick={() => setIsOpen(false)}
          />

          {/* Tree Roots Menu Container */}
          <nav className="lg:hidden fixed top-[60px] right-0 w-[85%] max-w-[320px] h-[calc(100vh-60px)] bg-gradient-to-br from-white via-[hsl(var(--rooted-cream))] to-[hsl(var(--card))] z-40 shadow-bloom-lg overflow-hidden">
            {/* Decorative Tree Root SVG Background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
              viewBox="0 0 320 800"
              preserveAspectRatio="xMaxYMin slice"
            >
              {/* Main root trunk */}
              <path
                d="M 280 0 Q 270 100, 260 200 T 240 400 Q 230 500, 220 600 T 200 800"
                stroke="hsl(var(--rooted-brown))"
                strokeWidth="8"
                fill="none"
                className="animate-root-grow"
              />

              {/* Branch root 1 - upper right */}
              <path
                d="M 260 150 Q 280 180, 300 220 L 320 250"
                stroke="hsl(var(--rooted-olive))"
                strokeWidth="5"
                fill="none"
                className="animate-root-branch-1 animation-delay-150"
              />

              {/* Branch root 2 - middle right */}
              <path
                d="M 240 350 Q 270 380, 300 420 L 320 460"
                stroke="hsl(var(--rooted-sage))"
                strokeWidth="6"
                fill="none"
                className="animate-root-branch-2 animation-delay-250"
              />

              {/* Branch root 3 - lower area */}
              <path
                d="M 220 550 Q 250 580, 280 620 L 310 670"
                stroke="hsl(var(--rooted-olive))"
                strokeWidth="5"
                fill="none"
                className="animate-root-branch-1 animation-delay-350"
              />

              {/* Small roots - details */}
              <path
                d="M 270 120 L 290 140"
                stroke="hsl(var(--rooted-brown))"
                strokeWidth="3"
                fill="none"
                className="animate-root-grow animation-delay-100"
              />
              <path
                d="M 250 280 L 270 300"
                stroke="hsl(var(--rooted-sage))"
                strokeWidth="3"
                fill="none"
                className="animate-root-grow animation-delay-200"
              />
              <path
                d="M 230 480 L 255 510"
                stroke="hsl(var(--rooted-olive))"
                strokeWidth="3"
                fill="none"
                className="animate-root-grow animation-delay-300"
              />

              {/* Organic root nodes */}
              <circle cx="260" cy="200" r="6" fill="hsl(var(--rooted-brown))" className="animate-root-pulse animation-delay-200" />
              <circle cx="240" cy="400" r="5" fill="hsl(var(--rooted-olive))" className="animate-root-pulse animation-delay-350" />
              <circle cx="220" cy="600" r="5" fill="hsl(var(--rooted-sage))" className="animate-root-pulse animation-delay-450" />
            </svg>

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
                      'backdrop-blur-sm',
                      'animate-root-item',
                      `animation-delay-${100 + index * 50}`,
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-bloom-sm scale-[1.02]'
                        : 'text-muted-foreground bg-white/70'
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
