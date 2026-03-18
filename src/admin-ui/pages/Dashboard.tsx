import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getJobApplications } from "../../services/jobApplicationService";
import type { JobApplication } from "../../services/jobApplicationService";
import { getInterviews } from "../../services/interviewService";
import type { Interview } from "../../types/admin";
import { getAllJobPostings } from "../../services/jobPostingService";
import type { JobPosting } from "../../services/jobPostingService";
import { getAdminUsers } from "../../services/adminUserService";
import type { AdminUser } from "../../types/admin";
import { useAuth } from "../../contexts/AuthContext";
import {
  TrendingUp as TrendingUpIcon,
  Loader,
  Calendar,
  FileText,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Toast, ToastType } from "../components/Toast";

interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  totalInterviews: number;
  upcomingInterviews: number;
  totalPostings: number;
  openPositions: number;
  totalUsers: number;
  activeUsers: number;
  contentViews: number;
  publishedPosts: number;
}

const Dashboard: React.FC = () => {
  const { isAdmin, isHRAdmin, isHRViewer } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingReview: 0,
    totalInterviews: 0,
    upcomingInterviews: 0,
    totalPostings: 0,
    openPositions: 0,
    totalUsers: 0,
    activeUsers: 0,
    contentViews: 12458,
    publishedPosts: 24,
  });
  const [recentApplications, setRecentApplications] = useState<
    JobApplication[]
  >([]);
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [recentPostings, setRecentPostings] = useState<JobPosting[]>([]);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch applications
      const applicationsResult = await getJobApplications();

      // Fetch interviews
      const interviewsResult = await getInterviews();

      // Fetch job postings
      const postingsResult = await getAllJobPostings();

      // Fetch users
      const usersResult = await getAdminUsers();

      if (!applicationsResult.error && applicationsResult.data) {
        const applications = applicationsResult.data;
        const sorted = [...applications].sort(
          (a, b) =>
            new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
        );
        setRecentApplications(sorted.slice(0, 3));

        setStats((prev) => ({
          ...prev,
          totalApplications: applications.length,
          pendingReview: applications.filter(
            (app) =>
              app.application_status === "pending" ||
              app.application_status === "reviewing",
          ).length,
        }));
      }

      if (!interviewsResult.error && interviewsResult.data) {
        const interviews = interviewsResult.data;
        const now = new Date();
        const upcoming = interviews.filter(
          (i) => i.status === "scheduled" && new Date(i.scheduled_date) > now,
        );
        const sorted = [...interviews].sort(
          (a, b) =>
            new Date(b.scheduled_date).getTime() -
            new Date(a.scheduled_date).getTime(),
        );
        setRecentInterviews(sorted.slice(0, 3));

        setStats((prev) => ({
          ...prev,
          totalInterviews: interviews.length,
          upcomingInterviews: upcoming.length,
        }));
      }

      if (!postingsResult.error && postingsResult.data) {
        const postings = postingsResult.data;
        const sorted = [...postings].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setRecentPostings(sorted.slice(0, 3));

        setStats((prev) => ({
          ...prev,
          totalPostings: postings.length,
          openPositions: postings.filter((p) => p.status === "open").length,
        }));
      }

      if (!usersResult.error && usersResult.data) {
        const users = usersResult.data;
        const sorted = [...users].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setRecentUsers(sorted.slice(0, 3));

        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: users.filter((u) => u.is_active).length,
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
      reviewing: "bg-blue-50 text-blue-700 border-blue-100",
      shortlisted: "bg-purple-50 text-purple-700 border-purple-100",
      interviewed: "bg-indigo-50 text-indigo-700 border-indigo-100",
      accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
      rejected: "bg-red-50 text-red-700 border-red-100",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-100";
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Executive Overview
            </h2>
            <p className="text-sm text-gray-500">
              Comprehensive view of recruitment, content, and business
              operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin-ui/analytics"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-black text-xs font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              View Analytics
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(isAdmin() || isHRAdmin() || isHRViewer()) && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalApplications}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total Applications
                  </div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
          )}

          {(isAdmin() || isHRAdmin() || isHRViewer()) && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.upcomingInterviews}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Upcoming Interviews
                  </div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Calendar className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
          )}

          {isAdmin() && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.activeUsers}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Active Users</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <UserCheck className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
          )}

          {(isAdmin() || isHRAdmin() || isHRViewer()) && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.openPositions}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Open Positions
                  </div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Briefcase className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications - HR roles only */}
          {(isAdmin() || isHRAdmin() || isHRViewer()) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">
                  Recent Applications
                </h3>
                <Link
                  to="/admin-ui/job-applications"
                  className="text-gray-500 hover:text-black text-xs font-medium underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                  <Loader className="animate-spin mb-4" size={32} />
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xs italic">
                    No applications yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="group px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200 shrink-0">
                          {app.first_name[0]}
                          {app.last_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {app.first_name} {app.last_name}
                          </h4>
                          <div className="text-xs text-gray-500 truncate">
                            {app.job_title}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border ${getStatusColor(app.application_status)} shrink-0`}
                        >
                          {app.application_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Interviews - HR roles only */}
          {(isAdmin() || isHRAdmin()) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">
                  Upcoming Interviews
                </h3>
                <Link
                  to="/admin-ui/interview-scheduler"
                  className="text-gray-500 hover:text-black text-xs font-medium underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                  <Loader className="animate-spin mb-4" size={32} />
                </div>
              ) : recentInterviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xs italic">
                    No interviews scheduled.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="group px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                          <Calendar className="text-blue-600" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {interview.candidate_name}
                          </h4>
                          <div className="text-xs text-gray-500">
                            {new Date(
                              interview.scheduled_date,
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              interview.scheduled_date,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-lg text-xs font-medium capitalize bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                          {interview.interview_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Job Postings - HR roles only */}
          {(isAdmin() || isHRAdmin()) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">
                  Active Job Postings
                </h3>
                <Link
                  to="/admin-ui/job-postings"
                  className="text-gray-500 hover:text-black text-xs font-medium underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                  <Loader className="animate-spin mb-4" size={32} />
                </div>
              ) : recentPostings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xs italic">
                    No job postings yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentPostings.map((posting) => (
                    <div
                      key={posting.id}
                      className="group px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                          <Briefcase className="text-blue-600" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {posting.title}
                          </h4>
                          <div className="text-xs text-gray-500 truncate">
                            {posting.location} • {posting.job_type}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border shrink-0 ${
                            posting.status === "open"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-gray-50 text-gray-700 border-gray-100"
                          }`}
                        >
                          {posting.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Users - Admin only */}
          {isAdmin() && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Recent Users</h3>
                <Link
                  to="/admin-ui/user-management"
                  className="text-gray-500 hover:text-black text-xs font-medium underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                  <Loader className="animate-spin mb-4" size={32} />
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xs italic">No users yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="group px-6 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200 shrink-0">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {user.email}
                          </h4>
                          <div className="text-xs text-gray-500 truncate">
                            {user.role}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border shrink-0 ${
                            user.role === "super_admin"
                              ? "bg-purple-50 text-purple-700 border-purple-100"
                              : user.role === "admin"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-gray-50 text-gray-700 border-gray-100"
                          }`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Stats - All roles */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pending Review</span>
                <span className="text-sm font-semibold">
                  {stats.pendingReview}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Interviews</span>
                <span className="text-sm font-semibold">
                  {stats.totalInterviews}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Users</span>
                <span className="text-sm font-semibold">
                  {stats.totalUsers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Postings</span>
                <span className="text-sm font-semibold">
                  {stats.totalPostings}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-sm font-semibold">Needs Attention</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  {stats.pendingReview} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
};

export default Dashboard;
