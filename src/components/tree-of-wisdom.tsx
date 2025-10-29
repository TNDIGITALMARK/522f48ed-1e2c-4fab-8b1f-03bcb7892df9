"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, Heart, Sparkles, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeOfWisdomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const DAILY_INSPIRATIONS = [
  {
    quote: "Growth is not a destination, but a continuous journey of self-discovery.",
    author: "Your Inner Wisdom",
    category: "Growth"
  },
  {
    quote: "Every small step you take towards wellness creates ripples of positive change.",
    author: "Tree of Wisdom",
    category: "Wellness"
  },
  {
    quote: "Your body is a garden; tend to it with love, nourishment, and patience.",
    author: "Ancient Wisdom",
    category: "Self-Care"
  },
  {
    quote: "In stillness, you find strength. In reflection, you find clarity.",
    author: "Mindful Practice",
    category: "Meditation"
  },
  {
    quote: "Each day is a fresh bloom waiting to unfold its beauty through your actions.",
    author: "Bloom Wisdom",
    category: "Inspiration"
  }
];

export function TreeOfWisdom({ open, onOpenChange, onComplete }: TreeOfWisdomProps) {
  const [activeTab, setActiveTab] = useState('inspiration');
  const [meditationMinutes, setMeditationMinutes] = useState(5);
  const [journalEntry, setJournalEntry] = useState('');
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>(['', '', '']);
  const [isStartingMeditation, setIsStartingMeditation] = useState(false);

  // Get today's inspiration (rotates based on day of year)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todaysInspiration = DAILY_INSPIRATIONS[dayOfYear % DAILY_INSPIRATIONS.length];

  const handleMeditationStart = () => {
    setIsStartingMeditation(true);
    // In a real app, this would launch a meditation timer/session
    setTimeout(() => {
      setIsStartingMeditation(false);
      alert(`Starting ${meditationMinutes} minute meditation session...`);
      onComplete?.();
    }, 1000);
  };

  const handleJournalSave = () => {
    if (journalEntry.trim()) {
      // In a real app, save to database
      console.log('Saving journal entry:', journalEntry);
      alert('Journal entry saved! 🌿 +20 Bloom Coins');
      setJournalEntry('');
      onComplete?.();
    }
  };

  const handleGratitudeSave = () => {
    const filledEntries = gratitudeEntries.filter(e => e.trim());
    if (filledEntries.length > 0) {
      // In a real app, save to database
      console.log('Saving gratitude entries:', filledEntries);
      alert(`Gratitude practice complete! 🙏 +${filledEntries.length * 10} Bloom Coins`);
      setGratitudeEntries(['', '', '']);
      onComplete?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-3xl">🌳</span>
            </div>
            <div>
              <DialogTitle className="text-2xl">Tree of Wisdom</DialogTitle>
              <DialogDescription>
                Your sacred space for reflection, meditation, and growth
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="inspiration">
              <Sparkles className="w-4 h-4 mr-2" />
              Daily Wisdom
            </TabsTrigger>
            <TabsTrigger value="meditation">
              <Brain className="w-4 h-4 mr-2" />
              Meditate
            </TabsTrigger>
            <TabsTrigger value="journal">
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="gratitude">
              <Heart className="w-4 h-4 mr-2" />
              Gratitude
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inspiration" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-3">
                    {todaysInspiration.category}
                  </Badge>
                  <blockquote className="text-2xl font-serif italic text-gray-800 leading-relaxed">
                    "{todaysInspiration.quote}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground mt-4">
                    — {todaysInspiration.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Today's wisdom • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            </Card>

            <Card className="p-6 bg-white/50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Reflection Prompts
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• How does this wisdom apply to your current journey?</li>
                <li>• What small action can you take today inspired by this message?</li>
                <li>• How can you share this wisdom with others?</li>
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="meditation" className="space-y-6">
            <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-semibold mb-3">Guided Meditation</h3>
              <p className="text-muted-foreground mb-8">
                Find your center, calm your mind, and connect with your inner wisdom
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Session Duration</label>
                  <div className="flex items-center justify-center gap-4">
                    {[3, 5, 10, 15, 20].map((minutes) => (
                      <Button
                        key={minutes}
                        variant={meditationMinutes === minutes ? "default" : "outline"}
                        size="lg"
                        onClick={() => setMeditationMinutes(minutes)}
                        className="w-16"
                      >
                        {minutes}m
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  onClick={handleMeditationStart}
                  disabled={isStartingMeditation}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  {isStartingMeditation ? 'Starting...' : `Start ${meditationMinutes} Minute Meditation`}
                </Button>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Earn <strong className="text-primary">+{meditationMinutes * 5} Bloom Coins</strong> for completing</p>
                  <p>🌱 Build mindfulness • 🧘‍♀️ Reduce stress • ✨ Find clarity</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Daily Journal</h3>
                  <p className="text-sm text-muted-foreground">Express your thoughts and feelings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What's on your mind today?
                  </label>
                  <Textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Write freely about your day, your feelings, your goals, or anything that comes to mind..."
                    className="min-h-[200px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {journalEntry.length} characters
                  </p>
                  <Button
                    onClick={handleJournalSave}
                    disabled={!journalEntry.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Save Entry (+20 Coins)
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/50">
              <h4 className="font-semibold mb-3">Journaling Prompts</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• What am I grateful for today?</li>
                <li>• What challenged me, and what did I learn?</li>
                <li>• How did I take care of my wellness today?</li>
                <li>• What intention do I want to set for tomorrow?</li>
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="gratitude" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-pink-50 to-rose-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Gratitude Practice</h3>
                  <p className="text-sm text-muted-foreground">List three things you're grateful for</p>
                </div>
              </div>

              <div className="space-y-4">
                {gratitudeEntries.map((entry, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium mb-2 block">
                      {index + 1}. I'm grateful for...
                    </label>
                    <Textarea
                      value={entry}
                      onChange={(e) => {
                        const newEntries = [...gratitudeEntries];
                        newEntries[index] = e.target.value;
                        setGratitudeEntries(newEntries);
                      }}
                      placeholder="Something that brought you joy, peace, or appreciation today..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                ))}

                <Button
                  onClick={handleGratitudeSave}
                  disabled={gratitudeEntries.every(e => !e.trim())}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Complete Practice (+{gratitudeEntries.filter(e => e.trim()).length * 10} Coins)
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white/50">
              <h4 className="font-semibold mb-3">Benefits of Gratitude</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 🧠 Improves mental health and reduces stress</li>
                <li>• 💖 Enhances relationships and emotional wellbeing</li>
                <li>• 😊 Increases happiness and life satisfaction</li>
                <li>• 💪 Boosts resilience and positive thinking</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
