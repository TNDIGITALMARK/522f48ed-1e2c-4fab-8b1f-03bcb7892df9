"use client";

import { ReactNode } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { DashboardMobileNav } from './dashboard-mobile-nav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-textile-beige textile-overlay-cream">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Navigation */}
      <DashboardMobileNav />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Desktop Header - hidden on mobile */}
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 mt-[44px] lg:mt-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
