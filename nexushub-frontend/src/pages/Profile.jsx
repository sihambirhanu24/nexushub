import { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import Layout from '../components/Layout';
import Toast from '../components/Toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [toast, setToast] = useState('');

  // Fetch current profile so phone pre-fills correctly
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setName(response.data.name || '');
      setPhone(response.data.phone || '');
    } catch (err) {
      // Fallback to AuthContext values if fetch fails
      setName(user?.name || '');
      setPhone(user?.phone || '');
    }
  };
  fetchProfile();
}, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setProfileError('');
  setProfileLoading(true);
  try {
    const response = await api.put('/auth/profile', { name, phone });
    const updated = response.data.user;

    // Update form state immediately so fields don't go blank
    setName(updated.name || '');
    setPhone(updated.phone || '');

    // Merge into AuthContext — this updates the sidebar name too
    updateUser({
      name: updated.name,
      phone: updated.phone,
    });

    showToast('Profile updated successfully');
  } catch (err) {
    setProfileError(err.response?.data?.message || 'Failed to update profile');
  } finally {
    setProfileLoading(false);
  }
};

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      // PUT not POST — match whatever your backend route uses
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-white mb-1">My Profile</h1>
        <p className="text-gray-500 text-sm mb-6">Update your personal information and password.</p>

        {/* Personal info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-white font-medium">Personal Information</h2>
          </div>

          {profileError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-800 text-gray-500 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-gray-600 mt-1">
                {user?.role === 'admin'
                  ? 'Email changes should be made through Team Members.'
                  : 'Contact an admin to change your email.'}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0912345678"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Department</label>
                <input
                  type="text"
                  value={user?.department || '—'}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-800 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Role</label>
                <input
                  type="text"
                  value={user?.role || '—'}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-800 text-gray-500 text-sm cursor-not-allowed capitalize"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h2 className="text-white font-medium">Change Password</h2>
          </div>

          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <Toast message={toast} show={!!toast} />
      </div>
    </Layout>
  );
}

export default Profile;