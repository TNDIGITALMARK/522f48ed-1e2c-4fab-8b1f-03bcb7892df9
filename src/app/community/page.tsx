"use client";

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { BloomLogo } from '@/components/bloom-logo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialFeed } from '@/components/social-feed';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { FriendRequestsPanel } from '@/components/friend-requests-panel';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Users,
  UserPlus,
  Search,
  Heart,
  MessageCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  getFeedPosts,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  createSocialPost,
  likePost,
  unlikePost
} from '@/lib/supabase/social-queries';

// Mock user data - in production this would come from auth
const CURRENT_USER = {
  id: 'user_123',
  name: 'You',
};

export default function CommunityPage() {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    friends: 12,
    posts: 24,
    likes: 156
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // In production, these would be real API calls
      // For now, using mock data
      setPosts([
        {
          id: '1',
          author_id: 'user_456',
          author_name: 'Sarah Johnson',
          content: 'Just completed my morning ritual! Feeling energized and ready for the day 🌅✨',
          image_url: null,
          post_type: 'text',
          canvas_data: null,
          likes_count: 12,
          comments_count: 3,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_liked: false
        },
        {
          id: '2',
          author_id: 'user_789',
          author_name: 'Emma Williams',
          content: 'Sharing my canvas journal from today\'s meditation session. Finding peace in the little things 🧘‍♀️',
          image_url: null,
          post_type: 'canvas_journal',
          canvas_data: {
            backgroundColor: '#F5E6D3',
            elements: []
          },
          likes_count: 24,
          comments_count: 7,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          is_liked: true
        },
        {
          id: '3',
          author_id: 'user_101',
          author_name: 'Olivia Brown',
          content: 'Amazing sunset after my evening walk! Nature therapy at its finest 🌅',
          image_url: '/api/placeholder/800/600',
          post_type: 'photo',
          canvas_data: null,
          likes_count: 45,
          comments_count: 12,
          created_at: new Date(Date.now() - 14400000).toISOString(),
          is_liked: false
        }
      ]);

      setFriendRequests([
        {
          id: 'req_1',
          sender_id: 'user_201',
          sender_name: 'Jessica Martinez',
          message: 'Hi! I love your wellness journey posts. Would love to connect!',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'req_2',
          sender_id: 'user_202',
          sender_name: 'Ashley Davis',
          message: null,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData: any) => {
    try {
      const newPost = {
        id: Date.now().toString(),
        author_id: CURRENT_USER.id,
        author_name: CURRENT_USER.name,
        ...postData,
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        is_liked: false
      };

      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, is_liked: true, likes_count: post.likes_count + 1 }
        : post
    ));
  };

  const handleUnlikePost = async (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, is_liked: false, likes_count: Math.max(0, post.likes_count - 1) }
        : post
    ));
  };

  const handleCommentPost = (postId: string) => {
    console.log('Open comments for post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    setStats(prev => ({ ...prev, friends: prev.friends + 1 }));
  };

  const handleRejectRequest = async (requestId: string) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <BloomLogo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 border border-purple-200">
            <Users className="w-4 h-4 text-purple-700" />
            <span className="text-sm font-medium text-purple-900">Connect & Share</span>
          </div>
          <h1 className="text-4xl mb-2">Community</h1>
          <p className="text-muted-foreground text-lg">
            Share your wellness journey with friends, connect with others, and inspire each other
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center hover:shadow-bloom transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{stats.friends}</div>
            <p className="text-sm text-muted-foreground">Friends</p>
          </Card>

          <Card className="p-5 text-center hover:shadow-bloom transition-shadow">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="text-2xl font-bold text-secondary-foreground mb-1">{stats.posts}</div>
            <p className="text-sm text-muted-foreground">Posts</p>
          </Card>

          <Card className="p-5 text-center hover:shadow-bloom transition-shadow">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="text-2xl font-bold text-accent-foreground mb-1">{stats.likes}</div>
            <p className="text-sm text-muted-foreground">Likes</p>
          </Card>
        </div>

        {/* Create Post Button */}
        <Button
          onClick={() => setCreatePostOpen(true)}
          className="w-full mb-8 h-14 text-lg gap-2 shadow-bloom hover:shadow-bloom-lg transition-all"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </Button>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed">
              <TrendingUp className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              <UserPlus className="w-4 h-4 mr-2" />
              Requests
              {friendRequests.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discover">
              <Search className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <SocialFeed
              posts={posts}
              currentUserId={CURRENT_USER.id}
              onLike={handleLikePost}
              onUnlike={handleUnlikePost}
              onComment={handleCommentPost}
              onDelete={handleDeletePost}
            />
          </TabsContent>

          <TabsContent value="requests">
            <FriendRequestsPanel
              requests={friendRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          </TabsContent>

          <TabsContent value="discover">
            <Card className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover People</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Find and connect with others on their wellness journey
              </p>
              <Button variant="outline" className="gap-2">
                <Search className="w-4 h-4" />
                Search Users
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tips Card */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-none">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">Share Your Wellness Journey</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Post daily reflections and achievements</li>
                <li>• Share photos from your workouts and activities</li>
                <li>• Post your canvas journal entries to inspire others</li>
                <li>• Connect with friends who share your wellness goals</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      <Navigation />

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        onPost={handleCreatePost}
        userName={CURRENT_USER.name}
      />
    </div>
  );
}
