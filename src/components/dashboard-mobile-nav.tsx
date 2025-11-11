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

          {/* ENHANCED TREE ROOT SVG - Inspired by Real Tree Root Photo with Organic Branching Patterns */}
          <svg
            className="lg:hidden fixed inset-0 w-full h-full pointer-events-none z-45"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Rich wood texture gradients - Natural brown with depth */}
              <linearGradient id="root-main-thick" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2d1f1a" stopOpacity="0.96" />
                <stop offset="30%" stopColor="#1a1410" stopOpacity="0.94" />
                <stop offset="60%" stopColor="#3d2d24" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#1a1410" stopOpacity="0.90" />
              </linearGradient>

              <linearGradient id="root-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1410" stopOpacity="0.88" />
                <stop offset="50%" stopColor="#2d1f1a" stopOpacity="0.86" />
                <stop offset="100%" stopColor="#1a1410" stopOpacity="0.82" />
              </linearGradient>

              <linearGradient id="root-thin" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a1410" stopOpacity="0.72" />
                <stop offset="50%" stopColor="#3d2d24" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#1a1410" stopOpacity="0.68" />
              </linearGradient>

              <linearGradient id="root-hair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1410" stopOpacity="0.60" />
                <stop offset="100%" stopColor="#2d1f1a" stopOpacity="0.50" />
              </linearGradient>

              {/* Organic bark texture for nodes */}
              <radialGradient id="root-bark-node">
                <stop offset="0%" stopColor="#3d2d24" stopOpacity="0.88" />
                <stop offset="40%" stopColor="#2d1f1a" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#1a1410" stopOpacity="0.60" />
                <stop offset="100%" stopColor="#0d0805" stopOpacity="0.25" />
              </radialGradient>
            </defs>

            {/* ORIGIN: Top Right Corner (96, 2) - Mimicking real tree root structure */}

            {/* ========== PRIMARY TRUNK ROOT - Thick, gnarled, twisting downward ========== */}
            <path
              d="M 96 2 Q 94 5 93 9 T 91 15 Q 89.5 20 88 25 T 85.5 34 Q 83 42 80 49 T 76 61 Q 72 70 68 78 T 62 90 L 58 98"
              stroke="url(#root-main-thick)"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-0"
              opacity="0.94"
            />
            {/* Shadow layer for depth */}
            <path
              d="M 96.5 2 Q 94.5 5 93.5 9 T 91.5 15 Q 90 20 88.5 25 T 86 34 Q 83.5 42 80.5 49 T 76.5 61 Q 72.5 70 68.5 78 T 62.5 90 L 58.5 98"
              stroke="#000000"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-0"
              opacity="0.88"
            />

            {/* ========== MAJOR LATERAL ROOT #1 - Thick horizontal spread to left ========== */}
            <path
              d="M 94 5 Q 88 7 82 9 T 69 13 Q 58 15 46 18 T 28 23 Q 18 26 8 30 L 1 34"
              stroke="url(#root-main-thick)"
              strokeWidth="1.9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.92"
            />
            <path
              d="M 94.5 5.5 Q 88.5 7.5 82.5 9.5 T 69.5 13.5 Q 58.5 15.5 46.5 18.5 T 28.5 23.5 Q 18.5 26.5 8.5 30.5 L 1.5 34.5"
              stroke="#000000"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.85"
            />

            {/* ========== MAJOR DIAGONAL ROOT #2 - Swooping down-left ========== */}
            <path
              d="M 92 10 Q 84 15 76 20 T 62 29 Q 50 36 38 44 T 20 58 Q 12 65 5 73 L 1 80"
              stroke="url(#root-main-thick)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-140"
              opacity="0.90"
            />
            <path
              d="M 92.5 10.5 Q 84.5 15.5 76.5 20.5 T 62.5 29.5 Q 50.5 36.5 38.5 44.5 T 20.5 58.5 Q 12.5 65.5 5.5 73.5 L 1.5 80.5"
              stroke="#000000"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-140"
              opacity="0.83"
            />

            {/* ========== MEDIUM BRANCH #1 - Arcing horizontally ========== */}
            <path
              d="M 89 17 Q 78 20 67 22 T 48 26 Q 35 29 22 33 T 6 40 L 1 43"
              stroke="url(#root-medium)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-180"
              opacity="0.87"
            />

            {/* ========== MEDIUM BRANCH #2 - Curving down ========== */}
            <path
              d="M 86 24 Q 76 29 66 34 T 49 43 Q 36 50 24 58 T 8 71 L 3 78"
              stroke="url(#root-medium)"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-220"
              opacity="0.85"
            />

            {/* ========== SECONDARY BRANCH #1 - Baby root off main trunk ========== */}
            <path
              d="M 88 25 Q 80 28 72 31 T 58 36 Q 46 40 34 45 L 24 50"
              stroke="url(#root-medium)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-260"
              opacity="0.82"
            />

            {/* ========== SECONDARY BRANCH #2 - Another baby root ========== */}
            <path
              d="M 81 40 Q 70 45 59 50 T 41 58 Q 28 64 16 71 L 8 77"
              stroke="url(#root-medium)"
              strokeWidth="1.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-280"
              opacity="0.80"
            />

            {/* ========== SECONDARY BRANCH #3 - Lower spread ========== */}
            <path
              d="M 76 55 Q 64 60 52 65 T 33 73 Q 21 78 10 85 L 3 91"
              stroke="url(#root-medium)"
              strokeWidth="0.95"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-300"
              opacity="0.78"
            />

            {/* ========== THIN TENDRILS - Fine roots branching off ========== */}
            <path
              d="M 91 12 Q 83 14 75 15 T 61 17 Q 48 19 35 22 L 24 25"
              stroke="url(#root-thin)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-190"
              opacity="0.72"
            />

            <path
              d="M 87 21 Q 77 25 67 28 T 50 33 Q 37 37 24 42 L 14 47"
              stroke="url(#root-thin)"
              strokeWidth="0.75"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-230"
              opacity="0.70"
            />

            <path
              d="M 84 32 Q 72 37 60 41 T 40 48 Q 26 53 13 60 L 5 66"
              stroke="url(#root-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-270"
              opacity="0.68"
            />

            <path
              d="M 79 46 Q 66 51 53 56 T 32 64 Q 19 70 8 77 L 2 83"
              stroke="url(#root-thin)"
              strokeWidth="0.65"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-290"
              opacity="0.66"
            />

            <path
              d="M 72 62 Q 58 68 44 73 T 22 82 Q 12 87 4 94 L 1 98"
              stroke="url(#root-thin)"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-320"
              opacity="0.64"
            />

            {/* ========== DELICATE ROOT HAIRS - Whisper-thin fibers ========== */}
            <path
              d="M 93 8 Q 85 9 77 10 T 63 12 L 52 14"
              stroke="url(#root-hair)"
              strokeWidth="0.55"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-130"
              opacity="0.62"
            />

            <path
              d="M 89 19 Q 79 22 69 24 T 52 28 L 40 31"
              stroke="url(#root-hair)"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-210"
              opacity="0.60"
            />

            <path
              d="M 85 30 Q 73 34 61 37 T 42 42 L 28 47"
              stroke="url(#root-hair)"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-250"
              opacity="0.58"
            />

            <path
              d="M 82 38 Q 69 43 56 47 T 35 54 L 22 60"
              stroke="url(#root-hair)"
              strokeWidth="0.45"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-275"
              opacity="0.56"
            />

            <path
              d="M 77 52 Q 63 58 49 63 T 27 72 L 15 79"
              stroke="url(#root-hair)"
              strokeWidth="0.45"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-310"
              opacity="0.54"
            />

            <path
              d="M 70 66 Q 55 72 40 77 T 18 86 L 8 92"
              stroke="url(#root-hair)"
              strokeWidth="0.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-340"
              opacity="0.52"
            />

            {/* ========== ULTRA-FINE ROOT HAIRS - Barely visible tendrils ========== */}
            <path
              d="M 90 14 Q 81 16 72 17 L 64 18"
              stroke="#1a1410"
              strokeWidth="0.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-160"
              opacity="0.50"
            />

            <path
              d="M 86 27 Q 75 30 64 33 L 54 36"
              stroke="#1a1410"
              strokeWidth="0.35"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-240"
              opacity="0.48"
            />

            <path
              d="M 80 44 Q 67 49 54 54 L 43 59"
              stroke="#1a1410"
              strokeWidth="0.35"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-285"
              opacity="0.46"
            />

            <path
              d="M 74 59 Q 60 65 46 70 L 34 76"
              stroke="#1a1410"
              strokeWidth="0.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-315"
              opacity="0.44"
            />

            {/* ========== ORGANIC NODES - Knots and junction points ========== */}
            {/* Major trunk nodes - thick, prominent */}
            <ellipse cx="92" cy="10" rx="1.3" ry="1.0" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-140" opacity="0.88" />
            <ellipse cx="88" cy="25" rx="1.2" ry="0.95" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-220" opacity="0.85" />
            <ellipse cx="85" cy="34" rx="1.1" ry="0.9" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-260" opacity="0.82" />
            <ellipse cx="80" cy="49" rx="1.0" ry="0.85" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-300" opacity="0.80" />
            <ellipse cx="76" cy="61" rx="0.95" ry="0.8" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-340" opacity="0.78" />
            <ellipse cx="68" cy="78" rx="0.85" ry="0.75" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-380" opacity="0.75" />

            {/* Branch junction nodes - medium size */}
            <circle cx="89" cy="17" r="0.75" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-180" opacity="0.78" />
            <circle cx="86" cy="24" r="0.7" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-220" opacity="0.76" />
            <circle cx="81" cy="40" r="0.65" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-280" opacity="0.74" />
            <circle cx="76" cy="55" r="0.6" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-300" opacity="0.72" />
            <circle cx="72" cy="62" r="0.55" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-320" opacity="0.70" />

            {/* Fine tendril nodes - small, delicate */}
            <circle cx="84" cy="32" r="0.5" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-250" opacity="0.68" />
            <circle cx="79" cy="46" r="0.45" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-290" opacity="0.66" />
            <circle cx="70" cy="66" r="0.4" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-340" opacity="0.64" />
            <circle cx="58" cy="72" r="0.35" fill="url(#root-bark-node)" className="animate-root-pulse animation-delay-360" opacity="0.62" />
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
