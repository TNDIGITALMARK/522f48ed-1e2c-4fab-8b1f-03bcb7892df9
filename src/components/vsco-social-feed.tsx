'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, X } from 'lucide-react';
import { getFriendsPosts, likePost, unlikePost, hasUserLikedPost, deletePost, type SocialPost } from '@/lib/supabase/social-posts-queries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VscoSocialFeedProps {
  userId: string;
}

export function VscoSocialFeed({ userId }: VscoSocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  async function loadPosts() {
    setLoading(true);
    const fetchedPosts = await getFriendsPosts(userId);
    setPosts(fetchedPosts);

    // Check which posts user has liked
    const likedSet = new Set<string>();
    for (const post of fetchedPosts) {
      const isLiked = await hasUserLikedPost(userId, post.id);
      if (isLiked) {
        likedSet.add(post.id);
      }
    }
    setLikedPosts(likedSet);
    setLoading(false);
  }

  async function handleLike(postId: string) {
    const isCurrentlyLiked = likedPosts.has(postId);

    if (isCurrentlyLiked) {
      const success = await unlikePost(userId, postId);
      if (success) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p
        ));
      }
    } else {
      const success = await likePost(userId, postId);
      if (success) {
        setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
        ));
      }
    }
  }

  async function handleDelete(postId: string) {
    const confirmed = confirm('Delete this post?');
    if (confirmed) {
      const success = await deletePost(postId, userId);
      if (success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-shimmer w-full max-w-md h-64 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* VSCO-style minimalist feed */}
      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No posts yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start sharing your healthy habits journey with friends!
          </p>
        </Card>
      ) : (
        posts.map(post => (
          <Card key={post.id} className="overflow-hidden border-minimal hover:border-emphasis transition-all">
            {/* User header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-semibold text-display">
                    {post.user_id.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-display">Friend</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {post.user_id === userId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Post image - VSCO style */}
            {post.image_url && (
              <div className="relative w-full aspect-square bg-muted">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      likedPosts.has(post.id)
                        ? 'fill-current text-red-500'
                        : 'text-foreground'
                    }`}
                  />
                </button>
              </div>

              {/* Like count */}
              {post.like_count > 0 && (
                <p className="text-sm font-semibold text-display">
                  {post.like_count} {post.like_count === 1 ? 'like' : 'likes'}
                </p>
              )}

              {/* Caption */}
              {post.caption && (
                <p className="text-body text-sm leading-relaxed">
                  <span className="font-semibold text-display mr-2">Friend</span>
                  {post.caption}
                </p>
              )}

              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {new Date(post.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
