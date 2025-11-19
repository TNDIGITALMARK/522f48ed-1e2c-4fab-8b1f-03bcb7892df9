"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Trash2,
  Flag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface SocialPost {
  id: string;
  author_id: string;
  author_name: string;
  content: string | null;
  image_url: string | null;
  post_type: 'text' | 'photo' | 'canvas_journal';
  canvas_data: any | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_liked?: boolean;
}

interface SocialFeedProps {
  posts: SocialPost[];
  currentUserId: string;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onComment: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export function SocialFeed({
  posts,
  currentUserId,
  onLike,
  onUnlike,
  onComment,
  onDelete
}: SocialFeedProps) {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'photo':
        return '📷 Photo';
      case 'canvas_journal':
        return '🎨 Canvas';
      case 'text':
      default:
        return '💭 Post';
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-10 h-10 text-muted-foreground opacity-50" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Connect with friends to see their posts, or create your first post to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPosts.has(post.id);
        const isLongContent = post.content && post.content.length > 200;
        const displayContent = isExpanded || !isLongContent
          ? post.content
          : post.content?.substring(0, 200) + '...';
        const isOwnPost = post.author_id === currentUserId;

        return (
          <Card key={post.id} className="magazine-feature-card overflow-hidden bg-white/90 backdrop-blur-sm shadow-bloom-sm hover:shadow-bloom transition-all">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {post.author_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{post.author_name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {getPostTypeLabel(post.post_type)}
                    </Badge>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwnPost && onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(post.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Delete Post
                    </DropdownMenuItem>
                  )}
                  {!isOwnPost && (
                    <DropdownMenuItem>
                      <Flag className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Post Content */}
            {post.content && (
              <div className="px-4 pb-3">
                <p className="text-foreground whitespace-pre-wrap">
                  {displayContent}
                </p>
                {isLongContent && (
                  <button
                    onClick={() => toggleExpanded(post.id)}
                    className="text-sm text-primary hover:underline mt-1 font-medium"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            {/* Post Image */}
            {post.image_url && (
              <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden">
                <img
                  src={post.image_url}
                  alt="Post image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Canvas Journal Preview */}
            {post.post_type === 'canvas_journal' && post.canvas_data && (
              <div
                className="w-full aspect-[4/3] relative overflow-hidden"
                style={{ backgroundColor: post.canvas_data.backgroundColor || '#F2E9E4' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge variant="secondary" className="gap-2">
                    🎨 Canvas Journal
                  </Badge>
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
                  <span>{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={post.is_liked ? "default" : "outline"}
                  size="sm"
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => post.is_liked ? onUnlike(post.id) : onLike(post.id)}
                >
                  <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} strokeWidth={1.5} />
                  {post.is_liked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => onComment(post.id)}
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  Comment
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
