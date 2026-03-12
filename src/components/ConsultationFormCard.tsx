import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, X } from "lucide-react";
import { submitConsultationRequest } from "../services/airtableService";

type ToastType = "success" | "error";

interface ToastData {
  message: string;
  type: ToastType;
}

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface FormSelectProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

interface ConsultationFormCardProps {
  className?: string;
  title?: string;
  submitLabel?: string;
  defaultSector?: string;
  disableSectorSelection?: boolean;
  onClose?: () => void; // Optional close handler
  showCloseButton?: boolean; // Show/hide close button
}

const sectorOptions = [
  { value: "experience-4.0", label: "Experience 4.0" },
  { value: "agility-4.0", label: "Agility 4.0" },
  { value: "farming-4.0", label: "Farming 4.0" },
  { value: "plant-4.0", label: "Plant 4.0" },
  { value: "infrastructure-4.0", label: "Infrastructure 4.0" },
  { value: "government-4.0", label: "Government 4.0" },
  { value: "hospitality-4.0", label: "Hospitality 4.0" },
  { value: "retail-4.0", label: "Retail 4.0" },
  { value: "service-4.0", label: "Service 4.0" },
  { value: "logistics-4.0", label: "Logistics 4.0" },
  { value: "wellness-4.0", label: "Wellness 4.0" },
];

const getSectorDisplayName = (sectorValue: string): string => {
  const sector = sectorOptions.find(option => option.value === sectorValue);
  return sector ? sector.label : sectorValue;
};

const interestOptions = [
  { value: "general-enquiries", label: "General Enquiries" },
  { value: "business-development", label: "Business Development" },
  { value: "products-and-services", label: "Products and Services" },
  { value: "events-webinars-press", label: "Events, Webinars and Press" },
  { value: "corporate-training", label: "Corporate Training" },
  { value: "request-demo", label: "Request Demo" },
];

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none bg-white"
      value={value}
      onChange={onChange}
      required={required}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2rem'
      }}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={4}
    />
  </div>
);

