"use client";

import { AnimatedHeroBackground } from '@/components/animated-hero-background';
import { RootedBalanceCircle } from '@/components/rooted-balance-circle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Calendar, ArrowRight, Activity, Brain, Users, Award, TrendingUp, Scale, Target, TrendingDown, Utensils } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

const features = [
  {
    icon: Calendar,
    title: 'Natural Cycle Tracking',
    description: 'Track your body\'s natural rhythms and align your wellness practices with nature\'s cycles for optimal health.',
    image: '/generated/wellness-coach-2.png',
  },
  {
    icon: Sparkles,
    title: 'Organic Nutrition Guide',
    description: 'Discover whole foods, seasonal eating, and plant-based recipes that nourish your body naturally.',
    image: '/generated/wellness-coach-3.png',
  },
  {
    icon: Activity,
    title: 'Mindful Movement',
    description: 'Practice yoga, walking meditations, and gentle exercises that connect you with your body and nature.',
    image: '/generated/wellness-coach-1.png',
  },
  {
    icon: Brain,
    title: 'Nature-Based Wellness',
    description: 'Daily practices inspired by the natural world to ground your mind, body, and spirit.',
    image: '/generated/wellness-coach-2.png',
  },
  {
    icon: Users,
    title: 'Grounded Community',
    description: 'Connect with like-minded individuals on a journey towards natural, sustainable wellness.',
    image: '/generated/wellness-coach-3.png',
  },
];

// Interactive counter hook
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      setCount(Math.floor(target * easeOut));

      if (now >= endTime) {
        setCount(target);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return { count, ref };
}

// Scroll reveal hook
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { isVisible, ref };
}

// Interactive Feature Card Component
function InteractiveFeatureCard({ feature, index, Icon }: { feature: any; index: number; Icon: any }) {
  const { isVisible, ref } = useScrollReveal();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-8 text-center transition-all duration-500 cursor-pointer group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex justify-center mb-5 transition-transform duration-300"
           style={{ transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)' }}>
        <div className="relative">
          <Icon className="w-12 h-12 text-primary transition-all duration-300" strokeWidth={1.5} />
          {isHovered && (
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-primary">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed text-sm transition-all duration-300"
         style={{ transform: isHovered ? 'scale(1.02)' : 'scale(1)' }}>
        {feature.description}
      </p>

      {/* Hover decoration */}
      <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500 mx-auto group-hover:w-full" />
    </div>
  );
}

// Mission Section with Scroll Reveal
function MissionSection() {
  const { isVisible, ref } = useScrollReveal();

  return (
    <section className="py-20 section-spacing" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          className="inline-block mb-6 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-10deg)',
          }}
        >
          <Heart className="w-16 h-16 text-primary mx-auto animate-pulse" strokeWidth={1.5} />
        </div>
        <h2
          className="text-3xl md:text-4xl mb-6 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '200ms',
          }}
        >
          Our Mission
        </h2>
        <p
          className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '400ms',
          }}
        >
          Our mission is to empower women's wellness. As women, we are constantly balancing countless responsibilities and roles.
          rooted is here to help you balance and refine wellness—not as another task on your to-do list, but as a gentle, nurturing practice
          that works with your body's natural rhythms. We promote self-awareness, body neutrality, and holistic health through a
          cycle-synced approach that honors where you are in your journey.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: Heart, title: 'Body Neutrality', desc: 'Progress without before/after photos', delay: '600ms' },
            { icon: TrendingUp, title: 'Empowerment', desc: 'Build agency through cycle education', delay: '700ms' },
            { icon: Users, title: 'Community', desc: 'Collective empowerment over competition', delay: '800ms' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: item.delay,
              }}
            >
              <div className="flex justify-center mb-4">
                <item.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section with Scroll Reveal
