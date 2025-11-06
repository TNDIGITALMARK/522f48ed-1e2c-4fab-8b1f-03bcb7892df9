import Image from 'next/image';

export function BloomLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Bloom Logo Image */}
      <div className="relative w-12 h-12">
        <Image
          src="/hero-images/bloom-logo.png"
          alt="Bloom Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Text branding */}
      <div className="flex items-center gap-2">
        <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
          <span className="text-foreground italic">Bloom</span>
        </div>
        <div className="text-sm text-muted-foreground font-light">
          by <span className="font-medium">Rooted</span>
        </div>
      </div>
    </div>
  );
}
