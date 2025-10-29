"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Garden3DScene } from '@/components/3d-garden-scene';
import { TreeDeciduous, Sparkles, Camera, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Garden3DPage() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
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
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-4 border border-primary/30">
                <TreeDeciduous className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">3D Garden View</span>
              </div>
              <h1 className="text-4xl mb-2">Your Magical Garden</h1>
              <p className="text-muted-foreground text-lg">
                Explore your Tree of Life in a beautiful 3D world - Hay Day style!
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className="flex-shrink-0"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <Card className="bloom-card mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">How to Explore Your Garden</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>🖱️ <strong>Rotate:</strong> Click and drag to rotate the camera around your garden</p>
                  <p>📏 <strong>Zoom:</strong> Scroll to zoom in and out</p>
                  <p>✋ <strong>Pan:</strong> Right-click and drag to move the camera</p>
                  <p>📱 <strong>Mobile:</strong> Use one finger to rotate, two fingers to zoom and pan</p>
                  <p>🌳 <strong>Tree of Life:</strong> Click the magical purple tree to visit your wellness rituals!</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 3D Garden Scene */}
        <Card className="bloom-card p-0 overflow-hidden border-none mb-8">
          <Garden3DScene className="garden-3d-container" />
        </Card>

        {/* Garden Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bloom-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <TreeDeciduous className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tree of Life</p>
                <h3 className="text-2xl font-bold text-green-700">Level 8</h3>
              </div>
            </div>
          </Card>

          <Card className="bloom-card bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Garden Magic</p>
                <h3 className="text-2xl font-bold text-purple-700">342 Coins</h3>
              </div>
            </div>
          </Card>

          <Card className="bloom-card bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Garden Items</p>
                <h3 className="text-2xl font-bold text-pink-700">24 Plants</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Garden Features */}
        <div>
          <h2 className="text-2xl mb-4">Garden Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bloom-card hover:shadow-bloom-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌸</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Flower Beds</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Beautiful circular flower beds surround your tree, each with vibrant blooms in different colors.
                  </p>
                  <Badge variant="secondary" className="text-xs">8 Beds</Badge>
                </div>
              </div>
            </Card>

            <Card className="bloom-card hover:shadow-bloom-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🍄</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Magical Mushrooms</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Whimsical mushrooms dot the landscape, adding a touch of fairy tale magic to your garden.
                  </p>
                  <Badge variant="secondary" className="text-xs">6 Mushrooms</Badge>
                </div>
              </div>
            </Card>

            <Card className="bloom-card hover:shadow-bloom-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🪨</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Garden Rocks</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Natural stone decorations provide texture and depth to your 3D landscape.
                  </p>
                  <Badge variant="secondary" className="text-xs">6 Rocks</Badge>
                </div>
              </div>
            </Card>

            <Card className="bloom-card hover:shadow-bloom-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏠</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Garden Shed</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    A cozy wooden shed stores your gardening tools and provides rustic charm.
                  </p>
                  <Badge variant="secondary" className="text-xs">1 Building</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
