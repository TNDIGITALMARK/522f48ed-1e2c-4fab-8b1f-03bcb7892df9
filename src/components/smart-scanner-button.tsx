'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import Link from 'next/link';

/**
 * Smart Scanner Button Component
 * A prominent button that navigates to the plate scanner for meal tracking
 * Styled to match the reference design with scan icon
 */
export function SmartScannerButton() {
  return (
    <div className="w-full animate-fade-in-up animation-delay-300">
      <Link href="/calorie-tracking" className="block">
        <Button
          className="w-full h-16 rounded-full bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 text-white shadow-bloom transition-all duration-300 hover:shadow-bloom-lg hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Scan className="w-6 h-6" />
            </div>
            <span className="text-lg font-semibold tracking-wide">Scan Your Item</span>
          </div>
        </Button>
      </Link>
    </div>
  );
}
