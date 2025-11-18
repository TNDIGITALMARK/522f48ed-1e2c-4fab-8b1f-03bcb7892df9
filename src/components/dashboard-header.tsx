"use client";

import { Bell, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  const [userName, setUserName] = useState('Brooklyn Thomlinson');
  const [isUploading, setIsUploading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data
  useEffect(() => {
    const profile = getUserProfile(MOCK_USER_ID);
    if (profile) {
      setProfilePicture(profile.profilePicture || null);
      setUserName(profile.name || 'Brooklyn Thomlinson');
    }

    // Subscribe to profile updates
    const unsubscribe = subscribeToProfile(MOCK_USER_ID, (updatedProfile) => {
      setProfilePicture(updatedProfile.profilePicture || null);
      setUserName(updatedProfile.name || 'Brooklyn Thomlinson');
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
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-border/50 shadow-sm" style={{ backgroundColor: 'hsl(0 0% 98%)' }}>
        <div className="flex items-center justify-between px-4 md:px-6 py-2">
          {/* Logo/Brand */}
          <div className="flex-1">
            <h2 className="text-lg font-['Inter'] font-semibold text-foreground">rooted</h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full h-9 w-9 hover:bg-primary/10"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-xs text-muted-foreground font-normal">3 new</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                      <span className="text-sm font-medium">Cycle Phase Update</span>
                      <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      You've entered your follicular phase. Energy levels may increase.
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                      <span className="text-sm font-medium">Daily Goal Reminder</span>
                      <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      You're 2 workouts away from your weekly goal!
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                      <span className="text-sm font-medium">New Community Post</span>
                      <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      Sarah shared a new wellness tip in the community.
                    </p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center justify-center text-xs text-primary">
                  View All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full p-1">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-['Inter'] font-semibold leading-tight text-foreground">{userName}</p>
                    <p className="text-xs font-['Inter'] text-muted-foreground leading-tight">Member</p>
                  </div>
                  <Avatar className="w-9 h-9 border-2 border-transparent hover:border-primary/50 transition-colors">
                    {profilePicture && <AvatarImage src={profilePicture} alt={userName} />}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
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
