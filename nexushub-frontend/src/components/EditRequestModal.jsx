import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../api/axios';

function EditRequestModal({ isOpen, onClose, onSuccess, request }) {
  const [form, setForm] = useState({
    title: '', description: '', type: 'Technical Support', status: 'pending', priority: 'medium',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (request) {
      setForm({
        title: request.title,
        description: request.description || '',
        type: request.type,
        status: request.status,
        priority: request.priority,
      });
    }
  }, [request]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/requests/${request.id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Work Request">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows="3"
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none" />
        <select name="type" value={form.type} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="Technical Support">Technical Support</option>
          <option value="Equipment Request">Equipment Request</option>
          <option value="Software Installation">Software Installation</option>
          <option value="Office Maintenance">Office Maintenance</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select name="priority" value={form.priority} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}

export default EditRequestModal;