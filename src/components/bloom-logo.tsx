export function BloomLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">
        <span className="text-foreground italic">Bloom</span>
      </div>
      <div className="text-sm text-muted-foreground font-light">
        by <span className="font-medium">Rooted</span>
      </div>
    </div>
  );
}
