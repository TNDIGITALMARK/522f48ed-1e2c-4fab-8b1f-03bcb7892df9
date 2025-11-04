import { supabase } from './client';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface SocialPost {
  id: string;
  tenantid: string;
  projectid: string;
  author_id: string;
  content: string | null;
  image_url: string | null;
  post_type: 'text' | 'photo' | 'canvas_journal';
  canvas_data: any | null;
  visibility: 'public' | 'friends' | 'private';
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface FriendRequest {
  id: string;
  tenantid: string;
  projectid: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string | null;
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

export interface PostLike {
  id: string;
  tenantid: string;
  projectid: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  tenantid: string;
  projectid: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// FRIEND OPERATIONS
// ============================================

/**
 * Get all friends for a user
 */
export async function getUserFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Friend[];
}

/**
 * Send a friend request
 */
export async function sendFriendRequest(
  senderId: string,
  receiverId: string,
  message?: string
): Promise<FriendRequest> {
  const { data, error } = await supabase
    .from('friend_requests')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      sender_id: senderId,
      receiver_id: receiverId,
      message: message || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data as FriendRequest;
}

/**
 * Get pending friend requests for a user
 */
export async function getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from('friend_requests')
    .select('*')
    .eq('receiver_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as FriendRequest[];
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(requestId: string, senderId: string, receiverId: string): Promise<void> {
  // Update request status
  const { error: updateError } = await supabase
    .from('friend_requests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (updateError) throw updateError;

  // Create bidirectional friendship
  const { error: insertError1 } = await supabase
    .from('friends')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      user_id: senderId,
      friend_id: receiverId
    });

  if (insertError1) throw insertError1;

  const { error: insertError2 } = await supabase
    .from('friends')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      user_id: receiverId,
      friend_id: senderId
    });

  if (insertError2) throw insertError2;
}

/**
 * Reject a friend request
 */
export async function rejectFriendRequest(requestId: string): Promise<void> {
  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) throw error;
}

/**
 * Remove a friend
 */
export async function removeFriend(userId: string, friendId: string): Promise<void> {
  const { error } = await supabase
    .from('friends')
    .delete()
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

  if (error) throw error;
}

// ============================================
// SOCIAL POST OPERATIONS
// ============================================

/**
 * Create a new social post
 */
export async function createSocialPost(
  authorId: string,
  postData: {
    content?: string;
    image_url?: string;
    post_type?: 'text' | 'photo' | 'canvas_journal';
    canvas_data?: any;
    visibility?: 'public' | 'friends' | 'private';
  }
): Promise<SocialPost> {
  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      author_id: authorId,
      content: postData.content || null,
      image_url: postData.image_url || null,
      post_type: postData.post_type || 'text',
      canvas_data: postData.canvas_data || null,
      visibility: postData.visibility || 'friends'
    })
    .select()
    .single();

  if (error) throw error;
  return data as SocialPost;
}

/**
 * Get feed posts (friends' posts + own posts)
 */
export async function getFeedPosts(userId: string, limit: number = 20): Promise<SocialPost[]> {
  // Get user's friends
  const friends = await getUserFriends(userId);
  const friendIds = friends.map(f => f.user_id === userId ? f.friend_id : f.user_id);

  // Get posts from friends and self
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .in('author_id', [...friendIds, userId])
    .in('visibility', ['public', 'friends'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as SocialPost[];
}

/**
 * Get posts by a specific user
 */
export async function getUserPosts(userId: string): Promise<SocialPost[]> {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SocialPost[];
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('social_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// ============================================
// POST INTERACTIONS
// ============================================

/**
 * Like a post
 */
export async function likePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('post_likes')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      post_id: postId,
      user_id: userId
    });

  if (error) throw error;

  // Increment likes count
  const { error: updateError } = await supabase.rpc('increment_post_likes', { post_id: postId });
  // If the RPC doesn't exist yet, manually increment
  if (updateError) {
    const { data: post } = await supabase
      .from('social_posts')
      .select('likes_count')
      .eq('id', postId)
      .single();

    if (post) {
      await supabase
        .from('social_posts')
        .update({ likes_count: post.likes_count + 1, updated_at: new Date().toISOString() })
        .eq('id', postId);
    }
  }
}

/**
 * Unlike a post
 */
export async function unlikePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (error) throw error;

  // Decrement likes count
  const { data: post } = await supabase
    .from('social_posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  if (post && post.likes_count > 0) {
    await supabase
      .from('social_posts')
      .update({ likes_count: post.likes_count - 1, updated_at: new Date().toISOString() })
      .eq('id', postId);
  }
}

/**
 * Check if user has liked a post
 */
export async function hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

/**
 * Add a comment to a post
 */
export async function addComment(postId: string, authorId: string, content: string): Promise<PostComment> {
  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      post_id: postId,
      author_id: authorId,
      content
    })
    .select()
    .single();

  if (error) throw error;

  // Increment comments count
  const { data: post } = await supabase
    .from('social_posts')
    .select('comments_count')
    .eq('id', postId)
    .single();

  if (post) {
    await supabase
      .from('social_posts')
      .update({ comments_count: post.comments_count + 1, updated_at: new Date().toISOString() })
      .eq('id', postId);
  }

  return data as PostComment;
}

/**
 * Get comments for a post
 */
export async function getPostComments(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as PostComment[];
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string, postId: string): Promise<void> {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;

  // Decrement comments count
  const { data: post } = await supabase
    .from('social_posts')
    .select('comments_count')
    .eq('id', postId)
    .single();

  if (post && post.comments_count > 0) {
    await supabase
      .from('social_posts')
      .update({ comments_count: post.comments_count - 1, updated_at: new Date().toISOString() })
      .eq('id', postId);
  }
}
