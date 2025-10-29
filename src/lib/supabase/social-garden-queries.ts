import { supabase, TENANT_ID, PROJECT_ID } from './client';

// ============================================
// Types
// ============================================

export interface FriendRequest {
  id: string;
  tenantid: string;
  projectid: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface Friend {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface Garden {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  garden_name: string;
  level: number;
  xp: number;
  coins: number;
  grid_width: number;
  grid_height: number;
  created_at: string;
  updated_at: string;
}

export interface GardenItem {
  id: string;
  tenantid: string;
  projectid: string;
  garden_id: string;
  item_type: string;
  item_name: string;
  grid_x: number;
  grid_y: number;
  width: number;
  height: number;
  growth_stage: number;
  is_harvested: boolean;
  placed_at: string;
  updated_at: string;
}

export interface Gift {
  id: string;
  tenantid: string;
  projectid: string;
  sender_id: string;
  recipient_id: string;
  gift_type: string;
  gift_name: string;
  gift_value: number;
  message?: string | null;
  is_claimed: boolean;
  created_at: string;
  claimed_at?: string | null;
}

export interface GardenVisit {
  id: string;
  tenantid: string;
  projectid: string;
  visitor_id: string;
  garden_id: string;
  visited_at: string;
}

// ============================================
// Friend Request Queries
// ============================================

export async function sendFriendRequest(
  requesterId: string,
  recipientId: string
): Promise<FriendRequest> {
  const { data, error } = await supabase
    .from('friend_requests')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      requester_id: requesterId,
      recipient_id: recipientId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error} = await supabase
    .from('friend_requests')
    .select('*')
    .eq('recipient_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function acceptFriendRequest(requestId: string, userId: string, friendId: string): Promise<void> {
  // Update request status
  const { error: updateError } = await supabase
    .from('friend_requests')
    .update({
      status: 'accepted',
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (updateError) throw updateError;

  // Create bidirectional friendship
  const { error: insertError1 } = await supabase
    .from('friends')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      user_id: userId,
      friend_id: friendId,
    });

  if (insertError1) throw insertError1;

  const { error: insertError2 } = await supabase
    .from('friends')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      user_id: friendId,
      friend_id: userId,
    });

  if (insertError2) throw insertError2;
}

export async function declineFriendRequest(requestId: string): Promise<void> {
  const { error } = await supabase
    .from('friend_requests')
    .update({
      status: 'declined',
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (error) throw error;
}

// ============================================
// Friend Queries
// ============================================

export async function getFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function removeFriend(userId: string, friendId: string): Promise<void> {
  // Remove both directions of friendship
  const { error: error1 } = await supabase
    .from('friends')
    .delete()
    .eq('user_id', userId)
    .eq('friend_id', friendId);

  if (error1) throw error1;

  const { error: error2 } = await supabase
    .from('friends')
    .delete()
    .eq('user_id', friendId)
    .eq('friend_id', userId);

  if (error2) throw error2;
}

// ============================================
// Garden Queries
// ============================================

export async function getGarden(userId: string): Promise<Garden | null> {
  const { data, error } = await supabase
    .from('gardens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

export async function createGarden(userId: string, gardenName?: string): Promise<Garden> {
  const { data, error } = await supabase
    .from('gardens')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      user_id: userId,
      garden_name: gardenName || 'My Garden',
      level: 1,
      xp: 0,
      coins: 100, // Starting coins
      grid_width: 10,
      grid_height: 10,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGarden(gardenId: string, updates: Partial<Garden>): Promise<Garden> {
  const { data, error } = await supabase
    .from('gardens')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', gardenId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateGarden(userId: string): Promise<Garden> {
  const garden = await getGarden(userId);
  if (garden) return garden;
  return await createGarden(userId);
}

// ============================================
// Garden Item Queries
// ============================================

export async function getGardenItems(gardenId: string): Promise<GardenItem[]> {
  const { data, error } = await supabase
    .from('garden_items')
    .select('*')
    .eq('garden_id', gardenId)
    .order('placed_at');

  if (error) throw error;
  return data || [];
}

export async function placeGardenItem(item: {
  gardenId: string;
  itemType: string;
  itemName: string;
  gridX: number;
  gridY: number;
  width?: number;
  height?: number;
}): Promise<GardenItem> {
  const { data, error } = await supabase
    .from('garden_items')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      garden_id: item.gardenId,
      item_type: item.itemType,
      item_name: item.itemName,
      grid_x: item.gridX,
      grid_y: item.gridY,
      width: item.width || 1,
      height: item.height || 1,
      growth_stage: 0,
      is_harvested: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGardenItem(
  itemId: string,
  updates: Partial<GardenItem>
): Promise<GardenItem> {
  const { data, error } = await supabase
    .from('garden_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeGardenItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('garden_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export async function harvestGardenItem(itemId: string): Promise<{ coins: number; xp: number }> {
  // Mark as harvested
  await updateGardenItem(itemId, { is_harvested: true });

  // Return reward (in real app, this would be calculated based on item type)
  return { coins: 10, xp: 5 };
}

// ============================================
// Gift Queries
// ============================================

export async function sendGift(gift: {
  senderId: string;
  recipientId: string;
  giftType: string;
  giftName: string;
  giftValue: number;
  message?: string;
}): Promise<Gift> {
  const { data, error } = await supabase
    .from('gifts')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      sender_id: gift.senderId,
      recipient_id: gift.recipientId,
      gift_type: gift.giftType,
      gift_name: gift.giftName,
      gift_value: gift.giftValue,
      message: gift.message,
      is_claimed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUnclaimedGifts(userId: string): Promise<Gift[]> {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('recipient_id', userId)
    .eq('is_claimed', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function claimGift(giftId: string): Promise<Gift> {
  const { data, error } = await supabase
    .from('gifts')
    .update({
      is_claimed: true,
      claimed_at: new Date().toISOString(),
    })
    .eq('id', giftId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Garden Visit Queries
// ============================================

export async function recordGardenVisit(visitorId: string, gardenId: string): Promise<GardenVisit> {
  const { data, error } = await supabase
    .from('garden_visits')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      visitor_id: visitorId,
      garden_id: gardenId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getGardenVisits(gardenId: string, limit = 10): Promise<GardenVisit[]> {
  const { data, error } = await supabase
    .from('garden_visits')
    .select('*')
    .eq('garden_id', gardenId)
    .order('visited_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================
// Helper Functions
// ============================================

export async function getFriendGardens(userId: string): Promise<Garden[]> {
  // Get user's friends
  const friends = await getFriends(userId);
  const friendIds = friends.map((f) => f.friend_id);

  if (friendIds.length === 0) return [];

  // Get gardens for all friends
  const { data, error } = await supabase
    .from('gardens')
    .select('*')
    .in('user_id', friendIds);

  if (error) throw error;
  return data || [];
}
