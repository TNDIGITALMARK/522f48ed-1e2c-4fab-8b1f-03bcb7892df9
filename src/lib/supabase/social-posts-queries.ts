import { supabase, TENANT_ID, PROJECT_ID } from './client';

// ============================================
// Types
// ============================================

export interface SocialPost {
  id: string;
  tenantid: string;
  projectid: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
  post_type: 'text' | 'photo' | 'both';
  visibility: 'public' | 'friends' | 'private';
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostLike {
  id: string;
  tenantid: string;
  projectid: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// ============================================
// Social Posts Queries
// ============================================

export async function createSocialPost(
  userId: string,
  caption: string | null,
  imageUrl: string | null,
  postType: 'text' | 'photo' | 'both' = 'text',
  visibility: 'public' | 'friends' | 'private' = 'friends'
): Promise<SocialPost | null> {
  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      user_id: userId,
      caption,
      image_url: imageUrl,
      post_type: postType,
      visibility,
      like_count: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating social post:', error);
    return null;
  }

  return data;
}

export async function getFriendsPosts(userId: string, limit: number = 50): Promise<SocialPost[]> {
  // Get user's friends
  const { data: friendsData, error: friendsError } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId);

  if (friendsError) {
    console.error('Error fetching friends:', friendsError);
    return [];
  }

  const friendIds = friendsData.map(f => f.friend_id);
  
  // Include user's own posts
  friendIds.push(userId);

  // Fetch posts from friends and self
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .in('user_id', friendIds)
    .eq('visibility', 'friends')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching friends posts:', error);
    return [];
  }

  return data;
}

export async function getUserPosts(userId: string): Promise<SocialPost[]> {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }

  return data;
}

export async function likePost(userId: string, postId: string): Promise<boolean> {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    return false; // Already liked
  }

  // Insert like
  const { error: likeError } = await supabase
    .from('post_likes')
    .insert({
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      post_id: postId,
      user_id: userId
    });

  if (likeError) {
    console.error('Error liking post:', likeError);
    return false;
  }

  // Increment like count
  const { error: updateError } = await supabase
    .from('social_posts')
    .update({ like_count: supabase.raw('like_count + 1') })
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating like count:', updateError);
  }

  return true;
}

export async function unlikePost(userId: string, postId: string): Promise<boolean> {
  // Delete like
  const { error: deleteError } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Error unliking post:', deleteError);
    return false;
  }

  // Decrement like count
  const { error: updateError } = await supabase
    .from('social_posts')
    .update({ like_count: supabase.raw('GREATEST(like_count - 1, 0)') })
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating like count:', updateError);
  }

  return true;
}

export async function hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data && !error;
}

export async function deletePost(postId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('social_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
}
