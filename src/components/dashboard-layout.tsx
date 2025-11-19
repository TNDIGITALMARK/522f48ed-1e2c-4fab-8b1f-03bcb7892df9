"use client";

import { ReactNode } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { RootedHeader } from './rooted-header';
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
        {/* Rooted Header - visible on all screen sizes */}
        <RootedHeader />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
