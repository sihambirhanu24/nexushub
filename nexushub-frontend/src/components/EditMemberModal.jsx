import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../api/axios';

function EditMemberModal({ isOpen, onClose, onSuccess, member }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'staff', department: '', status: 'active' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name, email: member.email, role: member.role,
        department: member.department || '', status: member.status,
      });
    }
  }, [member]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/members/${member.id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Team Member">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <select name="role" value={form.role} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department"
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <select name="status" value={form.status} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}

export default EditMemberModal;