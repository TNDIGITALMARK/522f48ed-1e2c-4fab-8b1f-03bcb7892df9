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
              Your Body's Wellness Partner
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
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-cream via-white to-accent/5">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold text-primary">Intelligent Nutrition</span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Smart Weekly Calorie Balance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your life has plans — dinners out, celebrations, weekends with friends. Stay on track while enjoying life with AI that adapts to your schedule, cycle, and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start mb-12">
            <div className="space-y-6">
              <div className="bloom-card hover:shadow-bloom-lg transition-all duration-300 bg-gradient-to-br from-white to-primary/5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-bloom">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Verified Plans? No Problem</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Going out this week? Our AI automatically rebalances your meal plans around drinking, eating out, and special events while keeping you on track with your fitness goals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bloom-card hover:shadow-bloom-lg transition-all duration-300 bg-gradient-to-br from-white to-secondary/5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center flex-shrink-0 shadow-bloom">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Cycle-Synced Intelligence</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Integrates cycle tracking to adjust nutrition needs based on where you are hormonally — because your body's needs change throughout the month.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bloom-card hover:shadow-bloom-lg transition-all duration-300 bg-gradient-to-br from-white to-accent/10">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-accent flex items-center justify-center flex-shrink-0 shadow-bloom">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Healthy Balance of Living</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Fitness goals shouldn't mean sacrificing your social life. Find the sweet spot between wellness and enjoying life's moments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bloom-card bg-gradient-to-br from-white via-primary/5 to-secondary/5 border-2 border-primary/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-semibold">How It Works</h3>
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">AI-powered rebalancing in three steps</p>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-bloom-sm hover:shadow-bloom transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-base font-bold flex-shrink-0 shadow-md">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1.5 text-base">Share Your Week</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Tell Bloom about upcoming dinners, drinks, or events
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-bloom-sm hover:shadow-bloom transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-white flex items-center justify-center text-base font-bold flex-shrink-0 shadow-md">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1.5 text-base">AI Rebalances</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your meal plans adjust based on your social calendar and cycle phase
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-bloom-sm hover:shadow-bloom transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-pink-400 text-white flex items-center justify-center text-base font-bold flex-shrink-0 shadow-md">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1.5 text-base">Stay On Track</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Hit your fitness goals while enjoying life — no guilt, no restrictions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                <p className="text-sm text-center text-foreground/80 italic">
                  <Heart className="w-4 h-4 inline-block mr-1 text-secondary" />
                  "Because wellness is about balance, not perfection"
                </p>
              </div>
            </div>
          </div>

          {/* Additional benefits row */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Weekly Tracking</h5>
              <p className="text-xs text-muted-foreground">Flexible daily goals that balance out over 7 days</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-secondary/10">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Smart AI</h5>
              <p className="text-xs text-muted-foreground">Learns your patterns and preferences over time</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-accent/20">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Zero Guilt</h5>
              <p className="text-xs text-muted-foreground">Enjoy life's moments without derailing progress</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Sustainable</h5>
              <p className="text-xs text-muted-foreground">Build habits that work with your lifestyle</p>
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