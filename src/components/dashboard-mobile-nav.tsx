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

          {/* Decorative Tree Root SVG Background - Growing from TOP RIGHT with REALISTIC 3D VOLUMETRIC DEPTH */}
          <svg
            className="lg:hidden fixed inset-0 w-full h-full pointer-events-none z-45"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Advanced 3D depth filter with multiple shadows */}
              <filter id="root-depth-3d" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="0.4" result="blur1" />
                <feOffset dx="0.3" dy="0.5" result="offset1" />
                <feComposite in="blur1" in2="offset1" operator="out" result="shadow1" />

                <feGaussianBlur in="SourceAlpha" stdDeviation="0.2" result="blur2" />
                <feOffset dx="-0.2" dy="0.3" result="offset2" />
                <feComposite in="blur2" in2="offset2" operator="out" result="shadow2" />

                <feMerge>
                  <feMergeNode in="shadow1" />
                  <feMergeNode in="shadow2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradients for 3D volumetric effect */}
              <linearGradient id="root-gradient-main" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#1a1a1a" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="root-gradient-branch" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#2a2a2a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="root-gradient-thin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#3a3a3a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
              </linearGradient>

              {/* Radial gradient for organic root nodes */}
              <radialGradient id="root-node-gradient">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#1a1a1a" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
              </radialGradient>
            </defs>

            {/* ORIGIN POINT: Top Right Corner (95, 5) */}

            {/* ===== MAIN TRUNK - VOLUMETRIC 3D RENDERING ===== */}
            {/* Deep shadow layer (darkest) */}
            <path
              d="M 93.8 5 Q 91.8 12, 88.8 20 T 83.8 35 Q 80.8 45, 76.8 55 T 68.8 75 Q 65.8 82, 62 90"
              stroke="#000000"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow"
              opacity="0.25"
            />

            {/* Mid-shadow layer */}
            <path
              d="M 94.2 5 Q 92.2 12, 89.2 20 T 84.2 35 Q 81.2 45, 77.2 55 T 69.2 75 Q 66.2 82, 62.5 90"
              stroke="#000000"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow"
              opacity="0.35"
            />

            {/* Left contour (shadow side) - THICK FOR VOLUME */}
            <path
              d="M 94.3 5 Q 92.3 12, 89.3 20 T 84.3 35 Q 81.3 45, 77.3 55 T 69.3 75 Q 66.3 82, 62.8 90"
              stroke="url(#root-gradient-main)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow"
              filter="url(#root-depth-3d)"
            />

            {/* Center core line */}
            <path
              d="M 95 5 Q 93 12, 90 20 T 85 35 Q 82 45, 78 55 T 70 75 Q 67 82, 63.5 90"
              stroke="#1a1a1a"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              className="animate-root-grow"
              opacity="0.6"
            />

            {/* Right contour (highlight side) - CREATES CYLINDER EFFECT */}
            <path
              d="M 95.7 5 Q 93.7 12, 90.7 20 T 85.7 35 Q 82.7 45, 78.7 55 T 70.7 75 Q 67.7 82, 64.2 90"
              stroke="#000000"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow"
              opacity="0.85"
            />

            {/* Highlight edge for roundness */}
            <path
              d="M 96 5 Q 94 12, 91 20 T 86 35 Q 83 45, 79 55 T 71 75 Q 68 82, 64.5 90"
              stroke="#000000"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              className="animate-root-grow"
              opacity="0.95"
            />

            {/* ===== PRIMARY THICK BRANCH - VOLUMETRIC 3D ===== */}
            {/* Shadow foundation */}
            <path
              d="M 92.5 8 Q 84.5 15, 74.5 22 T 59.5 32 Q 49.5 38, 39.5 45 T 25 55"
              stroke="#000000"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.3"
            />

            {/* Left contour (shadow) */}
            <path
              d="M 92.8 8 Q 84.8 15, 74.8 22 T 59.8 32 Q 49.8 38, 39.8 45 T 25.3 55"
              stroke="url(#root-gradient-branch)"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              filter="url(#root-depth-3d)"
            />

            {/* Center core */}
            <path
              d="M 93 8 Q 85 15, 75 22 T 60 32 Q 50 38, 40 45 T 25.5 55"
              stroke="#2a2a2a"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.5"
            />

            {/* Right contour (highlight) */}
            <path
              d="M 93.2 8 Q 85.2 15, 75.2 22 T 60.2 32 Q 50.2 38, 40.2 45 T 25.7 55"
              stroke="#000000"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.8"
            />

            {/* Thin highlight edge */}
            <path
              d="M 93.5 8 Q 85.5 15, 75.5 22 T 60.5 32 Q 50.5 38, 40.5 45 T 26 55"
              stroke="#000000"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.9"
            />

            {/* ===== SECONDARY MEDIUM BRANCH - TAPERING VOLUME ===== */}
            {/* Shadow base */}
            <path
              d="M 89.5 18 Q 79.5 25, 64.5 30 T 44.5 38 Q 34 42, 22 48"
              stroke="#000000"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-150"
              opacity="0.25"
            />

            {/* Left contour */}
            <path
              d="M 89.7 18 Q 79.7 25, 64.7 30 T 44.7 38 Q 34.2 42, 22.2 48"
              stroke="url(#root-gradient-branch)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-150"
              filter="url(#root-depth-3d)"
            />

            {/* Center */}
            <path
              d="M 90 18 Q 80 25, 65 30 T 45 38 Q 34.5 42, 22.5 48"
              stroke="#2a2a2a"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              className="animate-root-branch-2 animation-delay-150"
              opacity="0.5"
            />

            {/* Right contour */}
            <path
              d="M 90.3 18 Q 80.3 25, 65.3 30 T 45.3 38 Q 34.8 42, 22.8 48"
              stroke="#000000"
              strokeWidth="1.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-150"
              opacity="0.75"
            />

            {/* ===== THIN SPREADING BRANCH - ORGANIC TAPER ===== */}
            <path
              d="M 85.2 30 Q 70.2 35, 50.2 40 T 25.2 48 Q 15 52, 8 58"
              stroke="#000000"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-200"
              opacity="0.3"
            />

            <path
              d="M 85 30 Q 70 35, 50 40 T 25 48 Q 15 52, 8 58"
              stroke="url(#root-gradient-thin)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-200"
              filter="url(#root-depth-3d)"
            />

            {/* ===== LOWER SPREADING ROOT - VOLUMETRIC ===== */}
            <path
              d="M 78 48 Q 65 55, 50 60 T 30 68 Q 20 73, 12 80"
              stroke="#000000"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-250"
              opacity="0.25"
            />

            <path
              d="M 78.2 48 Q 65.2 55, 50.2 60 T 30.2 68 Q 20.2 73, 12.2 80"
              stroke="url(#root-gradient-branch)"
              strokeWidth="1.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-250"
              filter="url(#root-depth-3d)"
            />

            <path
              d="M 78.5 48 Q 65.5 55, 50.5 60 T 30.5 68 Q 20.5 73, 12.5 80"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-250"
              opacity="0.65"
            />

            {/* ===== DEEP DESCENDING ROOT ===== */}
            <path
              d="M 70 68 Q 55 75, 35 82 T 15 90 Q 10 94, 5 98"
              stroke="url(#root-gradient-thin)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-300"
              filter="url(#root-depth-3d)"
            />

            <path
              d="M 70.3 68 Q 55.3 75, 35.3 82 T 15.3 90 Q 10.3 94, 5.3 98"
              stroke="#000000"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-300"
              opacity="0.6"
            />

            {/* ===== WISPY UPPER TENDRILS ===== */}
            <path
              d="M 92 10 Q 82 12, 70 14 T 50 18 Q 38 21, 28 25"
              stroke="url(#root-gradient-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-80"
              filter="url(#root-depth-3d)"
            />

            <path
              d="M 92.3 10 Q 82.3 12, 70.3 14 T 50.3 18 Q 38.3 21, 28.3 25"
              stroke="#000000"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              className="animate-root-grow animation-delay-80"
              opacity="0.55"
            />

            {/* ===== DELICATE SIDE TENDRILS ===== */}
            <path
              d="M 75 55 Q 60 65, 40 75 T 20 88 Q 15 92, 10 96"
              stroke="url(#root-gradient-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-350"
              opacity="0.5"
            />

            <path
              d="M 88 22 Q 78 28, 65 35 T 48 44 Q 38 49, 30 55"
              stroke="url(#root-gradient-thin)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-180"
              filter="url(#root-depth-3d)"
            />

            {/* ===== ADDITIONAL FINE ROOTS FOR DENSITY ===== */}
            <path
              d="M 82 40 Q 70 45, 55 50 T 35 58"
              stroke="#000000"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              className="animate-root-branch-2 animation-delay-220"
              opacity="0.45"
            />

            <path
              d="M 68 62 Q 52 68, 32 75 T 18 83"
              stroke="#000000"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              className="animate-root-branch-1 animation-delay-280"
              opacity="0.4"
            />

            {/* ===== ORGANIC ROOT NODES - VOLUMETRIC SPHERES ===== */}
            {/* Node at trunk junction */}
            <ellipse cx="90" cy="20" rx="1.2" ry="1.0" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-150" />
            <circle cx="90" cy="19.8" r="0.4" fill="#2a2a2a" opacity="0.6" />

            {/* Node at major branch point */}
            <ellipse cx="75" cy="30" rx="1.0" ry="0.9" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-250" />
            <circle cx="75" cy="29.8" r="0.35" fill="#2a2a2a" opacity="0.5" />

            {/* Node at secondary branch */}
            <ellipse cx="65" cy="45" rx="0.9" ry="0.8" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-350" />
            <circle cx="65" cy="44.8" r="0.3" fill="#2a2a2a" opacity="0.5" />

            {/* Node at lower junction */}
            <ellipse cx="50" cy="60" rx="0.8" ry="0.7" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-400" />
            <circle cx="50" cy="59.8" r="0.25" fill="#2a2a2a" opacity="0.4" />

            {/* Small nodes along roots */}
            <circle cx="82" cy="35" r="0.5" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-180" opacity="0.7" />
            <circle cx="60" cy="50" r="0.45" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-280" opacity="0.65" />
            <circle cx="38" cy="70" r="0.4" fill="url(#root-node-gradient)" className="animate-root-pulse animation-delay-320" opacity="0.6" />
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
