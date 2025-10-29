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
  Sprout,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BloomLogo } from './bloom-logo';
import { Button } from './ui/button';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Cycle',
    href: '/cycle',
    icon: Heart,
  },
  {
    title: 'Workouts',
    href: '/workout',
    icon: Activity,
  },
  {
    title: 'Nutrition',
    href: '/nutrition',
    icon: Utensils,
  },
  {
    title: 'Rituals',
    href: '/rituals',
    icon: Sparkles,
  },
  {
    title: 'Garden',
    href: '/garden',
    icon: Sprout,
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
          <BloomLogo />
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

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[60px]"
            onClick={() => setIsOpen(false)}
          />
          <nav className="lg:hidden fixed top-[60px] left-0 right-0 bg-white border-b border-border z-40 p-4 space-y-2 shadow-bloom-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    'hover:bg-primary/10 hover:text-primary',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-bloom-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
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
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate w-full text-center">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
