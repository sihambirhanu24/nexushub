import Modal from './Modal';

function RequestDetailModal({ isOpen, onClose, request }) {
  if (!request) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Details">
      <div className="space-y-3 text-sm">
        <div><span className="text-gray-500">Request #:</span> <span className="text-white ml-2 font-mono">{request.request_number}</span></div>
        <div><span className="text-gray-500">Title:</span> <span className="text-white ml-2">{request.title}</span></div>
        <div><span className="text-gray-500">Description:</span> <p className="text-white mt-1">{request.description}</p></div>
        <div><span className="text-gray-500">Type:</span> <span className="text-white ml-2">{request.type}</span></div>
        <div><span className="text-gray-500">Priority:</span> <span className="text-white ml-2 capitalize">{request.priority}</span></div>
        <div><span className="text-gray-500">Status:</span> <span className="text-white ml-2 capitalize">{request.status}</span></div>
        <div><span className="text-gray-500">Requested By:</span> <span className="text-white ml-2">{request.requested_by_name}</span></div>
        <div><span className="text-gray-500">Created:</span> <span className="text-white ml-2">{new Date(request.created_at).toLocaleDateString()}</span></div>
      </div>
    </Modal>
  );
}

export default RequestDetailModal;