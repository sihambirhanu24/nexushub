import Modal from './Modal';

function MemberDetailModal({ isOpen, onClose, member }) {
  if (!member) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Details">
      <div className="space-y-3 text-sm">
        <div><span className="text-gray-500">Name:</span> <span className="text-white ml-2">{member.name}</span></div>
        <div><span className="text-gray-500">Email:</span> <span className="text-white ml-2">{member.email}</span></div>
        <div><span className="text-gray-500">Department:</span> <span className="text-white ml-2">{member.department || '—'}</span></div>
        <div><span className="text-gray-500">Role:</span> <span className="text-white ml-2 capitalize">{member.role}</span></div>
        <div><span className="text-gray-500">Status:</span> <span className="text-white ml-2 capitalize">{member.status}</span></div>
        <div><span className="text-gray-500">Joined:</span> <span className="text-white ml-2">{new Date(member.created_at).toLocaleDateString()}</span></div>
      </div>
    </Modal>
  );
}

export default MemberDetailModal;