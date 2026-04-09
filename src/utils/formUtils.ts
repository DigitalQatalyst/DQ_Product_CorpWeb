/**
 * Common form utilities to reduce duplication across form components
 */

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

export interface FormState {
  [key: string]: string;
}

export interface FormErrors {
  [key: string]: string;
}

/**
 * Common form field configurations
 */
export const COMMON_FORM_FIELDS = {
  name: {
    name: 'name',
    label: 'Full Name',
    type: 'text' as const,
    placeholder: 'Enter your full name',
    required: true,
    validation: {
      minLength: 2,
      message: 'Name must be at least 2 characters'
    }
  },
  
  email: {
    name: 'email',
    label: 'Email Address',
    type: 'email' as const,
    placeholder: 'Enter your email address',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  
  phone: {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel' as const,
    placeholder: '+971 XX XXX XXXX',
    required: false,
    validation: {
      pattern: /^[\+]?[0-9\s\-\(\)]{7,15}$/,
      message: 'Please enter a valid phone number'
    }
  },
  
  company: {
    name: 'company',
    label: 'Company Name',
    type: 'text' as const,
    placeholder: 'Enter your company name',
    required: false
  },
  
  message: {
    name: 'message',
    label: 'Message',
    type: 'textarea' as const,
    placeholder: 'Tell us about your requirements...',
    required: true,
    validation: {
      minLength: 10,
      message: 'Message must be at least 10 characters'
    }
  }
};

/**
 * Common select field options
 */
export const COMMON_SELECT_OPTIONS = {
  sectors: [
    { value: "experience-4-0", label: "Experience 4.0" },
    { value: "agility-4-0", label: "Agility 4.0" },
    { value: "farming-4-0", label: "Farming 4.0" },
    { value: "plant-4-0", label: "Plant 4.0" },
    { value: "infrastructure-4-0", label: "Infrastructure 4.0" },
    { value: "government-4-0", label: "Government 4.0" },
    { value: "hospitality-4-0", label: "Hospitality 4.0" },
    { value: "retail-4-0", label: "Retail 4.0" },
    { value: "service-4-0", label: "Services 4.0" },
    { value: "logistics-4-0", label: "Logistics 4.0" },
    { value: "wellness-4-0", label: "Wellness 4.0" }
  ],
  
  interests: [
    { value: "general-enquiries", label: "General Enquiries" },
    { value: "business-development", label: "Business Development" },
    { value: "products-and-services", label: "Products and Services" },
    { value: "events-webinars-press", label: "Events, Webinars and Press" },
    { value: "corporate-training", label: "Corporate Training" },
    { value: "request-demo", label: "Request Demo" }
  ],
  
  companySizes: [
    { value: "startup", label: "Startup (1-10 employees)" },
    { value: "small", label: "Small (11-50 employees)" },
    { value: "medium", label: "Medium (51-200 employees)" },
    { value: "large", label: "Large (201-1000 employees)" },
    { value: "enterprise", label: "Enterprise (1000+ employees)" }
  ],
  
  budgets: [
    { value: "under-10k", label: "Under $10,000" },
    { value: "10k-50k", label: "$10,000 - $50,000" },
    { value: "50k-100k", label: "$50,000 - $100,000" },
    { value: "100k-500k", label: "$100,000 - $500,000" },
    { value: "over-500k", label: "Over $500,000" }
  ],
  
  timelines: [
    { value: "immediate", label: "Immediate (Within 1 month)" },
    { value: "short-term", label: "Short-term (1-3 months)" },
    { value: "medium-term", label: "Medium-term (3-6 months)" },
    { value: "long-term", label: "Long-term (6+ months)" }
  ]
};

/**
 * Validate form field
 */
export function validateFormField(field: FormField, value: string): string | null {
  // Check required fields
  if (field.required && (!value || !value.trim())) {
    return `${field.label} is required`;
  }
  
  // Skip validation for empty optional fields
  if (!value || !value.trim()) {
    return null;
  }
  
  // Check validation rules
  if (field.validation) {
    const { pattern, minLength, maxLength, message } = field.validation;
    
    if (minLength && value.length < minLength) {
      return message || `${field.label} must be at least ${minLength} characters`;
    }
    
    if (maxLength && value.length > maxLength) {
      return message || `${field.label} must be no more than ${maxLength} characters`;
    }
    
    if (pattern && !pattern.test(value)) {
      return message || `Please enter a valid ${field.label.toLowerCase()}`;
    }
  }
  
  return null;
}

/**
 * Validate entire form
 */
export function validateForm(fields: FormField[], formData: FormState): FormErrors {
  const errors: FormErrors = {};
  
  fields.forEach(field => {
    const error = validateFormField(field, formData[field.name] || '');
    if (error) {
      errors[field.name] = error;
    }
  });
  
  return errors;
}

/**
 * Check if form has errors
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Create form field with common configuration
 */
export function createFormField(
  name: string,
  label: string,
  type: FormField['type'],
  options?: Partial<FormField>
): FormField {
  return {
    name,
    label,
    type,
    placeholder: options?.placeholder || `Enter ${label.toLowerCase()}`,
    required: options?.required || false,
    options: options?.options,
    validation: options?.validation
  };
}

/**
 * Common form submission states
 */
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export function createInitialSubmissionState(): FormSubmissionState {
  return {
    isSubmitting: false,
    isSubmitted: false,
    error: null
  };
}

export function setSubmittingState(): FormSubmissionState {
  return {
    isSubmitting: true,
    isSubmitted: false,
    error: null
  };
}

export function setSuccessState(): FormSubmissionState {
  return {
    isSubmitting: false,
    isSubmitted: true,
    error: null
  };
}

export function setErrorState(error: string): FormSubmissionState {
  return {
    isSubmitting: false,
    isSubmitted: false,
    error
  };
}