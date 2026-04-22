import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Body = {
  jobId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  currentLocation?: string;
  yearsOfExperience?: string;
  currentCompany?: string;
  currentJobRole?: string;
  noticePeriod?: string;
  expectedSalary?: string;
  resumeUrl?: string;
  resumeFilename?: string;
  additionalDocumentsUrl?: string;
  additionalDocumentsFilename?: string;
};

function cleanString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

function cleanEmail(v: unknown): string | null {
  const s = cleanString(v);
  if (!s) return null;
  // Simple sanity check (DB constraints / email verification can be stricter)
  if (!s.includes("@") || s.length < 5) return null;
  return s;
}

async function getJobTitle(jobId: number) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("job_postings")
    .select("title")
    .eq("id", jobId)
    .maybeSingle();
  return (data?.title as string | undefined) ?? null;
}

export async function POST(request: Request) {
  try {
    let body: Body;
    try {
      body = (await request.json()) as Body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const jobId =
      typeof body.jobId === "number" ? body.jobId : Number(body.jobId);
    if (!Number.isFinite(jobId)) {
      return NextResponse.json({ error: "jobId is required." }, { status: 400 });
    }

    const firstName = cleanString(body.firstName);
    const lastName = cleanString(body.lastName);
    const email = cleanEmail(body.email);

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required." },
        { status: 400 },
      );
    }

    const phone = cleanString(body.phone);
    const linkedinUrl = cleanString(body.linkedinUrl);
    const portfolioUrl = cleanString(body.portfolioUrl);
    const coverLetter = cleanString(body.coverLetter);
    const currentLocation = cleanString(body.currentLocation);
    const yearsOfExperience = cleanString(body.yearsOfExperience);
    const currentCompany = cleanString(body.currentCompany);
    const currentJobRole = cleanString(body.currentJobRole);
    const noticePeriod = cleanString(body.noticePeriod);
    const expectedSalary = cleanString(body.expectedSalary);
    const resumeUrl = cleanString(body.resumeUrl);
    const resumeFilename = cleanString(body.resumeFilename);
    const additionalDocumentsUrl = cleanString(body.additionalDocumentsUrl);
    const additionalDocumentsFilename = cleanString(
      body.additionalDocumentsFilename,
    );

    if (
      !phone ||
      !currentLocation ||
      !yearsOfExperience ||
      !noticePeriod ||
      !coverLetter ||
      !resumeUrl ||
      !resumeFilename
    ) {
      return NextResponse.json(
        {
          error:
            "phone, currentLocation, yearsOfExperience, noticePeriod, coverLetter, resumeUrl, and resumeFilename are required.",
        },
        { status: 400 },
      );
    }

    const admin = getSupabaseAdmin();
    const jobTitle = await getJobTitle(jobId);

    // Your DB requires job_id (NOT NULL), so always send it.
    // Also include job_posting_id for compatibility if you later add it.
    const payload: Record<string, unknown> = {
      job_id: jobId,
      job_posting_id: jobId,
      job_title: jobTitle,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      linkedin_url: linkedinUrl,
      portfolio_url: portfolioUrl,
      current_location: currentLocation,
      years_of_experience: yearsOfExperience,
      current_company: currentCompany,
      current_job_role: currentJobRole,
      notice_period: noticePeriod,
      expected_salary: expectedSalary,
      cover_letter: coverLetter,
      resume_url: resumeUrl,
      resume_filename: resumeFilename,
      additional_documents_url: additionalDocumentsUrl,
      additional_documents_filename: additionalDocumentsFilename,
      application_status: "pending",
    };

    const { error } = await admin.from("job_applications").insert(payload);
    if (!error) return NextResponse.json({ ok: true }, { status: 201 });

    const msg = error.message ?? "Insert failed.";
    console.error("[job-applications] insert failed", { msg, payload });
    return NextResponse.json({ error: msg }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal Server Error";
    console.error("[job-applications] unhandled error", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

