import { useState } from 'react';
import Modal from './Modal';
import api from '../api/axios';

function AddRequestModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', type: 'Technical Support', priority: 'medium',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/requests', form);
      onSuccess();
      onClose();
      setForm({ title: '', description: '', type: 'Technical Support', priority: 'medium' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Work Request">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Title</label>
          <input
            name="title" value={form.title} onChange={handleChange} placeholder="e.g., Printer not working" required
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange} placeholder="Provide details..." rows="3" required
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Type</label>
          <select
            name="type" value={form.type} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="Technical Support">Technical Support</option>
            <option value="Equipment Request">Equipment Request</option>
            <option value="Software Installation">Software Installation</option>
            <option value="Office Maintenance">Office Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Priority</label>
          <select
            name="priority" value={form.priority} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Request →'}
        </button>
      </form>
    </Modal>
  );
}

export default AddRequestModal;