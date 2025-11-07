"use client";

import { Navigation } from '@/components/navigation';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Sun, Moon, Heart, Sparkles, PenTool, Image as ImageIcon, Sticker, Camera } from 'lucide-react';
import Link from 'next/link';

const ritualCategories = [
  { name: 'Journaling', icon: BookOpen, href: '/rituals', description: 'Express your journey' },
  { name: 'Morning', icon: Sun, href: '/rituals/morning', description: 'Start your day' },
  { name: 'Evening', icon: Moon, href: '/rituals/evening', description: 'Wind down' },
  { name: 'Movement', icon: Heart, href: '/rituals/movement', description: 'Body & breath' },
];

const journalPrompts = [
  {
    id: 1,
    category: 'Morning Reflection',
    prompt: 'What am I grateful for today?',
    icon: '🌅',
    color: 'from-amber-100 to-orange-100',
    borderColor: 'border-amber-300'
  },
  {
    id: 2,
    category: 'Self-Care Check',
    prompt: 'How is my body feeling right now?',
    icon: '💆‍♀️',
    color: 'from-pink-100 to-rose-100',
    borderColor: 'border-pink-300'
  },
  {
    id: 3,
    category: 'Cycle Awareness',
    prompt: 'What phase am I in? How does it affect my energy?',
    icon: '🌙',
    color: 'from-purple-100 to-indigo-100',
    borderColor: 'border-purple-300'
  },
  {
    id: 4,
    category: 'Evening Reflection',
    prompt: 'What brought me joy today?',
    icon: '✨',
    color: 'from-blue-100 to-cyan-100',
    borderColor: 'border-blue-300'
  },
  {
    id: 5,
    category: 'Intention Setting',
    prompt: 'What do I want to nurture in myself?',
    icon: '🌱',
    color: 'from-green-100 to-emerald-100',
    borderColor: 'border-green-300'
  },
  {
    id: 6,
    category: 'Emotional Check-in',
    prompt: 'What emotions am I experiencing?',
    icon: '💝',
    color: 'from-red-100 to-pink-100',
    borderColor: 'border-red-300'
  }
];

export default function RitualsPage() {
  return (
    <div className="min-h-screen bg-textile-beige textile-overlay-cream pb-24">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 shadow-bloom-sm px-6 py-4 animate-fade-in-up">
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
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4 border border-purple-300">
            <span className="text-2xl">🌳</span>
            <span className="text-sm font-medium text-purple-900">Connected to your Tree of Life</span>
          </div>
          <h1 className="text-4xl mb-2">Wellness Rituals</h1>
          <p className="text-muted-foreground text-lg">
            Express your journey through journaling and curated wellness practices
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ritualCategories.map((category) => {
              const Icon = category.icon;
              const isActive = category.name === 'Journaling';
              return (
                <Link key={category.name} href={category.href}>
                  <Card className={`bloom-card text-center cursor-pointer transition-all ${
                    isActive ? 'bg-primary/10 border-primary/50' : 'hover:bg-muted/50'
                  }`}>
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h3 className={`font-semibold mb-1 ${isActive ? 'text-primary' : ''}`}>{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured: Digital Canvas Journaling */}
        <Card className="bloom-card mb-8 bg-gradient-to-br from-secondary/20 to-secondary/5 border-none overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0 shadow-bloom">
              <PenTool className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-3 bg-secondary text-secondary-foreground">Create & Express</Badge>
              <h2 className="text-2xl font-semibold mb-2">Digital Canvas Journaling</h2>
              <p className="text-muted-foreground mb-4">
                Create beautiful visual journal entries with photos, stickers, and text. Express your day like a canvas!
              </p>
              <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
                <Badge variant="outline" className="gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Photos
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Sticker className="w-3 h-3" />
                  Stickers
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Camera className="w-3 h-3" />
                  Gifs
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Effects
                </Badge>
              </div>
              <Link href="/rituals/journaling">
                <Button className="gap-2 shadow-bloom">
                  <PenTool className="w-5 h-5" />
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Quick Reflection Prompts */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Quick Reflection Prompts</h2>
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="w-3 h-3" />
              6 Prompts
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {journalPrompts.map((item) => (
              <Card
                key={item.id}
                className={`bloom-card group cursor-pointer bg-gradient-to-br ${item.color} border ${item.borderColor} hover:shadow-bloom-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {item.prompt}
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-white/80 hover:bg-white group-hover:border-primary transition-all"
                    >
                      Reflect Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Text-Based Quick Entry */}
        <Card className="bloom-card bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Quick Text Entry</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sometimes a few words are all you need. Capture your thoughts quickly with our simple text journaling.
              </p>
              <textarea
                placeholder="What's on your mind today? 💭"
                className="w-full min-h-[100px] p-4 rounded-xl border border-border bg-white resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <div className="flex gap-3 mt-3">
                <Button size="sm" className="shadow-bloom">
                  Save Entry
                </Button>
                <Button size="sm" variant="outline">
                  Add to Canvas
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}
