import { useState, useEffect, useRef } from 'react';
import { Bell, User, ClipboardList, Package, X } from 'lucide-react';
import api from '../api/axios';

function NotificationBell() {
  const [items, setItems] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('notif_dismissed') || '[]'); }
    catch { return []; }
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastSeen, setLastSeen] = useState(() => localStorage.getItem('notif_last_seen') || new Date(0).toISOString());
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const [membersRes, requestsRes, resourcesRes] = await Promise.all([
          api.get('/members'),
          api.get('/requests'),
          api.get('/resources'),
        ]);

        const members = membersRes.data.map((m) => ({
          id: `member-${m.id}`,
          type: 'member',
          label: `New member: ${m.name}`,
          created_at: m.created_at,
        }));
        const requests = (requestsRes.data.requests || requestsRes.data).map((r) => ({
          id: `request-${r.id}`,
          type: 'request',
          label: `New request: ${r.title}`,
          created_at: r.created_at,
        }));
        const resources = resourcesRes.data.map((r) => ({
          id: `resource-${r.id}`,
          type: 'resource',
          label: `New resource: ${r.name}`,
          created_at: r.created_at,
        }));

        const all = [...members, ...requests, ...resources]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 20);

        setItems(all);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };
    fetchRecent();
    const interval = setInterval(fetchRecent, 15000);
    return () => clearInterval(interval);
  }, []);

  const visibleItems = items.filter((i) => !dismissed.includes(i.id));
  const unreadCount = visibleItems.filter((i) => new Date(i.created_at) > new Date(lastSeen)).length;

  const handleOpen = () => {
    setShowDropdown((prev) => !prev);
    const now = new Date().toISOString();
    localStorage.setItem('notif_last_seen', now);
    setLastSeen(now);
  };

  const dismissOne = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('notif_dismissed', JSON.stringify(updated));
  };

  const dismissAll = () => {
    const allIds = items.map((i) => i.id);
    setDismissed(allIds);
    localStorage.setItem('notif_dismissed', JSON.stringify(allIds));
  };

  const iconFor = (type) => {
    if (type === 'member') return <User className="w-4 h-4 text-indigo-400 shrink-0" />;
    if (type === 'request') return <ClipboardList className="w-4 h-4 text-indigo-400 shrink-0" />;
    return <Package className="w-4 h-4 text-indigo-400 shrink-0" />;
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button onClick={handleOpen} className="relative">
        <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50 max-h-96 overflow-auto">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <p className="text-white font-medium text-sm">Notifications</p>
            {visibleItems.length > 0 && (
              <button
                onClick={dismissAll}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          {visibleItems.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-6 text-center">All caught up!</p>
          ) : (
            visibleItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/50 last:border-0 group">
                {iconFor(item.type)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-300 truncate">{item.label}</p>
                  <p className="text-xs text-gray-600">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => dismissOne(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;