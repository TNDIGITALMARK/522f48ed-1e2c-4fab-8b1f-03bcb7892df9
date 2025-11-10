"use client";

import { Navigation } from '@/components/navigation';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Clock, Sparkles, Stars, CloudMoon } from 'lucide-react';
import Link from 'next/link';

const eveningRituals = [
  {
    id: 1,
    title: 'Evening Reflection',
    duration: 8,
    description: 'Journal about your day - what went well, what you learned, what you\'re letting go',
    icon: '📖',
    color: 'from-indigo-100 to-purple-100',
    borderColor: 'border-indigo-300',
  },
  {
    id: 2,
    title: 'Gentle Wind-Down Yoga',
    duration: 15,
    description: 'Slow, restorative poses to release tension and prepare your body for sleep',
    icon: '🧘‍♀️',
    color: 'from-purple-100 to-pink-100',
    borderColor: 'border-purple-300',
  },
  {
    id: 3,
    title: 'Gratitude Meditation',
    duration: 10,
    description: 'End your day by reflecting on moments of gratitude and contentment',
    icon: '🙏',
    color: 'from-blue-100 to-indigo-100',
    borderColor: 'border-blue-300',
  },
  {
    id: 4,
    title: 'Skincare Ritual',
    duration: 10,
    description: 'Transform your skincare routine into a mindful self-care practice',
    icon: '✨',
    color: 'from-pink-100 to-rose-100',
    borderColor: 'border-pink-300',
  },
  {
    id: 5,
    title: 'Sleep Meditation',
    duration: 12,
    description: 'Guided body scan and breathing exercises to ease you into restful sleep',
    icon: '😴',
    color: 'from-violet-100 to-purple-100',
    borderColor: 'border-violet-300',
  },
  {
    id: 6,
    title: 'Tea & Intention',
    duration: 5,
    description: 'Brew a calming tea and set intentions for tomorrow while you sip mindfully',
    icon: '🫖',
    color: 'from-amber-100 to-orange-100',
    borderColor: 'border-amber-300',
  },
];

export default function EveningPage() {
  return (
    <div className="min-h-screen bg-textile-pearl textile-overlay-green pb-24">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 shadow-bloom-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">rooted</span>
            <span className="text-sm text-muted-foreground font-light ml-2">
              by <span className="font-medium">Rooted</span>
            </span>
          </div>
        </div>
      </header>

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4 border border-indigo-300">
            <Moon className="w-4 h-4 text-indigo-700" />
            <span className="text-sm font-medium text-indigo-900">Evening Rituals</span>
          </div>
          <h1 className="text-4xl mb-2">Wind Down with Grace</h1>
          <p className="text-muted-foreground text-lg">
            Create a peaceful evening routine that honors rest and prepares you for restorative sleep
          </p>
        </div>

        {/* Featured Evening Flow */}
        <Card className="bloom-card mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-bloom">
              <CloudMoon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-indigo-600 text-white">Complete Evening Flow</Badge>
              <h2 className="text-2xl font-semibold mb-2">Full Wind-Down Sequence</h2>
              <p className="text-muted-foreground mb-4">
                A comprehensive 40-minute evening ritual to help you transition from the busyness of the day into restful, restorative sleep
              </p>
              <div className="flex items-center gap-4">
                <Button className="gap-2 shadow-bloom">
                  <Moon className="w-5 h-5" />
                  Start Full Sequence
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  40 minutes
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-200">
            <div className="text-center">
              <div className="text-2xl mb-1">📖</div>
              <p className="text-xs text-muted-foreground">Reflection</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🧘‍♀️</div>
              <p className="text-xs text-muted-foreground">Gentle Yoga</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">😴</div>
              <p className="text-xs text-muted-foreground">Sleep Prep</p>
            </div>
          </div>
        </Card>

        {/* Individual Evening Rituals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Evening Practices</h2>
            <Badge variant="secondary" className="gap-1">
              <Stars className="w-3 h-3" />
              {eveningRituals.length} Rituals
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {eveningRituals.map((ritual) => (
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

        {/* Evening Tips */}
        <Card className="magazine-feature-card card-fabric bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Evening Ritual Tips</h3>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Begin winding down 1-2 hours before bed for the best sleep quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Dim lights and reduce screen time to support your body's natural melatonin production</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Create a consistent routine - your body will begin to prepare for sleep automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>During your luteal phase, you may need extra rest - honor that need</span>
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
