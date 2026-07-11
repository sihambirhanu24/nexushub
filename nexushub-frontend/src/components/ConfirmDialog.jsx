// src/components/ConfirmDialog.jsx
import Modal from './Modal';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-400 text-sm mb-5">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;