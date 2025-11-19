"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserProfile, subscribeToProfile } from '@/lib/user-profile-store';
import Link from 'next/link';

const MOCK_USER_ID = 'demo-user-001';

/**
 * RootedHeader - Unified header component for the entire app
 * Matches the elegant, minimal design from the community page with profile section
 */
export function RootedHeader() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userName, setUserName] = useState('Brooklyn Thomlinson');

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

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="relative z-40 bg-card/95 backdrop-blur-md border-b-2 border-border/50 px-6 py-5 animate-fade-in-up sticky top-0 shadow-bloom-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo/Brand - Left side */}
        <div>
          <div className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-wider">
            <span className="text-foreground">ROOTED</span>
          </div>
          <div className="text-xs text-muted-foreground font-light tracking-wide">
            Grounded in Nature
          </div>
        </div>

        {/* Profile - Right side */}
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
            <Link href="/profile">
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
    </header>
  );
}
