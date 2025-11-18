"use client";

import { useEffect, useRef } from 'react';

interface HormoneWave3DProps {
  phase?: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function HormoneWave3D({
  phase = 'ovulation',
  width = 800,
  height = 200,
  className = '',
  onClick,
  clickable = false
}: HormoneWave3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Phase color mapping - copper/terracotta tones
    const phaseColors = {
      menstruation: { primary: '#C89D7E', shadow: 'rgba(200, 157, 126, 0.3)' },
      follicular: { primary: '#B88A6F', shadow: 'rgba(184, 138, 111, 0.3)' },
      ovulation: { primary: '#A67C5C', shadow: 'rgba(166, 124, 92, 0.3)' }, // Darker copper for ovulation
      luteal: { primary: '#C89D7E', shadow: 'rgba(200, 157, 126, 0.3)' }
    };

    const colors = phaseColors[phase];

    // Animation state
    let animationFrame: number;
    let time = 0;

    // Wave parameters for smooth, organic 3D effect
    const amplitude = height * 0.25;
    const frequency = 0.015;
    const phase1Offset = 0;
    const phase2Offset = Math.PI / 4;
    const phase3Offset = Math.PI / 2;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw multiple wave layers for 3D depth effect
      const centerY = height / 2;

      // Bottom shadow layer (darkest, most transparent)
      drawWavePath(ctx, time, centerY + 20, amplitude * 0.9, frequency, phase3Offset, colors.shadow, 8);

      // Middle shadow layer
      drawWavePath(ctx, time, centerY + 10, amplitude * 0.95, frequency, phase2Offset, colors.shadow, 6);

      // Top main wave (brightest, most opaque)
      drawWavePath(ctx, time, centerY, amplitude, frequency, phase1Offset, colors.primary, 5);

      // Update time for animation
      time += 0.01;

      animationFrame = requestAnimationFrame(draw);
    };

    const drawWavePath = (
      ctx: CanvasRenderingContext2D,
      time: number,
      baseY: number,
      amplitude: number,
      frequency: number,
      phaseOffset: number,
      color: string,
      lineWidth: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Create smooth bezier curve for organic wave
      for (let x = 0; x <= width; x += 2) {
        // Multiple sine waves combined for organic movement
        const wave1 = Math.sin(x * frequency + time + phaseOffset) * amplitude;
        const wave2 = Math.sin(x * frequency * 1.5 + time * 1.2 + phaseOffset) * (amplitude * 0.3);
        const wave3 = Math.sin(x * frequency * 0.7 + time * 0.8 + phaseOffset) * (amplitude * 0.2);

        const y = baseY + wave1 + wave2 + wave3;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [phase, width, height]);

  return (
    <div
      className={`relative ${className} ${clickable ? 'cursor-pointer transition-all hover:scale-[1.02] hover:shadow-bloom-lg' : ''}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); } : undefined}
    >
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="w-full h-auto"
      />

      {/* Label overlay */}
      <div className="absolute bottom-2 left-4 text-xs font-semibold text-primary/70 uppercase tracking-wider">
        {phase} Phase
        {clickable && <span className="ml-2 text-xs opacity-70">→ Click to log period</span>}
      </div>
    </div>
  );
}
