"use client";

import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, Sun, Droplets, Sparkles, Award, TrendingUp, Gift, Star, Dumbbell, TreeDeciduous } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedGardenGrid } from '@/components/enhanced-garden-grid';
import { MultiplayerActivities } from '@/components/multiplayer-activities';
import { FriendsManager } from '@/components/friends-manager';
import { SendGiftDialog } from '@/components/send-gift-dialog';
import { GardenTutorial } from '@/components/garden-tutorial';

const gardenThemes = [
  { name: 'Sunflower Meadow', icon: Sun, locked: false, color: 'from-yellow-100 to-orange-100' },
  { name: 'Lunar Grove', icon: Sparkles, locked: false, color: 'from-purple-100 to-blue-100' },
  { name: 'Forest Haven', icon: Leaf, locked: true, color: 'from-green-100 to-emerald-100', requirement: 500 },
  { name: 'Cherry Blossom', icon: Sparkles, locked: true, color: 'from-pink-100 to-rose-100', requirement: 1000 },
];

const plantedFlowers = [
  { name: 'Sunflower', icon: Sun, level: 3, points: 150 },
  { name: 'Rose', icon: Sparkles, level: 2, points: 80 },
  { name: 'Daisy', icon: Leaf, level: 4, points: 200 },
  { name: 'Tulip', icon: Droplets, level: 1, points: 40 },
];

const achievements = [
  { title: '7-Day Streak', description: 'Log meals for 7 days straight', progress: 7, goal: 7, completed: true },
  { title: 'Workout Warrior', description: 'Complete 20 workouts', progress: 15, goal: 20, completed: false },
  { title: 'Nutrition Expert', description: 'Scan 50 food items', progress: 32, goal: 50, completed: false },
  { title: 'Cycle Tracker', description: 'Track 3 complete cycles', progress: 2, goal: 3, completed: false },
];

const rewards = [
  { name: '15% Off Wellness Box', coins: 100, type: 'discount' },
  { name: 'Plant 5 New Flowers', coins: 50, type: 'garden' },
  { name: 'Donate to Women\'s Health', coins: 200, type: 'charity' },
  { name: 'Unlock Forest Haven Theme', coins: 500, type: 'theme' },
];

