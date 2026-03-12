import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getInterviews, createInterview, updateInterviewStatus } from '../../services/interviewService';
import { quickCreateTeamsMeeting, checkTeamsPermissions, requestTeamsPermissions } from '../../services/teamsIntegrationService';
import type { Interview, InterviewStatus, InterviewType } from '../../types/admin';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Plus,
  Eye,
  CheckCircle,
  Loader,
  CalendarDays,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  Sparkles,
} from 'lucide-react';

export default function InterviewScheduler() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingTeamsMeeting, setCreatingTeamsMeeting] = useState(false);
  const [hasTeamsPermissions, setHasTeamsPermissions] = useState(false);

  // Form state for new interview
  const [newInterview, setNewInterview] = useState({
    candidate_name: '',
    candidate_email: '',
    interview_type: 'phone_screen' as InterviewType,
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 60,
    meeting_link: '',
    location: '',
    preparation_notes: '',
    create_teams_meeting: false, // New field
  });

  useEffect(() => {
    loadInterviews();
    checkPermissions();
  }, [statusFilter]);

  const checkPermissions = async () => {
    const { hasPermissions } = await checkTeamsPermissions();
    setHasTeamsPermissions(hasPermissions);
  };

  const handleRequestPermissions = async () => {
    const { success } = await requestTeamsPermissions();
    if (success) {
      setHasTeamsPermissions(true);
      alert('Teams permissions granted successfully!');
    } else {
      alert('Failed to grant Teams permissions. Please try again.');
    }
  };

  const loadInterviews = async () => {
    setLoading(true);
    const filters = statusFilter !== 'all' ? { status: statusFilter as InterviewStatus } : undefined;
    const { data } = await getInterviews(filters);
    setInterviews(data);
    setLoading(false);
  };

  const handleCreateInterview = async () => {
    if (!newInterview.candidate_name || !newInterview.candidate_email || !newInterview.scheduled_date || !newInterview.scheduled_time) {
      alert('Please fill in all required fields');
      return;
    }

    // Combine date and time
    const scheduledDateTime = `${newInterview.scheduled_date}T${newInterview.scheduled_time}:00`;
    let meetingLink = newInterview.meeting_link;

    // Create Teams meeting if requested
    if (newInterview.create_teams_meeting && (newInterview.interview_type === 'video' || newInterview.interview_type === 'technical')) {
      setCreatingTeamsMeeting(true);
      
      const { meeting, error } = await quickCreateTeamsMeeting(
        newInterview.candidate_name,
        newInterview.candidate_email,
        scheduledDateTime,
        newInterview.duration_minutes
      );

      setCreatingTeamsMeeting(false);

      if (error) {
        const proceed = confirm(`Failed to create Teams meeting: ${error}\n\nDo you want to continue without a Teams meeting?`);
        if (!proceed) return;
      } else if (meeting) {
        meetingLink = meeting.joinUrl;
        alert('Teams meeting created successfully! The link has been added to the interview.');
      }
    }

    const { error } = await createInterview({
      candidate_name: newInterview.candidate_name,
      candidate_email: newInterview.candidate_email,
      interview_type: newInterview.interview_type,
      scheduled_date: scheduledDateTime,
      duration_minutes: newInterview.duration_minutes,
      status: 'scheduled', // Always start as "scheduled"
      meeting_link: meetingLink || undefined,
      location: newInterview.location || undefined,
      preparation_notes: newInterview.preparation_notes || undefined,
      reminder_sent: false,
    });

    if (error) {
      alert(`Error creating interview: ${error}`);
      return;
    }

    setShowCreateModal(false);
    setNewInterview({
      candidate_name: '',
      candidate_email: '',
      interview_type: 'phone_screen',
      scheduled_date: '',
      scheduled_time: '',
      duration_minutes: 60,
      meeting_link: '',
      location: '',
      preparation_notes: '',
      create_teams_meeting: false,
    });
    loadInterviews();
  };

  const handleStatusChange = async (id: string, status: InterviewStatus) => {
    await updateInterviewStatus(id, status);
    loadInterviews();
  };

  const getTypeIcon = (type: InterviewType): React.ReactElement => {
    const icons: Record<InterviewType, React.ReactElement> = {
      phone_screen: <Phone size={16} className="text-blue-600" />,
      video: <Video size={16} className="text-purple-600" />,
      onsite: <MapPin size={16} className="text-emerald-600" />,
      technical: <Calendar size={16} className="text-orange-600" />,
      final: <CheckCircle size={16} className="text-indigo-600" />,
    };
    return icons[type];
  };

  const upcomingInterviews = interviews.filter(i => 
    new Date(i.scheduled_date) > new Date() && 
    (i.status === 'scheduled' || i.status === 'confirmed')
  );

  return (
    <AppLayout title="Interview Scheduler">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Interview Management
            </span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
            Schedule Interview
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{interviews.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Interviews</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <CalendarDays className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{upcomingInterviews.length}</div>
                <div className="text-xs text-gray-500 mt-1">Upcoming</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <CalendarClock className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {interviews.filter(i => i.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Completed</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <CalendarCheck className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {interviews.filter(i => i.status === 'cancelled').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Cancelled</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <CalendarX className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
          {['All', 'Scheduled', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
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

        {/* Interviews List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="inline-block animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
              <div className="col-span-3">Candidate</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Date & Time</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {interviews.map((interview) => (
                <div key={interview.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                  {/* Candidate */}
                  <div className="col-span-3">
                    <div className="font-bold text-sm text-gray-900">{interview.candidate_name}</div>
                    <div className="text-xs text-gray-500 truncate">{interview.candidate_email}</div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(interview.interview_type)}
                      <span className="text-sm font-medium capitalize">
                        {interview.interview_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{new Date(interview.scheduled_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} className="text-gray-400" />
                      <span>{new Date(interview.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>({interview.duration_minutes}min)</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <select
                      value={interview.status}
                      onChange={(e) => handleStatusChange(interview.id, e.target.value as InterviewStatus)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-bold focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="scheduled">SCHEDULED</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                      <option value="rescheduled">RESCHEDULED</option>
                      <option value="no_show">NO SHOW</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {interview.meeting_link && (
                      <a
                        href={interview.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                        title="Join Meeting"
                      >
                        <Video size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400 text-sm italic">No interviews scheduled</p>
          </div>
        )}

        {/* Create Interview Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Candidate Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Candidate Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Candidate Name *</label>
                      <input
                        type="text"
                        value={newInterview.candidate_name}
                        onChange={(e) => setNewInterview({ ...newInterview, candidate_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Candidate Email *</label>
                      <input
                        type="email"
                        value={newInterview.candidate_email}
                        onChange={(e) => setNewInterview({ ...newInterview, candidate_email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Interview Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Interview Details</h4>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Interview Type *</label>
                    <select
                      value={newInterview.interview_type}
                      onChange={(e) => setNewInterview({ ...newInterview, interview_type: e.target.value as InterviewType })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="phone_screen">📞 Phone Screen</option>
                      <option value="video">🎥 Video Interview</option>
                      <option value="onsite">📍 Onsite Interview</option>
                      <option value="technical">💻 Technical Interview</option>
                      <option value="final">✅ Final Round</option>
                    </select>
                  </div>

                  {/* Teams Meeting Integration */}
                  {(newInterview.interview_type === 'video' || newInterview.interview_type === 'technical') && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Video className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-bold text-gray-900">Microsoft Teams Integration</h5>
                            {!hasTeamsPermissions && (
                              <button
                                onClick={handleRequestPermissions}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                              >
                                Grant Permissions
                              </button>
                            )}
                          </div>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newInterview.create_teams_meeting}
                              onChange={(e) => setNewInterview({ ...newInterview, create_teams_meeting: e.target.checked })}
                              disabled={!hasTeamsPermissions}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                            />
                            <span className="text-sm text-gray-700">
                              <Sparkles className="inline w-4 h-4 text-yellow-500 mr-1" />
                              Automatically create Teams meeting and add link
                            </span>
                          </label>
                          
                          {!hasTeamsPermissions && (
                            <p className="text-xs text-gray-500 mt-2">
                              Grant Teams permissions to automatically create meetings with calendar invites
                            </p>
                          )}
                          
                          {hasTeamsPermissions && newInterview.create_teams_meeting && (
                            <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                              ✓ Teams meeting will be created automatically with calendar invite sent to candidate
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        value={newInterview.scheduled_date}
                        onChange={(e) => setNewInterview({ ...newInterview, scheduled_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Time *</label>
                      <input
                        type="time"
                        value={newInterview.scheduled_time}
                        onChange={(e) => setNewInterview({ ...newInterview, scheduled_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Duration (min)</label>
                      <input
                        type="number"
                        value={newInterview.duration_minutes}
                        onChange={(e) => setNewInterview({ ...newInterview, duration_minutes: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        min="15"
                        step="15"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> Interview will be created with status "Scheduled". After sending the invitation to the candidate, update the status to "Confirmed" once they accept.
                    </p>
                  </div>
                </div>

                {/* Meeting Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Meeting Information</h4>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Meeting Link
                      {newInterview.create_teams_meeting && (
                        <span className="ml-2 text-xs font-normal text-green-600">(Will be auto-generated)</span>
                      )}
                    </label>
                    <input
                      type="url"
                      value={newInterview.meeting_link}
                      onChange={(e) => setNewInterview({ ...newInterview, meeting_link: e.target.value })}
                      disabled={newInterview.create_teams_meeting}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder={newInterview.create_teams_meeting ? "Teams link will be generated automatically" : "https://zoom.us/j/123456789"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newInterview.create_teams_meeting 
                        ? "Teams meeting link will be created automatically" 
                        : "For video interviews (Zoom, Teams, Google Meet)"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newInterview.location}
                      onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Office address or room number"
                    />
                    <p className="text-xs text-gray-500 mt-1">For onsite interviews</p>
                  </div>
                </div>

                {/* Interviewer Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Preparation Notes</h4>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Notes & Instructions</label>
                    <textarea
                      value={newInterview.preparation_notes}
                      onChange={(e) => setNewInterview({ ...newInterview, preparation_notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      rows={3}
                      placeholder="Interview agenda, topics to cover, special requirements..."
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={creatingTeamsMeeting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInterview}
                  disabled={creatingTeamsMeeting}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {creatingTeamsMeeting ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Creating Teams Meeting...
                    </>
                  ) : (
                    'Schedule Interview'
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
