import { useState, useEffect, useRef } from 'react';
import { Search, User, ClipboardList, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

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
    if (query.trim() === '') {
      setResults(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await api.get('/search', { params: { q: query } });
        setResults(response.data);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search failed', err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const goTo = (path) => {
    navigate(path);
    setQuery('');
    setShowDropdown(false);
  };

  const hasResults = results && (results.members.length || results.requests.length || results.resources.length);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowDropdown(true)}
        placeholder="Search..."
        className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
      />

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50 max-h-96 overflow-auto">
          {!hasResults ? (
            <p className="text-gray-500 text-sm px-4 py-3">No results found.</p>
          ) : (
            <>
              {results.members.length > 0 && (
                <div className="p-2">
                  <p className="text-xs text-gray-500 uppercase px-2 py-1">Team Members</p>
                  {results.members.map((m) => (
                    <button key={m.id} onClick={() => goTo('/members')}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 text-left">
                      <User className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-sm text-white">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.requests.length > 0 && (
                <div className="p-2 border-t border-gray-800">
                  <p className="text-xs text-gray-500 uppercase px-2 py-1">Work Requests</p>
                  {results.requests.map((r) => (
                    <button key={r.id} onClick={() => goTo('/requests')}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 text-left">
                      <ClipboardList className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-sm text-white">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.request_number} · {r.status}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.resources.length > 0 && (
                <div className="p-2 border-t border-gray-800">
                  <p className="text-xs text-gray-500 uppercase px-2 py-1">Resources</p>
                  {results.resources.map((r) => (
                    <button key={r.id} onClick={() => goTo('/resources')}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 text-left">
                      <Package className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-sm text-white">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.resource_code} · {r.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;