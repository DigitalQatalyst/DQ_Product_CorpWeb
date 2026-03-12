import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { contentSubmissionService } from '../utils/supabase';
import { 
  Eye as EyeIcon,
  Check as CheckIcon,
  X as XIcon,
  Clock as ClockIcon,
  User as UserIcon,
  FileText as FileTextIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';

interface SubmissionWithDetails {
  id: string;
  mediaId: string;
  authorId: string;
  status: string;
  reviewerId: string | null;
  reviewNotes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mediaItem: any;
  author: any;
}

const ContentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewingSubmission, setReviewingSubmission] = useState<SubmissionWithDetails | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const filters = filter === 'all' ? {} : { status: filter };
      const data = await contentSubmissionService.getSubmissions(filters);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setToast({ message: 'Failed to load submissions', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmission = async (submissionId: string, status: string, notes: string = '') => {
    try {
      await contentSubmissionService.updateSubmissionStatus(
        submissionId,
        status,
        'current-user-id', // In a real app, this would come from auth context
        notes
      );
      
      setToast({ 
        message: `Submission ${status.toLowerCase()} successfully!`, 
        type: 'success' 
      });
      
      setReviewingSubmission(null);
      setReviewNotes('');
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      setToast({ message: 'Failed to update submission', type: 'error' });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Submitted': { bg: 'bg-blue-100', text: 'text-blue-800', icon: ClockIcon },
      'InReview': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: EyeIcon },
      'Approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckIcon },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XIcon },
      'Published': { bg: 'bg-purple-100', text: 'text-purple-800', icon: FileTextIcon },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Submitted'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const filteredSubmissions = submissions;

  return (
    <AppLayout title="Content Submissions">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Content Review Queue</h2>
            <p className="text-sm text-gray-600">Review and approve content submissions from authors</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Submissions</option>
              <option value="Submitted">Submitted</option>
              <option value="InReview">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No submissions found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {submission.mediaItem?.title || 'Untitled'}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {submission.author?.name || 'Unknown Author'}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileTextIcon className="w-4 h-4" />
                        {submission.mediaItem?.type || 'Unknown Type'}
                      </div>
                    </div>

                    {submission.mediaItem?.summary && (
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {submission.mediaItem.summary}
                      </p>
                    )}

                    {submission.reviewNotes && (
                      <div className="bg-gray-50 rounded-md p-3 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Review Notes:</p>
                        <p className="text-sm text-gray-600">{submission.reviewNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/admin-ui/media/${submission.mediaId}`}
                      className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    
                    {(submission.status === 'Submitted' || submission.status === 'InReview') && (
                      <button
                        onClick={() => setReviewingSubmission(submission)}
                        className="inline-flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold mb-4">Review Submission</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                {reviewingSubmission.mediaItem?.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                By: {reviewingSubmission.author?.name}
              </p>
              {reviewingSubmission.mediaItem?.summary && (
                <p className="text-sm text-gray-700">
                  {reviewingSubmission.mediaItem.summary}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (optional)
              </label>
              <textarea
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any feedback or notes about this submission..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setReviewingSubmission(null);
                  setReviewNotes('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewSubmission(reviewingSubmission.id, 'Rejected', reviewNotes)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleReviewSubmission(reviewingSubmission.id, 'Approved', reviewNotes)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ContentSubmissions;