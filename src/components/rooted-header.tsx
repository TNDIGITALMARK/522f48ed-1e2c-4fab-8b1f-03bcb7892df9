"use client";

/**
 * RootedHeader - Unified header component for the entire app
 * Matches the elegant, minimal design from the community page
 */
export function RootedHeader() {
  return (
    <header className="relative z-40 bg-card/95 backdrop-blur-md border-b-2 border-border/50 px-6 py-5 animate-fade-in-up sticky top-0 shadow-bloom-sm">
      <div className="max-w-4xl mx-auto">
        <div className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-wider">
          <span className="text-foreground">ROOTED</span>
        </div>
        <div className="text-xs text-muted-foreground font-light tracking-wide">
          Grounded in Nature
        </div>
      </div>
    </header>
  );
}
