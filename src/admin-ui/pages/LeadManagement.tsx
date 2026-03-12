import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getFormSubmissions, updateSubmissionStatus, updateSubmissionPriority, assignSubmission } from '../../services/formSubmissionService';
import type { FormSubmission, FormStatus, Priority } from '../../types/admin';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Filter,
  Search,
  Eye,
  User,
  AlertCircle,
  Users,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react';

export default function LeadManagement() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<FormSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const loadSubmissions = async () => {
    setLoading(true);
    const filters = statusFilter !== 'all' ? { status: statusFilter as FormStatus } : undefined;
    const { data } = await getFormSubmissions(filters);
    setSubmissions(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: FormStatus) => {
    await updateSubmissionStatus(id, status);
    loadSubmissions();
  };

  const handlePriorityChange = async (id: string, priority: Priority) => {
    await updateSubmissionPriority(id, priority);
    loadSubmissions();
  };

  const getStatusBadge = (status: FormStatus) => {
    const styles: Record<FormStatus, string> = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      qualified: 'bg-purple-50 text-purple-700 border-purple-200',
      converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      closed: 'bg-gray-50 text-gray-700 border-gray-200',
      spam: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const styles: Record<Priority, string> = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Lead Management">
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-gray-400" />
            <span className="text-xs text-gray-500">Status</span>
            <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
              {['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    statusFilter === status.toLowerCase()
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Leads</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {submissions.filter(s => s.status === 'new').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">New</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Sparkles className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {submissions.filter(s => s.status === 'qualified').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Qualified</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Award className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {submissions.filter(s => s.status === 'converted').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Converted</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
              <div className="col-span-3">Contact</div>
              <div className="col-span-2">Form Type</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredSubmissions.map((lead) => (
                <div key={lead.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                  {/* Contact */}
                  <div className="col-span-3">
                    <div className="font-bold text-sm text-gray-900">
                      {lead.first_name} {lead.last_name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail size={12} />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={12} />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Form Type */}
                  <div className="col-span-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">
                      {lead.form_type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Company */}
                  <div className="col-span-2">
                    {lead.company ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Building size={14} className="text-gray-400" />
                        <span className="truncate">{lead.company}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as FormStatus)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-bold focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="qualified">QUALIFIED</option>
                      <option value="converted">CONVERTED</option>
                      <option value="closed">CLOSED</option>
                      <option value="spam">SPAM</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1">
                    <select
                      value={lead.priority}
                      onChange={(e) => handlePriorityChange(lead.id, e.target.value as Priority)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-bold focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="low">LOW</option>
                      <option value="medium">MED</option>
                      <option value="high">HIGH</option>
                      <option value="urgent">URG</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400 text-sm italic">No leads found</p>
          </div>
        )}

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedLead.first_name} {selectedLead.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedLead.form_type.replace(/_/g, ' ')}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedLead.email}</p>
                    </div>
                    {selectedLead.phone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{selectedLead.phone}</p>
                      </div>
                    )}
                    {selectedLead.company && (
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <p className="font-medium">{selectedLead.company}</p>
                      </div>
                    )}
                    {selectedLead.job_title && (
                      <div>
                        <span className="text-gray-500">Job Title:</span>
                        <p className="font-medium">{selectedLead.job_title}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Data */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Form Data</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedLead.form_data, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Metadata</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-medium">{getStatusBadge(selectedLead.status)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <p className="font-medium">{getPriorityBadge(selectedLead.priority)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lead Score:</span>
                      <p className="font-medium">{selectedLead.lead_score}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <p className="font-medium">{new Date(selectedLead.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
