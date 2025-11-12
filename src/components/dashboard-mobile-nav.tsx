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
        <div className="flex items-center justify-between px-4 py-2">
          <RootedLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl h-7 w-7"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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

            {/* ========== PRIMARY TRUNK ROOT - Organic, twisting downward with natural taper ========== */}
            <path
              d="M 96 2 C 95 3.5 94.2 5.5 93.5 8 C 92.5 11.5 92 14.5 91 18 C 89.8 22 88.5 25.5 87 29.5 C 85 34.5 83 39 81 44 C 78.5 49.5 76 55 73 61 C 69.5 68 66 74 62 80 C 58 86 54 91 50 96"
              stroke="url(#root-main-thick)"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-0"
              opacity="0.94"
              style={{ strokeWidth: '2.4' }}
            />
            {/* Natural taper - gets thinner as it grows */}
            <path
              d="M 73 61 C 69.5 68 66 74 62 80 C 58 86 54 91 50 96"
              stroke="url(#root-main-thick)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-0"
              opacity="0.92"
            />
            {/* Shadow layer for depth */}
            <path
              d="M 96.5 2.5 C 95.5 4 94.7 6 94 8.5 C 93 12 92.5 15 91.5 18.5 C 90.3 22.5 89 26 87.5 30 C 85.5 35 83.5 39.5 81.5 44.5 C 79 50 76.5 55.5 73.5 61.5 C 70 68.5 66.5 74.5 62.5 80.5 C 58.5 86.5 54.5 91.5 50.5 96.5"
              stroke="#000000"
              strokeWidth="2.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-0"
              opacity="0.85"
            />

            {/* ========== MAJOR LATERAL ROOT #1 - Organic horizontal spread with curves ========== */}
            <path
              d="M 94 5 C 90 6 86 7.5 82 9 C 76 11 70 12.5 64 14 C 56 16 48 17.5 40 20 C 32 22.5 24 25 16 28 C 10 30 5 32 1 34"
              stroke="url(#root-main-thick)"
              strokeWidth="2.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.92"
            />
            {/* Taper section */}
            <path
              d="M 40 20 C 32 22.5 24 25 16 28 C 10 30 5 32 1 34"
              stroke="url(#root-main-thick)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.90"
            />
            <path
              d="M 94.5 5.5 C 90.5 6.5 86.5 8 82.5 9.5 C 76.5 11.5 70.5 13 64.5 14.5 C 56.5 16.5 48.5 18 40.5 20.5 C 32.5 23 24.5 25.5 16.5 28.5 C 10.5 30.5 5.5 32.5 1.5 34.5"
              stroke="#000000"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-100"
              opacity="0.84"
            />

            {/* ========== MAJOR DIAGONAL ROOT #2 - Organic swooping down-left with natural flow ========== */}
            <path
              d="M 92 10 C 88 13 84 16.5 79 20 C 73 24.5 67 29 60 34 C 52 40 44 46 36 52 C 27 59 18 66 10 73 C 6 77 3 79 1 81"
              stroke="url(#root-main-thick)"
              strokeWidth="1.9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-140"
              opacity="0.90"
            />
            {/* Taper */}
            <path
              d="M 36 52 C 27 59 18 66 10 73 C 6 77 3 79 1 81"
              stroke="url(#root-main-thick)"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-140"
              opacity="0.88"
            />
            <path
              d="M 92.5 10.5 C 88.5 13.5 84.5 17 79.5 20.5 C 73.5 25 67.5 29.5 60.5 34.5 C 52.5 40.5 44.5 46.5 36.5 52.5 C 27.5 59.5 18.5 66.5 10.5 73.5 C 6.5 77.5 3.5 79.5 1.5 81.5"
              stroke="#000000"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-140"
              opacity="0.82"
            />

            {/* ========== MEDIUM BRANCH #1 - Natural arcing with irregularity ========== */}
            <path
              d="M 89 17 C 82 19 75 20.5 68 22 C 59 24 50 25.5 41 28 C 32 30.5 23 33 14 36 C 8 38 4 40 1 42"
              stroke="url(#root-medium)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-180"
              opacity="0.87"
            />
            {/* Taper */}
            <path
              d="M 41 28 C 32 30.5 23 33 14 36 C 8 38 4 40 1 42"
              stroke="url(#root-medium)"
              strokeWidth="1.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-180"
              opacity="0.85"
            />

            {/* ========== MEDIUM BRANCH #2 - Organic curve downward ========== */}
            <path
              d="M 86 24 C 80 28 74 32.5 67 37 C 59 42.5 51 48 42 54 C 32 61 22 68 12 75 C 7 79 4 81 2 83"
              stroke="url(#root-medium)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-220"
              opacity="0.85"
            />
            {/* Taper */}
            <path
              d="M 42 54 C 32 61 22 68 12 75 C 7 79 4 81 2 83"
              stroke="url(#root-medium)"
              strokeWidth="0.95"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-220"
              opacity="0.83"
            />

            {/* ========== SECONDARY BRANCH #1 - Branching off at angle ========== */}
            <path
              d="M 88 25 C 83 27.5 78 30 72 32 C 65 34.5 58 37 50 40 C 42 43 34 46 26 49"
              stroke="url(#root-medium)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-260"
              opacity="0.82"
            />
            {/* Taper */}
            <path
              d="M 50 40 C 42 43 34 46 26 49"
              stroke="url(#root-medium)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-260"
              opacity="0.80"
            />

            {/* ========== SECONDARY BRANCH #2 - Irregular curved branch ========== */}
            <path
              d="M 81 40 C 74 44 67 48.5 59 53 C 50 58.5 41 64 31 70 C 22 76 13 82 5 88"
              stroke="url(#root-medium)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-280"
              opacity="0.80"
            />
            {/* Taper */}
            <path
              d="M 31 70 C 22 76 13 82 5 88"
              stroke="url(#root-medium)"
              strokeWidth="0.75"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-280"
              opacity="0.78"
            />

            {/* ========== SECONDARY BRANCH #3 - Lower diagonal spread ========== */}
            <path
              d="M 76 55 C 69 59 62 63.5 54 68 C 45 73.5 36 79 26 85 C 18 90 10 95 3 99"
              stroke="url(#root-medium)"
              strokeWidth="1.0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-300"
              opacity="0.78"
            />
            {/* Taper */}
            <path
              d="M 26 85 C 18 90 10 95 3 99"
              stroke="url(#root-medium)"
              strokeWidth="0.65"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-300"
              opacity="0.76"
            />

            {/* ========== THIN TENDRILS - Fine roots with natural irregularity ========== */}
            <path
              d="M 91 12 C 86 13.5 81 14.8 75 16 C 68 17.5 61 19 53 20.5 C 45 22 37 23.5 29 25"
              stroke="url(#root-thin)"
              strokeWidth="0.85"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-190"
              opacity="0.72"
            />

            <path
              d="M 87 21 C 81 24 75 27 68 30 C 60 33.5 52 37 43 40.5 C 34 44 25 47.5 16 51"
              stroke="url(#root-thin)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-230"
              opacity="0.70"
            />

            <path
              d="M 84 32 C 77 36 70 40 62 44 C 53 49 44 54 34 59 C 24 65 14 71 6 77"
              stroke="url(#root-thin)"
              strokeWidth="0.75"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-270"
              opacity="0.68"
            />

            <path
              d="M 79 46 C 71 51 63 56 54 61 C 44 67 34 73 23 79 C 15 84 8 89 2 94"
              stroke="url(#root-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-290"
              opacity="0.66"
            />

            <path
              d="M 72 62 C 63 68 54 74 44 80 C 33 87 22 93 11 99"
              stroke="url(#root-thin)"
              strokeWidth="0.65"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-320"
              opacity="0.64"
            />

            {/* ========== ADDITIONAL THIN BRANCHES - More chaotic spread ========== */}
            <path
              d="M 90 15 C 84 17.5 78 19.5 71 21.5 C 63 23.8 55 26 46 28.5 C 37 31 28 33.5 19 36"
              stroke="url(#root-thin)"
              strokeWidth="0.75"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-200"
              opacity="0.69"
            />

            <path
              d="M 85 28 C 78 32 71 36 63 40 C 54 45 45 50 35 56 C 25 62 15 68 7 74"
              stroke="url(#root-thin)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-245"
              opacity="0.67"
            />

            <path
              d="M 78 50 C 70 55 62 60 53 65 C 43 71 33 77 22 84 C 13 90 6 95 1 99"
              stroke="url(#root-thin)"
              strokeWidth="0.65"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-295"
              opacity="0.65"
            />

            {/* ========== DELICATE ROOT HAIRS - Whisper-thin organic fibers ========== */}
            <path
              d="M 93 8 C 89 8.8 85 9.5 81 10.2 C 76 11 71 11.8 66 12.6 C 60 13.5 54 14.4 48 15.3"
              stroke="url(#root-hair)"
              strokeWidth="0.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-130"
              opacity="0.62"
            />

            <path
              d="M 89 19 C 84 21 79 22.8 74 24.5 C 68 26.5 62 28.3 55 30.2 C 48 32 41 33.8 34 35.5"
              stroke="url(#root-hair)"
              strokeWidth="0.55"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-210"
              opacity="0.60"
            />

            <path
              d="M 85 30 C 79 33 73 36 66 39 C 58 42.5 50 46 41 49.5 C 32 53 23 56.5 14 60"
              stroke="url(#root-hair)"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-250"
              opacity="0.58"
            />

            <path
              d="M 82 38 C 75 42 68 46 60 50 C 51 55 42 60 32 66 C 22 72 12 78 4 84"
              stroke="url(#root-hair)"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-275"
              opacity="0.56"
            />

            <path
              d="M 77 52 C 69 57 61 62 52 67 C 42 73 32 79 21 86 C 12 92 5 96 1 99"
              stroke="url(#root-hair)"
              strokeWidth="0.48"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-310"
              opacity="0.54"
            />

            <path
              d="M 70 66 C 61 72 52 78 42 84 C 31 91 20 97 9 103"
              stroke="url(#root-hair)"
              strokeWidth="0.45"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-340"
              opacity="0.52"
            />

            {/* ========== EXTRA WISPY ROOT HAIRS - Maximum realism ========== */}
            <path
              d="M 91 10 C 86 11.5 81 13 76 14.5 C 70 16.2 64 17.8 58 19.5"
              stroke="url(#root-hair)"
              strokeWidth="0.55"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-150"
              opacity="0.59"
            />

            <path
              d="M 87 23 C 81 26 75 29 68 32 C 60 35.5 52 39 43 42.5"
              stroke="url(#root-hair)"
              strokeWidth="0.52"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-235"
              opacity="0.57"
            />

            <path
              d="M 83 35 C 76 39 69 43 61 47 C 52 52 43 57 33 63"
              stroke="url(#root-hair)"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-265"
              opacity="0.55"
            />

            <path
              d="M 80 43 C 72 48 64 53 55 58 C 45 64 35 70 24 77"
              stroke="url(#root-hair)"
              strokeWidth="0.48"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-285"
              opacity="0.53"
            />

            <path
              d="M 75 58 C 66 64 57 70 47 76 C 36 83 25 90 14 97"
              stroke="url(#root-hair)"
              strokeWidth="0.45"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-325"
              opacity="0.51"
            />

            {/* ========== ULTRA-FINE ROOT HAIRS - Barely visible wispy tendrils ========== */}
            <path
              d="M 90 14 C 86 15.2 82 16.3 78 17.3 C 73 18.5 68 19.6 63 20.7"
              stroke="#1a1410"
              strokeWidth="0.42"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-160"
              opacity="0.50"
            />

            <path
              d="M 86 27 C 81 29.5 76 31.8 71 34 C 65 36.5 59 39 52 41.5"
              stroke="#1a1410"
              strokeWidth="0.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-240"
              opacity="0.48"
            />

            <path
              d="M 80 44 C 74 48 68 52 61 56 C 53 61 45 66 36 71"
              stroke="#1a1410"
              strokeWidth="0.38"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-285"
              opacity="0.46"
            />

            <path
              d="M 74 59 C 67 64 60 69 52 74 C 43 80 34 86 24 92"
              stroke="#1a1410"
              strokeWidth="0.35"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-315"
              opacity="0.44"
            />

            {/* ========== MICRO ROOT FILAMENTS - Subtle natural detail ========== */}
            <path
              d="M 92 11 C 88 12 84 12.9 80 13.8 C 75 14.8 70 15.8 65 16.8"
              stroke="#1a1410"
              strokeWidth="0.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-grow animation-delay-145"
              opacity="0.49"
            />

            <path
              d="M 88 20 C 83 22.5 78 24.8 73 27 C 67 29.5 61 32 54 34.5"
              stroke="#1a1410"
              strokeWidth="0.38"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-215"
              opacity="0.47"
            />

            <path
              d="M 84 33 C 78 37 72 41 65 45 C 57 50 49 55 40 61"
              stroke="#1a1410"
              strokeWidth="0.36"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-255"
              opacity="0.45"
            />

            <path
              d="M 81 41 C 74 46 67 51 59 56 C 50 62 41 68 31 75"
              stroke="#1a1410"
              strokeWidth="0.35"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-280"
              opacity="0.43"
            />

            <path
              d="M 76 54 C 68 60 60 66 51 72 C 41 79 31 86 20 93"
              stroke="#1a1410"
              strokeWidth="0.33"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-1 animation-delay-305"
              opacity="0.41"
            />

            <path
              d="M 71 65 C 62 71 53 77 43 84 C 32 91 21 98 10 105"
              stroke="#1a1410"
              strokeWidth="0.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-root-branch-2 animation-delay-335"
              opacity="0.39"
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
          <div className="lg:hidden fixed top-[52px] right-4 z-50 space-y-3 w-[280px] max-w-[calc(100vw-2rem)]">
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

    </>
  );
}
