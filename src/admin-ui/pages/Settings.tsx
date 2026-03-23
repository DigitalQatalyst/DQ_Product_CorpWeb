import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import {
  User,
  Settings as SettingsIcon,
  Layers,
  ShieldCheck,
  Database,
  Activity,
  ChevronRight,
  Bell,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Upload,
  Camera,
  X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password-reset', label: 'Password Reset', icon: Key },
] as const

type TabId = (typeof TABS)[number]['id']

const Settings: React.FC = () => {
  const { user, profile, updateProfile } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = useMemo<TabId>(() => {
    const maybeTab = searchParams.get('tab') as TabId | null
    return (maybeTab && TABS.some((tab) => tab.id === maybeTab)) ? maybeTab : 'profile'
  }, [searchParams])
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  // Initialize profile state with actual profile data
  const [profileState, setProfileState] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: user?.email || '',
    role: profile?.role || 'user',
    avatar_url: profile?.avatar_url || '',
  })

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password reset state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  })

  const [mediaConfig, setMediaConfig] = useState({
    defaultVisibility: 'Public',
    defaultStatus: 'Draft',
    enforceSeoFields: true,
    requireReview: true,
  })

  const [taxonomyState, setTaxonomyState] = useState({
    domains: [
      'Finance & Funding',
      'Marketing & Sales',
      'Technology & Innovation',
      'Operations & Productivity',
      'Legal & Compliance',
      'Strategy & Growth',
    ],
    stages: ['Ideation', 'Startup', 'Growth', 'Scale'],
    formats: ['Article', 'Report', 'Announcement', 'Event', 'Podcast', 'Video', 'Tool'],
  })

  const [rolesState, setRolesState] = useState([
    { role: 'Admin', description: 'Full root access to all system modules', members: 4 },
    { role: 'Editor', description: 'Can manage media lifecycle and taxonomy', members: 8 },
    { role: 'Contributor', description: 'Draft access to media repository', members: 12 },
    { role: 'Reviewer', description: 'Governance and quality control', members: 3 },
  ])

  const [storageState, setStorageState] = useState({
    storageProvider: 'Supabase',
    bucket: 'media-assets',
    azureAccount: '',
    azureContainer: '',
    webhooksEndpoint: 'https://api.digitalqatalyst.com/webhooks/v1/sync',
    integrations: {
      analytics: 'Mixpanel',
      transcription: 'Azure AI',
    },
  })

  const [diagnosticsResults, setDiagnosticsResults] = useState<
    Array<{ label: string; status: 'passing' | 'failing' | 'running'; detail?: string }>
  >([
    { label: 'Supabase Node Connection', status: 'passing' },
    { label: 'Environment Secrets', status: 'passing' },
    { label: 'Admin RPC Interface', status: 'running', detail: 'Pending manual trigger' },
    { label: 'Bucket I/O Latency', status: 'running', detail: 'Pending manual trigger' },
    { label: 'Consistency Check', status: 'running', detail: 'Pending manual trigger' },
  ])

  // Update profile state when profile data changes
  useEffect(() => {
    if (profile) {
      setProfileState(prev => ({
        ...prev,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: user?.email || '',
        role: profile.role || 'user',
        avatar_url: profile.avatar_url || '',
      }))
    }
  }, [profile, user?.email])

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setSaveMessage({ type: 'error', message: 'Please select an image file' })
        setTimeout(() => setSaveMessage(null), 3000)
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSaveMessage({ type: 'error', message: 'Image must be less than 5MB' })
        setTimeout(() => setSaveMessage(null), 3000)
        return
      }

      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload avatar to Supabase storage
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return null
    }
  }

  // Remove avatar
  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview('')
    setProfileState(prev => ({ ...prev, avatar_url: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    
    setIsLoading(true)
    setSaveMessage(null)
    
    try {
      let avatarUrl = profileState.avatar_url
      
      // Upload new avatar if selected
      if (avatarFile) {
        setIsUploadingAvatar(true)
        const uploadedUrl = await uploadAvatar(avatarFile)
        if (uploadedUrl) {
          avatarUrl = uploadedUrl
        } else {
          setSaveMessage({ type: 'error', message: 'Failed to upload avatar' })
          setIsUploadingAvatar(false)
          setIsLoading(false)
          return
        }
        setIsUploadingAvatar(false)
      }
      
      // Update profile without full_name (it's autogenerated)
      const { error } = await updateProfile({
        first_name: profileState.first_name,
        last_name: profileState.last_name,
        avatar_url: avatarUrl,
      })
      
      if (error) {
        setSaveMessage({ type: 'error', message: 'Failed to update profile' })
      } else {
        setSaveMessage({ type: 'success', message: 'Profile updated successfully!' })
        setAvatarFile(null) // Clear uploaded file
        setAvatarPreview('') // Clear preview
      }
    } catch (err) {
      setSaveMessage({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
      setTimeout(() => setSaveMessage(null), 5000) // Show success message for 5 seconds
    }
  }

  const handlePasswordReset = async () => {
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setSaveMessage({ type: 'error', message: 'New passwords do not match' })
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }
    
    if (passwordState.newPassword.length < 8) {
      setSaveMessage({ type: 'error', message: 'Password must be at least 8 characters long' })
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }
    
    setIsLoading(true)
    setSaveMessage(null)
    
    try {
      // Import and use the password reset service
      const { resetPassword } = await import('../../services/passwordResetService')
      
      // For password reset, we need the current session
      if (!user) {
        throw new Error('No active session')
      }
      
      // This would need to be implemented - updating password for logged in user
      // For now, show a success message
      setSaveMessage({ type: 'success', message: 'Password reset functionality would be implemented here' })
    } catch (err) {
      setSaveMessage({ type: 'error', message: 'Failed to reset password' })
    } finally {
      setIsLoading(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const setActiveTabAndUrl = (id: TabId) => {
    setActiveTab(id)
    const next = new URLSearchParams(searchParams)
    next.set('tab', id)
    setSearchParams(next, { replace: true })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">Profile & Experience</h2>
              <p className="text-sm text-gray-400">Configure your personal workspace and profile information.</p>
            </header>

            {saveMessage && (
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                saveMessage.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {saveMessage.type === 'success' ? 
                  <CheckCircle2 size={16} /> : 
                  <AlertCircle size={16} />
                }
                <span className="text-sm font-medium">{saveMessage.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Avatar</h3>
                  
                  <div className="flex flex-col items-center space-y-4">
                    {/* Avatar Display */}
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                        {(avatarPreview || profileState.avatar_url) ? (
                          <img 
                            src={avatarPreview || profileState.avatar_url} 
                            alt="Profile avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <User size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Avatar Actions */}
                      <div className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Change avatar"
                        >
                          <Camera size={16} />
                        </button>
                        {(avatarPreview || profileState.avatar_url) && (
                          <button
                            onClick={removeAvatar}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove avatar"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    
                    {/* Upload Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <Upload size={16} />
                      {profileState.avatar_url ? 'Change Avatar' : 'Upload Avatar'}
                    </button>
                    
                    {/* Upload Status */}
                    {isUploadingAvatar && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </div>
                    )}
                    
                    {/* File Requirements */}
                    <div className="text-xs text-gray-500 text-center space-y-1">
                      <p>Maximum file size: 5MB</p>
                      <p>Supported formats: JPG, PNG, GIF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First Name</label>
                    <input
                      value={profileState.first_name}
                      onChange={(e) => setProfileState((prev) => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Name</label>
                    <input
                      value={profileState.last_name}
                      onChange={(e) => setProfileState((prev) => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Email</label>
                    <input
                      type="email"
                      value={profileState.email}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</label>
                    <input
                      value={profileState.role}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed capitalize"
                    />
                    <p className="text-[10px] text-gray-400">Role is managed by administrators</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading || isUploadingAvatar}
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )
      case 'password-reset':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">Password Reset</h2>
              <p className="text-sm text-gray-400">Change your account password for enhanced security.</p>
            </header>

            {saveMessage && (
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                saveMessage.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {saveMessage.type === 'success' ? 
                  <CheckCircle2 size={16} /> : 
                  <AlertCircle size={16} />
                }
                <span className="text-sm font-medium">{saveMessage.message}</span>
              </div>
            )}

            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</label>
                <div className="relative">
                  <input
                    type={passwordState.showCurrentPassword ? 'text' : 'password'}
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-12 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordState(prev => ({ ...prev, showCurrentPassword: !prev.showCurrentPassword }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {passwordState.showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <input
                    type={passwordState.showNewPassword ? 'text' : 'password'}
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-12 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordState(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {passwordState.showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={passwordState.showConfirmPassword ? 'text' : 'password'}
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-12 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {passwordState.showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Key size={16} />
                  Password Requirements
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      passwordState.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      passwordState.newPassword === passwordState.confirmPassword && passwordState.confirmPassword ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    New passwords match
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePasswordReset}
                  disabled={isLoading || !passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmPassword}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Key size={16} />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AppLayout title="Workspace Settings">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabAndUrl(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="min-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </AppLayout>
  )
}

export default Settings





