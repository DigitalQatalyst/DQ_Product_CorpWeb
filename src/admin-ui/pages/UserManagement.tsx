import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import {
  getAdminUsers,
  createAdminUser,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteAdminUser,
} from '../../services/adminUserService';
import { getSupabaseAdmin } from '../../admin-ui/utils/supabaseClient';
import type { AdminUser, UserRole } from '../../types/admin';
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
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new user
  const [newUser, setNewUser] = useState({
    email: '',
    display_name: '',
    password: '',
    role: 'viewer' as UserRole,
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    const filters = roleFilter !== 'all' ? { role: roleFilter as UserRole } : undefined;
    const { data } = await getAdminUsers(filters);
    setUsers(data);
    setLoading(false);
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.display_name || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    
    try {
      // Use regular client with service role key for admin operations
      const supabaseAdmin = getSupabaseAdmin();
      
      console.log('Attempting to create user with admin client...');
      
      // Step 1: Create user in Supabase Auth using admin API
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true, // Use boolean instead of string
        user_metadata: {
          display_name: newUser.display_name,
          role: newUser.role,
          department: newUser.department,
        },
        options: {
          data: {
            email_confirm: true // Explicitly set as boolean in options
          }
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        
        // If it's a permissions error, try alternative approach
        if (authError.message?.includes('not allowed') || authError.message?.includes('permission')) {
          alert('Permission denied. Please check that VITE_SUPABASE_SERVICE_ROLE_KEY is properly configured in your environment variables.');
        } else {
          alert(`Error creating user: ${authError.message}`);
        }
        
        setIsCreating(false);
        return;
      }

      console.log('Auth user created:', authData);

      // Step 2: Create user profile in admin_users table
      const { error: profileError } = await createAdminUser({
        email: newUser.email,
        display_name: newUser.display_name,
        role: newUser.role,
        department: newUser.department,
        is_active: true,
        auth_id: authData.user.id,
      });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        alert(`Error creating user profile: ${profileError}`);
        // Try to clean up auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        setIsCreating(false);
        return;
      }

      console.log('User profile created successfully');
      
      // Step 3: Send password reset email (acts as invitation)
      const { error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: newUser.email,
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (inviteError) {
        console.warn('Could not send invitation email:', inviteError);
        // User is created, but email failed - still consider success
        alert(`User created successfully but invitation email failed: ${inviteError.message}`);
      } else {
        alert(`User created successfully! Invitation email sent to ${newUser.email}`);
      }

      // Reset form and close modal
      setShowAddModal(false);
      setNewUser({
        email: '',
        display_name: '',
        password: '',
        role: 'viewer',
        department: '',
      });
      
      // Reload users list
      await loadUsers();
      
    } catch (error: any) {
      console.error('Unexpected error creating user:', error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
    loadUsers();
  };

  const handleToggleActive = async (user: AdminUser) => {
    if (user.is_active) {
      await deactivateUser(user.id);
    } else {
      await activateUser(user.id);
    }
    loadUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    await deleteAdminUser(userId);
    loadUsers();
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
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
              {['All', 'Super Admin', 'Admin', 'HR Manager', 'Content Editor', 'Viewer'].map((role, idx) => {
                const roleValue = ['all', 'super_admin', 'admin', 'hr_manager', 'content_editor', 'viewer'][idx];
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

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
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
                  {users.filter(u => u.is_active).length}
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
                  {users.filter(u => !u.is_active).length}
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
                  {users.filter(u => u.role === 'super_admin' || u.role === 'admin').length}
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
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Last Login</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                  {/* User */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200">
                        {user.display_name ? user.display_name.split(' ').map(n => n[0]).join('') : 
                         user.first_name && user.last_name ? `${user.first_name[0]}${user.last_name[0]}` : 
                         user.email[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">
                          {user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail size={12} />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-bold focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="hr_manager">HR Manager</option>
                      <option value="content_editor">Content Editor</option>
                      <option value="content_creator">Content Creator</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="col-span-2">
                    {user.department ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Briefcase size={14} className="text-gray-400" />
                        <span>{user.department}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase ${
                        user.is_active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {user.is_active ? (
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

                  {/* Last Login */}
                  <div className="col-span-2 text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
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

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Display Name *</label>
                  <input
                    type="text"
                    value={newUser.display_name}
                    onChange={(e) => setNewUser({ ...newUser, display_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter password or generate one"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Generate secure password"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="content_creator">Content Creator</option>
                    <option value="content_editor">Content Editor</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., HR, Marketing, IT"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={isCreating}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={isCreating}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
