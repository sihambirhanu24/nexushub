import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import AddRequestModal from '../components/AddRequestModal';
import EditRequestModal from '../components/EditRequestModal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


function WorkRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);

  useEffect(() => { fetchRequests(); }, []);

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
      setDeletingRequest(null);
      fetchRequests();
    } catch (err) {
      console.error('Failed to delete request', err);
    }
  };

  const filteredRequests = statusFilter === 'all' ? requests : requests.filter((r) => r.status === statusFilter);

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

  const filters = ['all', 'pending', 'in-progress', 'completed', 'cancelled'];
  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Work Requests</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage operational requests.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === f ? 'bg-indigo-500 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Request #</th>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No requests found.</td></tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs">{r.request_number}</td>
                    <td className="px-5 py-3 text-white">{r.title}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyle(r.priority)}`}>{r.priority}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingRequest(r)}><Pencil className="w-4 h-4 text-gray-500 hover:text-indigo-400" /></button>
                        {isAdmin && (
                          <button onClick={() => setDeletingRequest(r)}><Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AddRequestModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchRequests} />
        <EditRequestModal isOpen={!!editingRequest} onClose={() => setEditingRequest(null)} onSuccess={fetchRequests} request={editingRequest} />
        <ConfirmDialog
          isOpen={!!deletingRequest}
          onClose={() => setDeletingRequest(null)}
          onConfirm={handleDelete}
          title="Delete Request"
          message={`Are you sure you want to delete "${deletingRequest?.title}"? This cannot be undone.`}
        />
      </div>
    </Layout>
  );
}

export default WorkRequests;