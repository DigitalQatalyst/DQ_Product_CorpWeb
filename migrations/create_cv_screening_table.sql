-- Create CV Screening Results Table
-- This table stores AI-powered screening results for job applications

CREATE TABLE IF NOT EXISTS cv_screening_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES job_applications(id) ON DELETE CASCADE,
  
  -- Scoring (0-100 scale)
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  skills_match_score INTEGER NOT NULL CHECK (skills_match_score >= 0 AND skills_match_score <= 100),
  experience_match_score INTEGER NOT NULL CHECK (experience_match_score >= 0 AND experience_match_score <= 100),
  education_match_score INTEGER NOT NULL CHECK (education_match_score >= 0 AND education_match_score <= 100),
  
  -- Extracted Information
  extracted_skills TEXT[] DEFAULT '{}',
  extracted_experience TEXT[] DEFAULT '{}',
  extracted_education TEXT[] DEFAULT '{}',
  
  -- Assessment
  key_highlights TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  recommendation TEXT NOT NULL CHECK (recommendation IN ('strong_match', 'good_match', 'potential_match', 'weak_match', 'no_match')),
  screening_summary TEXT NOT NULL,
  
  -- Metadata
  screened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  screened_by UUID REFERENCES admin_users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cv_screening_application_id ON cv_screening_results(application_id);
CREATE INDEX IF NOT EXISTS idx_cv_screening_overall_score ON cv_screening_results(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_cv_screening_recommendation ON cv_screening_results(recommendation);
CREATE INDEX IF NOT EXISTS idx_cv_screening_screened_at ON cv_screening_results(screened_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cv_screening_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cv_screening_updated_at
  BEFORE UPDATE ON cv_screening_results
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_screening_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE cv_screening_results ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admins can view screening results
CREATE POLICY "Admins can view all screening results"
  ON cv_screening_results
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated admins can insert screening results
CREATE POLICY "Admins can insert screening results"
  ON cv_screening_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated admins can update screening results
CREATE POLICY "Admins can update screening results"
  ON cv_screening_results
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create view for screening analytics
CREATE OR REPLACE VIEW v_screening_analytics AS
SELECT 
  recommendation,
  COUNT(*) as count,
  ROUND(AVG(overall_score), 2) as avg_overall_score,
  ROUND(AVG(skills_match_score), 2) as avg_skills_score,
  ROUND(AVG(experience_match_score), 2) as avg_experience_score,
  ROUND(AVG(education_match_score), 2) as avg_education_score
FROM cv_screening_results
GROUP BY recommendation
ORDER BY 
  CASE recommendation
    WHEN 'strong_match' THEN 1
    WHEN 'good_match' THEN 2
    WHEN 'potential_match' THEN 3
    WHEN 'weak_match' THEN 4
    WHEN 'no_match' THEN 5
  END;

-- Create view for applications with screening results
CREATE OR REPLACE VIEW v_applications_with_screening AS
SELECT 
  ja.*,
  csr.overall_score,
  csr.skills_match_score,
  csr.experience_match_score,
  csr.education_match_score,
  csr.recommendation,
  csr.screening_summary,
  csr.key_highlights,
  csr.red_flags,
  csr.screened_at
FROM job_applications ja
LEFT JOIN cv_screening_results csr ON ja.id = csr.application_id
ORDER BY csr.overall_score DESC NULLS LAST, ja.applied_at DESC;

-- Grant permissions
GRANT SELECT ON v_screening_analytics TO authenticated;
GRANT SELECT ON v_applications_with_screening TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE cv_screening_results IS 'Stores AI-powered CV screening results for job applications';
COMMENT ON COLUMN cv_screening_results.overall_score IS 'Overall candidate match score (0-100)';
COMMENT ON COLUMN cv_screening_results.skills_match_score IS 'Skills alignment score (0-100)';
COMMENT ON COLUMN cv_screening_results.experience_match_score IS 'Experience relevance score (0-100)';
COMMENT ON COLUMN cv_screening_results.education_match_score IS 'Education match score (0-100)';
COMMENT ON COLUMN cv_screening_results.recommendation IS 'AI recommendation: strong_match, good_match, potential_match, weak_match, no_match';
COMMENT ON VIEW v_screening_analytics IS 'Analytics view showing screening results distribution and average scores';
COMMENT ON VIEW v_applications_with_screening IS 'Combined view of applications with their screening results';
