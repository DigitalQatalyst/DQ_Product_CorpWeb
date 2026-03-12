import { getJobsSupabase } from '../lib/supabaseClients';
import type { JobApplication } from '../types/admin';

// Azure OpenAI configuration (using existing setup)
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = import.meta.env.VITE_AZURE_OPENAI_KEY;
const AZURE_OPENAI_DEPLOYMENT = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;

export interface CVScreeningResult {
  application_id: string;
  overall_score: number; // 0-100
  skills_match_score: number; // 0-100
  experience_match_score: number; // 0-100
  education_match_score: number; // 0-100;
  extracted_skills: string[];
  extracted_experience: string[];
  extracted_education: string[];
  key_highlights: string[];
  red_flags: string[];
  recommendation: 'strong_match' | 'good_match' | 'potential_match' | 'weak_match' | 'no_match';
  screening_summary: string;
  screened_at: string;
  screened_by?: string;
}

export interface JobRequirements {
  required_skills: string[];
  preferred_skills: string[];
  min_years_experience: number;
  required_education?: string;
  job_description: string;
}

/**
 * Extract text from PDF resume using PDF.js
 */
async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  try {
    // Fetch the PDF file
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Use pdfjs-dist to extract text
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from resume');
  }
}

/**
 * Screen CV using Azure OpenAI
 */
async function screenCVWithAI(
  cvText: string,
  jobRequirements: JobRequirements,
  applicationData: Partial<JobApplication>
): Promise<Omit<CVScreeningResult, 'application_id' | 'screened_at' | 'screened_by'>> {
  try {
    const prompt = `You are an expert HR recruiter. Analyze the following resume against the job requirements and provide a detailed screening assessment.

JOB REQUIREMENTS:
- Position: ${applicationData.job_title}
- Required Skills: ${jobRequirements.required_skills.join(', ')}
- Preferred Skills: ${jobRequirements.preferred_skills.join(', ')}
- Minimum Experience: ${jobRequirements.min_years_experience} years
- Required Education: ${jobRequirements.required_education || 'Not specified'}
- Job Description: ${jobRequirements.job_description}

CANDIDATE INFORMATION:
- Name: ${applicationData.first_name} ${applicationData.last_name}
- Years of Experience: ${applicationData.years_of_experience}
- Current Company: ${applicationData.current_company || 'Not specified'}
- Current Role: ${applicationData.current_role || 'Not specified'}
- Location: ${applicationData.current_location}

RESUME TEXT:
${cvText}

COVER LETTER:
${applicationData.cover_letter}

Please analyze and provide a JSON response with the following structure:
{
  "overall_score": <number 0-100>,
  "skills_match_score": <number 0-100>,
  "experience_match_score": <number 0-100>,
  "education_match_score": <number 0-100>,
  "extracted_skills": [<array of skills found in resume>],
  "extracted_experience": [<array of relevant work experiences>],
  "extracted_education": [<array of education qualifications>],
  "key_highlights": [<array of 3-5 standout points>],
  "red_flags": [<array of concerns or gaps, empty if none>],
  "recommendation": "<strong_match|good_match|potential_match|weak_match|no_match>",
  "screening_summary": "<2-3 sentence summary of the assessment>"
}

Focus on:
1. Skills alignment with job requirements
2. Relevant experience and achievements
3. Education and certifications
4. Career progression and stability
5. Cultural fit indicators from cover letter`;

    const response = await fetch(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert HR recruiter specializing in candidate screening and assessment. Provide objective, data-driven evaluations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return result;
  } catch (error) {
    console.error('Error screening CV with AI:', error);
    throw new Error('Failed to screen CV with AI');
  }
}

/**
 * Screen a job application
 */
export async function screenApplication(
  applicationId: string,
  jobRequirements: JobRequirements,
  screenedBy?: string
): Promise<{ success: boolean; result?: CVScreeningResult; error?: string }> {
  try {
    const supabase = getJobsSupabase();

    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      throw new Error('Application not found');
    }

    // Extract text from resume PDF
    const cvText = await extractTextFromPDF(application.resume_url);

    // Screen with AI
    const aiResult = await screenCVWithAI(cvText, jobRequirements, application);

    // Prepare screening result
    const screeningResult: CVScreeningResult = {
      application_id: applicationId,
      ...aiResult,
      screened_at: new Date().toISOString(),
      screened_by: screenedBy,
    };

    // Save screening result to database
    const { error: saveError } = await supabase
      .from('cv_screening_results')
      .upsert(screeningResult, { onConflict: 'application_id' });

    if (saveError) {
      console.error('Error saving screening result:', saveError);
      // Continue even if save fails - return the result
    }

    // Auto-update application status based on recommendation
    if (aiResult.recommendation === 'strong_match' || aiResult.recommendation === 'good_match') {
      await supabase
        .from('job_applications')
        .update({ application_status: 'screened' })
        .eq('id', applicationId);
    }

    return {
      success: true,
      result: screeningResult,
    };
  } catch (error) {
    console.error('Error screening application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Batch screen multiple applications
 */
export async function batchScreenApplications(
  applicationIds: string[],
  jobRequirements: JobRequirements,
  screenedBy?: string
): Promise<{
  success: boolean;
  results: Array<{ applicationId: string; success: boolean; result?: CVScreeningResult; error?: string }>;
}> {
  const results = await Promise.all(
    applicationIds.map(async (id) => {
      const result = await screenApplication(id, jobRequirements, screenedBy);
      return {
        applicationId: id,
        ...result,
      };
    })
  );

  return {
    success: results.every((r) => r.success),
    results,
  };
}

/**
 * Get screening result for an application
 */
export async function getScreeningResult(
  applicationId: string
): Promise<{ data: CVScreeningResult | null; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    const { data, error } = await supabase
      .from('cv_screening_results')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      throw new Error(error.message);
    }

    return { data: data as CVScreeningResult | null };
  } catch (error) {
    console.error('Error fetching screening result:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get all screening results for a job posting
 */
export async function getScreeningResultsByJob(
  jobId: number
): Promise<{ data: CVScreeningResult[]; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    
    // First get all applications for this job
    const { data: applications, error: appError } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId);

    if (appError) {
      throw new Error(appError.message);
    }

    if (!applications || applications.length === 0) {
      return { data: [] };
    }

    const applicationIds = applications.map((app) => app.id);

    // Get screening results for these applications
    const { data, error } = await supabase
      .from('cv_screening_results')
      .select('*')
      .in('application_id', applicationIds)
      .order('overall_score', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { data: (data as CVScreeningResult[]) || [] };
  } catch (error) {
    console.error('Error fetching screening results:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Simple keyword-based screening (fallback if AI fails)
 */
export function simpleKeywordScreening(
  cvText: string,
  requiredSkills: string[],
  preferredSkills: string[]
): {
  matchedRequired: string[];
  matchedPreferred: string[];
  requiredMatchPercentage: number;
  preferredMatchPercentage: number;
} {
  const cvLower = cvText.toLowerCase();

  const matchedRequired = requiredSkills.filter((skill) =>
    cvLower.includes(skill.toLowerCase())
  );

  const matchedPreferred = preferredSkills.filter((skill) =>
    cvLower.includes(skill.toLowerCase())
  );

  return {
    matchedRequired,
    matchedPreferred,
    requiredMatchPercentage: (matchedRequired.length / requiredSkills.length) * 100,
    preferredMatchPercentage:
      preferredSkills.length > 0
        ? (matchedPreferred.length / preferredSkills.length) * 100
        : 0,
  };
}
