"use client";

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Image as ImageIcon,
  Sticker,
  Type,
  Palette,
  Download,
  Save,
  Trash2,
  Upload,
  Sparkles,
  Camera,
  Smile,
  Heart,
  Star,
  Sun,
  Moon,
  Flower2,
  Circle
} from 'lucide-react';
import Link from 'next/link';

const colorPalette = [
  '#1C1C1B', // Onyx
  '#7B6F5E', // Walnut
  '#979086', // Ash
  '#F7ECDB', // Greige
  '#F2E9E4', // Stucco
  '#FFFFFF', // White
  '#FFD700', // Gold
  '#E6E6FA', // Lavender
  '#FFE4B5', // Moccasin
  '#D4AF37', // Antique Gold
];

const stickerCategories = {
  emotions: [
    { icon: '😊', label: 'Happy' },
    { icon: '😌', label: 'Peaceful' },
    { icon: '🥰', label: 'Loved' },
    { icon: '😴', label: 'Tired' },
    { icon: '💪', label: 'Strong' },
    { icon: '🌟', label: 'Sparkle' },
  ],
  nature: [
    { icon: '🌸', label: 'Flower' },
    { icon: '🌿', label: 'Leaf' },
    { icon: '🌙', label: 'Moon' },
    { icon: '☀️', label: 'Sun' },
    { icon: '⭐', label: 'Star' },
    { icon: '🌈', label: 'Rainbow' },
  ],
  wellness: [
    { icon: '💆‍♀️', label: 'Spa' },
    { icon: '🧘‍♀️', label: 'Yoga' },
    { icon: '💝', label: 'Heart' },
    { icon: '🌺', label: 'Hibiscus' },
    { icon: '✨', label: 'Shine' },
    { icon: '🕊️', label: 'Peace' },
  ],
};

const textFonts = [
  { name: 'Playfair Display', class: 'font-serif' },
  { name: 'Inter', class: 'font-sans' },
  { name: 'Handwriting', class: 'font-cursive' },
  { name: 'Bold', class: 'font-bold' },
];

interface CanvasElement {
  id: string;
  type: 'text' | 'sticker' | 'image';
  content: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  fontClass?: string;
  size?: number;
}

