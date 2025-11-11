"use client";

/**
 * ROOTED Text Logo Component
 *
 * Custom implementation of the "ROOTED" text with stylized 'T' featuring root tendrils.
 * Inspired by the reference image with elegant serif typography and organic root design.
 */

export function RootedTextLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 600 150"
        className="w-full h-auto"
        style={{ maxWidth: '600px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Define the elegant serif font style */}
        <defs>
          {/* Gradient for depth */}
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.85 }} />
          </linearGradient>

          {/* Shadow filter for depth */}
          <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main "ROOTED" text */}
        <text
          x="50%"
          y="50"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="72"
          fontWeight="400"
          letterSpacing="8"
          fill="url(#textGradient)"
          filter="url(#textShadow)"
        >
          ROO
        </text>

        {/* Stylized "T" with space for roots */}
        <text
          x="50%"
          y="50"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="72"
          fontWeight="400"
          letterSpacing="8"
          fill="url(#textGradient)"
          filter="url(#textShadow)"
          dx="85"
        >
          T
        </text>

        {/* Continue with "ED" */}
        <text
          x="50%"
          y="50"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="72"
          fontWeight="400"
          letterSpacing="8"
          fill="url(#textGradient)"
          filter="url(#textShadow)"
          dx="155"
        >
          ED
        </text>

        {/* Root system extending from the "T" */}
        <g className="roots-container" transform="translate(330, 65)">
          {/* Main central root */}
          <path
            d="M 0 0 Q -2 15 -3 30 Q -4 45 -2 60 Q 0 75 -1 85"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
            className="animate-root-grow"
          />

          {/* Left primary branch */}
          <path
            d="M -1 25 Q -8 32 -15 38 Q -22 44 -30 48 Q -38 52 -45 54"
            stroke="currentColor"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
            className="animate-root-branch-1 animation-delay-150"
          />

          {/* Right primary branch */}
          <path
            d="M 0 30 Q 7 36 14 42 Q 21 48 28 52 Q 35 56 42 58"
            stroke="currentColor"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
            className="animate-root-branch-1 animation-delay-180"
          />

          {/* Left secondary branch upper */}
          <path
            d="M -8 35 Q -12 40 -16 45 Q -20 50 -24 53"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
            className="animate-root-branch-2 animation-delay-220"
          />

          {/* Right secondary branch upper */}
          <path
            d="M 5 38 Q 9 43 13 48 Q 17 53 20 56"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
            className="animate-root-branch-2 animation-delay-240"
          />

          {/* Left tertiary fine roots */}
          <path
            d="M -18 42 Q -20 46 -22 50 Q -24 54 -26 58"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.65"
            className="animate-root-branch-2 animation-delay-280"
          />

          {/* Right tertiary fine roots */}
          <path
            d="M 16 45 Q 18 49 20 53 Q 22 57 24 61"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.65"
            className="animate-root-branch-2 animation-delay-300"
          />

          {/* Far left delicate root */}
          <path
            d="M -28 48 Q -32 52 -36 56 Q -40 60 -44 63"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
            className="animate-root-branch-2 animation-delay-320"
          />

          {/* Far right delicate root */}
          <path
            d="M 26 51 Q 30 55 34 59 Q 38 63 42 66"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
            className="animate-root-branch-2 animation-delay-340"
          />

          {/* Central lower extension */}
          <path
            d="M -1 85 Q -1.5 92 -2 98"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
            className="animate-root-branch-2 animation-delay-360"
          />

          {/* Left lower spreading roots */}
          <path
            d="M -45 54 Q -50 56 -55 58 Q -60 60 -64 61"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.45"
            className="animate-root-branch-2 animation-delay-400"
          />

          {/* Right lower spreading roots */}
          <path
            d="M 42 58 Q 47 60 52 62 Q 57 64 61 65"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.45"
            className="animate-root-branch-2 animation-delay-420"
          />

          {/* Ultra-fine hair roots left */}
          <path
            d="M -56 58 Q -58 60 -60 62"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.35"
            className="animate-root-branch-2 animation-delay-450"
          />

          {/* Ultra-fine hair roots right */}
          <path
            d="M 52 62 Q 54 64 56 66"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.35"
            className="animate-root-branch-2 animation-delay-470"
          />
        </g>
      </svg>
    </div>
  );
}

export default RootedTextLogo;
