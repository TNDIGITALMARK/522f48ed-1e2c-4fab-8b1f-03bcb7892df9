"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles, HelpCircle, Settings, Share2, Trophy,
  BookOpen, Users, TrendingUp
} from 'lucide-react';

interface QuickActionsMenuProps {
  onTutorial: () => void;
  onLeaderboard?: () => void;
  onShare?: () => void;
}

export function QuickActionsMenu({ onTutorial, onLeaderboard, onShare }: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sparkles className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onTutorial}>
          <HelpCircle className="w-4 h-4 mr-2" />
          <span>View Tutorial</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <BookOpen className="w-4 h-4 mr-2" />
          <span>Garden Guide</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onLeaderboard}>
          <Trophy className="w-4 h-4 mr-2" />
          <span>Leaderboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Users className="w-4 h-4 mr-2" />
          <span>Invite Friends</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          <span>Share Garden</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <TrendingUp className="w-4 h-4 mr-2" />
          <span>View Stats</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
