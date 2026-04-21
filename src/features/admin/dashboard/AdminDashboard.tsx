"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  UserCheck,
  Briefcase,
  TrendingUp,
  Loader,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalApplications: number;
  pendingReview: number;
  upcomingInterviews: number;
  totalInterviews: number;
  activeUsers: number;
  totalUsers: number;
  openPositions: number;
  totalPostings: number;
}

interface RecentApp {
  id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  application_status: string;
}

interface RecentInterview {
  id: number;
  candidate_name: string;
  scheduled_date: string;
  interview_type: string;
  status: string;
}

interface RecentPosting {
  id: number;
  title: string;
  location: string;
  type: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  reviewing: "bg-blue-50 text-blue-700 border-blue-100",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  open: "bg-emerald-50 text-emerald-700 border-emerald-100",
  closed: "bg-muted text-muted-foreground border-border",
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    pendingReview: 0,
    upcomingInterviews: 0,
    totalInterviews: 0,
    activeUsers: 0,
    totalUsers: 0,
    openPositions: 0,
    totalPostings: 0,
  });
  const [apps, setApps] = useState<RecentApp[]>([]);
  const [interviews, setInterviews] = useState<RecentInterview[]>([]);
  const [postings, setPostings] = useState<RecentPosting[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const now = new Date().toISOString();

      const [appsRes, interviewsRes, postingsRes, usersRes] = await Promise.all(
        [
          supabase
            .from("job_applications")
            .select("*")
            .order("applied_at", { ascending: false }),
          supabase
            .from("interviews")
            .select("*")
            .order("scheduled_date", { ascending: false }),
          supabase
            .from("job_postings")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("admin_users")
            .select("*")
            .order("created_at", { ascending: false }),
        ],
      );

      const applications = (appsRes.data ?? []) as RecentApp[];
      const interviewRows = (interviewsRes.data ?? []) as RecentInterview[];
      const postingRows = (postingsRes.data ?? []) as RecentPosting[];
      const adminUsers = (usersRes.data ?? []) as Array<{ is_active: boolean }>;

      if (applications.length > 0) {
        setApps(getRecentApplications(applications));
        setStats((current) => ({
          ...current,
          totalApplications: applications.length,
          pendingReview: countPendingApplications(applications),
        }));
      }
      if (interviewRows.length > 0) {
        const upcomingInterviews = getUpcomingInterviews(interviewRows, now);

        setInterviews(upcomingInterviews);
        setStats((current) => ({
          ...current,
          totalInterviews: interviewRows.length,
          upcomingInterviews: upcomingInterviews.length,
        }));
      }
      if (postingRows.length > 0) {
        setPostings(getRecentPostings(postingRows));
        setStats((current) => ({
          ...current,
          totalPostings: postingRows.length,
          openPositions: countOpenPositions(postingRows),
        }));
      }
      if (adminUsers.length > 0) {
        setStats((current) => ({
          ...current,
          totalUsers: adminUsers.length,
          activeUsers: countActiveUsers(adminUsers),
        }));
      }

      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
    },
    {
      label: "Upcoming Interviews",
      value: stats.upcomingInterviews,
      icon: Calendar,
    },
    { label: "Active Users", value: stats.activeUsers, icon: UserCheck },
    { label: "Open Positions", value: stats.openPositions, icon: Briefcase },
  ];

  let recentApplicationsContent: ReactNode;

  if (loading) {
    recentApplicationsContent = <LoadingState />;
  } else if (apps.length === 0) {
    recentApplicationsContent = <EmptyState text="No applications yet." />;
  } else {
    recentApplicationsContent = (
      <div className="divide-y divide-border">
        {apps.map((app) => (
          <div
            key={app.id}
            className="px-6 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center text-sm font-bold text-foreground shrink-0">
              {getInitials(app.first_name, app.last_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {app.first_name} {app.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {app.job_title}
              </p>
            </div>
            <StatusBadge status={app.application_status} />
          </div>
        ))}
      </div>
    );
  }

  let upcomingInterviewsContent: ReactNode;

  if (loading) {
    upcomingInterviewsContent = <LoadingState />;
  } else if (interviews.length === 0) {
    upcomingInterviewsContent = <EmptyState text="No interviews scheduled." />;
  } else {
    upcomingInterviewsContent = (
      <div className="divide-y divide-border">
        {interviews.map((iv) => (
          <div
            key={iv.id}
            className="px-6 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="bg-secondary/10 p-3 rounded-lg shrink-0">
              <Calendar className="text-secondary" size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {iv.candidate_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(iv.scheduled_date).toLocaleDateString()} at{" "}
                {new Date(iv.scheduled_date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <StatusBadge status={iv.interview_type} />
          </div>
        ))}
      </div>
    );
  }

  let activePostingsContent: ReactNode;

  if (loading) {
    activePostingsContent = <LoadingState />;
  } else if (postings.length === 0) {
    activePostingsContent = <EmptyState text="No job postings yet." />;
  } else {
    activePostingsContent = (
      <div className="divide-y divide-border">
        {postings.map((posting) => (
          <div
            key={posting.id}
            className="px-6 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="bg-secondary/10 p-3 rounded-lg shrink-0">
              <Briefcase className="text-secondary" size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {posting.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {posting.location} • {posting.type}
              </p>
            </div>
            <StatusBadge status={posting.status} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Executive Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Recruitment, content, and business operations.
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border text-sm font-medium rounded-md hover:bg-muted transition-colors"
        >
          <TrendingUp size={16} /> View Analytics
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card
            key={label}
            className="py-0 gap-0 border-r-[3px] border-r-primary"
          >
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Icon className="text-secondary" size={24} strokeWidth={1.5} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="py-0 gap-0">
          <CardHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between bg-muted/30">
            <h3 className="font-semibold text-foreground">
              Recent Applications
            </h3>
            <Link
              href="/admin/applications"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">{recentApplicationsContent}</CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="py-0 gap-0">
          <CardHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between bg-muted/30">
            <h3 className="font-semibold text-foreground">
              Upcoming Interviews
            </h3>
            <Link
              href="/admin/interviews"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">{upcomingInterviewsContent}</CardContent>
        </Card>

        {/* Active Job Postings */}
        <Card className="py-0 gap-0">
          <CardHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between bg-muted/30">
            <h3 className="font-semibold text-foreground">
              Active Job Postings
            </h3>
            <Link
              href="/admin/job-postings"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">{activePostingsContent}</CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="py-0 gap-0">
          <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground">Quick Insights</h3>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { label: "Pending Review", value: stats.pendingReview },
              { label: "Total Interviews", value: stats.totalInterviews },
              { label: "Total Users", value: stats.totalUsers },
              { label: "Total Postings", value: stats.totalPostings },
            ].map(({ label, value }, i, arr) => (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {value}
                  </span>
                </div>
                {i < arr.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Needs Attention
              </span>
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700"
              >
                {stats.pendingReview} items
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getRecentApplications(applications: RecentApp[]) {
  return applications.slice(0, 3);
}

function countPendingApplications(applications: RecentApp[]) {
  return applications.filter(({ application_status }) =>
    ["pending", "reviewing"].includes(application_status),
  ).length;
}

function getUpcomingInterviews(interviews: RecentInterview[], nowIso: string) {
  return interviews
    .filter(
      ({ scheduled_date, status }) =>
        status === "scheduled" && scheduled_date > nowIso,
    )
    .slice(0, 3);
}

function getRecentPostings(postings: RecentPosting[]) {
  return postings.slice(0, 3);
}

function countOpenPositions(postings: RecentPosting[]) {
  return postings.filter(({ status }) => status === "open").length;
}

function countActiveUsers(users: Array<{ is_active: boolean }>) {
  return users.filter(({ is_active }) => is_active).length;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const cls =
    STATUS_COLORS[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border shrink-0 ${cls}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader className="animate-spin text-primary" size={28} />
    </div>
  );
}

function EmptyState({ text }: Readonly<{ text: string }>) {
  return (
    <p className="text-center text-xs text-muted-foreground italic py-12">
      {text}
    </p>
  );
}
