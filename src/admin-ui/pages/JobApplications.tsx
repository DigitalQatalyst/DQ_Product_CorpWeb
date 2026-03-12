import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getJobApplications, updateApplicationStatus } from "../../services/jobApplicationService";
import { screenApplication, getScreeningResult, type CVScreeningResult, type JobRequirements } from "../../services/cvScreeningService";
import type { JobApplication, ApplicationStatus, ApplicationStatusUpdate } from "../../types/admin";
import { APPLICATION_STATUS_METADATA } from "../../types/admin";
import { Mail, Phone, Eye, Download, Filter, FileText, FolderOpen, CheckCircle, Clock, UserCheck, Calendar, Users, Award, Briefcase, XCircle, UserX, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export default function JobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateApp, setStatusUpdateApp] = useState<JobApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  
  // CV Screening state
  const [screeningApp, setScreeningApp] = useState<string | null>(null);
  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const [screeningConfig, setScreeningConfig] = useState<JobApplication | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<string>("");
  const [preferredSkills, setPreferredSkills] = useState<string>("");
  const [minExperience, setMinExperience] = useState<string>("3");
  const [requiredEducation, setRequiredEducation] = useState<string>("");
  const [screeningResults, setScreeningResults] = useState<Map<string, CVScreeningResult>>(new Map());
  const [showScreeningDetail, setShowScreeningDetail] = useState<CVScreeningResult | null>(null);

  useEffect(() => {
    loadApplications();
  }, [filter]);

  useEffect(() => {
    // Load screening results for all applications
    loadScreeningResults();
  }, [applications]);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    
    const filters = filter !== "all" ? { status: filter as ApplicationStatus } : undefined;
    const result = await getJobApplications(filters);
    
    if (result.error) {
      setError(result.error);
    } else {
      setApplications(result.data);
    }
    
    setLoading(false);
  };

  const loadScreeningResults = async () => {
    const results = new Map<string, CVScreeningResult>();
    
    for (const app of applications) {
      const { data } = await getScreeningResult(app.id);
      if (data) {
        results.set(app.id, data);
      }
    }
    
    setScreeningResults(results);
  };

  const handleScreenClick = (application: JobApplication) => {
    setScreeningConfig(application);
    setShowScreeningModal(true);
    
    // Pre-fill with common defaults
    setRequiredSkills("");
    setPreferredSkills("");
    setMinExperience("3");
    setRequiredEducation("Bachelor's degree");
  };

  const handleScreenSubmit = async () => {
    if (!screeningConfig) return;
    
    setScreeningApp(screeningConfig.id);
    setShowScreeningModal(false);
    
    const jobRequirements: JobRequirements = {
      required_skills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferred_skills: preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      min_years_experience: parseInt(minExperience) || 0,
      required_education: requiredEducation,
      job_description: screeningConfig.job_title,
    };
    
    const result = await screenApplication(
      screeningConfig.id,
      jobRequirements
    );
    
    setScreeningApp(null);
    
    if (result.success && result.result) {
      // Update local screening results
      setScreeningResults(prev => new Map(prev).set(screeningConfig.id, result.result!));
      
      // Show result detail
      setShowScreeningDetail(result.result);
      
      // Reload applications to get updated status
      loadApplications();
    } else {
      alert(`Screening failed: ${result.error}`);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getRecommendationBadge = (recommendation: string) => {
    const styles: Record<string, string> = {
      strong_match: 'bg-green-100 text-green-700 border-green-300',
      good_match: 'bg-blue-100 text-blue-700 border-blue-300',
      potential_match: 'bg-amber-100 text-amber-700 border-amber-300',
      weak_match: 'bg-orange-100 text-orange-700 border-orange-300',
      no_match: 'bg-red-100 text-red-700 border-red-300',
    };
    
    return styles[recommendation] || styles.no_match;
  };

  const handleStatusChange = async (application: JobApplication, newStatus: ApplicationStatus) => {
    // If changing to rejected, show modal for reason
    if (newStatus === 'rejected') {
      setStatusUpdateApp(application);
      setShowStatusModal(true);
      return;
    }

    const statusUpdate: ApplicationStatusUpdate = {
      status: newStatus,
    };

    const result = await updateApplicationStatus(application.id, statusUpdate);
    
    if (result.success) {
      loadApplications();
    } else {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  const handleStatusModalSubmit = async () => {
    if (!statusUpdateApp) return;

    const statusUpdate: ApplicationStatusUpdate = {
      status: 'rejected',
      rejection_reason: rejectionReason || undefined,
      internal_notes: internalNotes || undefined,
    };

    const result = await updateApplicationStatus(statusUpdateApp.id, statusUpdate);
    
    if (result.success) {
      setShowStatusModal(false);
      setStatusUpdateApp(null);
      setRejectionReason("");
      setInternalNotes("");
      loadApplications();
    } else {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    const iconMap: Record<ApplicationStatus, any> = {
      pending: Clock,
      screened: Eye,
      qualified: UserCheck,
      interview_scheduled: Calendar,
      interviewed: Users,
      shortlisted: Award,
      offered: Briefcase,
      hired: CheckCircle,
      rejected: XCircle,
      withdrawn: UserX,
    };
    const Icon = iconMap[status];
    return Icon ? <Icon size={14} /> : null;
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const metadata = APPLICATION_STATUS_METADATA[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${metadata.color} ${metadata.bgColor} ${metadata.borderColor}`}>
        {getStatusIcon(status)}
        {metadata.label}
      </span>
    );
  };

  const getStatusCounts = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.application_status === 'pending').length,
      screened: applications.filter(a => a.application_status === 'screened').length,
      qualified: applications.filter(a => a.application_status === 'qualified').length,
      interview_scheduled: applications.filter(a => a.application_status === 'interview_scheduled').length,
      interviewed: applications.filter(a => a.application_status === 'interviewed').length,
      shortlisted: applications.filter(a => a.application_status === 'shortlisted').length,
      offered: applications.filter(a => a.application_status === 'offered').length,
      hired: applications.filter(a => a.application_status === 'hired').length,
      rejected: applications.filter(a => a.application_status === 'rejected').length,
      withdrawn: applications.filter(a => a.application_status === 'withdrawn').length,
      active: applications.filter(a => 
        !['rejected', 'withdrawn', 'hired'].includes(a.application_status)
      ).length,
    };
  };

  const totalApplications = applications.length;
  const counts = getStatusCounts();

  return (
    <AppLayout title="Talent Pipeline">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{counts.total}</div>
                <div className="text-xs text-gray-500 mt-1">Total Applications</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-amber-500">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{counts.active}</div>
                <div className="text-xs text-gray-500 mt-1">Active Pipeline</div>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg">
                <FolderOpen className="text-amber-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-purple-500">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{counts.shortlisted}</div>
                <div className="text-xs text-gray-500 mt-1">Shortlisted</div>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-green-500">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{counts.hired}</div>
                <div className="text-xs text-gray-500 mt-1">Hired</div>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-gray-400" />
          <span className="text-xs text-gray-500">Status</span>
          <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "all"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              All ({counts.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "pending"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setFilter("screened")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "screened"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Screened ({counts.screened})
            </button>
            <button
              onClick={() => setFilter("qualified")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "qualified"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Qualified ({counts.qualified})
            </button>
            <button
              onClick={() => setFilter("interview_scheduled")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "interview_scheduled"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Interview ({counts.interview_scheduled})
            </button>
            <button
              onClick={() => setFilter("interviewed")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "interviewed"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Interviewed ({counts.interviewed})
            </button>
            <button
              onClick={() => setFilter("shortlisted")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "shortlisted"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Shortlisted ({counts.shortlisted})
            </button>
            <button
              onClick={() => setFilter("offered")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "offered"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Offered ({counts.offered})
            </button>
            <button
              onClick={() => setFilter("hired")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "hired"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Hired ({counts.hired})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === "rejected"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          </div>
          <div className="ml-auto text-xs text-gray-500">
            {totalApplications} applications
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}

        {/* Applications Table */}
        {!loading && applications.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
              <div className="col-span-2">Candidate</div>
              <div className="col-span-2">Position</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">AI Score</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {applications.map((app) => {
                const screeningResult = screeningResults.get(app.id);
                const isScreening = screeningApp === app.id;
                
                return (
                <div key={app.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                  {/* Candidate */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200 shrink-0">
                      {app.first_name[0]}{app.last_name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {app.first_name} {app.last_name}
                      </h4>
                      <p className="text-xs text-gray-400">{app.years_of_experience} exp</p>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="col-span-2">
                    <p className="font-bold text-sm text-gray-900 truncate">{app.job_title}</p>
                    <p className="text-xs text-gray-400">{new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>

                  {/* Contact */}
                  <div className="col-span-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Mail size={12} className="text-gray-400" />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="text-gray-400" />
                      <span>{app.phone}</span>
                    </div>
                  </div>

                  {/* AI Score */}
                  <div className="col-span-2">
                    {isScreening ? (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Loader2 size={14} className="animate-spin" />
                        Screening...
                      </div>
                    ) : screeningResult ? (
                      <div className="space-y-1">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${getScoreColor(screeningResult.overall_score)}`}>
                          <TrendingUp size={12} />
                          {screeningResult.overall_score}/100
                        </div>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ml-1 ${getRecommendationBadge(screeningResult.recommendation)}`}>
                          {screeningResult.recommendation.replace('_', ' ')}
                        </div>
                        <button
                          onClick={() => setShowScreeningDetail(screeningResult)}
                          className="block text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          View Details
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleScreenClick(app)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium"
                      >
                        <Sparkles size={14} />
                        Screen CV
                      </button>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <select
                      value={app.application_status}
                      onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-medium focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="screened">Screened</option>
                      <option value="qualified">Qualified</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="offered">Offered</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                      title="Download Resume"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              )})}

            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm italic">No applications found</p>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedApp.first_name} {selectedApp.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedApp.job_title}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Current Status</h4>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedApp.application_status)}
                    {selectedApp.status_changed_at && (
                      <span className="text-xs text-gray-400">
                        Updated {new Date(selectedApp.status_changed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {selectedApp.rejection_reason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-medium text-red-900">Rejection Reason:</p>
                      <p className="text-sm text-red-700 mt-1">{selectedApp.rejection_reason}</p>
                    </div>
                  )}
                  {selectedApp.internal_notes && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-900">Internal Notes:</p>
                      <p className="text-sm text-blue-700 mt-1 whitespace-pre-wrap">{selectedApp.internal_notes}</p>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedApp.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">{selectedApp.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{selectedApp.current_location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <p className="font-medium">{selectedApp.years_of_experience}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Professional Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedApp.current_company && (
                      <div>
                        <span className="text-gray-500">Current Company:</span>
                        <p className="font-medium">{selectedApp.current_company}</p>
                      </div>
                    )}
                    {selectedApp.current_role && (
                      <div>
                        <span className="text-gray-500">Current Role:</span>
                        <p className="font-medium">{selectedApp.current_role}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Notice Period:</span>
                      <p className="font-medium">{selectedApp.notice_period}</p>
                    </div>
                    {selectedApp.expected_salary && (
                      <div>
                        <span className="text-gray-500">Expected Salary:</span>
                        <p className="font-medium">{selectedApp.expected_salary}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Cover Letter</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApp.cover_letter}</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Documents</h4>
                  <div className="flex gap-3">
                    <a
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold"
                    >
                      <Download size={16} />
                      Resume
                    </a>
                    {selectedApp.additional_documents_url && (
                      <a
                        href={selectedApp.additional_documents_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold"
                      >
                        <Download size={16} />
                        Additional Docs
                      </a>
                    )}
                    {selectedApp.linkedin_url && (
                      <a
                        href={selectedApp.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {showStatusModal && statusUpdateApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900">Reject Application</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {statusUpdateApp.first_name} {statusUpdateApp.last_name} - {statusUpdateApp.job_title}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (Optional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Does not meet minimum requirements, Overqualified, Position filled..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Notes (Optional)
                  </label>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add any internal notes for the team..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusUpdateApp(null);
                    setRejectionReason("");
                    setInternalNotes("");
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusModalSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CV Screening Configuration Modal */}
        {showScreeningModal && screeningConfig && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">AI CV Screening</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {screeningConfig.first_name} {screeningConfig.last_name} - {screeningConfig.job_title}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900">
                    Configure the job requirements to screen this candidate's CV using AI. The system will analyze their resume and provide a detailed assessment.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="e.g., React, TypeScript, Node.js, REST APIs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={preferredSkills}
                    onChange={(e) => setPreferredSkills(e.target.value)}
                    placeholder="e.g., GraphQL, Docker, AWS, CI/CD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Years of Experience
                    </label>
                    <input
                      type="number"
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Education
                    </label>
                    <input
                      type="text"
                      value={requiredEducation}
                      onChange={(e) => setRequiredEducation(e.target.value)}
                      placeholder="e.g., Bachelor's degree"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowScreeningModal(false);
                    setScreeningConfig(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScreenSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-bold"
                >
                  <Sparkles size={16} />
                  Start Screening
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Screening Result Detail Modal */}
        {showScreeningDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowScreeningDetail(null)}>
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-purple-600" size={24} />
                      <h3 className="text-xl font-bold text-gray-900">AI Screening Report</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Screened on {new Date(showScreeningDetail.screened_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowScreeningDetail(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall Match Score</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">{showScreeningDetail.overall_score}/100</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRecommendationBadge(showScreeningDetail.recommendation)}`}>
                      {showScreeningDetail.recommendation.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Score Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Skills Match</p>
                      <p className={`text-2xl font-bold ${getScoreColor(showScreeningDetail.skills_match_score).split(' ')[0]}`}>
                        {showScreeningDetail.skills_match_score}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Experience Match</p>
                      <p className={`text-2xl font-bold ${getScoreColor(showScreeningDetail.experience_match_score).split(' ')[0]}`}>
                        {showScreeningDetail.experience_match_score}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Education Match</p>
                      <p className={`text-2xl font-bold ${getScoreColor(showScreeningDetail.education_match_score).split(' ')[0]}`}>
                        {showScreeningDetail.education_match_score}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">AI Summary</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{showScreeningDetail.screening_summary}</p>
                  </div>
                </div>

                {/* Key Highlights */}
                {showScreeningDetail.key_highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Key Highlights</h4>
                    <div className="space-y-2">
                      {showScreeningDetail.key_highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                          <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={16} />
                          <p className="text-sm text-green-900">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {showScreeningDetail.red_flags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Areas of Concern</h4>
                    <div className="space-y-2">
                      {showScreeningDetail.red_flags.map((flag, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
                          <p className="text-sm text-red-900">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Skills */}
                {showScreeningDetail.extracted_skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Extracted Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {showScreeningDetail.extracted_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Experience */}
                {showScreeningDetail.extracted_experience.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Relevant Experience</h4>
                    <div className="space-y-2">
                      {showScreeningDetail.extracted_experience.map((exp, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{exp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Education */}
                {showScreeningDetail.extracted_education.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Education</h4>
                    <div className="space-y-2">
                      {showScreeningDetail.extracted_education.map((edu, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{edu}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
