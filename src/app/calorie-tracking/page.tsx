'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { CalorieDashboard } from '@/components/fitness/CalorieDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CalorieTrackingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Calorie Tracking</h1>
          <p className="text-muted-foreground">
            Smart calorie management powered by AI to help you reach your fitness goals
          </p>
        </div>

        <CalorieDashboard />
      </div>
    </DashboardLayout>
  );
}
