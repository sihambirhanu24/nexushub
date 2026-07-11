import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, Package, BarChart3, LogOut, Zap, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import NotificationBell from './NotificationBell';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Team Members', path: '/members', icon: Users },
  { name: 'Work Requests', path: '/requests', icon: ClipboardList },
  { name: 'Resources', path: '/resources', icon: Package },
  { name: 'Statistics', path: '/statistics', icon: BarChart3 },
];

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-60 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-40
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-white font-semibold">NexusHub</span>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <Link
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
              }}
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-500 hover:text-red-400" />
            </button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-60 flex flex-col min-h-screen w-full">

       <header className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-20">
          <button
            className="md:hidden text-gray-400 hover:text-white flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 min-w-0 max-w-xl">
            <GlobalSearch />
          </div>

          <div className="ml-auto flex items-center">
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;