function CTASection() {
  const { isVisible, ref } = useScrollReveal();

  return (
    <section className="max-w-6xl mx-auto px-6 section-spacing-lg" ref={ref}>
      <div
        className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl text-center p-12 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02]"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of women who are transforming their wellness journey with personalized,
            holistic care designed just for them.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-6 shadow-sm hover:shadow-xl transition-all hover:scale-110 active:scale-95 group relative overflow-hidden">
              <span className="relative z-10 flex items-center text-lg font-semibold">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Weight & Goals Section with Animated Counters
function WeightGoalsSection() {
  const { isVisible, ref } = useScrollReveal();
  const currentWeight = useCountUp(152, 1500);
  const targetWeight = useCountUp(145, 1500);
  const logsCount = useCountUp(24, 1200);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setProgressWidth(43), 300);
    }
  }, [isVisible]);

  return (
    <section className="section-spacing-lg" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-12 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="inline-block mb-4 px-5 py-2 bg-[hsl(35,40%,94%)] rounded-full border border-black/10">
            <span className="text-sm font-semibold text-secondary">Track Your Progress</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">Weight & Goals at Your Fingertips</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor your journey with intelligent tracking that adapts to your body's natural rhythms and celebrates every milestone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Current Weight Card with animated counter */}
          <div
            className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
              transitionDelay: '200ms',
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  <h3 className="text-xl font-semibold">Current Weight</h3>
                </div>
                <div className="space-y-2" ref={currentWeight.ref}>
                  <p className="text-5xl font-bold text-primary">
                    {currentWeight.count}.4 <span className="text-2xl text-muted-foreground">lbs</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Last updated: Today at 7:30 AM</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-black/10 hover:border-secondary/30 transition-all">
              <TrendingDown className="w-5 h-5 text-secondary flex-shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-sm font-medium">3.2 lbs lost</p>
                <p className="text-xs text-muted-foreground">over 30 days</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                On Track
              </Badge>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border border-black/5 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">7 Days</p>
                <p className="text-lg font-bold text-primary">-0.8</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-black/5 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">30 Days</p>
                <p className="text-lg font-bold text-secondary">-3.2</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-black/5 hover:shadow-md transition-shadow" ref={logsCount.ref}>
                <p className="text-xs text-muted-foreground mb-1">Logs</p>
                <p className="text-lg font-bold text-accent-foreground">{logsCount.count}</p>
              </div>
            </div>
          </div>

          {/* Active Goal Card with animated progress */}
          <div
            className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transitionDelay: '400ms',
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-8 h-8 text-secondary" strokeWidth={1.5} />
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
                <div ref={targetWeight.ref}>
                  <p className="text-sm text-muted-foreground mb-1">Target Weight</p>
                  <p className="text-3xl font-bold text-secondary">
                    {targetWeight.count}.0 <span className="text-lg text-muted-foreground">lbs</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">To Go</p>
                  <p className="text-2xl font-bold text-primary">7.4 <span className="text-sm text-muted-foreground">lbs</span></p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-secondary">{progressWidth}%</span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-black/10 hover:border-secondary/20 transition-all">
                <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Weekly Target:</strong> 1.5 lbs per week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Scale, title: 'Smart Weight Tracking', desc: 'Log your weight effortlessly and visualize trends that sync with your menstrual cycle phases', color: 'primary' },
            { icon: Target, title: 'Personalized Goals', desc: 'Set cutting, bulking, or maintenance goals tailored to your body and lifestyle', color: 'secondary' },
            { icon: TrendingUp, title: 'Progress Insights', desc: 'AI analyzes your patterns and provides encouragement without judgment or pressure', color: 'secondary' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${600 + idx * 100}ms`,
              }}
            >
              <div className="flex justify-center mb-4">
                <item.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/weight">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-8 shadow-sm hover:shadow-md hover:scale-105 transition-all">
              <Scale className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Start Tracking
              <ArrowRight className="ml-2 w-5 h-5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowScrollTop(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Botanical background with reduced opacity - matches dashboard */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url('/backgrounds/botanical-pattern.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />
      {/* Pure white background layer */}
      <div className="fixed inset-0 -z-20 bg-white" />

      {/* Header - Matches dashboard styling */}
      <header className="relative z-40 bg-white/95 backdrop-blur-md border-b border-black/10 px-6 py-5 sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo/Brand - Left side */}
          <div>
            <div className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-wider">
              <span className="text-foreground">ROOTED</span>
            </div>
            <div className="text-xs text-muted-foreground font-light tracking-wide">
              Grounded in Nature
            </div>
          </div>

          {/* Navigation - Right side */}
          <nav className="flex items-center gap-6">
            <Link href="#features" className="hidden md:inline-block text-foreground hover:text-primary transition-colors font-medium text-sm">
              Features
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 shadow-sm hover:shadow-md transition-all text-sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Clean, minimal with parallax */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 overflow-hidden">
        {/* Animated Background Layer with parallax */}
        <div style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <AnimatedHeroBackground />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center"
             style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
          <div className="inline-block mb-6 px-8 py-3.5 bg-[hsl(35,40%,94%)] rounded-full border border-black/10">
            <span className="text-base font-semibold text-primary">Wellness Grounded in Nature</span>
          </div>
          <h1 className="text-5xl md:text-7xl mb-8 leading-tight">
            Ground Yourself in Natural Wellness
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
            Rooted empowers you to reconnect with nature and your body through holistic wellness — blending organic nutrition, mindful movement, and sustainable daily rituals.
          </p>
          <p className="text-lg md:text-xl mb-10 leading-relaxed text-foreground/80">
            Build wellness practices that are <strong>rooted in nature</strong>, grounded in self-care.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-7 text-lg font-semibold shadow-sm hover:shadow-xl transition-all hover:scale-110 active:scale-95 relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="rounded-full px-12 py-7 text-lg font-semibold border border-black/10 bg-white hover:bg-[hsl(35,40%,94%)] transition-all hover:scale-110 active:scale-95 hover:border-primary/30 group">
                <span className="group-hover:text-primary transition-colors">Learn More</span>
              </Button>
            </Link>
          </div>

          {/* Oval button for meal plan personalization */}
          <div className="mt-8 text-center">
            <Link href="/nutrition/quiz">
              <Button
                variant="outline"
                className="rounded-full px-8 py-3 text-sm font-medium border border-black/10 bg-white hover:bg-[hsl(35,40%,94%)] transition-all hover:scale-105"
              >
                <Utensils className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Personalize your meal plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement with scroll reveal */}
      <MissionSection />

      {/* Rooted Balance Circle Section */}
      <section className="relative section-spacing">
        <div className="max-w-6xl mx-auto px-6">
          <RootedBalanceCircle />
        </div>
      </section>

      {/* Features Section with scroll reveal */}
      <section id="features" className="section-spacing-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Smart, Intuitive Wellness</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A female-centered ecosystem that uses AI and cycle syncing to personalize your wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <InteractiveFeatureCard key={index} feature={feature} index={index} Icon={Icon} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Weight & Goals Tracking Section with interactive counters */}
      <WeightGoalsSection />

      {/* Smart Weekly Calorie System */}
      <section className="relative overflow-hidden section-spacing-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-5 py-2 bg-[hsl(35,40%,94%)] rounded-full border border-black/10">
              <span className="text-sm font-semibold text-primary">Intelligent Nutrition</span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Smart Weekly Calorie Balance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your life has plans — dinners out, celebrations, weekends with friends. Stay on track while enjoying life with AI that adapts to your schedule, cycle, and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-12">
            <div className="space-y-6">
              <div className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
                <div className="flex gap-4 items-start">
                  <Calendar className="w-8 h-8 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Verified Plans? No Problem</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Going out this week? Our AI automatically rebalances your meal plans around drinking, eating out, and special events while keeping you on track with your fitness goals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
                <div className="flex gap-4 items-start">
                  <Activity className="w-8 h-8 text-secondary flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Cycle-Synced Intelligence</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Integrates cycle tracking to adjust nutrition needs based on where you are hormonally — because your body's needs change throughout the month.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-6">
                <div className="flex gap-4 items-start">
                  <TrendingUp className="w-8 h-8 text-accent-foreground flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Healthy Balance of Living</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Fitness goals shouldn't mean sacrificing your social life. Find the sweet spot between wellness and enjoying life's moments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(35,40%,94%)] border border-black/10 rounded-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h3 className="text-2xl font-semibold">How It Works</h3>
                  <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted-foreground">AI-powered rebalancing in three steps</p>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-black/10 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl font-bold text-primary flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1.5 text-base">Share Your Week</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Tell us about upcoming dinners, drinks, or events
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-black/10 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl font-bold text-secondary flex-shrink-0">
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
                  <div className="bg-white rounded-2xl p-6 border border-black/10 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl font-bold text-accent-foreground flex-shrink-0">
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

              <div className="mt-8 p-4 bg-[hsl(35,40%,94%)] rounded-xl border border-black/10">
                <p className="text-sm text-center text-foreground/80 italic">
                  <Heart className="w-4 h-4 inline-block mr-1 text-secondary" strokeWidth={1.5} />
                  "Because wellness is about balance, not perfection"
                </p>
              </div>
            </div>
          </div>

          {/* Additional benefits row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-6 rounded-2xl bg-[hsl(35,40%,94%)] border border-black/10 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <Award className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Weekly Tracking</h5>
              <p className="text-xs text-muted-foreground">Flexible daily goals that balance out over 7 days</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[hsl(35,40%,94%)] border border-black/10 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <Brain className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Smart AI</h5>
              <p className="text-xs text-muted-foreground">Learns your patterns and preferences over time</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[hsl(35,40%,94%)] border border-black/10 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <Heart className="w-8 h-8 text-accent-foreground" strokeWidth={1.5} />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Zero Guilt</h5>
              <p className="text-xs text-muted-foreground">Enjoy life's moments without derailing progress</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[hsl(35,40%,94%)] border border-black/10 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <Activity className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h5 className="font-semibold mb-1 text-sm">Sustainable</h5>
              <p className="text-xs text-muted-foreground">Build habits that work with your lifestyle</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with scroll reveal */}
      <CTASection />

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowRight className="w-6 h-6 -rotate-90 group-hover:scale-110 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
}