export default function JournalingPage() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<'text' | 'sticker' | 'image' | 'background'>('text');
  const [backgroundColor, setBackgroundColor] = useState('#F2E9E4');
  const [selectedSticker, setSelectedSticker] = useState('');
  const [textColor, setTextColor] = useState('#1C1C1B');
  const [textFont, setTextFont] = useState('font-sans');

  const addTextElement = () => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Double click to edit',
      x: 50,
      y: 50,
      fontSize: 24,
      color: textColor,
      fontClass: textFont,
    };
    setCanvasElements([...canvasElements, newElement]);
  };

  const addStickerElement = (sticker: string) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'sticker',
      content: sticker,
      x: 100,
      y: 100,
      size: 48,
    };
    setCanvasElements([...canvasElements, newElement]);
  };

  const deleteElement = (id: string) => {
    setCanvasElements(canvasElements.filter(el => el.id !== id));
  };

  const clearCanvas = () => {
    setCanvasElements([]);
    setBackgroundColor('#F2E9E4');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/rituals">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Rituals
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4 border border-purple-300">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span className="text-sm font-medium text-purple-900">Create Your Daily Canvas</span>
          </div>
          <h1 className="text-4xl mb-2">Digital Canvas Journaling</h1>
          <p className="text-muted-foreground text-lg">
            Express your day through a beautiful visual canvas with photos, stickers, and text
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Tool Selection */}
            <Card className="neutral-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Tools
              </h3>
              <div className="space-y-2">
                <Button
                  variant={selectedTool === 'text' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedTool('text')}
                >
                  <Type className="w-4 h-4" />
                  Text
                </Button>
                <Button
                  variant={selectedTool === 'sticker' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedTool('sticker')}
                >
                  <Sticker className="w-4 h-4" />
                  Stickers
                </Button>
                <Button
                  variant={selectedTool === 'image' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedTool('image')}
                >
                  <ImageIcon className="w-4 h-4" />
                  Photos
                </Button>
                <Button
                  variant={selectedTool === 'background' ? 'default' : 'outline'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedTool('background')}
                >
                  <Circle className="w-4 h-4" />
                  Background
                </Button>
              </div>
            </Card>

            {/* Text Options */}
            {selectedTool === 'text' && (
              <Card className="neutral-card">
                <h3 className="font-semibold mb-4">Text Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Font Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {textFonts.map((font) => (
                        <Button
                          key={font.name}
                          variant={textFont === font.class ? 'default' : 'outline'}
                          size="sm"
                          className={font.class}
                          onClick={() => setTextFont(font.class)}
                        >
                          {font.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Text Color</label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: color,
                            borderColor: textColor === color ? '#1C1C1B' : 'transparent'
                          }}
                          onClick={() => setTextColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={addTextElement} className="w-full gap-2">
                    <Type className="w-4 h-4" />
                    Add Text
                  </Button>
                </div>
              </Card>
            )}

            {/* Sticker Options */}
            {selectedTool === 'sticker' && (
              <Card className="neutral-card">
                <h3 className="font-semibold mb-4">Stickers</h3>
                <div className="space-y-4">
                  {Object.entries(stickerCategories).map(([category, stickers]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium mb-2 capitalize">{category}</h4>
                      <div className="grid grid-cols-6 gap-2">
                        {stickers.map((sticker) => (
                          <button
                            key={sticker.label}
                            className="text-3xl hover:scale-125 transition-transform p-2 rounded-lg hover:bg-muted"
                            onClick={() => addStickerElement(sticker.icon)}
                            title={sticker.label}
                          >
                            {sticker.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Background Options */}
            {selectedTool === 'background' && (
              <Card className="neutral-card">
                <h3 className="font-semibold mb-4">Background Color</h3>
                <div className="grid grid-cols-5 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: backgroundColor === color ? '#1C1C1B' : 'transparent'
                      }}
                      onClick={() => setBackgroundColor(color)}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Photo Upload */}
            {selectedTool === 'image' && (
              <Card className="neutral-card">
                <h3 className="font-semibold mb-4">Add Photo</h3>
                <div className="space-y-3">
                  <Button className="w-full gap-2" variant="outline">
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  <Button className="w-full gap-2" variant="outline">
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                  <div className="text-xs text-muted-foreground text-center">
                    Add photos from your device or camera
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-9">
            <Card className="neutral-card p-0 overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Canvas</Badge>
                  <span className="text-sm text-muted-foreground">
                    {canvasElements.length} elements
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCanvas} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Entry
                  </Button>
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Sparkles className="w-4 h-4" />
                    Post to Community
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div
                className="relative w-full min-h-[600px] transition-colors"
                style={{ backgroundColor }}
              >
                {canvasElements.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Sparkles className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Start creating your canvas</p>
                      <p className="text-sm text-muted-foreground">
                        Add text, stickers, and photos to express your day
                      </p>
                    </div>
                  </div>
                ) : (
                  canvasElements.map((element) => (
                    <div
                      key={element.id}
                      className="absolute group cursor-move hover:shadow-neutral transition-shadow"
                      style={{
                        left: element.x,
                        top: element.y,
                      }}
                    >
                      {element.type === 'text' && (
                        <div
                          className={`${element.fontClass} px-4 py-2 rounded-lg bg-white/80`}
                          style={{
                            fontSize: element.fontSize,
                            color: element.color,
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                      {element.type === 'sticker' && (
                        <div
                          style={{ fontSize: element.size }}
                        >
                          {element.content}
                        </div>
                      )}
                      <button
                        onClick={() => deleteElement(element.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="neutral-card mt-4 bg-gradient-to-br from-accent/20 to-accent/5 border-none">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Canvas Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Click on elements to move them around your canvas</li>
                    <li>• Layer stickers and text to create depth</li>
                    <li>• Use the color palette to match your mood</li>
                    <li>• Save your creations to build a visual journal over time</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
