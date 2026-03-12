import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import {
  getAllJobPostings,
  markPositionAsFilled,
  deleteJobPosting,
  getApplicationCount,
} from "../../services/jobPostingService";
import type { JobPosting } from "../../services/jobPostingService";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Search,
  Briefcase,
  FolderOpen,
  Target,
} from "lucide-react";

export default function JobPostingsManagement() {
  const navigate = useNavigate();
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [applicationCounts, setApplicationCounts] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPostings();
  }, [filter]);

  const loadPostings = async () => {
    setLoading(true);
    setError(null);

    const filters = filter !== "all" ? { status: filter } : undefined;
    const result = await getAllJobPostings(filters);

    if (result.error) {
      setError(result.error);
    } else {
      setPostings(result.data);
      // Load application counts
      result.data.forEach(async (posting) => {
        const { count } = await getApplicationCount(posting.id);
        setApplicationCounts((prev) => ({ ...prev, [posting.id]: count }));
      });
    }

    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    const result = await deleteJobPosting(id);
    if (result.success) {
      loadPostings();
    } else {
      alert(`Failed to delete: ${result.error}`);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'open') {
      return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize bg-green-50 text-green-700 border border-green-200">● Open</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
  };

  const filteredPostings = postings.filter(posting =>
    posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    posting.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPostings = postings.length;
  const openPostings = postings.filter(p => p.status === 'open').length;
  const totalOpportunities = postings.reduce((sum, p) => sum + (applicationCounts[p.id] || 0), 0);

  return (
    <AppLayout title="Job Postings">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{totalPostings}</div>
                <div className="text-xs text-gray-500 mt-1">Total Positions</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Briefcase className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{openPostings}</div>
                <div className="text-xs text-gray-500 mt-1">Open Positions</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <FolderOpen className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{totalOpportunities}</div>
                <div className="text-xs text-gray-500 mt-1">Total Opportunities</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Target className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
              {["All", "Open", "Closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    filter === status.toLowerCase()
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate("/admin-ui/job-postings/new")}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              New Position
            </button>
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

        {/* Postings Table */}
        {!loading && filteredPostings.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
              <div className="col-span-4">Position</div>
              <div className="col-span-3">Details</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredPostings.map((posting) => (
                <div key={posting.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                  {/* Position */}
                  <div className="col-span-4">
                    <h3 className="font-bold text-gray-900 mb-1">{posting.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold">{posting.department}</span>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">{posting.level}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-span-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{posting.location}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Posted: {new Date(posting.posted_date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {getStatusBadge(posting.status)}
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/jobs/${posting.id}`)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin-ui/job-postings/${posting.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(posting.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPostings.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm italic">No job postings found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
