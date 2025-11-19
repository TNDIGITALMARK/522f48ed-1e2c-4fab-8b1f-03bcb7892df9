"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, X } from 'lucide-react';

interface FriendRequest {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string | null;
  created_at: string;
}

interface FriendRequestsPanelProps {
  requests: FriendRequest[];
  onAccept: (requestId: string, senderId: string) => void;
  onReject: (requestId: string) => void;
}

export function FriendRequestsPanel({
  requests,
  onAccept,
  onReject
}: FriendRequestsPanelProps) {
  if (requests.length === 0) {
    return (
      <Card className="magazine-feature-card p-6 text-center bg-white/90 backdrop-blur-sm shadow-bloom-sm">
        <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
          <UserPlus className="w-8 h-8 text-muted-foreground opacity-50" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-muted-foreground">No pending friend requests</p>
      </Card>
    );
  }

  return (
    <Card className="magazine-feature-card p-6 bg-white/90 backdrop-blur-sm shadow-bloom-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Friend Requests</h3>
        <Badge variant="secondary">{requests.length}</Badge>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-start gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors border border-border/30"
          >
            <Avatar className="w-12 h-12 border-2 border-primary/10 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {request.sender_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground mb-1">
                {request.sender_name}
              </p>
              {request.message && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {request.message}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-2 rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => onAccept(request.id, request.sender_id)}
                >
                  <Check className="w-4 h-4" strokeWidth={2} />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => onReject(request.id)}
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
