export type JobApplicationCreateInput = {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentLocation: string;
  yearsOfExperience: string;
  noticePeriod: string;
  expectedSalary?: string;
  coverLetter: string;
  resumeUrl: string;
  resumeFilename: string;
  additionalDocumentsUrl?: string;
  additionalDocumentsFilename?: string;
};

export async function createJobApplication(input: JobApplicationCreateInput) {
  const res = await fetch("/api/job-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to submit application.");
  }

  return (await res.json()) as { ok: true };
}

