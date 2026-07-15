import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Users, UserCheck, UserX } from 'lucide-react';
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

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const inactiveMembers = members.filter((m) => m.status === 'inactive').length;

  const statusColor = (status) =>
    status === 'active'
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      : 'bg-gray-700/50 text-gray-400 border border-gray-700';

  const isAdmin = user?.role === 'admin';
  const canManageMembers = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Team Members</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your organization's members.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition-all"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{totalMembers}</p>
              <p className="text-xs text-gray-500">Total Members</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{activeMembers}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-700/50 flex items-center justify-center shrink-0">
              <UserX className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{inactiveMembers}</p>
              <p className="text-xs text-gray-500">Inactive</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-indigo-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
            ))}
          </select>

          {/* Status pill tabs */}
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            {['all', 'active', 'inactive'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
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

        {/* Desktop table */}
        <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Department</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                {canManageMembers && <th className="text-left px-5 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No members found.</p>
                </td></tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setViewingMember(m)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-semibold shrink-0">
                          {m.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{m.email}</td>
                    <td className="px-5 py-3 text-gray-400">{m.department || '—'}</td>
                    <td className="px-5 py-3 text-gray-400 capitalize">{m.role}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    {canManageMembers && (
                      <td className="px-5 py-3">
                        <div className="flex gap-2 ">
                          <button onClick={(e) => { e.stopPropagation(); setEditingMember(m); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">
                            <Pencil className="w-3.5 h-3.5 text-gray-500 hover:text-indigo-400" />
                          </button>
                          {isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); setDeletingMember(m); }}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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
          ) : filteredMembers.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm">No members found.</p>
          ) : (
            filteredMembers.map((m) => (
              <div key={m.id} onClick={() => setViewingMember(m)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 active:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-semibold shrink-0">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{m.name}</p>
                      <p className="text-gray-500 text-xs truncate">{m.email}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(m.status)}`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-800/50">
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{m.department || '—'}</span>
                    <span>·</span>
                    <span className="capitalize">{m.role}</span>
                  </div>
                  {canManageMembers && (
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setEditingMember(m); }}
                        className="p-1.5 rounded-lg hover:bg-indigo-500/10">
                        <Pencil className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      {isAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); setDeletingMember(m); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <AddMemberModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}
          onSuccess={() => { fetchMembers(); showToast('Member added successfully'); }} />
        <EditMemberModal isOpen={!!editingMember} onClose={() => setEditingMember(null)}
          onSuccess={() => { fetchMembers(); showToast('Member updated successfully'); }} member={editingMember} />
        <MemberDetailModal isOpen={!!viewingMember} onClose={() => setViewingMember(null)} member={viewingMember} />
        <ConfirmDialog isOpen={!!deletingMember} onClose={() => setDeletingMember(null)}
          onConfirm={handleDelete} title="Delete Member"
          message={`Are you sure you want to delete ${deletingMember?.name}? This cannot be undone.`} />
        <Toast message={toast} show={!!toast} />
      </div>
    </Layout>
  );
}

export default TeamMembers;