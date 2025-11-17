"use client";

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VisionBoardWidgetProps {
  className?: string;
}

interface VisionImage {
  id: string;
  src: string;
  alt: string;
  file?: File;
}

export function VisionBoardWidget({ className }: VisionBoardWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visionImages, setVisionImages] = useState<VisionImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const newImage: VisionImage = {
        id: Date.now() + '-' + Math.random(),
        src: objectUrl,
        alt: file.name,
        file: file,
      };

      setVisionImages((prev) => [...prev, newImage]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setVisionImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove?.src.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.src);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={cn("calendar-container overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/5 transition-colors group"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Collapse monthly vision board' : 'Expand monthly vision board'}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Monthly Vision Board
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in-up">
          <div className="border-t border-border/50 pt-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">
                {currentMonth}
              </h3>
              <p className="text-xs text-muted-foreground">
                Add photos that represent your goals and aspirations
              </p>
            </div>

            {visionImages.length > 0 ? (
              <div className="mb-4">
                {visionImages.length === 1 && (
                  <div className="grid grid-cols-1 gap-3">
                    {visionImages.map((image, index) => (
                      <div key={image.id} className="relative aspect-[16/9] rounded-lg overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale group" style={{ animationDelay: `${index * 50}ms` }}>
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(image.id); }} className="absolute top-2 right-2 p-1.5 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" aria-label="Remove image">
                          <X className="w-4 h-4 text-destructive-foreground" />
                        </button>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                {visionImages.length === 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    {visionImages.map((image, index) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale group" style={{ animationDelay: `${index * 50}ms` }}>
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 300px" />
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(image.id); }} className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" aria-label="Remove image">
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                {visionImages.length === 3 && (
                  <div className="grid grid-cols-3 gap-3">
                    {visionImages.map((image, index) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale group" style={{ animationDelay: `${index * 50}ms` }}>
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 33vw, 200px" />
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(image.id); }} className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" aria-label="Remove image">
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                {visionImages.length === 4 && (
                  <div className="grid grid-cols-2 gap-3">
                    {visionImages.map((image, index) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale group" style={{ animationDelay: `${index * 50}ms` }}>
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 300px" />
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(image.id); }} className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" aria-label="Remove image">
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                {visionImages.length >= 5 && (
                  <div className="grid grid-cols-6 gap-3">
                    <div className="relative col-span-3 row-span-2 rounded-lg overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale group" style={{ animationDelay: '0ms' }}>
                      <Image src={visionImages[0].src} alt={visionImages[0].alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 400px" />
                      <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(visionImages[0].id); }} className="absolute top-2 right-2 p-1.5 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" aria-label="Remove image">
                        <X className="w-4 h-4 text-destructive-foreground" />
                      </button>
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {visionImages.slice(1).map((image, index) => (
                      <div key={image.id} className="relative col-span-3 aspect-square rounded-lg overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all animate-fade-in-scale group" style={{ animationDelay: `${(index + 1) * 50}ms` }}>
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 768px) 33vw, 200px" />
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(image.id); }} className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" aria-label="Remove image">
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 p-8 rounded-lg border-2 border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center text-center">
                <Upload className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground mb-1">
                  No photos yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Click the button below to add your first photo
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload vision board photos"
            />

            <Button
              variant="outline"
              className="w-full rounded-full border-dashed hover:border-primary/50 hover:bg-primary/5"
              onClick={handleAddPhotoClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Photos
            </Button>

            {visionImages.length > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {visionImages.length} {visionImages.length === 1 ? 'photo' : 'photos'} added
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
