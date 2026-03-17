import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Mail, Lock, Shield, Users, Plus, Edit2, Save, X, CheckCircle, AlertCircle, Loader2, Eye, EyeOff, UserPlus, LogOut } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  created_at?: string;
}

interface NewUser {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: string;
}

interface Invitation {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  accepted_by?: string;
  status: 'pending' | 'accepted' | 'expired';
}

export default function AdminSettings() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'users' | 'invitations'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    role: '',
    avatar_url: '',
    bio: '',
    phone: '',
    location: '',
    created_at: '',
  });
  
  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Users management state
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Invitations state
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user',
  });

  // Load profile data
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: user?.email || '',
        role: profile.role || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        created_at: profile.created_at || '',
      });
    }
  }, [profile, user]);

  // Load all users (admin only)
  const loadUsers = async () => {
    if (profile?.role !== 'admin') return;
    
    setLoadingUsers(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      // Get emails from auth.users for each profile
      const usersWithEmails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: authUser.user?.email || ''
          };
        })
      );
      
      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load invitations
  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { error } = await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
      });
      
      if (error) throw error;
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });
      
      if (error) throw error;
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      await loadUsers(); // Reload users
      setSuccess('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      await loadUsers(); // Reload users
      setSuccess('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  // Send invitation
  const handleSendInvitation = async () => {
    // Validation
    if (!newInvitation.email || !newInvitation.name || !newInvitation.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (newInvitation.password !== newInvitation.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newInvitation.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Generate invitation token
      const token = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
      
      // Create invitation record
      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          email: newInvitation.email,
          name: newInvitation.name,
          role: newInvitation.role,
          created_by: user?.id,
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        });
      
      if (invitationError) throw invitationError;
      
      // Create user account with temporary password
      const { error: signupError } = await supabase.auth.signUp({
        email: newInvitation.email,
        password: newInvitation.password,
        options: {
          data: {
            name: newInvitation.name,
            invitation_token: token,
            is_invitation: true,
          },
        },
      });
      
      if (signupError) throw signupError;
      
      setSuccess(`Invitation sent to ${newInvitation.email}! They will receive an email to confirm their account.`);
      setNewInvitation({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: 'user',
      });
      setShowAddUserModal(false);
      await loadInvitations();
    } catch (error) {
      console.error('Error sending invitation:', error);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend invitation
  const handleResendInvitation = async (invitationId: string, email: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Generate new token
      const token = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
      
      // Update invitation with new token and extend expiry
      const { error } = await supabase
        .from('invitations')
        .update({
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        })
        .eq('id', invitationId);
      
      if (error) throw error;
      
      setSuccess(`Invitation resent to ${email}`);
      await loadInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      setError('Failed to resend invitation');
    } finally {
      setLoading(false);
    }
  };

  // Cancel invitation
  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId);
      
      if (error) throw error;
      
      setSuccess('Invitation cancelled');
      await loadInvitations();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      setError('Failed to cancel invitation');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      window.location.href = '/login';
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'invitations') {
      loadInvitations();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your profile and system settings</p>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-green-400">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Profile
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  Security
                </div>
              </button>
              
              {profile?.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'users'
                        ? 'text-primary-400 border-b-2 border-primary-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      Users
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('invitations')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'invitations'
                        ? 'text-primary-400 border-b-2 border-primary-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} />
                      Invitations
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <input
                        type="text"
                        value={profileData.role}
                        disabled
                        className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed capitalize"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your location"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-secondary-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}

              {/* Users Tab (Admin Only) */}
              {activeTab === 'users' && profile?.role === 'admin' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus size={20} />
                      Add User
                    </button>
                  </div>
                  
                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <Loader2 className="animate-spin mx-auto" size={40} />
                      <p className="text-gray-400 mt-4">Loading users...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-secondary-700 rounded-lg overflow-hidden">
                        <thead className="bg-secondary-800">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                          {users.map((userItem) => (
                            <tr key={userItem.id} className="hover:bg-secondary-600">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{userItem.name}</p>
                                    <p className="text-gray-400 text-sm">{userItem.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  userItem.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                  userItem.role === 'hr' ? 'bg-blue-500/20 text-blue-400' :
                                  userItem.role === 'editor' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {userItem.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                {new Date(userItem.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <select
                                    value={userItem.role}
                                    onChange={(e) => handleUpdateUserRole(userItem.id, e.target.value)}
                                    className="px-3 py-1 bg-secondary-600 border border-gray-500 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  >
                                    <option value="user">User</option>
                                    <option value="hr">HR</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                  
                                  <button
                                    onClick={() => handleDeleteUser(userItem.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Invitations Tab (Admin Only) */}
              {activeTab === 'invitations' && profile?.role === 'admin' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white mb-6">User Invitations</h2>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus size={20} />
                      Send Invitation
                    </button>
                  </div>
                  
                  {/* Existing Invitations */}
                  <div className="space-y-4">
                    {invitations.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No invitations sent yet</p>
                      </div>
                    ) : (
                      invitations.map((invitation) => (
                        <div key={invitation.id} className="bg-secondary-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                  <UserPlus size={16} className="text-white" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{invitation.name}</p>
                                  <p className="text-gray-400 text-sm">{invitation.email}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      invitation.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                      invitation.role === 'hr' ? 'bg-blue-500/20 text-blue-400' :
                                      invitation.role === 'editor' ? 'bg-purple-500/20 text-purple-400' :
                                      'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {invitation.role}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      invitation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      invitation.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {invitation.status}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {invitation.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleResendInvitation(invitation.id, invitation.email)}
                                    disabled={loading}
                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                                    title="Resend invitation"
                                  >
                                    <Mail size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleCancelInvitation(invitation.id)}
                                    disabled={loading}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                    title="Cancel invitation"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary-800 rounded-2xl border border-gray-700 p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Send User Invitation</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={newInvitation.name}
                    onChange={(e) => setNewInvitation({ ...newInvitation, name: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={newInvitation.email}
                    onChange={(e) => setNewInvitation({ ...newInvitation, email: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPasswords.new ? 'text' : 'password'}
                    required
                    value={newInvitation.password}
                    onChange={(e) => setNewInvitation({ ...newInvitation, password: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    required
                    value={newInvitation.confirmPassword}
                    onChange={(e) => setNewInvitation({ ...newInvitation, confirmPassword: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-2">
                  User Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={newInvitation.role}
                    onChange={(e) => setNewInvitation({ ...newInvitation, role: e.target.value })}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="hr">HR</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvitation}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
