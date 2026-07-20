import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Utensils, Syringe, Bot, Activity,
  Users, FileText, Settings, Heart, X, ChevronRight, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getInitials } from '../utils/helpers.js';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Child Profile', path: '/child-profile' },
  { icon: Utensils, label: 'Nutrition & Growth', path: '/nutrition' },
  { icon: Syringe, label: 'Vaccination', path: '/vaccination' },
  { icon: Bot, label: 'AI Assistant', path: '/assistant' },
  { icon: Activity, label: 'Activities', path: '/activities' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: FileText, label: 'Medical Records', path: '/medical-records' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, child, setActiveUserId } = useApp();
  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear the session
    setActiveUserId(null);             // Tell AppContext we logged out
    navigate('/login');                // Send them to the login page
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold gradient-text">GrowNest</span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Child profile mini */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {child ? getInitials(child.name) : ''}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{child?.name || 'No Child Selected'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Profile</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-auto" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            {user ? getInitials(user.name) : ''}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>

        {/* New Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
