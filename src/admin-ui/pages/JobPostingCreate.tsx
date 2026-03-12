import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { createJobPosting } from "../../services/jobPostingService";
import type { JobPostingInput } from "../../services/jobPostingService";
import { useToast } from "../../components/ui/Toast";
import {
  Plus,
  X,
  Save,
  Eye,
  Calendar,
  MapPin,
  Briefcase,
  User,
  CheckCircle,
} from "lucide-react";

export default function JobPostingCreate() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<JobPostingInput>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    level: "Mid-Level",
    description: "",
    requirements: [""],
    responsibilities: [""],
    skills: {
      core: [""],
      behavioral: [""],
    },
    openPositions: 1,
    postedDate: new Date().toISOString().split('T')[0],
    status: "draft",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentOptions = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Legal",
    "Executive",
    "Other",
  ];

  const locationOptions = [
    "Nairobi",
    "Abu Dhabi, UAE",
    "Dubai, UAE",
    "Remote",
    "Nairobi / Remote",
    "Abu Dhabi / Remote",
    "Dubai / Remote",
    "Hybrid",
  ];

  const typeOptions = ["Full-time", "Part-time", "Contract", "Internship"];

  const levelOptions = ["Entry-Level", "Mid-Level", "Senior-Level", "Executive"];

  const statusOptions = ["draft", "open", "closed", "filled"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }

    if (formData.requirements.some(req => !req.trim())) {
      newErrors.requirements = "All requirements must be filled or removed";
    }

    if (formData.responsibilities.some(resp => !resp.trim())) {
      newErrors.responsibilities = "All responsibilities must be filled or removed";
    }
    
    // Validate skills if they exist
    if (formData.skills?.core && formData.skills.core.some(skill => skill && !skill.trim())) {
      newErrors.skills = "All core skills must be filled or removed";
    }
    
    if (formData.skills?.behavioral && formData.skills.behavioral.some(skill => skill && !skill.trim())) {
      newErrors.skills = "All behavioral skills must be filled or removed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'open') => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await createJobPosting({
        ...formData,
        status,
      });

      if (result.success) {
        showToast(`Job posting ${status === 'open' ? 'published' : 'saved as draft'} successfully!`, 'success');
        setTimeout(() => {
          navigate('/admin-ui/job-postings');
        }, 1500);
      } else {
        if (result.error && result.error.includes('job_postings table')) {
          setError(result.error);
          showToast('Database table not found. Please run the migration script first.', 'error');
        } else {
          setError(result.error || 'Failed to create job posting');
          showToast(result.error || 'Failed to create job posting', 'error');
        }
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      if (errorMessage.includes('job_postings table')) {
        setError(errorMessage);
        showToast('Database table not found. Please run the migration script first.', 'error');
      } else {
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof JobPostingInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req),
    }));
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index: number) => {
    if (formData.responsibilities.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) => i === index ? value : resp),
    }));
  };

  const addSkill = (type: 'core' | 'behavioral') => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...(prev.skills || { core: [], behavioral: [] }),
        [type]: [...((prev.skills && prev.skills[type]) || []), ""],
      }
    }));
  };

  const removeSkill = (type: 'core' | 'behavioral', index: number) => {
    setFormData(prev => {
      const currentSkills = (prev.skills && prev.skills[type]) || [];
      if (currentSkills.length <= 1) return prev;
      
      return {
        ...prev,
        skills: {
          ...(prev.skills || { core: [], behavioral: [] }),
          [type]: currentSkills.filter((_, i) => i !== index),
        }
      };
    });
  };

  const updateSkill = (type: 'core' | 'behavioral', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...(prev.skills || { core: [], behavioral: [] }),
        [type]: ((prev.skills && prev.skills[type]) || []).map((skill, i) => i === index ? value : skill),
      }
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No closing date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppLayout title="Create Job Posting">
      <div className="space-y-6">
        {error && error.includes('job_postings table') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Database Setup Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>To use this form, you need to run the database migration:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to your Supabase Dashboard</li>
                    <li>Navigate to the SQL Editor</li>
                    <li>Copy and run the contents of <code className="bg-yellow-100 px-1 rounded">migrations/create_job_postings_table.sql</code></li>
                    <li>Refresh this page after running the migration</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create New Position</h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details for your new job posting
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} />
              {isPreview ? "Edit" : "Preview"}
            </button>
            
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              Save Draft
            </button>
            
            <button
              onClick={() => handleSubmit('open')}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>

        {isPreview ? (
          // Preview Mode
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {formData.title || "Job Title"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                      <Briefcase size={12} />
                      {formData.department || "Department"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                      <User size={12} />
                      {formData.level || "Level"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      <MapPin size={12} />
                      {formData.location || "Location"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      {formData.type || "Type"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Status: <span className="font-medium capitalize">{formData.status}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {formData.description || "Job description will appear here..."}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {formData.requirements.filter(req => req.trim()).map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Responsibilities</h3>
                <ul className="space-y-2">
                  {formData.responsibilities.filter(resp => resp.trim()).map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.department ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select department</option>
                        {departmentOptions.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select location</option>
                        {locationOptions.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {typeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {levelOptions.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  

                </div>
              </div>
              
              {/* Job Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description *</h3>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed description of the role, including key responsibilities, team structure, and what makes this position exciting..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              {/* Requirements */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Requirements *</h3>
                  <button
                    onClick={addRequirement}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Requirement
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => updateRequirement(index, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.requirements ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={`Requirement ${index + 1}`}
                        />
                      </div>
                      {formData.requirements.length > 1 && (
                        <button
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.requirements && <p className="text-red-500 text-xs mt-2">{errors.requirements}</p>}
              </div>
              
              {/* Responsibilities */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Responsibilities *</h3>
                  <button
                    onClick={addResponsibility}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Responsibility
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => updateResponsibility(index, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.responsibilities ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={`Responsibility ${index + 1}`}
                        />
                      </div>
                      {formData.responsibilities.length > 1 && (
                        <button
                          onClick={() => removeResponsibility(index)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.responsibilities && <p className="text-red-500 text-xs mt-2">{errors.responsibilities}</p>}
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Competencies</h3>
              
              {/* Core Skills */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Core Skills</h4>
                  <button
                    onClick={() => addSkill('core')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Core Skill
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.skills?.core || []).map((skill, index) => (
                    <div key={`core-${index}`} className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={skill || ''}
                          onChange={(e) => updateSkill('core', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder={`Core skill ${index + 1}`}
                        />
                      </div>
                      {(formData.skills?.core?.length || 0) > 1 && (
                        <button
                          onClick={() => removeSkill('core', index)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Behavioral Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Behavioral Skills</h4>
                  <button
                    onClick={() => addSkill('behavioral')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Behavioral Skill
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.skills?.behavioral || []).map((skill, index) => (
                    <div key={`behavioral-${index}`} className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={skill || ''}
                          onChange={(e) => updateSkill('behavioral', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder={`Behavioral skill ${index + 1}`}
                        />
                      </div>
                      {(formData.skills?.behavioral?.length || 0) > 1 && (
                        <button
                          onClick={() => removeSkill('behavioral', index)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Open Positions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Open Positions
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.openPositions || 1}
                  onChange={(e) => handleInputChange('openPositions', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
                
                <div className="space-y-4">
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleSubmit('draft')}
                      disabled={isSubmitting}
                      className="w-full mb-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save as Draft
                    </button>
                    
                    <button
                      onClick={() => handleSubmit('open')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Publish Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Help */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Success</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Use clear, concise language in your job title</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Include specific requirements and qualifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Highlight what makes your company unique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Set a realistic closing date for applications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </AppLayout>
  );
}