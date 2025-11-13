"use client";

import { Bell, Search, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useRef, useEffect } from 'react';
import { getUserProfile, updateProfilePicture, subscribeToProfile } from '@/lib/user-profile-store';
import Link from 'next/link';

const MOCK_USER_ID = 'demo-user-001';

export function DashboardHeader() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userName, setUserName] = useState('Sarah Thompson');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data
  useEffect(() => {
    const profile = getUserProfile(MOCK_USER_ID);
    if (profile) {
      setProfilePicture(profile.profilePicture || null);
      setUserName(profile.name || 'Sarah Thompson');
    }

    // Subscribe to profile updates
    const unsubscribe = subscribeToProfile(MOCK_USER_ID, (updatedProfile) => {
      setProfilePicture(updatedProfile.profilePicture || null);
      setUserName(updatedProfile.name || 'Sarah Thompson');
    });

    return unsubscribe;
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await updateProfilePicture(MOCK_USER_ID, file);
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-0.5">
          {/* Search Bar */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search wellness data, rituals..."
                className="pl-6 py-0 h-6 text-[10px] bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative rounded-full h-6 w-6">
              <Bell className="w-3 h-3" />
              <span className="absolute top-0 right-0 w-1 h-1 bg-secondary rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] font-medium leading-tight">{userName}</p>
                    <p className="text-[7px] text-muted-foreground leading-tight">Premium Member</p>
                  </div>
                  <Avatar className="w-6 h-6">
                    {profilePicture && <AvatarImage src={profilePicture} alt={userName} />}
                    <AvatarFallback className="bg-primary text-primary-foreground text-[9px]">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                  Change Profile Picture
                </DropdownMenuItem>
                <Link href="/settings">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                {profilePicture && <AvatarImage src={profilePicture} alt={userName} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload New Photo'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Recommended: Square image, max 5MB
                <br />
                Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
