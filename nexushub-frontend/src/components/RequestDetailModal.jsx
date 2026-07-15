import { ClipboardList, User, Tag, Hash, Calendar, AlertCircle, X } from 'lucide-react';

function RequestDetailModal({ isOpen, onClose, request }) {
  if (!isOpen || !request) return null;

  const statusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'cancelled': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const priorityStyle = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'medium': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'low': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const headerGradient = (status) => {
    switch (status) {
      case 'pending': return 'from-yellow-500/10 to-transparent';
      case 'in-progress': return 'from-blue-500/10 to-transparent';
      case 'completed': return 'from-emerald-500/10 to-transparent';
      default: return 'from-gray-700/10 to-transparent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className={`bg-gradient-to-r ${headerGradient(request.status)} p-6 border-b border-gray-800`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg leading-tight">{request.title}</h2>
                <p className="text-gray-500 text-sm font-mono mt-0.5">{request.request_number}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(request.status)}`}>
              {request.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityStyle(request.priority)}`}>
              {request.priority}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">

          {/* Description */}
          {request.description && (
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed">{request.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Type</span>
              </div>
              <p className="text-white font-medium text-sm">{request.type}</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Requested By</span>
              </div>
              <p className="text-white font-medium text-sm">{request.requested_by_name}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Created</span>
            </div>
            <p className="text-white font-medium text-sm">
              {new Date(request.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestDetailModal;