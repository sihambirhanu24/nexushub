import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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
      case 'pending': return 'bg-yellow-500/10 text-yellow-400';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400';
      case 'cancelled': return 'bg-gray-700 text-gray-400';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  const priorityStyle = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-400';
      case 'high': return 'bg-orange-500/10 text-orange-400';
      case 'medium': return 'bg-blue-500/10 text-blue-400';
      case 'low': return 'bg-gray-700 text-gray-400';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  const isAdmin = user?.role === 'admin';
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Work Requests</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage operational requests.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>

        <div className="relative mb-4 w-full sm:max-w-sm">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="Search by title, request #, or requester..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500 capitalize">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500 capitalize">
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Desktop / tablet table view - hidden below md */}
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
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No requests found.</td></tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} onClick={() => setViewingRequest(r)} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer">
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs">{r.request_number}</td>
                    <td className="px-5 py-3 text-white">{r.title}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium">
                          {r.requested_by_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-400 text-sm">{r.requested_by_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle(r.priority)}`}>{r.priority}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {canEdit && (
                          <button onClick={(e) => { e.stopPropagation(); setEditingRequest(r); }}>
                            <Pencil className="w-4 h-4 text-gray-500 hover:text-indigo-400" />
                          </button>
                        )}
                        {isAdmin && (
                          <button onClick={(e) => { e.stopPropagation(); setDeletingRequest(r); }}>
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
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

        {/* Mobile card view - shown only below md */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <p className="text-center py-8 text-gray-500 text-sm">Loading...</p>
          ) : filteredRequests.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">No requests found.</p>
          ) : (
            filteredRequests.map((r) => (
              <div
                key={r.id}
                onClick={() => setViewingRequest(r)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 active:bg-gray-800/30"
              >
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
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {r.requested_by_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-400 text-sm truncate">{r.requested_by_name}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle(r.priority)}`}>
                    {r.priority}
                  </span>
                </div>
                {(canEdit || isAdmin) && (
                  <div className="flex gap-3 mt-3 pt-3 border-t border-gray-800/50">
                    {canEdit && (
                      <button onClick={(e) => { e.stopPropagation(); setEditingRequest(r); }} className="flex items-center gap-1 text-xs text-gray-400">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); setDeletingRequest(r); }} className="flex items-center gap-1 text-xs text-gray-400">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <AddRequestModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={() => { fetchRequests(); showToast('Request created successfully'); }} />
        <EditRequestModal isOpen={!!editingRequest} onClose={() => setEditingRequest(null)} onSuccess={() => { fetchRequests(); showToast('Request updated successfully'); }} request={editingRequest} />
        <RequestDetailModal isOpen={!!viewingRequest} onClose={() => setViewingRequest(null)} request={viewingRequest} />
        <ConfirmDialog
          isOpen={!!deletingRequest}
          onClose={() => setDeletingRequest(null)}
          onConfirm={handleDelete}
          title="Delete Request"
          message={`Are you sure you want to delete "${deletingRequest?.title}"? This cannot be undone.`}
        />
        <Toast message={toast} show={!!toast} />
      </div>
    </Layout>
  );
}

export default WorkRequests;