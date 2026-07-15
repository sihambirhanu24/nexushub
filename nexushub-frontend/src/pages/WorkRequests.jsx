import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Search, ClipboardList } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';
import AddRequestModal from '../components/AddRequestModal';
import EditRequestModal from '../components/EditRequestModal';
import RequestDetailModal from '../components/RequestDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

function WorkRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data.requests || response.data);
    } catch (err) {
      console.error('Failed to load requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/requests/${deletingRequest.id}`);
      showToast('Request deleted successfully');
      setDeletingRequest(null);
      fetchRequests();
    } catch (err) {
      console.error('Failed to delete request', err);
    }
  };

  const filteredRequests = requests
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .filter((r) => priorityFilter === 'all' || r.priority === priorityFilter)
    .filter((r) =>
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.request_number.toLowerCase().includes(search.toLowerCase()) ||
      (r.requested_by_name || '').toLowerCase().includes(search.toLowerCase())
    );

  const statusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'cancelled': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const priorityStyle = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'medium': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'low': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const statusTabs = ['all', 'pending', 'in-progress', 'completed', 'cancelled'];
  const isAdmin = user?.role === 'admin';
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Work Requests</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage operational requests.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition-all">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>

        {/* Status pill tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-4 overflow-x-auto">
          {statusTabs.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {s === 'all' ? `All (${requests.length})` : `${s} (${requests.filter(r => r.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Search and priority filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="Search by title, request #, or requester..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500">
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Request #</th>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Requested By</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-500">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No requests found.</p>
                </td></tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} onClick={() => setViewingRequest(r)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/40 cursor-pointer transition-colors group">
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs">{r.request_number}</td>
                    <td className="px-5 py-3 text-white font-medium">{r.title}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-semibold">
                          {r.requested_by_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-400 text-sm">{r.requested_by_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle(r.priority)}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 ">
                        {canEdit && (
                          <button onClick={(e) => { e.stopPropagation(); setEditingRequest(r); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">
                            <Pencil className="w-3.5 h-3.5 text-gray-500 hover:text-indigo-400" />
                          </button>
                        )}
                        {isAdmin && (
                          <button onClick={(e) => { e.stopPropagation(); setDeletingRequest(r); }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">No requests found.</p>
          ) : (
            filteredRequests.map((r) => (
              <div key={r.id} onClick={() => setViewingRequest(r)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 active:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{r.title}</p>
                    <p className="text-gray-500 text-xs font-mono mt-0.5">{r.request_number}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                    {r.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-semibold">
                      {r.requested_by_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-400 text-xs truncate">{r.requested_by_name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle(r.priority)}`}>
                    {r.priority}
                  </span>
                </div>
                {(canEdit || isAdmin) && (
                  <div className="flex gap-3 mt-3 pt-3 border-t border-gray-800/50">
                    {canEdit && (
                      <button onClick={(e) => { e.stopPropagation(); setEditingRequest(r); }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); setDeletingRequest(r); }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <AddRequestModal isOpen={showModal} onClose={() => setShowModal(false)}
          onSuccess={() => { fetchRequests(); showToast('Request created successfully'); }} />
        <EditRequestModal isOpen={!!editingRequest} onClose={() => setEditingRequest(null)}
          onSuccess={() => { fetchRequests(); showToast('Request updated successfully'); }} request={editingRequest} />
        <RequestDetailModal isOpen={!!viewingRequest} onClose={() => setViewingRequest(null)} request={viewingRequest} />
        <ConfirmDialog isOpen={!!deletingRequest} onClose={() => setDeletingRequest(null)}
          onConfirm={handleDelete} title="Delete Request"
          message={`Are you sure you want to delete "${deletingRequest?.title}"? This cannot be undone.`} />
        <Toast message={toast} show={!!toast} />
      </div>
    </Layout>
  );
}

export default WorkRequests;