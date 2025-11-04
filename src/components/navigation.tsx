"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, Apple, Dumbbell, Users, Heart } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/nutrition', icon: Apple, label: 'Nutrition' },
    { href: '/workout', icon: Dumbbell, label: 'Workout' },
    { href: '/cycle', icon: Heart, label: 'Cycle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="max-w-lg mx-auto px-2 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all flex-1 min-w-0 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
