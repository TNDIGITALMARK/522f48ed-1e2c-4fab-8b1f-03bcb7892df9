"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Users, Sparkles, Sun, Moon, Heart, Leaf, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ritualCategories = [
  { name: 'All', icon: Sparkles },
  { name: 'Morning', icon: Sun },
  { name: 'Evening', icon: Moon },
  { name: 'Movement', icon: Heart },
  { name: 'Nutrition', icon: Leaf },
];

const wellnessRituals = [
  {
    id: 1,
    title: 'Morning Energizing Flow',
    duration: 15,
    category: 'Movement',
    phase: 'Follicular Phase',
    difficulty: 'Beginner',
    description: 'Gentle yoga sequence to awaken your body and boost morning energy',
    instructor: 'Emma Wilson',
    image: '/generated/wellness-coach-1.png',
  },
  {
    id: 2,
    title: 'Cycle Syncing Meditation',
    duration: 10,
    category: 'Evening',
    phase: 'All Phases',
    difficulty: 'All Levels',
    description: 'Guided meditation to connect with your body\'s natural rhythm',
    instructor: 'Maya Chen',
    image: '/generated/wellness-coach-2.png',
  },
  {
    id: 3,
    title: 'Nourish & Glow',
    duration: 20,
    category: 'Nutrition',
    phase: 'Menstruation',
    difficulty: 'Beginner',
    description: 'Iron-rich recipes and nutrition guidance for your menstrual phase',
    instructor: 'Sophie Laurent',
    image: '/generated/wellness-coach-3.png',
  },
  {
    id: 4,
    title: 'Evening Wind Down',
    duration: 12,
    category: 'Evening',
    phase: 'Luteal Phase',
    difficulty: 'All Levels',
    description: 'Calming breathwork and gentle stretches for restful sleep',
    instructor: 'Emma Wilson',
    image: '/generated/wellness-coach-1.png',
  },
  {
    id: 5,
    title: 'Ovulation Power Flow',
    duration: 25,
    category: 'Movement',
    phase: 'Ovulation',
    difficulty: 'Intermediate',
    description: 'High-energy workout to match your peak cycle phase',
    instructor: 'Maya Chen',
    image: '/generated/wellness-coach-2.png',
  },
  {
    id: 6,
    title: 'Self-Care Sunday',
    duration: 30,
    category: 'All',
    phase: 'All Phases',
    difficulty: 'All Levels',
    description: 'Complete self-care ritual including skincare, journaling, and relaxation',
    instructor: 'Sophie Laurent',
    image: '/generated/wellness-coach-3.png',
  },
];

export default function RitualsPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back to Garden Button */}
        <div className="mb-6">
          <Link href="/garden">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Garden
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4 border border-purple-300">
            <span className="text-2xl">🌳</span>
            <span className="text-sm font-medium text-purple-900">Connected to your Tree of Life</span>
          </div>
          <h1 className="text-4xl mb-2">Wellness Rituals</h1>
          <p className="text-muted-foreground text-lg">
            Curated practices designed for your unique journey. Access these anytime from the Tree of Life in your 3D Garden! 🌳✨
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {ritualCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Ritual */}
        <Card className="bloom-card mb-8 bg-gradient-to-br from-secondary/20 to-secondary/5 border-none overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-32 md:h-32 w-full h-48 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={wellnessRituals[0].image}
                alt={wellnessRituals[0].instructor}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <Badge className="mb-3 bg-secondary text-secondary-foreground">Featured Today</Badge>
              <h2 className="text-2xl font-semibold mb-2">{wellnessRituals[0].title}</h2>
              <p className="text-muted-foreground mb-4">{wellnessRituals[0].description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {wellnessRituals[0].duration} minutes
                </div>
                <Badge variant="outline">{wellnessRituals[0].phase}</Badge>
                <Badge variant="secondary">{wellnessRituals[0].difficulty}</Badge>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-bloom">
                <Play className="w-5 h-5" />
                Start Ritual
              </button>
            </div>
          </div>
        </Card>

        {/* All Rituals */}
        <div className="mb-8">
          <h2 className="text-2xl mb-4">All Rituals</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {wellnessRituals.slice(1).map((ritual) => (
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

        {/* Wellness Tips */}
        <Card className="bloom-card bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ritual Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Based on your ovulation phase, we recommend high-energy practices like the Ovulation Power Flow.
                Your body is at peak performance - embrace movement and creative expression!
              </p>
              <button className="text-primary font-medium hover:text-secondary transition-colors">
                Explore more recommendations →
              </button>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
