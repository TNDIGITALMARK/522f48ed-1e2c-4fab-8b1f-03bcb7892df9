"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Utensils,
  Sparkles,
  Calendar,
  Settings,
  LogOut,
  Users,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BloomLogo } from './bloom-logo';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Cycle Tracking',
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
    title: 'Weight',
    href: '/weight',
    icon: Scale,
  },
  {
    title: 'Daily Rituals',
    href: '/rituals',
    icon: Sparkles,
  },
  {
    title: 'Community',
    href: '/community',
    icon: Users,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl border-r border-border/50 flex flex-col shadow-bloom">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <BloomLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group',
                'hover:scale-105 hover:shadow-bloom-sm',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-bloom'
                  : 'text-foreground hover:bg-primary/10 hover:text-primary'
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-primary-foreground/20"
                  : "bg-muted/50 group-hover:bg-primary/20"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-base">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 backdrop-blur-sm mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg">
            S
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Sarah</p>
            <p className="text-xs text-muted-foreground">sarah@bloom.app</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-foreground hover:bg-muted/50 hover:scale-105 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-foreground hover:bg-destructive/10 hover:text-destructive hover:scale-105 transition-all duration-300"
            onClick={() => {
              // Add logout logic here
              console.log('Logout clicked');
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
