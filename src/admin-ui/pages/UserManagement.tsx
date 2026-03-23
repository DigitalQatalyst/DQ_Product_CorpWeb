import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import {
  getAllProfiles,
  updateProfile,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteProfile,
} from '../../services/profileService';
import type { Profile } from '../../contexts/AuthContext';
import {
  UserPlus,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Briefcase,
  Users,
  UserCheck,
  UserX,
  Shield,
  Edit,
  Save,
  X,
  RefreshCwIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function UserManagement() {
  const [users, setUsers] = useState<(Profile & { email?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<(Profile & { email?: string }) | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // get current logged user
  

  // Form state for editing user
  const [editUser, setEditUser] = useState<Partial<Profile>>({
    first_name: '',
    last_name: '',
    role: 'viewer',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // const loadUsers = async () => {
  //   setLoading(true);
  //   const filters = roleFilter !== 'all' ? { role: roleFilter } : undefined;
  //   const { data, error } = await getAllProfiles();
    
  //   console.log('Fetched users:', { data, error, filters });
    
  //   setUsers(data);
  //   setLoading(false);
  // };o

  const loadUsers = async()=>{
    setLoading(true)
    try {
      const response = await supabase.from('profiles')
              .select('*')
              // where id is not mine
              .neq('id', (await supabase.auth.getUser()).data.user?.id)
              .order('created_at', { ascending: false });
              console.log("all profiles table",response.data)
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      console.log("error getting users",error)
      setLoading(false);
    }
  }

  const handleEditUser = (user: Profile & { email?: string }) => {
    setEditingUser(user);
    setEditUser({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      avatar_url: user.avatar_url,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser?.id) return;

    const { error } = await updateProfile(editingUser.id, editUser);

    if (error) {
      alert(`Error updating user: ${error}`);
      return;
    }

    setShowEditModal(false);
    setEditingUser(null);
    setEditUser({
      first_name: '',
      last_name: '',
      role: 'viewer',
    });
    loadUsers();
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole);
    loadUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will:\n\n• Delete their profile data\n• Delete their authentication account\n• Revoke all access to the system')) {
      return;
    }
    
    try {
      console.log('[UserManagement] Starting user deletion for:', userId);
      const result = await deleteProfile(userId);
      
      if (result.success) {
        console.log('[UserManagement] User deletion successful:', {
          authDeletionSuccess: result.authDeletionSuccess,
          profileDeletionSuccess: result.profileDeletionSuccess
        });
        
        // Show success message
        alert(`User deleted successfully!\n\n✅ Profile deleted: ${result.profileDeletionSuccess ? 'Yes' : 'No'}\n✅ Auth account deleted: ${result.authDeletionSuccess ? 'Yes' : 'No'}`);
        
        // Refresh the user list
        loadUsers();
      } else {
        console.error('[UserManagement] User deletion failed:', result.error);
        alert(`Failed to delete user: ${result.error}`);
      }
    } catch (error) {
      console.error('[UserManagement] Deletion error:', error);
      alert(`An error occurred while deleting user: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  return (
    <AppLayout title="User Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-gray-400" />
            <span className="text-xs text-gray-500">Role</span>
            <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
              {['All', 'Admin', 'Creator', 'HR-Admin', 'HR-Viewer', 'Inactive'].map((role, idx) => {
                const roleValue = ['all', 'admin', 'creator', 'hr_admin', 'hr_viewer', 'inactive'][idx];
                return (
                  <button
                    key={roleValue}
                    onClick={() => setRoleFilter(roleValue)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      roleFilter === roleValue
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Users</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {users.filter(u => u.role !== 'inactive').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Active</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <UserCheck className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role === 'inactive').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Inactive</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <UserX className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Admins</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Shield className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
              <div className="col-span-3">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Avatar</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1 text-right flex flex-row items-center space-x-2">Actions <button onClick={()=>loadUsers()}><RefreshCwIcon size={16} color="green" /></button> </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                  {/* User */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200">
                        {user.first_name?.[0] || '?'}{user.last_name?.[0] || ''}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail size={12} />
                          <span className="truncate">{user.email || 'No email'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-bold focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="admin">Admin</option>
                      <option value="creator">Creator</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>

                  {/* Avatar */}
                  <div className="col-span-2">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No avatar</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <button
                      onClick={() => user.role === 'inactive' ? activateUser(user.id) : deactivateUser(user.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase ${
                        user.role !== 'inactive'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {user.role !== 'inactive' ? (
                        <>
                          <CheckCircle size={12} />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} />
                          Inactive
                        </>
                      )}
                    </button>
                  </div>

                  {/* Created */}
                  <div className="col-span-2 text-sm text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      title="Edit User"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
            <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={editUser.first_name || ''}
                      onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editUser.last_name || ''}
                      onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                  <select
                    value={editUser.role || 'viewer'}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                    <option value="creator">Creator</option>
                  </select>
                </div>

                


                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={editUser.avatar_url || ''}
                    onChange={(e) => setEditUser({ ...editUser, avatar_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
