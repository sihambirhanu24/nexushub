import Modal from './Modal';

function ResourceDetailModal({ isOpen, onClose, resource }) {
  if (!resource) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resource Details">
      <div className="space-y-3 text-sm">
        <div><span className="text-gray-500">Code:</span> <span className="text-white ml-2 font-mono">{resource.resource_code}</span></div>
        <div><span className="text-gray-500">Name:</span> <span className="text-white ml-2">{resource.name}</span></div>
        <div><span className="text-gray-500">Category:</span> <span className="text-white ml-2">{resource.category}</span></div>
        <div><span className="text-gray-500">Status:</span> <span className="text-white ml-2 capitalize">{resource.status}</span></div>
        <div><span className="text-gray-500">Added:</span> <span className="text-white ml-2">{new Date(resource.created_at).toLocaleDateString()}</span></div>
      </div>
    </Modal>
  );
}

export default ResourceDetailModal;