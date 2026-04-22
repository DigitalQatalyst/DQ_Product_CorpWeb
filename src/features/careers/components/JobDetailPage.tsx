"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle,
  Building2,
  Calendar,
  Share2,
  Loader,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { JobPostingType } from "../api/types";
import { getJobPostingById } from "../api/jobPostings";

export function JobDetailPage({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobPostingType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobPostingById(Number(jobId))
      .then((data) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.title} at DigitalQatalyst`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="animate-spin text-secondary" size={36} />
      </div>
    );

  if (!job)
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Job Not Found
        </h2>
        <p className="text-muted-foreground mb-4">
          This position doesn&apos;t exist or has been filled.
        </p>
        <Link
          href="/jobs"
          className="text-secondary font-semibold hover:underline"
        >
          Back to Job Listings
        </Link>
      </div>
    );

  const metaItems = [
    { icon: Building2, label: "Department", value: job.department },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Clock, label: "Employment Type", value: job.type },
    { icon: Briefcase, label: "Experience Level", value: job.level },
    {
      icon: Calendar,
      label: "Posted Date",
      value: job.postedDate
        ? new Date(job.postedDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb bar */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/careers" />}>
                  Careers
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/jobs" />}>
                  Job Listings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[200px]">
                  {job.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to Job Listings
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-secondary/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h1 className="text-4xl font-bold text-foreground leading-tight">
                  {job.title}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent/20"
                >
                  Open
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium mb-4">
                {job.department} • {job.location} • {job.type}
                {job.openPositions &&
                  ` • ${job.openPositions} Position${job.openPositions !== 1 ? "s" : ""} Available`}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/jobs/${jobId}/apply`}
                  className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
                >
                  Apply Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-background text-foreground font-semibold rounded-lg border border-border hover:bg-muted transition-colors inline-flex items-center gap-2"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>

            <div className="lg:w-1/3 w-full">
              <Card className="py-0 gap-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Job Overview
                  </h3>
                  <div className="space-y-0">
                    {metaItems.map(({ icon: Icon, label, value }, i, arr) => (
                      <div key={label}>
                        <div className="flex items-start gap-3 py-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                            <Icon
                              size={20}
                              className="text-secondary"
                              strokeWidth={1.5}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              {label}
                            </p>
                            <p className="font-medium text-foreground text-sm">
                              {value}
                            </p>
                          </div>
                        </div>
                        {i < arr.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Responsibilities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Key Responsibilities
          </h2>
          <Card className="py-0 gap-0">
            <CardContent className="p-8">
              <ul className="space-y-4">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      size={22}
                      className="text-secondary shrink-0 mt-0.5"
                    />
                    <span className="text-muted-foreground leading-relaxed">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Skills */}
        {job.skills && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Required Skills & Competencies
            </h2>
            <div className="space-y-6">
              <Card className="py-0 gap-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Core Skills
                  </h3>
                  <ul className="space-y-3">
                    {job.skills.core.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle
                          size={20}
                          className="text-accent shrink-0 mt-0.5"
                        />
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="py-0 gap-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Behavioral & Professional Competencies
                  </h3>
                  <ul className="space-y-3">
                    {job.skills.behavioral.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle
                          size={20}
                          className="text-secondary shrink-0 mt-0.5"
                        />
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Requirements */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Qualifications & Experience
          </h2>
          <Card className="py-0 gap-0">
            <CardContent className="p-8">
              <ul className="space-y-4">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      size={22}
                      className="text-accent shrink-0 mt-0.5"
                    />
                    <span className="text-muted-foreground leading-relaxed">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Apply CTA */}
        <Card className="py-0 gap-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our team and help shape the future of digital transformation.
            </p>
            <Link
              href={`/jobs/${jobId}/apply`}
              className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
            >
              Apply for this Position
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
