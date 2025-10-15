// src/components/NotificationsPanel.jsx
import React from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-16 bg-white rounded-2xl shadow-2xl w-80 max-h-96 border border-gray-200 z-50 backdrop-blur-sm">
      {/* Notifications Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-gray-700" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-xl cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                  !notification.read 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${
                      !notification.read ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      !notification.read ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="font-medium text-gray-600">No notifications</p>
            <p className="text-sm text-gray-500 mt-1">We'll notify you when something arrives</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;