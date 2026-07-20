import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, Moon, Sun, ChevronDown, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getInitials } from '../utils/helpers.js';

export default function DashboardNavbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode, user, notifications, markNotificationRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Close when changing tabs/routes
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 card shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                {unread > 0 && <span className="badge badge-info">{unread} new</span>}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => { 
                      markNotificationRead(n.id); 
                      setShowNotifications(false); 
                      if (n.link) navigate(n.link);
                    }}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1 flex-shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            {user ? getInitials(user.name) : ''}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
