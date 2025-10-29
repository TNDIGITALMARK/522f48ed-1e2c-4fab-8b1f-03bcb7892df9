"use client";

import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Calendar, ArrowRight, Activity, Brain, Users, Award, TrendingUp, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: Calendar,
    title: 'Smart Cycle Syncing',
    description: 'AI learns your hormonal patterns and adjusts workout intensity, macros, and recovery for each phase.',
    image: '/generated/wellness-coach-2.png',
  },
  {
    icon: Sparkles,
    title: 'Smart Nutrition Planner',
    description: 'AI fridge scanner, dynamic meal planning, and Bloom Score for food labels to optimize your nutrition.',
    image: '/generated/wellness-coach-3.png',
  },
  {
    icon: Activity,
    title: 'Workout Sync System',
    description: 'Cycle-based training that adapts to your energy levels with personalized workouts for every phase.',
    image: '/generated/wellness-coach-1.png',
  },
  {
    icon: Leaf,
    title: 'Gamified Garden',
    description: 'Build your virtual garden as you grow habits. Each meal and workout blooms into beautiful rewards.',
    image: '/generated/wellness-coach-1.png',
  },
  {
    icon: Brain,
    title: 'AI Wellness Companion',
    description: 'Get daily affirmations, cycle insights, and personalized health education tailored to you.',
    image: '/generated/wellness-coach-2.png',
  },
  {
    icon: Users,
    title: 'Community & Support',
    description: 'Connect by cycle phase or goals in a body-positive space for empowerment and inclusion.',
    image: '/generated/wellness-coach-3.png',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-accent/10">
      {/* Header/Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BloomLogo />
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </Link>
            <Link href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-foreground hover:text-primary transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </nav>
          <Link href="/dashboard">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-6">
              Download App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">Wellness Rooted in Self-Compassion</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
              Not a Diet — a Dialogue with Your Body
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Bloom empowers women to reconnect with their bodies through smart, intuitive wellness — blending holistic nutrition, emotional awareness, and cycle-synced care.
            </p>
            <p className="text-lg mb-8 leading-relaxed text-foreground/80">
              Make fitness a form of <strong>self-care</strong>, not self-control.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-bloom">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[3rem] blur-3xl" />
              <Image
                src="/generated/phone-mockup.png"
                alt="Bloom App Preview"
                width={400}
                height={600}
                className="relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <Heart className="w-16 h-16 text-primary mx-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            To help women redefine fitness — not as punishment or perfection, but as a lifelong relationship with their body.
            Bloom promotes wellness, body neutrality, and self-awareness through a holistic, cycle-synced, and sociologically informed lens.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Body Neutrality</h3>
              <p className="text-muted-foreground">Progress without before/after photos</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Empowerment</h3>
              <p className="text-muted-foreground">Build agency through cycle education</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">Collective empowerment over competition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-background via-cream/30 to-accent/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Smart, Intuitive Wellness</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A female-centered ecosystem that uses AI and cycle syncing to personalize your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bloom-card text-center hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Smart Weekly Calorie System */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-accent/20 rounded-full">
                <span className="text-sm font-medium text-accent-foreground">Revolutionary Approach</span>
              </div>
              <h2 className="text-4xl mb-6">Smart Weekly Calorie Balance</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Most calorie trackers judge your day in isolation, causing guilt or binge–restrict cycles.
                Bloom tracks calories weekly, allowing flexibility and smart adaptation.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Flexible Distribution</h4>
                    <p className="text-muted-foreground text-sm">
                      Redistributes weekly calories based on your cycle phase automatically
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Eliminates Guilt</h4>
                    <p className="text-muted-foreground text-sm">
                      Had 200 extra calories? We adjust tomorrow's target — you're still on track
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Hormonal Alignment</h4>
                    <p className="text-muted-foreground text-sm">
                      Aligns with your body's natural changes throughout your cycle
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8">
              <h3 className="text-2xl mb-6 text-center">How It Works</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-bloom">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                    <h4 className="font-semibold">Set Your Goal</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Choose your objective (lose, maintain, or gain)
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-bloom">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">2</div>
                    <h4 className="font-semibold">Weekly Total Set</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Bloom calculates your optimal weekly calorie budget
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-bloom">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/50 text-accent-foreground flex items-center justify-center text-sm font-bold">3</div>
                    <h4 className="font-semibold">Smart Redistribution</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Daily targets adjust based on your cycle and yesterday's intake
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Card className="bloom-card bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/10 border-none text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl mb-6">Ready to Bloom?</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of women who are transforming their wellness journey with personalized,
              holistic care designed just for them.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-bloom-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <BloomLogo className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Empowering women through holistic wellness and self-care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Facebook</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>© 2025 Bloom by Rooted. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}