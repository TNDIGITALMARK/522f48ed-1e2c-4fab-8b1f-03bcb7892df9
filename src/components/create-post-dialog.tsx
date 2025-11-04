"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ImageIcon,
  Upload,
  Globe,
  Users,
  Lock,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: (postData: {
    content: string;
    image_url?: string;
    post_type: 'text' | 'photo';
    visibility: 'public' | 'friends' | 'private';
  }) => void;
  userName: string;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onPost,
  userName
}: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('friends');
  const [isPosting, setIsPosting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handlePost = async () => {
    if (!content.trim() && !imagePreview) return;

    setIsPosting(true);
    try {
      await onPost({
        content: content.trim(),
        image_url: imagePreview || undefined,
        post_type: imagePreview ? 'photo' : 'text',
        visibility
      });

      // Reset form
      setContent('');
      setImagePreview(null);
      setVisibility('friends');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const canPost = (content.trim().length > 0 || imagePreview) && !isPosting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, photos, or canvas journals with your community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{userName}</p>
              <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                <SelectTrigger className="w-fit h-7 text-xs border-none px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Friends
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Only Me
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none text-base border-none focus-visible:ring-0 px-0"
          />

          {/* Image Preview */}
          {imagePreview && (
            <Card className="relative overflow-hidden">
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-[400px] object-cover"
              />
            </Card>
          )}

          {/* Add Media Section */}
          <Card className="p-4 bg-muted/30 border-dashed">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Add to your post
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm">Photo</span>
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPosting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={!canPost}
              className="min-w-[100px]"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
