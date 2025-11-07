"use client";

import { BloomingFlower } from './blooming-flower';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

/**
 * Example implementations of the BloomingFlower component
 * Demonstrating various use cases and configurations
 */

export function BloomingFlowerExamples() {
  const [controlledBloom, setControlledBloom] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Blooming Flower Component Examples</h2>
        <p className="text-muted-foreground">
          Inspired by Lively's animated dashboard design
        </p>
      </div>

      {/* Example 1: Auto-bloom with default settings */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-4">Auto-Bloom (Default)</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Automatically blooms after mounting with default settings
        </p>
        <div className="flex justify-center">
          <BloomingFlower />
        </div>
      </Card>

      {/* Example 2: Large size with custom timing */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-4">Large Flower - Custom Timing</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Size: 250px, Duration: 3000ms, Delay: 1000ms
        </p>
        <div className="flex justify-center">
          <BloomingFlower size={250} duration={3000} delay={1000} />
        </div>
      </Card>

      {/* Example 3: Controlled bloom with button */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-4">Controlled Bloom</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Click the button to toggle the bloom state
        </p>
        <div className="flex flex-col items-center gap-4">
          <BloomingFlower bloomed={controlledBloom} size={180} />
          <Button
            onClick={() => setControlledBloom(!controlledBloom)}
            className="rounded-full"
          >
            {controlledBloom ? 'Reset Flower' : 'Bloom Flower'}
          </Button>
        </div>
      </Card>

      {/* Example 4: Multiple small flowers */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-4">Multiple Flowers - Staggered</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Small flowers with different delays for cascading effect
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          <BloomingFlower size={120} delay={300} duration={2000} />
          <BloomingFlower size={120} delay={600} duration={2000} />
          <BloomingFlower size={120} delay={900} duration={2000} />
          <BloomingFlower size={120} delay={1200} duration={2000} />
        </div>
      </Card>

      {/* Example 5: Looping animation */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-4">Looping Animation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Flower continuously blooms and resets
        </p>
        <div className="flex justify-center">
          <BloomingFlower size={150} loop={true} duration={1800} />
        </div>
      </Card>

      {/* Example 6: Dashboard header integration */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <h3 className="text-xl font-semibold mb-4">Dashboard Header Integration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Example of flower integrated with greeting
        </p>
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Monday, January 1</p>
            <h1 className="text-4xl font-bold mb-2">Hi Sarah 👋</h1>
            <p className="text-muted-foreground">Welcome to your wellness dashboard</p>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <BloomingFlower size={180} duration={2500} delay={500} />
          </div>
        </div>
      </Card>

      {/* Example 7: Background decoration */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
          <BloomingFlower size={200} duration={3000} delay={800} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-4">Background Decoration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Flower used as subtle background element with reduced opacity
          </p>
          <p className="text-muted-foreground">
            This card demonstrates how the blooming flower can be used as a decorative
            background element to add organic visual interest without overwhelming the content.
          </p>
        </div>
      </Card>

      {/* Usage Code Examples */}
      <Card className="p-8 bg-muted/20">
        <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4 font-mono text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Basic auto-bloom:</p>
            <code className="block bg-card p-3 rounded-lg">
              {`<BloomingFlower />`}
            </code>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Custom size and timing:</p>
            <code className="block bg-card p-3 rounded-lg">
              {`<BloomingFlower size={180} duration={2500} delay={800} />`}
            </code>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Controlled bloom:</p>
            <code className="block bg-card p-3 rounded-lg">
              {`<BloomingFlower bloomed={isActive} size={150} />`}
            </code>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Looping animation:</p>
            <code className="block bg-card p-3 rounded-lg">
              {`<BloomingFlower loop={true} duration={1800} />`}
            </code>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Background decoration:</p>
            <code className="block bg-card p-3 rounded-lg">
              {`<div className="absolute opacity-20">
  <BloomingFlower size={120} delay={1500} />
</div>`}
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
}
