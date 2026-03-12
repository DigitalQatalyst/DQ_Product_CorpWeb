import React, { useEffect, useMemo, useState } from 'react'
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
  CheckCircle2
} from 'lucide-react'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'media-config', label: 'Governance', icon: SettingsIcon },
  { id: 'taxonomy', label: 'Taxonomy', icon: Layers },
  { id: 'roles', label: 'Access Control', icon: ShieldCheck },
  { id: 'storage', label: 'System', icon: Database },
  { id: 'diagnostics', label: 'Node Health', icon: Activity },
] as const

type TabId = (typeof TABS)[number]['id']

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = useMemo<TabId>(() => {
    const maybeTab = searchParams.get('tab') as TabId | null
    return (maybeTab && TABS.some((tab) => tab.id === maybeTab)) ? maybeTab : 'profile'
  }, [searchParams])
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const [profileState, setProfileState] = useState({
    name: 'Admin Manager',
    email: 'admin@digitalqatalyst.com',
    timezone: 'Asia/Dubai',
    notifications: {
      approvals: true,
      publishing: true,
      weeklyDigest: false,
    },
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
              <p className="text-sm text-gray-400">Configure your personal workspace and workflow notifications.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Identity</label>
                  <input
                    value={profileState.name}
                    onChange={(e) => setProfileState((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Email</label>
                  <input
                    type="email"
                    value={profileState.email}
                    onChange={(e) => setProfileState((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Workspace Timezone</label>
                  <select
                    value={profileState.timezone}
                    onChange={(e) => setProfileState((prev) => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all appearance-none"
                  >
                    <option value="Asia/Dubai">GST - Dubai (UTC+4)</option>
                    <option value="Europe/London">GMT - London (UTC+0)</option>
                    <option value="America/New_York">EST - New York (UTC-5)</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-center gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-gray-500">
                    <Bell size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">Push Notifications</h3>
                    <p className="text-xs text-gray-400 mt-1">Receive alerts for critical system events and content changes.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'approvals', label: 'Workflow state transitions' },
                    { key: 'publishing', label: 'Successful deployment confirmation' },
                    { key: 'weeklyDigest', label: 'Weekly health report' },
                  ].map((notif) => (
                    <label key={notif.key} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs font-medium text-gray-600 group-hover:text-black transition-colors">{notif.label}</span>
                      <input
                        type="checkbox"
                        checked={(profileState.notifications as any)[notif.key]}
                        onChange={(e) => setProfileState((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, [notif.key]: e.target.checked },
                        }))}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 'media-config':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">Governance</h2>
              <p className="text-sm text-gray-400">Manage the quality standards and default behaviors of the media hub.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Visibility</label>
                  <select
                    value={mediaConfig.defaultVisibility}
                    onChange={(e) => setMediaConfig((prev) => ({ ...prev, defaultVisibility: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all appearance-none"
                  >
                    <option value="Public">Public Access</option>
                    <option value="Private">Restricted</option>
                    <option value="Internal">Enterprise Internal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Workflow State</label>
                  <select
                    value={mediaConfig.defaultStatus}
                    onChange={(e) => setMediaConfig((prev) => ({ ...prev, defaultStatus: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all appearance-none"
                  >
                    <option value="Draft">Drafting</option>
                    <option value="InReview">Submission</option>
                    <option value="Scheduled">Scheduled Queue</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-6">
                  <label className="flex items-start gap-4 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mediaConfig.enforceSeoFields}
                      onChange={(e) => setMediaConfig((prev) => ({ ...prev, enforceSeoFields: e.target.checked }))}
                      className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-gray-900 group-hover:underline underline-offset-4 decoration-black/10">Lock publishing for metadata</span>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tight">Requires SEO titles and descriptions before any content goes live.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mediaConfig.requireReview}
                      onChange={(e) => setMediaConfig((prev) => ({ ...prev, requireReview: e.target.checked }))}
                      className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-gray-900 group-hover:underline underline-offset-4 decoration-black/10">Double-entry verification</span>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tight">Ensures that a second administrator must approve content before publication.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      case 'taxonomy':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">Taxonomy</h2>
              <p className="text-sm text-gray-400">Curate the classification system used across the knowledge ecosystem.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { title: 'Domains', items: taxonomyState.domains, key: 'domains' },
                { title: 'Stages', items: taxonomyState.stages, key: 'stages' },
                { title: 'Formats', items: taxonomyState.formats, key: 'formats' },
              ].map((group) => (
                <div key={group.key} className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{group.title}</h3>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-50">
                    {group.items.map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 group">
                        <span className="text-xs font-bold text-gray-700">{item}</span>
                        <button
                          onClick={() => setTaxonomyState((prev: any) => ({
                            ...prev,
                            [group.key]: prev[group.key].filter((i: string) => i !== item),
                          }))}
                          className="text-[10px] font-black text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Append Classification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-3">
                  <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none appearance-none">
                    <option>Domain</option>
                    <option>Business Stage</option>
                    <option>Format</option>
                  </select>
                </div>
                <div className="sm:col-span-7">
                  <input
                    placeholder="Classification label..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'roles':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1 flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-gray-900">Access Control</h2>
                <p className="text-sm text-gray-400">Manage fine-grained permissions and collaborative roles.</p>
              </div>
              <button className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">
                Invite Member
              </button>
            </header>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Type</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Grant Count</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rolesState.map((role) => (
                    <tr key={role.role} className="group hover:bg-gray-50/20 transition-colors text-xs">
                      <td className="px-6 py-5 font-bold text-gray-900">{role.role}</td>
                      <td className="px-6 py-5 text-gray-500 italic">"{role.description}"</td>
                      <td className="px-6 py-5">
                        <span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-gray-600">{role.members} users</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-[10px] font-black text-gray-400 hover:text-black transition-colors flex items-center gap-1 ml-auto">
                          AUDIT <ChevronRight size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'storage':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">Node Architecture</h2>
              <p className="text-sm text-gray-400">Low-level infrastructure and external integration settings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage Provider</label>
                  <select
                    value={storageState.storageProvider}
                    onChange={(e) => setStorageState((prev) => ({ ...prev, storageProvider: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none appearance-none"
                  >
                    <option value="Supabase">Supabase Storage</option>
                    <option value="Azure Blob Storage">Azure Blob Engine</option>
                    <option value="AWS S3">Amazon S3 Node</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Bucket</label>
                  <input
                    value={storageState.bucket}
                    onChange={(e) => setStorageState((prev) => ({ ...prev, bucket: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Edge Discovery Endpoint (Webhook)</label>
                  <input
                    value={storageState.webhooksEndpoint}
                    onChange={(e) => setStorageState((prev) => ({ ...prev, webhooksEndpoint: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-8">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <SettingsIcon size={12} /> External Bridges
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Telemetery Node</label>
                    <input
                      value={storageState.integrations.analytics}
                      onChange={(e) => setStorageState((prev) => ({
                        ...prev,
                        integrations: { ...prev.integrations, analytics: e.target.value },
                      }))}
                      className="w-full px-0 bg-transparent border-b border-gray-200 focus:border-black text-sm font-bold placeholder-gray-200 outline-none transition-all rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Linguistic Processor</label>
                    <input
                      value={storageState.integrations.transcription}
                      onChange={(e) => setStorageState((prev) => ({
                        ...prev,
                        integrations: { ...prev.integrations, transcription: e.target.value },
                      }))}
                      className="w-full px-0 bg-transparent border-b border-gray-200 focus:border-black text-sm font-bold placeholder-gray-200 outline-none transition-all rounded-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'diagnostics':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">Health Monitor</h2>
              <p className="text-sm text-gray-400">Verifying synchronization across distributed environment nodes.</p>
            </header>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-50">
              {diagnosticsResults.map((item) => (
                <div key={item.label} className="p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900">{item.label}</p>
                    {item.detail && <p className="text-[10px] text-gray-400 font-medium italic">{item.detail}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${item.status === 'passing' ? 'text-emerald-500 bg-emerald-50' :
                          item.status === 'failing' ? 'text-red-500 bg-red-50' :
                            'text-gray-400 bg-gray-50'
                        }`}
                    >
                      {item.status}
                    </span>
                    {item.status === 'passing' && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setDiagnosticsResults((prev) =>
                  prev.map((item) =>
                    item.status === 'running'
                      ? { ...item, status: 'passing', detail: 'Verification complete. Synchronized.' }
                      : item,
                  ),
                )
              }
              className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-xl shadow-gray-100"
            >
              Force Status Refresh
            </button>
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





