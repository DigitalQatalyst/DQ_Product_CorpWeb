import { useState, useCallback } from 'react';
import { useToast } from '../../components/ui/Toast';

interface FormFieldError {
  field: string;
  message: string;
}

interface UseFormManagementProps<T> {
  initialValues: T;
  validationRules?: Record<keyof T, (value: any) => string | null>;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string; data?: any }>;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormManagement<T>({
  initialValues,
  validationRules = {} as Record<keyof T, (value: any) => string | null>,
  onSubmit,
  successMessage = 'Form submitted successfully!',
  errorMessage = 'Failed to submit form'
}: UseFormManagementProps<T>) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Handle field changes
  const handleInputChange = useCallback(<K extends keyof T>(
    field: K,
    value: T[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field as keyof T];
      if (rule) {
        const error = rule(formData[field as keyof T]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  // Handle form submission
  const handleSubmit = useCallback(async (status?: string) => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    try {
      const submitData = status ? { ...formData, status } : formData;
      const result = await onSubmit(submitData as T);
      
      if (result.success) {
        showToast(successMessage, 'success');
        return true;
      } else {
        showToast(result.error || errorMessage, 'error');
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      showToast(errorMsg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData, onSubmit, successMessage, errorMessage, showToast]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setIsPreview(false);
  }, [initialValues]);

  // Toggle preview mode
  const togglePreview = useCallback(() => {
    setIsPreview(prev => !prev);
  }, []);

  return {
    // State
    formData,
    errors,
    isSubmitting,
    isPreview,
    
    // Actions
    handleInputChange,
    handleSubmit,
    resetForm,
    togglePreview,
    validateForm,
    
    // Helpers
    setFormData,
    setErrors
  };
}