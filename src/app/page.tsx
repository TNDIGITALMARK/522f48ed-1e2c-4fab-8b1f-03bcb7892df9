"use client";

import { AnimatedHeroBackground } from '@/components/animated-hero-background';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Calendar, ArrowRight, Activity, Brain, Users, Award, TrendingUp, Scale, Target, TrendingDown } from 'lucide-react';
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
    <div className="min-h-screen bg-textile-beige">
      {/* Header/Navigation */}
      <header className="bg-card/95 backdrop-blur-md border-b-2 border-border/50 px-6 py-5 sticky top-0 z-50 shadow-bloom-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
            <span className="text-foreground italic">Bloom</span>
            <span className="text-sm text-muted-foreground font-light ml-2">
              by <span className="font-medium">Rooted</span>
            </span>
          </div>
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
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-2.5 shadow-bloom-sm hover:shadow-bloom transition-all">
              Download App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Animated Background */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 overflow-hidden textile-overlay-cream">
        {/* Animated Background Layer */}
        <AnimatedHeroBackground />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6 px-8 py-3.5 bg-gradient-to-r from-primary/12 to-secondary/12 rounded-full backdrop-blur-sm border border-primary/20 animate-fade-in-scale shadow-bloom-sm">
            <span className="text-base font-semibold text-primary">Wellness Rooted in Self-Compassion</span>
          </div>
          <h1 className="text-5xl md:text-7xl mb-8 leading-tight animate-fade-in-up">
            Your Body's Wellness Partner
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
            Bloom empowers women to reconnect with their bodies through smart, intuitive wellness — blending holistic nutrition, emotional awareness, and cycle-synced care.
          </p>
          <p className="text-lg md:text-xl mb-10 leading-relaxed text-foreground/80 animate-fade-in-up animation-delay-400">
            Make fitness a form of <strong>self-care</strong>, not self-control.
          </p>
          <div className="flex flex-wrap gap-5 justify-center animate-fade-in-up animation-delay-600">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-7 text-lg font-semibold shadow-bloom hover:shadow-bloom-lg transition-all hover:scale-105">
                Start Your Journey
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="rounded-full px-12 py-7 text-lg font-semibold border-2 border-primary/30 backdrop-blur-sm bg-card/90 hover:bg-card hover:border-primary/50 transition-all hover:scale-105 shadow-bloom-sm">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="texture-fabric py-20 textile-overlay-cream section-spacing">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
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
      <section id="features" className="section-spacing-lg bg-textile-pearl textile-overlay-green">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Smart, Intuitive Wellness</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A female-centered ecosystem that uses AI and cycle syncing to personalize your wellness journey
            </p>
          </div>

          <div className="magazine-grid-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="magazine-feature-card text-center p-8 relative z-10">
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-bloom-sm">
                      <Icon className="w-9 h-9 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[0.95rem]">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weight & Goals Tracking Section */}
      <section className="section-spacing-lg bg-textile-beige textile-overlay-cream">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full border border-secondary/20">
              <span className="text-sm font-semibold text-secondary">Track Your Progress</span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-4">Weight & Goals at Your Fingertips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor your journey with intelligent tracking that adapts to your body's natural rhythms and celebrates every milestone
            </p>
          </div>

          <div className="magazine-grid-2 mb-12">
            {/* Current Weight Card */}
            <Card className="magazine-feature-card bg-gradient-to-br from-primary/12 to-primary/5 border-2 border-primary/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Scale className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Current Weight</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-bold text-primary">152.4 <span className="text-2xl text-muted-foreground">lbs</span></p>
                    <p className="text-sm text-muted-foreground">Last updated: Today at 7:30 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-primary/10">
                <TrendingDown className="w-5 h-5 text-secondary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">3.2 lbs lost</p>
                  <p className="text-xs text-muted-foreground">over 30 days</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  On Track
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">7 Days</p>
                  <p className="text-lg font-bold text-primary">-0.8</p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">30 Days</p>
                  <p className="text-lg font-bold text-secondary">-3.2</p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Logs</p>
                  <p className="text-lg font-bold text-accent-foreground">24</p>
                </div>
              </div>
            </Card>

            {/* Active Goal Card */}
            <Card className="magazine-feature-card bg-gradient-to-br from-secondary/12 to-secondary/5 border-2 border-secondary/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold">Active Goal</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">📉</span>
                      <div>
                        <p className="text-2xl font-bold">Cutting Phase</p>
                        <p className="text-sm text-muted-foreground">Healthy weight loss journey</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Target Weight</p>
                    <p className="text-3xl font-bold text-secondary">145.0 <span className="text-lg text-muted-foreground">lbs</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">To Go</p>
                    <p className="text-2xl font-bold text-primary">7.4 <span className="text-sm text-muted-foreground">lbs</span></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-secondary">43%</span>
                  </div>
                  <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all"
                      style={{ width: '43%' }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-secondary/10">
                  <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Weekly Target:</strong> 1.5 lbs per week
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="magazine-grid-3">
            <div className="magazine-feature-card text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-bloom">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Smart Weight Tracking</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log your weight effortlessly and visualize trends that sync with your menstrual cycle phases
              </p>
            </div>

            <div className="bloom-card hover:shadow-bloom-lg transition-all duration-300 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 shadow-bloom">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Personalized Goals</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Set cutting, bulking, or maintenance goals tailored to your body and lifestyle
              </p>
            </div>

            <div className="magazine-feature-card text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/80 to-accent flex items-center justify-center mx-auto mb-4 shadow-bloom">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Progress Insights</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI analyzes your patterns and provides encouragement without judgment or pressure
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/weight">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-8 shadow-bloom">
                <Scale className="w-5 h-5 mr-2" />
                Start Tracking
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Weekly Calorie System */}
      <section className="relative overflow-hidden section-spacing-xl texture-fabric textile-overlay-cream">
        {/* Decorative darker sage green accent elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(120 25% 55% / 0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(110 30% 28% / 0.10) 0%, transparent 70%)' }} />

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

          <div className="magazine-grid-2 items-start mb-12">
            <div className="space-y-6">
              <div className="magazine-feature-card bg-gradient-to-br from-card to-primary/8 p-6">
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

              <div className="magazine-feature-card bg-gradient-to-br from-card to-secondary/8 p-6">
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

              <div className="magazine-feature-card bg-gradient-to-br from-card to-accent/10 p-6">
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

            <div className="magazine-feature-card bg-gradient-to-br from-card via-primary/8 to-secondary/8 border-2 border-primary/25 p-8">
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
          <div className="magazine-grid mt-12">
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
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Sustainable</h5>
              <p className="text-xs text-muted-foreground">Build habits that work with your lifestyle</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 section-spacing-lg">
        <Card className="magazine-feature-card bg-gradient-to-br from-secondary/15 via-accent/8 to-primary/12 border-2 border-accent/20 text-center p-12">
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
      <footer className="texture-fabric textile-overlay-cream border-t-2 border-border py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight mb-4">
                <span className="text-foreground italic">Bloom</span>
                <span className="text-sm text-muted-foreground font-light ml-2">
                  by <span className="font-medium">Rooted</span>
                </span>
              </div>
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