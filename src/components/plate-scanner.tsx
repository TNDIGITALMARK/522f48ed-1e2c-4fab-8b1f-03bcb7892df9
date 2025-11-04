'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MealAnalysisResult {
  items: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  aiSuggestions?: string[];
}

export function PlateScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setImage(imageData);
        stopCamera();
        analyzeImage(imageData);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);

    // Simulate AI analysis (in production, this would call an AI API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock result - replace with actual API call
    const mockResult: MealAnalysisResult = {
      items: [
        {
          name: 'Grilled Chicken Breast',
          calories: 280,
          protein: 53,
          carbs: 0,
          fat: 6,
          confidence: 0.92
        },
        {
          name: 'Brown Rice',
          calories: 215,
          protein: 5,
          carbs: 45,
          fat: 2,
          confidence: 0.88
        },
        {
          name: 'Steamed Broccoli',
          calories: 55,
          protein: 4,
          carbs: 11,
          fat: 0.5,
          confidence: 0.85
        },
        {
          name: 'Olive Oil Dressing',
          calories: 120,
          protein: 0,
          carbs: 0,
          fat: 14,
          confidence: 0.78
        }
      ],
      totalCalories: 670,
      totalProtein: 62,
      totalCarbs: 56,
      totalFat: 22.5,
      aiSuggestions: [
        'Great protein-to-carb ratio for post-workout!',
        'Consider adding more colorful vegetables for antioxidants',
        'Well-balanced meal aligned with your fitness goals'
      ]
    };

    setResult(mockResult);
    setAnalyzing(false);
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveMeal = () => {
    if (result) {
      // Save to storage/database
      alert(`Meal logged: ${result.totalCalories} calories`);
      resetScanner();
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      {!image && !cameraActive && (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Scan Your Plate</h3>
              <p className="text-muted-foreground">
                Take a photo of your meal to get instant calorie estimates powered by AI
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={startCamera} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Photo
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </Card>
      )}

      {/* Camera View */}
      {cameraActive && (
        <Card className="p-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button onClick={capturePhoto} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                Capture
              </Button>
              <Button onClick={stopCamera} variant="outline" size="lg">
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Image Preview & Analysis */}
      {image && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Preview */}
            <div className="relative">
              <img
                src={image}
                alt="Meal"
                className="w-full rounded-lg max-h-96 object-contain"
              />
              <Button
                onClick={resetScanner}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Analyzing State */}
            {analyzing && (
              <div className="text-center py-8 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <div>
                  <p className="font-medium text-lg">Analyzing your meal...</p>
                  <p className="text-sm text-muted-foreground">
                    Using AI to identify food items and estimate calories
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && !analyzing && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-primary">
                      {result.totalCalories}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Calories</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {result.totalProtein}g
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Protein</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-amber-600">
                      {result.totalCarbs}g
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Carbs</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {result.totalFat}g
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Fat</p>
                  </div>
                </div>

                {/* Detected Items */}
                <div>
                  <h4 className="font-semibold mb-3">Detected Food Items</h4>
                  <div className="space-y-3">
                    {result.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {(item.confidence * 100).toFixed(0)}% confident
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{item.calories}</p>
                          <p className="text-xs text-muted-foreground">cal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                {result.aiSuggestions && result.aiSuggestions.length > 0 && (
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-2">AI Insights</h4>
                        <ul className="space-y-2 text-sm">
                          {result.aiSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={saveMeal} className="flex-1" size="lg">
                    Save Meal
                  </Button>
                  <Button onClick={resetScanner} variant="outline" size="lg">
                    Scan Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Info Card */}
      {!image && !cameraActive && (
        <Card className="p-6 bg-muted/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            How It Works
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>Take or upload a clear photo of your meal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>AI identifies food items and portions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>Get instant calorie and macro estimates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>Log the meal to your daily tracking</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