const Toast: React.FC<ToastData & { onClose: () => void }> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`rounded-lg shadow-lg p-4 flex items-start ${
          type === "success"
            ? "bg-green-50 border-l-4 border-green-500"
            : "bg-red-50 border-l-4 border-red-500"
        }`}
      >
        <div
          className={`flex-shrink-0 mr-3 ${
            type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {type === "success" ? <CheckCircle size={20} /> : <X size={20} />}
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export const ConsultationFormCard: React.FC<ConsultationFormCardProps> = ({
  className = "",
  title = "Schedule a free consultation!",
  submitLabel = "Submit Request",
  defaultSector = "",
  disableSectorSelection = false,
  onClose,
  showCloseButton = true,
}) => {
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [businessDetails, setBusinessDetails] = useState({
    companyName: "",
    phoneNumber: "",
    sector: defaultSector,
    interest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [phoneError, setPhoneError] = useState<string>("");

  // Phone number validation function
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) return true; // Optional field, empty is valid
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it contains only digits (after removing formatting)
    // Minimum 7 digits, maximum 15 digits (international standard)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPhoneError("Phone number must be between 7 and 15 digits");
      return false;
    }
    
    // Check if original input contains any letters
    if (/[a-zA-Z]/.test(phone)) {
      setPhoneError("Phone number cannot contain letters");
      return false;
    }
    
    setPhoneError("");
    return true;
  };

  // Set the sector when disableSectorSelection is true and defaultSector is provided
  useEffect(() => {
    if (disableSectorSelection && defaultSector && businessDetails.sector !== defaultSector) {
      setBusinessDetails(prev => ({
        ...prev,
        sector: defaultSector
      }));
    }
  }, [disableSectorSelection, defaultSector, businessDetails.sector]);

  const handleClose = () => {
    if (onClose) {
      // If there's unsaved data, confirm before closing
      const hasData = 
        contactFormData.name || 
        contactFormData.email || 
        contactFormData.message ||
        businessDetails.companyName ||
        businessDetails.phoneNumber ||
        businessDetails.interest;

      if (hasData && !isSuccess) {
        const confirmClose = window.confirm(
          'You have unsaved changes. Are you sure you want to close the form?'
        );
        if (!confirmClose) return;
      }

      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setContactFormData({ name: "", email: "", message: "" });
    setBusinessDetails({
      companyName: "",
      phoneNumber: "",
      sector: defaultSector,
      interest: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate phone number before submission
    if (businessDetails.phoneNumber && !validatePhoneNumber(businessDetails.phoneNumber)) {
      setIsSubmitting(false);
      setSubmitError("Please enter a valid phone number with digits only.");
      return;
    }

    try {
      // Submit to Airtable (primary data storage)
      await submitConsultationRequest({
        name: contactFormData.name,
        email: contactFormData.email,
        company: businessDetails.companyName || '',
        phone: businessDetails.phoneNumber || '',
        sector: businessDetails.sector || '',
        interest: businessDetails.interest || '',
        message: contactFormData.message,
      });
      
      console.log('✅ Consultation request saved to Airtable successfully');

      // Also send email notification via FormSubmit (backup notification system)
      const formData = new FormData();
      formData.append('Name', contactFormData.name);
      formData.append('Email Address', contactFormData.email);
      formData.append('Company Name', businessDetails.companyName || 'Not provided');
      formData.append('Phone Number', businessDetails.phoneNumber || 'Not provided');
      formData.append('Sector Interest', businessDetails.sector || 'Not provided');
      formData.append('General Interest', businessDetails.interest || 'Not provided');
      formData.append('Message', contactFormData.message);
      formData.append('_subject', '🚀 New Consultation Request - DigitalQatalyst');
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('_next', 'https://digitalqatalyst.com/thank-you');
      formData.append('_cc', 'leads@digitalqatalyst.com');
      
      // Send email notification (runs in background, don't wait for it)
      fetch("https://formsubmit.co/info@digitalqatalyst.com", {
        method: "POST",
        body: formData,
        mode: 'no-cors'
      }).then(() => {
        console.log('📧 Email notification sent via FormSubmit');
      }).catch(error => {
        console.log('⚠️ Email notification failed (non-critical):', error);
      });

      setIsSuccess(true);
      setToast({
        message: "Thank you! Your consultation request has been recorded and we'll respond within 24 hours.",
        type: "success",
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('❌ Error submitting consultation form:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again or contact us directly at info@digitalqatalyst.com"
      );
      setToast({
        message: "Failed to send request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-white text-gray-900 rounded-2xl p-8 shadow-2xl relative ${className}`}
    >
      {/* Close Button */}
      {showCloseButton && onClose && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close form"
          title="Close form"
        >
          <X size={20} />
        </button>
      )}

      <h3 className="text-2xl font-bold mb-6 pr-10">{title}</h3>
      <form onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Thank you!
            </h4>
            <p className="text-gray-600">Your consultation request has been recorded and we'll be in touch soon to schedule your consultation!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Your Name"
                placeholder="John Doe"
                value={contactFormData.name}
                onChange={(e) =>
                  setContactFormData({
                    ...contactFormData,
                    name: e.target.value,
                  })
                }
                required
              />
              <FormInput
                label="Email Address"
                type="email"
                placeholder="john@company.com"
                value={contactFormData.email}
                onChange={(e) =>
                  setContactFormData({
                    ...contactFormData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Company Name"
                placeholder="Your Company"
                value={businessDetails.companyName}
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    companyName: e.target.value,
                  })
                }
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                    phoneError
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="+971 XX XXX XXXX"
                  value={businessDetails.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBusinessDetails({
                      ...businessDetails,
                      phoneNumber: value,
                    });
                    // Validate in real-time as user types
                    if (value.trim()) {
                      validatePhoneNumber(value);
                    } else {
                      setPhoneError(""); // Clear error if field is empty
                    }
                  }}
                  onBlur={(e) => {
                    // Also validate on blur for good measure
                    if (e.target.value.trim()) {
                      validatePhoneNumber(e.target.value);
                    }
                  }}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {disableSectorSelection && defaultSector ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Which sector are you interested?
                  </label>
                  <input
                    type="text"
                    value={getSectorDisplayName(defaultSector)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              ) : (
                <FormSelect
                  label="Which sector are you interested?"
                  options={sectorOptions}
                  value={businessDetails.sector}
                  onChange={(e) =>
                    setBusinessDetails({
                      ...businessDetails,
                      sector: e.target.value,
                    })
                  }
                />
              )}
              <FormSelect
                label="What are you interested in?"
                options={interestOptions}
                value={businessDetails.interest}
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    interest: e.target.value,
                  })
                }
              />
            </div>

            <FormTextarea
              label="Kindly provide enough information about your organization and needs..."
              placeholder="Tell us about your digital transformation needs..."
              value={contactFormData.message}
              onChange={(e) =>
                setContactFormData({
                  ...contactFormData,
                  message: e.target.value,
                })
              }
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3.5 mt-2 font-bold text-sm rounded-lg shadow-lg bg-primary hover:bg-primary-600 text-white transition-all duration-300 flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  {submitLabel}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </>
        )}
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConsultationFormCard;
