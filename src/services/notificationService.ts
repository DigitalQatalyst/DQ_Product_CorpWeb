import { getPrimarySupabase } from '../lib/supabaseClients';
import type { Notification, NotificationType, Priority } from '../types/admin';

const supabase = getPrimarySupabase();

// Get notifications for a user
export const getNotifications = async (userId: string, filters?: {
  isRead?: boolean;
  type?: NotificationType;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.isRead !== undefined) {
      query = query.eq('is_read', filters.isRead);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as Notification[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get unread count
export const getUnreadCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { count: count || 0, error: null };
  } catch (error: any) {
    return { count: 0, error: error.message };
  }
};

// Create notification
export const createNotification = async (notification: {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  priority?: Priority;
}) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return { data: data as Notification, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Mark notification as read
export const markAsRead = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Notification, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Mark all as read
export const markAllAsRead = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select();

    if (error) throw error;
    return { data: data as Notification[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Delete notification
export const deleteNotification = async (id: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete all read notifications
export const deleteAllRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Bulk create notifications (for multiple users)
export const createBulkNotifications = async (notifications: Array<{
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  priority?: Priority;
}>) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) throw error;
    return { data: data as Notification[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Subscribe to real-time notifications
export const subscribeToNotifications = (
  userId: string,
  callback: (notification: Notification) => void
) => {
  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return subscription;
};

// Unsubscribe from notifications
export const unsubscribeFromNotifications = (subscription: any) => {
  supabase.removeChannel(subscription);
};
