import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';
import AddResourceModal from '../components/AddResourceModal';
import EditResourceModal from '../components/EditResourceModal';
import ResourceDetailModal from '../components/ResourceDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);
  const [viewingResource, setViewingResource] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchResources(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const fetchResources = async () => {
    try {
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (err) {
      console.error('Failed to load resources', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/resources/${deletingResource.id}`);
      showToast('Resource deleted successfully');
      setDeletingResource(null);
      fetchResources();
    } catch (err) {
      console.error('Failed to delete resource', err);
    }
  };

  const filteredResources = resources
    .filter((r) => categoryFilter === 'all' || r.category === categoryFilter)
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .filter((r) =>
      search === '' ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.resource_code.toLowerCase().includes(search.toLowerCase())
    );

  const statusStyle = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'in-use': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'unavailable': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const statusBorderLeft = (status) => {
    switch (status) {
      case 'available': return 'border-l-emerald-500';
      case 'in-use': return 'border-l-blue-500';
      case 'maintenance': return 'border-l-yellow-500';
      case 'unavailable': return 'border-l-gray-600';
      default: return 'border-l-gray-700';
    }
  };

  const categories = ['all', 'Laptop', 'Desktop', 'Printer', 'Meeting Room', 'Vehicle', 'Projector', 'Furniture'];
  const statusTabs = ['all', 'available', 'in-use', 'maintenance', 'unavailable'];
  const isAdmin = user?.role === 'admin';

  const availableCount = resources.filter(r => r.status === 'available').length;
  const inUseCount = resources.filter(r => r.status === 'in-use').length;

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Resources</h1>
            <p className="text-gray-500 text-sm mt-1">Manage company assets and equipment.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
              <span><span className="text-emerald-400 font-semibold">{availableCount}</span> available</span>
              <span><span className="text-blue-400 font-semibold">{inUseCount}</span> in use</span>
            </div>
            {isAdmin && (
              <button onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition-all">
                <Plus className="w-4 h-4" /> Add Resource
              </button>
            )}
          </div>
        </div>

        {/* Category pill tabs */}
        <div className="flex gap-1 flex-wrap mb-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === c
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        {/* Search and status filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="Search by name or resource code..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 overflow-x-auto">
            {statusTabs.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-all ${
                  statusFilter === s
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Resource cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
                <div className="h-3 bg-gray-800 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-800 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No resources found.</p>
            <p className="text-sm mt-1 text-gray-600">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((r) => (
              <div
                key={r.id}
                onClick={() => setViewingResource(r)}
                className={`bg-gray-900 border border-gray-800 border-l-4 ${statusBorderLeft(r.status)} rounded-xl p-4 cursor-pointer hover:border-gray-700 hover:scale-[1.01] active:scale-[0.99] transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                    {r.status}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setEditingResource(r); }}
                        className="p-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-gray-500 hover:text-indigo-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeletingResource(r); }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-white font-semibold">{r.name}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{r.resource_code}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
                  <span className="text-xs text-gray-500">{r.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddResourceModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSuccess={() => { fetchResources(); showToast('Resource added successfully'); }} />
      <EditResourceModal isOpen={!!editingResource} onClose={() => setEditingResource(null)}
        onSuccess={() => { fetchResources(); showToast('Resource updated successfully'); }} resource={editingResource} />
      <ResourceDetailModal isOpen={!!viewingResource} onClose={() => setViewingResource(null)} resource={viewingResource} />
      <ConfirmDialog isOpen={!!deletingResource} onClose={() => setDeletingResource(null)}
        onConfirm={handleDelete} title="Delete Resource"
        message={`Are you sure you want to delete "${deletingResource?.name}"? This cannot be undone.`} />
      <Toast message={toast} show={!!toast} />
    </Layout>
  );
}

export default Resources;