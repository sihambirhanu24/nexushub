import { User, Mail, Building2, Shield, Calendar, X } from 'lucide-react';

function MemberDetailModal({ isOpen, onClose, member }) {
  if (!isOpen || !member) return null;

  const statusStyle = member.status === 'active'
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'bg-gray-700/50 text-gray-400 border border-gray-700';

  const roleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'manager': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'staff': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'viewer': return 'bg-gray-700/50 text-gray-400 border border-gray-700';
      default: return 'bg-gray-700/50 text-gray-400';
    }
  };

  const avatarColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'manager': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'staff': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      default: return 'bg-gray-700/50 border-gray-700 text-gray-400';
    }
  };

  const headerGradient = (role) => {
    switch (role) {
      case 'admin': return 'from-red-500/10 to-transparent';
      case 'manager': return 'from-purple-500/10 to-transparent';
      case 'staff': return 'from-indigo-500/10 to-transparent';
      default: return 'from-gray-700/10 to-transparent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className={`bg-gradient-to-r ${headerGradient(member.role)} p-6 border-b border-gray-800`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-2xl font-bold ${avatarColor(member.role)}`}>
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg leading-tight">{member.name}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{member.email}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle}`}>
              {member.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColor(member.role)}`}>
              {member.role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Department</span>
              </div>
              <p className="text-white font-medium text-sm">{member.department || '—'}</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Role</span>
              </div>
              <p className="text-white font-medium text-sm capitalize">{member.role}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Email</span>
            </div>
            <p className="text-white font-medium text-sm">{member.email}</p>
          </div>

          {member.phone && (
            <div className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Phone</span>
              </div>
              <p className="text-white font-medium text-sm">{member.phone}</p>
            </div>
          )}

          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Joined</span>
            </div>
            <p className="text-white font-medium text-sm">
              {new Date(member.created_at).toLocaleDateString('en-US', {
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

export default MemberDetailModal;