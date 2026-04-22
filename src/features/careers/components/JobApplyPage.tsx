"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Loader, Send, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { JobListing } from "@/features/careers/data/careers.data";
import { createJobApplication } from "@/features/careers/api";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  currentLocation: string;
  yearsOfExperience: string;
  noticePeriod: string;
  expectedSalary: string;
  coverLetter: string;
  resumeUrl: string;
  resumeFilename: string;
};

function emptyForm(): FormState {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    currentLocation: "",
    yearsOfExperience: "",
    noticePeriod: "",
    expectedSalary: "",
    coverLetter: "",
    resumeUrl: "",
    resumeFilename: "",
  };
}

export function JobApplyPage({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobListing | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  const [form, setForm] = useState<FormState>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoadingJob(true);
    fetch(`/api/jobs/${jobId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoadingJob(false));
  }, [jobId]);

  const parsedJobId = useMemo(() => Number(jobId), [jobId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!Number.isFinite(parsedJobId)) {
      setError("Invalid job id.");
      return;
    }

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const currentLocation = form.currentLocation.trim();
    const yearsOfExperience = form.yearsOfExperience.trim();
    const noticePeriod = form.noticePeriod.trim();
    const coverLetter = form.coverLetter.trim();
    const resumeUrl = form.resumeUrl.trim();
    const resumeFilename = form.resumeFilename.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !currentLocation ||
      !yearsOfExperience ||
      !noticePeriod ||
      !coverLetter ||
      !resumeUrl ||
      !resumeFilename
    ) {
      setError(
        "Please fill in all required fields (name, email, phone, location, experience, notice period, cover letter, and resume link).",
      );
      return;
    }

    setSubmitting(true);
    try {
      await createJobApplication({
        jobId: parsedJobId,
        firstName,
        lastName,
        email,
        phone,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        portfolioUrl: form.portfolioUrl.trim() || undefined,
        currentLocation,
        yearsOfExperience,
        noticePeriod,
        expectedSalary: form.expectedSalary.trim() || undefined,
        coverLetter,
        resumeUrl,
        resumeFilename,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingJob) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="animate-spin text-secondary" size={36} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Job Not Found
        </h2>
        <p className="text-muted-foreground mb-4">
          This position doesn&apos;t exist or has been filled.
        </p>
        <Link href="/jobs" className="text-secondary font-semibold hover:underline">
          Back to Job Listings
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to job
          </Link>

          <Card className="py-0 gap-0 mt-6">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <h1 className="text-xl font-bold text-foreground">
                Application submitted
              </h1>
              <p className="text-sm text-muted-foreground">
                We’ve received your application for <span className="font-medium">{job.title}</span>.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Alert>
                <AlertTitle>What happens next</AlertTitle>
                <AlertDescription>
                  Our HR team will review your submission and reach out if there’s a match.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button render={<Link href="/jobs" /> } variant="outline">
                  View other roles
                </Button>
                <Button render={<Link href={`/jobs/${jobId}`} />}>
                  Back to job details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to job details
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Apply for {job.title}
            </h1>
            <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Briefcase size={14} /> {job.department}
              </span>
              <Separator orientation="vertical" className="h-4 hidden sm:inline-block" />
              <span>{job.location}</span>
              <Separator orientation="vertical" className="h-4 hidden sm:inline-block" />
              <span>{job.type}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center size-11 rounded-xl bg-primary/10 shrink-0">
            <User className="text-primary" />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Couldn’t submit</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="py-0 gap-0">
          <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">Your details</h2>
            <p className="text-sm text-muted-foreground">
              Provide the basics so HR can reach you.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    First name
                  </label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Jane"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="jane@example.com"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+971 50 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Current location
                  </label>
                  <Input
                    value={form.currentLocation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, currentLocation: e.target.value }))
                    }
                    placeholder="e.g. Dubai, UAE"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Years of experience
                  </label>
                  <Input
                    value={form.yearsOfExperience}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))
                    }
                    placeholder="e.g. 5"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Notice period
                  </label>
                  <Input
                    value={form.noticePeriod}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, noticePeriod: e.target.value }))
                    }
                    placeholder="e.g. 30 days / Immediate"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Expected salary (optional)
                  </label>
                  <Input
                    value={form.expectedSalary}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, expectedSalary: e.target.value }))
                    }
                    placeholder="e.g. 18,000 AED"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Resume URL
                  </label>
                  <Input
                    value={form.resumeUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, resumeUrl: e.target.value }))
                    }
                    placeholder="Paste a public link to your resume (PDF/Doc)"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For now, upload your resume to a drive and paste the share link.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Resume filename
                  </label>
                  <Input
                    value={form.resumeFilename}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, resumeFilename: e.target.value }))
                    }
                    placeholder="e.g. Jane-Doe-Resume.pdf"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    LinkedIn URL (optional)
                  </label>
                  <Input
                    value={form.linkedinUrl}
                    onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Portfolio URL (optional)
                  </label>
                  <Input
                    value={form.portfolioUrl}
                    onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Cover letter
                  </label>
                  <Textarea
                    value={form.coverLetter}
                    onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                    placeholder="Tell us why you're a great fit..."
                    className="min-h-40"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm(emptyForm())}
                  disabled={submitting}
                >
                  Clear
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader className="animate-spin" /> : <Send />}
                  Submit application
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                By submitting, you agree we may store and process your information for recruitment.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