export default function GardenPage() {
  const [bloomCoins, setBloomCoins] = useState(342);
  const [currentTheme] = useState('Sunflower Meadow');
  const [gardenLevel] = useState(8);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [selectedFriendForGift, setSelectedFriendForGift] = useState<{ id: string; name: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const nextLevelPoints = 400;
  const currentPoints = 342;
  const progressToNextLevel = (currentPoints / nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2">Your Bloom Garden</h1>
              <p className="text-muted-foreground text-lg">
                Build, grow, and compete - Hay Day style!
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTutorial(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Tutorial
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Garden Feature Card */}
        <Card className="bloom-card mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-bloom">
              <TreeDeciduous className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">New Experience</Badge>
              <h2 className="text-2xl font-semibold mb-2">Explore Your Garden in 3D!</h2>
              <p className="text-white/90 mb-4">
                Experience your magical Tree of Life in a beautiful 3D world with Hay Day-style graphics.
                Rotate, zoom, and explore your blooming garden paradise!
              </p>
              <Link href="/garden-3d">
                <Button className="gap-2 bg-white text-purple-600 hover:bg-white/90 shadow-bloom">
                  <TreeDeciduous className="w-5 h-5" />
                  View 3D Garden
                  <Sparkles className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Garden Stats & Coins */}
        <Card className="bloom-card mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Garden Level {gardenLevel}</h2>
                  <p className="text-muted-foreground">{currentTheme}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Sparkles className="w-6 h-6 text-secondary" />
                <div className="text-3xl font-bold text-secondary">{bloomCoins}</div>
              </div>
              <p className="text-sm text-muted-foreground">Bloom Coins</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Progress to Level {gardenLevel + 1}</p>
              <p className="text-sm font-semibold text-primary">
                {currentPoints} / {nextLevelPoints}
              </p>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
        </Card>

        {/* This Week's Growth */}
        <div className="mb-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-secondary" />
            This Week's Contributions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-5 text-center hover:shadow-bloom-sm transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <p className="text-sm text-muted-foreground">Meals Logged</p>
              <Badge variant="secondary" className="text-xs mt-2">+60 points</Badge>
            </Card>

            <Card className="p-5 text-center hover:shadow-bloom-sm transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <Droplets className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary mb-1">4</div>
              <p className="text-sm text-muted-foreground">Workouts Done</p>
              <Badge variant="secondary" className="text-xs mt-2">+80 points</Badge>
            </Card>

            <Card className="p-5 text-center hover:shadow-bloom-sm transition-shadow">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Sun className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="text-2xl font-bold text-accent-foreground mb-1">7</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
              <Badge variant="secondary" className="text-xs mt-2">+35 points</Badge>
            </Card>

            <Card className="p-5 text-center hover:shadow-bloom-sm transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">3</div>
              <p className="text-sm text-muted-foreground">Cycle Tracked</p>
              <Badge variant="secondary" className="text-xs mt-2">+30 points</Badge>
            </Card>
          </div>
        </div>

        {/* Your Garden */}
        <div className="mb-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Your Blooming Plants
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {plantedFlowers.map((flower, index) => {
              const FlowerIcon = flower.icon;
              return (
                <Card key={index} className="bloom-card text-center group hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                    <FlowerIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">{flower.name}</h4>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {Array.from({ length: flower.level }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {flower.points} pts
                  </Badge>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            Achievements
          </h3>

          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`p-5 ${achievement.completed ? 'bg-gradient-to-r from-primary/10 to-secondary/10' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.completed ? 'bg-primary' : 'bg-muted/30'
                    }`}>
                      <Award className={`w-6 h-6 ${
                        achievement.completed ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.completed && (
                    <Badge variant="secondary" className="text-xs">
                      Completed!
                    </Badge>
                  )}
                </div>

                {!achievement.completed && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{achievement.progress} / {achievement.goal}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.goal) * 100} className="h-2" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards Shop */}
        <div>
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Redeem Your Bloom Coins
          </h3>

          <div className="space-y-3">
            {rewards.map((reward, index) => {
              const canAfford = bloomCoins >= reward.coins;
              return (
                <Card key={index} className={`p-5 ${!canAfford ? 'opacity-60' : 'hover:shadow-bloom-lg transition-shadow cursor-pointer'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Gift className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{reward.name}</h4>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium text-secondary">{reward.coins} Bloom Coins</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled={!canAfford}
                      className={`rounded-full ${
                        canAfford
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem' : 'Locked'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Garden Themes */}
        <div className="mt-8">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Garden Themes
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {gardenThemes.map((theme, index) => {
              const ThemeIcon = theme.icon;
              return (
                <Card
                  key={index}
                  className={`p-6 bg-gradient-to-br ${theme.color} ${
                    theme.locked ? 'opacity-60' : 'cursor-pointer hover:shadow-bloom-lg transition-shadow'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                        <ThemeIcon className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-lg">{theme.name}</h4>
                    </div>
                    {!theme.locked && theme.name === currentTheme && (
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                  </div>
                  {theme.locked && (
                    <p className="text-sm text-muted-foreground">
                      Unlock at {theme.requirement} Bloom Coins
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Interactive Garden & Social Features */}
        <div className="mb-6">
          <Tabs defaultValue="garden" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="garden">My Garden</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="visits">Garden Visits</TabsTrigger>
            </TabsList>

            <TabsContent value="garden">
              <Card className="bloom-card">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-primary" />
                    Your Bloom Garden
                  </h3>
                  <p className="text-muted-foreground">
                    🌱 Build your dream farm! Plant crops, grow fruit trees, and create a beautiful garden paradise. Drag and place plants anywhere, water them, fertilize them, and watch them grow!
                  </p>
                </div>

                <EnhancedGardenGrid
                  gridWidth={12}
                  gridHeight={12}
                  gardenLevel={gardenLevel}
                  coins={bloomCoins}
                  onCoinsChange={setBloomCoins}
                />
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card className="bloom-card">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-primary" />
                  Multiplayer Activities
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join group workouts, hikes, and runs! Complete HYROX challenges, conquer mountain trails,
                  and compete with friends to climb the leaderboard. Earn coins and XP while building a healthier you!
                </p>
                <MultiplayerActivities />
              </Card>
            </TabsContent>

            <TabsContent value="friends">
              <FriendsManager
                onVisitGarden={(friendId) => {
                  alert(`Visiting ${friendId}'s garden! This would open their garden view.`);
                }}
                onSendGift={(friendId) => {
                  const friendData = { id: friendId, name: 'Friend' };
                  setSelectedFriendForGift(friendData);
                  setGiftDialogOpen(true);
                }}
              />
            </TabsContent>

            <TabsContent value="visits">
              <Card className="bloom-card">
                <h3 className="text-2xl font-semibold mb-4">Recent Garden Visits</h3>
                <p className="text-muted-foreground mb-6">
                  See who's been visiting your garden and check out your friends' gardens!
                </p>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', action: 'watered your roses', time: '2 hours ago' },
                    { name: 'Emma Williams', action: 'visited your garden', time: '5 hours ago' },
                    { name: 'Olivia Brown', action: 'sent you a gift', time: '1 day ago' },
                  ].map((visit, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary text-sm">
                              {visit.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{visit.name}</p>
                            <p className="text-sm text-muted-foreground">{visit.action}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{visit.time}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Navigation />

      {/* Gift Dialog */}
      {selectedFriendForGift && (
        <SendGiftDialog
          open={giftDialogOpen}
          onOpenChange={setGiftDialogOpen}
          friendName={selectedFriendForGift.name}
          userCoins={bloomCoins}
          onSend={(gift, message) => {
            setBloomCoins(bloomCoins - gift.cost);
            alert(`Sent ${gift.name} to ${selectedFriendForGift.name}!${message ? `\nMessage: ${message}` : ''}`);
          }}
        />
      )}

      {/* Garden Tutorial */}
      {showTutorial && (
        <GardenTutorial onComplete={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
