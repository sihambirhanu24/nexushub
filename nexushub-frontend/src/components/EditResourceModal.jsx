import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../api/axios';

function EditResourceModal({ isOpen, onClose, onSuccess, resource }) {
  const [form, setForm] = useState({
    resource_code: '', name: '', category: 'Laptop', status: 'available',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resource) {
      setForm({
        resource_code: resource.resource_code,
        name: resource.name,
        category: resource.category,
        status: resource.status,
      });
    }
  }, [resource]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/resources/${resource.id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Resource">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="resource_code" value={form.resource_code} onChange={handleChange} placeholder="Resource Code" required
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
        <input
          name="name" value={form.name} onChange={handleChange} placeholder="Name" required
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
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
        <select
          name="status" value={form.status} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
        >
          <option value="available">Available</option>
          <option value="in-use">In Use</option>
          <option value="maintenance">Maintenance</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <button
          type="submit" disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}

export default EditResourceModal;
