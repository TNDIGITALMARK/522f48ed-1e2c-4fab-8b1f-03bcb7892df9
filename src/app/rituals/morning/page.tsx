"use client";

import { Navigation } from '@/components/navigation';
import { RootedHeader } from '@/components/rooted-header';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sun, Clock, Sparkles, Coffee, Sunrise } from 'lucide-react';
import Link from 'next/link';

const morningRituals = [
  {
    id: 1,
    title: 'Morning Gratitude Practice',
    duration: 5,
    description: 'Start your day with intention by reflecting on three things you\'re grateful for',
    icon: '🙏',
    color: 'from-amber-100 to-yellow-100',
    borderColor: 'border-amber-300',
  },
  {
    id: 2,
    title: 'Cycle Check-In',
    duration: 3,
    description: 'Connect with your body and note where you are in your menstrual cycle',
    icon: '🌙',
    color: 'from-purple-100 to-indigo-100',
    borderColor: 'border-purple-300',
  },
  {
    id: 3,
    title: 'Hydration Ritual',
    duration: 2,
    description: 'Begin with a glass of water and set an intention to nourish yourself today',
    icon: '💧',
    color: 'from-blue-100 to-cyan-100',
    borderColor: 'border-blue-300',
  },
  {
    id: 4,
    title: 'Sunrise Meditation',
    duration: 10,
    description: 'Guided meditation to align with the energy of a new day',
    icon: '🌅',
    color: 'from-orange-100 to-pink-100',
    borderColor: 'border-orange-300',
  },
  {
    id: 5,
    title: 'Affirmation Setting',
    duration: 5,
    description: 'Choose an empowering affirmation to carry with you throughout the day',
    icon: '✨',
    color: 'from-pink-100 to-rose-100',
    borderColor: 'border-pink-300',
  },
  {
    id: 6,
    title: 'Gentle Stretching',
    duration: 8,
    description: 'Wake up your body with simple stretches you can do in bed or standing',
    icon: '🧘‍♀️',
    color: 'from-green-100 to-emerald-100',
    borderColor: 'border-green-300',
  },
];

export default function MorningPage() {
  return (
    <div className="min-h-screen bg-textile-pearl textile-overlay-green pb-24">
      {/* Header */}
      <RootedHeader />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/rituals">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Rituals
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4 border border-amber-300">
            <Sun className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-medium text-amber-900">Morning Rituals</span>
          </div>
          <h1 className="text-4xl mb-2">Start Your Day with Intention</h1>
          <p className="text-muted-foreground text-lg">
            Create a mindful morning routine that honors your body and sets a positive tone
          </p>
        </div>

        {/* Featured Morning Flow */}
        <Card className="bloom-card mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-bloom">
              <Sunrise className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-amber-600 text-white">Complete Morning Flow</Badge>
              <h2 className="text-2xl font-semibold mb-2">Full Morning Ritual Sequence</h2>
              <p className="text-muted-foreground mb-4">
                Follow this complete 30-minute sequence to start your day grounded, energized, and aligned with your intentions
              </p>
              <div className="flex items-center gap-4">
                <Button className="gap-2 shadow-bloom">
                  <Sun className="w-5 h-5" />
                  Start Full Sequence
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  30 minutes
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-200">
            <div className="text-center">
              <div className="text-2xl mb-1">🧘‍♀️</div>
              <p className="text-xs text-muted-foreground">Meditation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💪</div>
              <p className="text-xs text-muted-foreground">Movement</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📝</div>
              <p className="text-xs text-muted-foreground">Journaling</p>
            </div>
          </div>
        </Card>

        {/* Individual Morning Rituals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Quick Morning Practices</h2>
            <Badge variant="secondary" className="gap-1">
              <Coffee className="w-3 h-3" />
              {morningRituals.length} Rituals
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {morningRituals.map((ritual) => (
              <Card
                key={ritual.id}
                className={`bloom-card group cursor-pointer bg-gradient-to-br ${ritual.color} border ${ritual.borderColor} hover:shadow-bloom-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{ritual.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {ritual.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {ritual.duration}m
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {ritual.description}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/80 hover:bg-white group-hover:border-primary transition-all"
                    >
                      Begin Practice
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Morning Tips */}
        <Card className="magazine-feature-card card-fabric bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Morning Ritual Tips</h3>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Start small - even 5 minutes of intentional morning time can shift your whole day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Keep your ritual flexible - honor what your body needs each morning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sync with your cycle - high energy practices during ovulation, gentle ones during menstruation</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
