"use client";

import { Navigation } from '@/components/navigation';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const movementRituals = [
  {
    id: 1,
    title: 'Morning Energizing Flow',
    duration: 15,
    phase: 'Follicular Phase',
    difficulty: 'Beginner',
    description: 'Gentle yoga sequence to awaken your body and boost morning energy',
    instructor: 'Emma Wilson',
    image: '/generated/wellness-coach-1.png',
    featured: true,
  },
  {
    id: 2,
    title: 'Cycle Syncing Meditation',
    duration: 10,
    phase: 'All Phases',
    difficulty: 'All Levels',
    description: 'Guided meditation to connect with your body\'s natural rhythm',
    instructor: 'Maya Chen',
    image: '/generated/wellness-coach-2.png',
  },
  {
    id: 3,
    title: 'Evening Wind Down',
    duration: 12,
    phase: 'Luteal Phase',
    difficulty: 'All Levels',
    description: 'Calming breathwork and gentle stretches for restful sleep',
    instructor: 'Emma Wilson',
    image: '/generated/wellness-coach-1.png',
  },
  {
    id: 4,
    title: 'Ovulation Power Flow',
    duration: 25,
    phase: 'Ovulation',
    difficulty: 'Intermediate',
    description: 'High-energy workout to match your peak cycle phase',
    instructor: 'Maya Chen',
    image: '/generated/wellness-coach-2.png',
  },
  {
    id: 5,
    title: 'Gentle Restorative Yoga',
    duration: 20,
    phase: 'Menstruation',
    difficulty: 'Beginner',
    description: 'Slow, nurturing movements to support your body during menstruation',
    instructor: 'Sophie Laurent',
    image: '/generated/wellness-coach-3.png',
  },
  {
    id: 6,
    title: 'Strength & Balance',
    duration: 18,
    phase: 'Follicular Phase',
    difficulty: 'Intermediate',
    description: 'Build strength and stability with this empowering practice',
    instructor: 'Emma Wilson',
    image: '/generated/wellness-coach-1.png',
  },
];

export default function MovementPage() {
  const featuredRitual = movementRituals.find(r => r.featured);
  const otherRituals = movementRituals.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">Bloom</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full mb-4 border border-pink-300">
            <Heart className="w-4 h-4 text-pink-700" />
            <span className="text-sm font-medium text-pink-900">Movement & Body Rituals</span>
          </div>
          <h1 className="text-4xl mb-2">Movement Rituals</h1>
          <p className="text-muted-foreground text-lg">
            Yoga, meditation, and mindful movement practices synced to your cycle
          </p>
        </div>

        {/* Featured Ritual */}
        {featuredRitual && (
          <Card className="bloom-card mb-8 bg-gradient-to-br from-secondary/20 to-secondary/5 border-none overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 md:h-32 w-full h-48 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={featuredRitual.image}
                  alt={featuredRitual.instructor}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Badge className="mb-3 bg-secondary text-secondary-foreground">Featured Today</Badge>
                <h2 className="text-2xl font-semibold mb-2">{featuredRitual.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredRitual.description}</p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {featuredRitual.duration} minutes
                  </div>
                  <Badge variant="outline">{featuredRitual.phase}</Badge>
                  <Badge variant="secondary">{featuredRitual.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-bloom">
                    <Play className="w-5 h-5" />
                    Start Ritual
                  </button>
                  <p className="text-sm text-muted-foreground">
                    with {featuredRitual.instructor}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Filter by Phase */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
              All Phases
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              Menstruation
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              Follicular
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              Ovulation
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              Luteal
            </Badge>
          </div>
        </div>

        {/* All Movement Rituals */}
        <div className="mb-8">
          <h2 className="text-2xl mb-4">All Movement Practices</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {otherRituals.map((ritual) => (
              <Card key={ritual.id} className="bloom-card group cursor-pointer">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={ritual.image}
                      alt={ritual.instructor}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {ritual.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ritual.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {ritual.duration}m
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {ritual.phase}
                    </Badge>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Movement Benefits */}
        <Card className="bloom-card bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Movement & Your Cycle</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Syncing your movement practice with your menstrual cycle helps honor your body's natural energy fluctuations.
                During high-energy phases like ovulation, embrace vigorous flows. During menstruation, opt for gentle, restorative practices.
              </p>
              <button className="text-primary font-medium hover:text-secondary transition-colors">
                Learn more about cycle syncing →
              </button>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
