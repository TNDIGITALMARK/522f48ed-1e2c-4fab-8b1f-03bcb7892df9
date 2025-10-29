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
  LogOut
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
    title: 'Daily Rituals',
    href: '/rituals',
    icon: Sparkles,
  },
  {
    title: 'My Garden',
    href: '/garden',
    icon: Calendar,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <BloomLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          onClick={() => {
            // Add logout logic here
            console.log('Logout clicked');
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
