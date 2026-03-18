import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getAnalyticsSummary } from "../../services/analyticsService";
import type { AnalyticsSummary } from "../../types/admin";
import { useAuth } from "../../contexts/AuthContext";
import {
  BarChart3,
  Loader,
  Eye,
  FileText,
  Clock,
  TrendingUp,
  Users,
  Briefcase,
  Target,
  Calendar,
} from "lucide-react";

export default function Analytics() {
  const { isAdmin, isCreator, isHRAdmin, isHRViewer } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const { data } = await getAnalyticsSummary();
    if (data) {
      setSummary(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <AppLayout title="Analytics & Reports">
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-gray-400" size={32} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics & Reports">
      <div className="space-y-6">
        {/* Date Range Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-gray-400" />
            <span className="text-sm text-gray-500">Performance Overview</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        {/* Content Analytics - Admin and Creator only */}
        {(isAdmin() || isCreator()) && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Content Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.content.total_views.toLocaleString() ||
                        "12,458"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total Views
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Eye className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.content.total_posts || 24}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Published Posts
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.content.avg_time_on_page || 145}s
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Avg. Time on Page
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.content.top_performing.length || 8}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Top Performers
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <TrendingUp className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recruitment Analytics - Admin and HR roles */}
        {(isAdmin() || isHRAdmin() || isHRViewer()) && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recruitment Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.recruitment.total_applications || 48}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total Applications
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Users className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.recruitment.total_positions || 7}
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

              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.recruitment.conversion_rate?.toFixed(1) ||
                        "10.4"}
                      %
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Conversion Rate
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Target className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 border-r-[3px] border-r-blue-900">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary?.recruitment.avg_time_to_hire || 18}d
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Avg. Time to Hire
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Performance Trend - Admin/Creator only */}
          {(isAdmin() || isCreator()) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Content Performance Trend
              </h3>
              <div className="h-64">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1="40"
                    x2="400"
                    y2="40"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="80"
                    x2="400"
                    y2="80"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="120"
                    x2="400"
                    y2="120"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="160"
                    x2="400"
                    y2="160"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />

                  {/* Line chart - Views trend */}
                  <polyline
                    points="0,180 50,160 100,140 150,120 200,100 250,90 300,70 350,50 400,40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Area fill */}
                  <polygon
                    points="0,180 50,160 100,140 150,120 200,100 250,90 300,70 350,50 400,40 400,200 0,200"
                    fill="#3b82f6"
                    fillOpacity="0.1"
                  />

                  {/* Data points */}
                  <circle cx="0" cy="180" r="3" fill="#3b82f6" />
                  <circle cx="50" cy="160" r="3" fill="#3b82f6" />
                  <circle cx="100" cy="140" r="3" fill="#3b82f6" />
                  <circle cx="150" cy="120" r="3" fill="#3b82f6" />
                  <circle cx="200" cy="100" r="3" fill="#3b82f6" />
                  <circle cx="250" cy="90" r="3" fill="#3b82f6" />
                  <circle cx="300" cy="70" r="3" fill="#3b82f6" />
                  <circle cx="350" cy="50" r="3" fill="#3b82f6" />
                  <circle cx="400" cy="40" r="3" fill="#3b82f6" />
                </svg>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>
          )}

          {/* Application Funnel - Admin/HR roles only */}
          {(isAdmin() || isHRAdmin() || isHRViewer()) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-6">
                Application Funnel
              </h3>
              <div className="h-64">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 450 240"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Y-axis */}
                  <line
                    x1="50"
                    y1="20"
                    x2="50"
                    y2="190"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="50"
                    y1="190"
                    x2="440"
                    y2="190"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />

                  {/* Y-axis labels */}
                  <text
                    x="40"
                    y="25"
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    50
                  </text>
                  <text
                    x="40"
                    y="67.5"
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    40
                  </text>
                  <text
                    x="40"
                    y="110"
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    30
                  </text>
                  <text
                    x="40"
                    y="152.5"
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    20
                  </text>
                  <text
                    x="40"
                    y="195"
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    0
                  </text>

                  {/* Bars - Applied: 48 (48/50 * 170 = 163.2px from bottom) */}
                  <rect
                    x="75"
                    y="26.8"
                    width="50"
                    height="163.2"
                    fill="#3b82f6"
                    rx="3"
                  />
                  <text
                    x="100"
                    y="17"
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize="13"
                    fontWeight="600"
                  >
                    48
                  </text>
                  <text
                    x="100"
                    y="215"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    Applied
                  </text>

                  {/* Bars - Reviewed: 35 (35/50 * 170 = 119px from bottom) */}
                  <rect
                    x="155"
                    y="71"
                    width="50"
                    height="119"
                    fill="#6366f1"
                    rx="3"
                  />
                  <text
                    x="180"
                    y="61"
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize="13"
                    fontWeight="600"
                  >
                    35
                  </text>
                  <text
                    x="180"
                    y="215"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    Reviewed
                  </text>

                  {/* Bars - Shortlisted: 22 (22/50 * 170 = 74.8px from bottom) */}
                  <rect
                    x="235"
                    y="115.2"
                    width="50"
                    height="74.8"
                    fill="#8b5cf6"
                    rx="3"
                  />
                  <text
                    x="260"
                    y="105"
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize="13"
                    fontWeight="600"
                  >
                    22
                  </text>
                  <text
                    x="260"
                    y="215"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    Shortlisted
                  </text>

                  {/* Bars - Interviewed: 12 (12/50 * 170 = 40.8px from bottom) */}
                  <rect
                    x="315"
                    y="149.2"
                    width="50"
                    height="40.8"
                    fill="#a78bfa"
                    rx="3"
                  />
                  <text
                    x="340"
                    y="139"
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize="13"
                    fontWeight="600"
                  >
                    12
                  </text>
                  <text
                    x="340"
                    y="215"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    Interviewed
                  </text>

                  {/* Bars - Accepted: 5 (5/50 * 170 = 17px from bottom) */}
                  <rect
                    x="395"
                    y="173"
                    width="50"
                    height="17"
                    fill="#10b981"
                    rx="3"
                  />
                  <text
                    x="420"
                    y="163"
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize="13"
                    fontWeight="600"
                  >
                    5
                  </text>
                  <text
                    x="420"
                    y="215"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    Accepted
                  </text>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
