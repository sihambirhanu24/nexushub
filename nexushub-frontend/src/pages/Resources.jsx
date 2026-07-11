import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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
      case 'available': return 'bg-emerald-500/10 text-emerald-400';
      case 'in-use': return 'bg-blue-500/10 text-blue-400';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400';
      case 'unavailable': return 'bg-gray-700 text-gray-400';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  const categories = ['all', 'Laptop', 'Desktop', 'Printer', 'Meeting Room', 'Vehicle', 'Projector', 'Furniture'];
  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Resources</h1>
            <p className="text-gray-500 text-sm mt-1">Manage company assets and equipment.</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Resource
            </button>
          )}
        </div>

        <div className="relative mb-4 w-full sm:max-w-sm">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="Search by name or resource code..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500">
            {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500 capitalize">
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : filteredResources.length === 0 ? (
            <p className="text-gray-500 text-sm">No resources found.</p>
          ) : (
            filteredResources.map((r) => (
              <div key={r.id} onClick={() => setViewingResource(r)} className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-700 active:bg-gray-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                    {r.status}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); setEditingResource(r); }} className="p-1 -m-1">
                        <Pencil className="w-3.5 h-3.5 text-gray-500 hover:text-indigo-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeletingResource(r); }} className="p-1 -m-1">
                        <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-white font-medium">{r.name}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{r.resource_code}</p>
                <p className="text-xs text-gray-500 mt-2">{r.category}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <AddResourceModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={() => { fetchResources(); showToast('Resource added successfully'); }} />
      <EditResourceModal isOpen={!!editingResource} onClose={() => setEditingResource(null)} onSuccess={() => { fetchResources(); showToast('Resource updated successfully'); }} resource={editingResource} />
      <ResourceDetailModal isOpen={!!viewingResource} onClose={() => setViewingResource(null)} resource={viewingResource} />
      <ConfirmDialog
        isOpen={!!deletingResource}
        onClose={() => setDeletingResource(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deletingResource?.name}"? This cannot be undone.`}
      />
      <Toast message={toast} show={!!toast} />
    </Layout>
  );
}

export default Resources;