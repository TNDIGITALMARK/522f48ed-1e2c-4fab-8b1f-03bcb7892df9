"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Check, X, Gift, Eye } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  level: number;
  lastActive: string;
  status: 'online' | 'offline';
}

interface FriendRequest {
  id: string;
  name: string;
  sentAt: string;
}

interface FriendsManagerProps {
  onVisitProfile?: (friendId: string) => void;
  onSendGift?: (friendId: string) => void;
}

export function FriendsManager({ onVisitProfile, onSendGift }: FriendsManagerProps) {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      level: 12,
      lastActive: '2 hours ago',
      status: 'online',
    },
    {
      id: '2',
      name: 'Emma Williams',
      level: 8,
      lastActive: '1 day ago',
      status: 'offline',
    },
    {
      id: '3',
      name: 'Olivia Brown',
      level: 15,
      lastActive: '3 hours ago',
      status: 'online',
    },
  ]);

  const [requests, setRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      name: 'Jessica Davis',
      sentAt: '5 minutes ago',
    },
    {
      id: '2',
      name: 'Sophia Miller',
      sentAt: '1 hour ago',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const acceptRequest = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    setFriends([
      ...friends,
      {
        id: Date.now().toString(),
        name: request.name,
        level: 1,
        lastActive: 'Just now',
        status: 'online',
      },
    ]);
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  const declineRequest = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  const sendFriendRequest = () => {
    if (!searchQuery.trim()) return;

    // Simulate sending request
    alert(`Friend request sent to ${searchQuery}`);
    setSearchQuery('');
    setShowAddDialog(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Friends</h3>
              <p className="text-sm text-muted-foreground">
                Connect with wellness buddies
              </p>
            </div>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Friend</DialogTitle>
                <DialogDescription>
                  Search for friends by username or email
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Enter username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendFriendRequest()}
                />

                <Button onClick={sendFriendRequest} className="w-full">
                  Send Friend Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4 mt-4">
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No friends yet. Add some to get started!
                </p>
              </div>
            ) : (
              friends.map((friend) => (
                <Card key={friend.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {friend.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{friend.name}</h4>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              friend.status === 'online'
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`}
                          />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Level {friend.level}</span>
                          <span>•</span>
                          <span>{friend.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => onVisitProfile?.(friend.id)}
                      >
                        <Eye className="w-4 h-4" />
                        Visit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => onSendGift?.(friend.id)}
                      >
                        <Gift className="w-4 h-4" />
                        Gift
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 mt-4">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No pending friend requests
                </p>
              </div>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <span className="font-semibold text-secondary">
                          {request.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Sent {request.sentAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => acceptRequest(request.id)}
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => declineRequest(request.id)}
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
