"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dumbbell, Mountain, Footprints, Users, Trophy, Clock,
  MapPin, TrendingUp, Flame, Target, Award, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'hyrox' | 'hike' | 'run' | 'challenge';
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  duration: string;
  distance?: string;
  participants: number;
  maxParticipants: number;
  rewards: {
    coins: number;
    xp: number;
  };
  startTime: string;
  status: 'upcoming' | 'active' | 'completed';
  icon: React.ComponentType<{ className?: string }>;
}

interface UserStats {
  totalActivities: number;
  totalDistance: string;
  totalCoins: number;
  streak: number;
  rank: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'hyrox',
    name: 'Morning HYROX Challenge',
    description: '8 stations of functional fitness workout',
    difficulty: 'hard',
    duration: '60 min',
    participants: 12,
    maxParticipants: 20,
    rewards: { coins: 150, xp: 500 },
    startTime: 'Today, 8:00 AM',
    status: 'upcoming',
    icon: Dumbbell,
  },
  {
    id: '2',
    type: 'hike',
    name: 'Mountain Trail Adventure',
    description: 'Scenic mountain trail with elevation gain',
    difficulty: 'medium',
    duration: '2 hours',
    distance: '5.2 km',
    participants: 8,
    maxParticipants: 15,
    rewards: { coins: 100, xp: 350 },
    startTime: 'Today, 10:30 AM',
    status: 'active',
    icon: Mountain,
  },
  {
    id: '3',
    type: 'run',
    name: '5K Community Run',
    description: 'Group run through the park',
    difficulty: 'easy',
    duration: '30 min',
    distance: '5 km',
    participants: 24,
    maxParticipants: 30,
    rewards: { coins: 75, xp: 250 },
    startTime: 'Today, 6:00 PM',
    status: 'upcoming',
    icon: Footprints,
  },
  {
    id: '4',
    type: 'challenge',
    name: 'Weekly Wellness Challenge',
    description: 'Complete all 3 activities this week',
    difficulty: 'extreme',
    duration: '1 week',
    participants: 156,
    maxParticipants: 200,
    rewards: { coins: 500, xp: 1500 },
    startTime: 'Ends in 3 days',
    status: 'active',
    icon: Trophy,
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Sarah Johnson', score: 2450, avatar: 'SJ', streak: 28 },
  { rank: 2, name: 'Emma Williams', score: 2380, avatar: 'EW', streak: 21 },
  { rank: 3, name: 'You', score: 2120, avatar: 'ME', streak: 14 },
  { rank: 4, name: 'Olivia Brown', score: 1980, avatar: 'OB', streak: 19 },
  { rank: 5, name: 'Sophia Davis', score: 1850, avatar: 'SD', streak: 12 },
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  hard: 'bg-orange-100 text-orange-700 border-orange-300',
  extreme: 'bg-red-100 text-red-700 border-red-300',
};

export function MultiplayerActivities() {
  const [joinedActivities, setJoinedActivities] = useState<Set<string>>(new Set(['2']));
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const userStats: UserStats = {
    totalActivities: 47,
    totalDistance: '127.5 km',
    totalCoins: 2120,
    streak: 14,
    rank: '3rd Place',
  };

  const handleJoinActivity = (activityId: string) => {
    setJoinedActivities(prev => new Set([...prev, activityId]));
  };

  const handleLeaveActivity = (activityId: string) => {
    setJoinedActivities(prev => {
      const newSet = new Set(prev);
      newSet.delete(activityId);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <Card className="bloom-card bg-gradient-to-br from-primary/10 to-secondary/10 border-none">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Your Activity Stats
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Dumbbell className="w-7 h-7 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{userStats.totalActivities}</div>
            <p className="text-sm text-muted-foreground">Activities</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-7 h-7 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-secondary">{userStats.totalDistance}</div>
            <p className="text-sm text-muted-foreground">Distance</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-7 h-7 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500">{userStats.streak}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-7 h-7 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{userStats.rank}</div>
            <p className="text-sm text-muted-foreground">Ranking</p>
          </div>
        </div>
      </Card>

      {/* Available Activities */}
      <div>
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Available Activities
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {ACTIVITIES.map((activity) => {
            const ActivityIcon = activity.icon;
            const isJoined = joinedActivities.has(activity.id);

            return (
              <div
                key={activity.id}
                className={cn(
                  'activity-card',
                  isJoined && 'active'
                )}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      activity.status === 'active' ? 'bg-green-100' : 'bg-primary/10'
                    )}>
                      <ActivityIcon className={cn(
                        'w-6 h-6',
                        activity.status === 'active' ? 'text-green-600' : 'text-primary'
                      )} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{activity.name}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>

                  {activity.status === 'active' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Live
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{activity.duration}</span>
                    </div>
                    {activity.distance && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{activity.distance}</span>
                      </div>
                    )}
                    <Badge className={cn('text-xs', difficultyColors[activity.difficulty])}>
                      {activity.difficulty}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{activity.participants}/{activity.maxParticipants} joined</span>
                      </div>
                      <span className="text-muted-foreground">{activity.startTime}</span>
                    </div>
                    <Progress
                      value={(activity.participants / activity.maxParticipants) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="gap-1">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        +{activity.rewards.coins} coins
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Star className="w-3 h-3 text-blue-500" />
                        +{activity.rewards.xp} XP
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      variant={isJoined ? 'outline' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isJoined) {
                          handleLeaveActivity(activity.id);
                        } else {
                          handleJoinActivity(activity.id);
                        }
                      }}
                      className={isJoined ? '' : 'bg-primary hover:bg-primary/90'}
                    >
                      {isJoined ? 'Leave' : 'Join'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <Card className="bloom-card">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Community Leaderboard
        </h3>

        <div className="space-y-3">
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border-2 transition-all',
                entry.name === 'You'
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/30 border-transparent hover:border-primary/30'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                  entry.rank === 1 && 'bg-yellow-100 text-yellow-700',
                  entry.rank === 2 && 'bg-gray-200 text-gray-700',
                  entry.rank === 3 && 'bg-orange-100 text-orange-700',
                  entry.rank > 3 && 'bg-muted text-muted-foreground'
                )}>
                  {entry.rank}
                </div>

                <Avatar className="w-10 h-10">
                  <AvatarFallback className={cn(
                    'font-semibold',
                    entry.name === 'You' && 'bg-primary text-primary-foreground'
                  )}>
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {entry.name}
                    {entry.name === 'You' && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {entry.streak} day streak
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg text-primary">{entry.score}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Keep going! You're only <span className="font-semibold text-primary">260 points</span> away from 2nd place!
          </p>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Target className="w-4 h-4 mr-2" />
            View Full Rankings
          </Button>
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="bloom-card">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-secondary" />
          Recent Achievements
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'First HYROX', description: 'Complete your first HYROX workout', icon: Dumbbell, color: 'text-blue-500' },
            { title: 'Mountain Conqueror', description: 'Complete 5 mountain hikes', icon: Mountain, color: 'text-green-500' },
            { title: 'Speed Demon', description: 'Run 5K in under 25 minutes', icon: Footprints, color: 'text-purple-500' },
            { title: 'Social Butterfly', description: 'Join 10 group activities', icon: Users, color: 'text-pink-500' },
          ].map((achievement, index) => {
            const AchievementIcon = achievement.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors achievement-unlock"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <AchievementIcon className={cn('w-6 h-6', achievement.color)} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
