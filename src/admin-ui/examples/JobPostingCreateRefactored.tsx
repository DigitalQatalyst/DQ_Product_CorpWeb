import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { createJobPosting } from "../../services/jobPostingService";
import type { JobPostingInput } from "../../services/jobPostingService";
import { useFormManagement } from "../hooks/useFormManagement";
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

// Validation rules
const validationRules = {
  title: (value: string) => !value.trim() ? "Job title is required" : null,
  department: (value: string) => !value ? "Department is required" : null,
  location: (value: string) => !value.trim() ? "Location is required" : null,
  description: (value: string) => !value.trim() ? "Job description is required" : null,
  requirements: (value: string[]) => value.some(req => !req.trim()) ? "All requirements must be filled" : null,
  responsibilities: (value: string[]) => value.some(resp => !resp.trim()) ? "All responsibilities must be filled" : null,
  'skills.core': (value: string[]) => value.some(skill => skill && !skill.trim()) ? "All core skills must be filled" : null,
  'skills.behavioral': (value: string[]) => value.some(skill => skill && !skill.trim()) ? "All behavioral skills must be filled" : null,
};

export default function JobPostingCreateRefactored() {
  const navigate = useNavigate();
  
  const {
    formData,
    errors,
    isSubmitting,
    isPreview,
    handleInputChange,
    handleSubmit,
    togglePreview,
    setFormData
  } = useFormManagement<JobPostingInput>({
    initialValues: {
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
    },
    validationRules,
    onSubmit: createJobPosting,
    successMessage: "Job posting created successfully!",
    errorMessage: "Failed to create job posting"
  });

  // Array manipulation helpers (these could also be part of the hook)
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

  // ... rest of the component JSX would follow the same pattern
  // but with much less boilerplate code

  return (
    <AppLayout title="Create Job Posting">
      <div className="space-y-6">
        {/* Your existing JSX here, but with much cleaner form logic */}
        {/* All the form state management is handled by the hook */}
      </div>
    </AppLayout>
  );
}