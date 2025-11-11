"use client";

import Image from 'next/image';

/**
 * ROOTED Logo Component
 *
 * Displays the exact ROOTED logo with tree roots design from the provided reference image.
 * Logo features bold "ROOTED" text with tree roots extending from the letter T.
 */

export function RootedTextLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/rooted-logo.png"
        alt="ROOTED"
        width={400}
        height={400}
        className="w-full h-auto object-contain"
        style={{ maxWidth: '400px' }}
        priority
      />
    </div>
  );
}

export default RootedTextLogo;
