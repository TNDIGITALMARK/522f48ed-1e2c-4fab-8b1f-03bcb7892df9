import Image from 'next/image';

export function RootedLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Rooted text logo with tree roots on 't' */}
      <Image
        src="/rooted-logo.png"
        alt="rooted"
        width={180}
        height={60}
        className="object-contain"
        priority
      />
    </div>
  );
}

// Keep old export for backwards compatibility during migration
export const rootedLogo = RootedLogo;
