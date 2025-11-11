import Image from 'next/image';

export function RootedLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Rooted Logo Image with root system - Updated with uppercase R */}
      <div className="relative w-14 h-14">
        <Image
          src="/generated/rooted-logo-uppercase.png"
          alt="Rooted Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Text branding - Updated to UPPERCASE */}
      <div className="flex flex-col">
        <div className="font-['Cormorant_Garamond'] text-3xl font-semibold tracking-wider">
          <span className="text-foreground">ROOTED</span>
        </div>
        <div className="text-xs text-muted-foreground font-light tracking-wide">
          Grounded in Nature
        </div>
      </div>
    </div>
  );
}

// Keep old export for backwards compatibility during migration
export const rootedLogo = RootedLogo;
