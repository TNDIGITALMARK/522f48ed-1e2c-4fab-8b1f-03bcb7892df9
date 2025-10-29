"use client";

import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: Heart,
    title: 'Mindfulness & Meditation',
    description: 'Personalized practices to help you connect with your body and reduce daily stress.',
    image: '/generated/wellness-coach-1.png',
  },
  {
    icon: Calendar,
    title: 'Cycle Syncing & Hormone Balance',
    description: 'Track your cycle and receive phase-based wellness recommendations.',
    image: '/generated/wellness-coach-2.png',
  },
  {
    icon: Sparkles,
    title: 'Nutrition & Self-Care Rituals',
    description: 'Curated tips on food and daily practices to help you feel your best every day.',
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
            <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
              Flourish Your Whole Self
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive Wellness for Modern Women
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-bloom">
                  Learn More
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Download Now
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

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Holistic Wellness at Your Fingertips</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to nurture your mind, body, and spirit in one beautiful platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bloom-card text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-accent/30">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
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