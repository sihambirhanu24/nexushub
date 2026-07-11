import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import AddMemberModal from '../components/AddMemberModal';
import EditMemberModal from '../components/EditMemberModal';
import MemberDetailModal from '../components/MemberDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function TeamMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchMembers(); }, [search]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const fetchMembers = async () => {
    try {
      const params = search ? { search } : {};
      const response = await api.get('/members', { params });
      setMembers(response.data);
    } catch (err) {
      console.error('Failed to load members', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/members/${deletingMember.id}`);
      showToast('Member deleted successfully');
      setDeletingMember(null);
      fetchMembers();
    } catch (err) {
      console.error('Failed to delete member', err);
    }
  };

  const departments = ['all', ...new Set(members.map((m) => m.department).filter(Boolean))];

  const filteredMembers = members
    .filter((m) => departmentFilter === 'all' || m.department === departmentFilter)
    .filter((m) => statusFilter === 'all' || m.status === statusFilter);

  const statusColor = (status) =>
    status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-400';

  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Team Members</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your organization's members.</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Member
            </button>
          )}
        </div>

        <div className="relative mb-4 w-full sm:max-w-sm">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="Search members, roles, or departments..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500 capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Desktop / tablet table view - hidden below md */}
        <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Department</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                {isAdmin && <th className="text-left px-5 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No members found.</td></tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setViewingMember(m)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                  >
                    <td className="px-5 py-3 text-white">{m.name}</td>
                    <td className="px-5 py-3 text-gray-400">{m.email}</td>
                    <td className="px-5 py-3 text-gray-400">{m.department || '—'}</td>
                    <td className="px-5 py-3 text-gray-400 capitalize">{m.role}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setEditingMember(m); }}>
                            <Pencil className="w-4 h-4 text-gray-500 hover:text-indigo-400" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeletingMember(m); }}>
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    )}
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
          ) : filteredMembers.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">No members found.</p>
          ) : (
            filteredMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => setViewingMember(m)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 active:bg-gray-800/30"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{m.name}</p>
                    <p className="text-gray-500 text-sm truncate">{m.email}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(m.status)}`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-3 text-gray-400">
                    <span>{m.department || '—'}</span>
                    <span className="capitalize">{m.role}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); setEditingMember(m); }} className="p-1">
                        <Pencil className="w-4 h-4 text-gray-500 hover:text-indigo-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeletingMember(m); }} className="p-1">
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <AddMemberModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={() => { fetchMembers(); showToast('Member added successfully'); }} />
        <EditMemberModal isOpen={!!editingMember} onClose={() => setEditingMember(null)} onSuccess={() => { fetchMembers(); showToast('Member updated successfully'); }} member={editingMember} />
        <MemberDetailModal isOpen={!!viewingMember} onClose={() => setViewingMember(null)} member={viewingMember} />
        <ConfirmDialog
          isOpen={!!deletingMember}
          onClose={() => setDeletingMember(null)}
          onConfirm={handleDelete}
          title="Delete Member"
          message={`Are you sure you want to delete ${deletingMember?.name}? This cannot be undone.`}
        />
        <Toast message={toast} show={!!toast} />
      </div>
    </Layout>
  );
}

export default TeamMembers;