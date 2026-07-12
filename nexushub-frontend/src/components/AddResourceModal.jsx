import { useState } from 'react';
import Modal from './Modal';
import api from '../api/axios';

function AddResourceModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', category: 'Laptop', status: 'available',
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
      await api.post('/resources', form);
      onSuccess();
      onClose();
      setForm({ name: '', category: 'Laptop', status: 'available' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Resource">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 mb-4">
        Resource code will be auto-generated based on category (e.g. LP-001 for Laptop).
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Name</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="e.g., MacBook Pro M2" required
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Category</label>
          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Printer">Printer</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Projector">Projector</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">Status</label>
          <select
            name="status" value={form.status} onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Resource →'}
        </button>
      </form>
    </Modal>
  );
}

export default AddResourceModal;