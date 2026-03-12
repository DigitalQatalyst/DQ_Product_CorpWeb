/**
 * Filter Configuration for Blog Creation Form
 * Defines all available filter options for marketplace categorization
 */

export const DIGITAL_PERSPECTIVES = [
  { id: 'd1', label: 'D1 - Digital Economy 4.0 (E4.0)', value: 'D1' },
  { id: 'd2', label: 'D2 - Digital Cognitive Organisation (DCO)', value: 'D2' },
  { id: 'd3', label: 'D3 - Digital Business Platform (DBP)', value: 'D3' },
  { id: 'd4', label: 'D4 - Digital Transformation 2.0 (DT2.0)', value: 'D4' },
  { id: 'd5', label: 'D5 - Digital Worker & Digital Workspace', value: 'D5' },
  { id: 'd6', label: 'D6 - Digital Accelerators (Tools)', value: 'D6' },
] as const;

export const DIGITAL_STREAMS = [
  { id: 'frontend', label: 'Digital Front-End', value: 'Digital Front-End' },
  { id: 'core', label: 'Digital Core', value: 'Digital Core' },
  { id: 'enablers', label: 'Digital Enablers', value: 'Digital Enablers' },
] as const;

// Domains grouped by stream - shown conditionally based on selected stream
export const DIGITAL_DOMAINS_BY_STREAM = {
  'Digital Front-End': [
    { id: 'channels', label: 'Digital Channels', value: 'Digital Channels' },
    { id: 'experience', label: 'Digital Experience', value: 'Digital Experience' },
    { id: 'services', label: 'Digital Services', value: 'Digital Services' },
    { id: 'marketing', label: 'Digital Marketing', value: 'Digital Marketing' },
  ],
  'Digital Core': [
    { id: 'workspace', label: 'Digital Workspace', value: 'Digital Workspace' },
    { id: 'core-systems', label: 'Digital Core', value: 'Digital Core' },
    { id: 'gprc', label: 'Digital GPRC', value: 'Digital GPRC' },
    { id: 'backoffice', label: 'Digital Back-Office', value: 'Digital Back-Office' },
  ],
  'Digital Enablers': [
    { id: 'interops', label: 'Digital InterOps', value: 'Digital InterOps' },
    { id: 'security', label: 'Digital Security', value: 'Digital Security' },
    { id: 'intelligence', label: 'Digital Intelligence', value: 'Digital Intelligence' },
    { id: 'it', label: 'Digital IT', value: 'Digital IT' },
  ],
} as const;

export const DIGITAL_SECTORS = [
  { id: 'experience40', label: 'Cross-Sector Domain (Experience4.0)', value: 'Cross-Sector Domain (Experience4.0)' },
  { id: 'agility40', label: 'Cross-Sector Domain (Agility4.0)', value: 'Cross-Sector Domain (Agility4.0)' },
  { id: 'farming40', label: 'Primary Sector (Farming4.0)', value: 'Primary Sector (Farming4.0)' },
  { id: 'plant40', label: 'Secondary Sector (Plant4.0)', value: 'Secondary Sector (Plant4.0)' },
  { id: 'infrastructure40', label: 'Secondary Sector (Infrastructure4.0)', value: 'Secondary Sector (Infrastructure4.0)' },
  { id: 'government40', label: 'Tertiary Sector (Government4.0)', value: 'Tertiary Sector (Government4.0)' },
  { id: 'hospitality40', label: 'Tertiary Sector (Hospitality4.0)', value: 'Tertiary Sector (Hospitality4.0)' },
  { id: 'retail40', label: 'Tertiary Sector (Retail4.0)', value: 'Tertiary Sector (Retail4.0)' },
  { id: 'service40', label: 'Quaternary Sector (Service4.0)', value: 'Quaternary Sector (Service4.0)' },
  { id: 'logistics40', label: 'Quaternary Sector (Logistics4.0)', value: 'Quaternary Sector (Logistics4.0)' },
  { id: 'wellness40', label: 'Quinary Sector (Wellness4.0)', value: 'Quinary Sector (Wellness4.0)' },
] as const;

export const CONTENT_TYPES = [
  { id: 'article', label: 'Articles', value: 'Articles' },
  { id: 'blog', label: 'Blogs', value: 'Blogs' },
  { id: 'whitepaper', label: 'Whitepapers', value: 'Whitepapers' },
  { id: 'report', label: 'Research Reports', value: 'Research Reports' },
  { id: 'case-study', label: 'Case Studies', value: 'Case Studies' },
  { id: 'interview', label: 'Expert Interviews', value: 'Expert Interviews' },
  { id: 'prediction', label: 'Prediction Analysis', value: 'Prediction Analysis' },
  { id: 'video', label: 'Videos', value: 'Videos' },
  { id: 'podcast', label: 'Podcasts', value: 'Podcasts' },
] as const;

export const FORMATS = [
  { id: 'quickreads', label: 'Quick Reads', value: 'Quick Reads' },
  { id: 'indepth', label: 'In-Depth Reports', value: 'In-Depth Reports' },
  { id: 'interactive', label: 'Interactive Tools', value: 'Interactive Tools' },
  { id: 'templates', label: 'Downloadable Templates', value: 'Downloadable Templates' },
  { id: 'recorded', label: 'Recorded Media', value: 'Recorded Media' },
  { id: 'live', label: 'Live Events', value: 'Live Events' },
] as const;

export const POPULARITY_TAGS = [
  { id: 'latest', label: 'Latest', value: 'Latest' },
  { id: 'trending', label: 'Trending', value: 'Trending' },
  { id: 'downloaded', label: 'Most Downloaded', value: 'Most Downloaded' },
  { id: 'editors', label: "Editor's Pick", value: "Editor's Pick" },
] as const;

/**
 * Helper function to get domains available for a selected stream
 */
export const getDomainsForStream = (stream: string): any[] => {
  return DIGITAL_DOMAINS_BY_STREAM[stream as keyof typeof DIGITAL_DOMAINS_BY_STREAM] || [];
};
