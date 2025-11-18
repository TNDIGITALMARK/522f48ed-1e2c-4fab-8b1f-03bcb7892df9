'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Activity, Heart, ChevronRight } from 'lucide-react';

interface CycleHistoryData {
  year: number;
  cycles: {
    month: string;
    startDate: string;
    endDate: string;
    length: number;
    periodLength: number;
    flow: 'light' | 'medium' | 'heavy';
    symptoms: string[];
  }[];
}

export function CycleHistory() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Mock data - replace with actual data from database
  const historyData: CycleHistoryData[] = [
    {
      year: 2025,
      cycles: [
        {
          month: 'January',
          startDate: '2025-01-15',
          endDate: '2025-02-11',
          length: 28,
          periodLength: 6,
          flow: 'medium',
          symptoms: ['Cramps', 'Bloating', 'Mood swings']
        },
        {
          month: 'December',
          startDate: '2024-12-18',
          endDate: '2025-01-14',
          length: 29,
          periodLength: 5,
          flow: 'light',
          symptoms: ['Increased energy', 'Clear skin']
        }
      ]
    },
    {
      year: 2024,
      cycles: [
        {
          month: 'November',
          startDate: '2024-11-20',
          endDate: '2024-12-17',
          length: 34,
          periodLength: 6,
          flow: 'heavy',
          symptoms: ['Cramping', 'Fatigue', 'Headaches']
        },
        {
          month: 'October',
          startDate: '2024-10-24',
          endDate: '2024-11-19',
          length: 29,
          periodLength: 6,
          flow: 'medium',
          symptoms: ['Bloating', 'Mood swings']
        },
        {
          month: 'September',
          startDate: '2024-09-26',
          endDate: '2024-10-23',
          length: 28,
          periodLength: 5,
          flow: 'medium',
          symptoms: ['Mild cramping']
        },
        {
          month: 'August',
          startDate: '2024-08-29',
          endDate: '2024-09-25',
          length: 30,
          periodLength: 6,
          flow: 'heavy',
          symptoms: ['Cramping', 'Fatigue']
        }
      ]
    }
  ];

  const currentData = historyData.find(d => d.year === selectedYear);
  const allCycles = historyData.flatMap(d => d.cycles);

  // Calculate statistics
  const avgCycleLength = Math.round(
    allCycles.reduce((sum, c) => sum + c.length, 0) / allCycles.length
  );
  const avgPeriodLength = Math.round(
    allCycles.reduce((sum, c) => sum + c.periodLength, 0) / allCycles.length
  );
  const cycleVariation = Math.max(...allCycles.map(c => c.length)) - Math.min(...allCycles.map(c => c.length));

  // Render period length dots
  const renderPeriodDots = (periodLength: number) => {
    const dots = [];
    const maxDots = 8;

    for (let i = 0; i < maxDots; i++) {
      const isFilled = i < periodLength;
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            isFilled ? 'bg-red-400' : 'bg-gray-200'
          }`}
        />
      );
    }

    return <div className="flex gap-1">{dots}</div>;
  };

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'light':
        return 'bg-pink-100 text-pink-700';
      case 'medium':
        return 'bg-pink-200 text-pink-800';
      case 'heavy':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Cycle History</h2>
          <Badge variant="secondary" className="text-sm">
            {allCycles.length} Cycles Tracked
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Cycle</p>
                <p className="text-2xl font-bold">{avgCycleLength} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Period Length</p>
                <p className="text-2xl font-bold">{avgPeriodLength} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cycle Variations</p>
                <p className="text-2xl font-bold">{cycleVariation}±{Math.ceil(cycleVariation / 2)} days</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Year Selector */}
      <div className="flex gap-2">
        <Button
          variant={selectedYear === 2025 ? 'default' : 'outline'}
          onClick={() => setSelectedYear(2025)}
        >
          2025
        </Button>
        <Button
          variant={selectedYear === 2024 ? 'default' : 'outline'}
          onClick={() => setSelectedYear(2024)}
        >
          2024
        </Button>
      </div>

      {/* Cycle Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          {selectedYear} Cycles
        </h3>

        {currentData?.cycles.map((cycle, index) => (
          <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Cycle Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{cycle.month} {selectedYear}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cycle.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(cycle.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Cycle Length Visualization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cycle Length</span>
                  <span className="font-semibold">{cycle.length} days</span>
                </div>
                {renderPeriodDots(cycle.periodLength)}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Period: {cycle.periodLength} days</span>
                  <Badge className={getFlowColor(cycle.flow)} variant="secondary">
                    {cycle.flow} flow
                  </Badge>
                </div>
              </div>

              {/* Symptoms */}
              {cycle.symptoms.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Symptoms Logged:</p>
                  <div className="flex flex-wrap gap-2">
                    {cycle.symptoms.map((symptom, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
