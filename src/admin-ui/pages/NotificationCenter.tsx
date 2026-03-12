import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService';
import type { Notification } from '../../types/admin';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Briefcase,
  FileText,
  AlertCircle,
  Settings,
  Loader,
} from 'lucide-react';

// Mock user ID - replace with actual auth user ID
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    const filters = filter === 'unread' ? { isRead: false } : undefined;
    const { data } = await getNotifications(MOCK_USER_ID, filters);
    setNotifications(data);
    setLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(MOCK_USER_ID);
    loadNotifications();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      application: <Briefcase size={20} className="text-blue-600" />,
      submission: <FileText size={20} className="text-purple-600" />,
      content: <FileText size={20} className="text-emerald-600" />,
      system: <Settings size={20} className="text-gray-600" />,
    };
    return icons[type] || <Bell size={20} className="text-gray-600" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'border-l-gray-300',
      normal: 'border-l-blue-400',
      high: 'border-l-orange-400',
      urgent: 'border-l-red-500',
    };
    return colors[priority] || 'border-l-gray-300';
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppLayout title="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                Notification Center
              </span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-black text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="inline-block animate-spin text-gray-400" size={32} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400 text-sm italic">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border-l-4 ${getPriorityColor(notification.priority)} border-r border-t border-b border-gray-200 p-4 hover:shadow-md transition-all ${
                  !notification.is_read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`text-sm font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium capitalize">
                            {notification.type}
                          </span>
                          {notification.priority !== 'normal' && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {notification.priority}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Link */}
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-2"
                      >
                        View Details →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
