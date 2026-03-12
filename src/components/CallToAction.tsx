import React, { useEffect, useState } from "react";
import { CheckCircle, X, ArrowRight } from "lucide-react";
import { FadeInUpOnScroll, useInView } from "./AnimationUtils";
import { submitConsultationRequest } from "../services/airtableService";

// Form input component
const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
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
};

// Form select component
const FormSelect = ({ label, options, value, onChange, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none bg-white"
        value={value}
        onChange={onChange}
        required={required}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
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
};

// Form textarea component
const FormTextarea = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
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
      ></textarea>
    </div>
  );
};

// Toast notification component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
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

interface ToastData {
  message: string;
  type: "success" | "error" | "info";
}

const CallToAction: React.FC = () => {
  const [ref] = useInView({
    threshold: 0.2,
  });
  const [toast, setToast] = useState<ToastData | null>(null);

  // Form states
  const [partnerFormData, setPartnerFormData] = useState({
    name: "",
    email: "",
    serviceCategory: "",
    message: "",
  });
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactFormSuccess, setContactFormSuccess] = useState(false);
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

  // Form submission states
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitError, setContactSubmitError] = useState<string | null>(
    null,
  );

  // Handle form submissions

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactSubmitError(null);

    // Validate phone number before submission
    if (partnerFormData.email && !validatePhoneNumber(partnerFormData.email)) {
      setIsSubmittingContact(false);
      setContactSubmitError("Please enter a valid phone number with digits only.");
      return;
    }

    try {
      // Submit to Airtable (primary data storage)
      await submitConsultationRequest({
        name: contactFormData.name,
        email: contactFormData.email,
        company: partnerFormData.name || "",
        phone: partnerFormData.email || "",
        sector: partnerFormData.serviceCategory || "",
        interest: partnerFormData.message || "",
        message: contactFormData.message,
      });

      console.log("✅ Consultation request saved to Airtable successfully");

      // Also send email notification via FormSubmit (backup notification system)
      const formData = new FormData();
      formData.append("Name", contactFormData.name);
      formData.append("Email Address", contactFormData.email);
      formData.append("Company Name", partnerFormData.name || "Not provided");
      formData.append("Phone Number", partnerFormData.email || "Not provided");
      formData.append(
        "Sector Interest",
        partnerFormData.serviceCategory || "Not provided",
      );
      formData.append(
        "General Interest",
        partnerFormData.message || "Not provided",
      );
      formData.append("Message", contactFormData.message);
      formData.append(
        "_subject",
        "🚀 New Consultation Request - DigitalQatalyst",
      );
      formData.append("_captcha", "false");
      formData.append("_template", "table");
      formData.append("_next", "https://digitalqatalyst.com/thank-you");
      formData.append("_cc", "leads@digitalqatalyst.com");

      // Send email notification (runs in background, don't wait for it)
      fetch("https://formsubmit.co/info@digitalqatalyst.com", {
        method: "POST",
        body: formData,
        mode: "no-cors",
      })
        .then(() => {
          console.log("📧 Email notification sent via FormSubmit");
        })
        .catch((error) => {
          console.log("⚠️ Email notification failed (non-critical):", error);
        });

      setContactFormSuccess(true);
      setToast({
        message:
          "Thank you! Your consultation request has been recorded and we'll respond within 24 hours.",
        type: "success",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setContactFormSuccess(false);
        setContactFormData({
          name: "",
          email: "",
          message: "",
        });
        setPartnerFormData({
          name: "",
          email: "",
          serviceCategory: "",
          message: "",
        });
      }, 3000);
    } catch (error) {
      console.error("❌ Error submitting consultation form:", error);
      setContactSubmitError(
        error instanceof Error
          ? error.message
          : "Network error. Please try again or contact us directly at info@digitalqatalyst.com",
      );
      setToast({
        message: "Failed to send request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div
      id="consultation"
      ref={ref}
      className="bg-secondary-900 py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/Form_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-secondary-900/75"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <FadeInUpOnScroll>
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Your Path to Digital Excellence Starts Here
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-2xl">
                At DQ, we partner with you to unlock innovative solutions that transform your business. Our approach blends cutting-edge technology with practical expertise, ensuring your digital journey is efficient, impactful, and future-ready.
              </p>

              {/* Benefits List */}
              <ul className="space-y-4">
                <li className="flex items-center text-white">
                  <CheckCircle
                    size={24}
                    className="text-white mr-3 flex-shrink-0"
                  />
                  <span className="text-lg"><strong>Unlock Efficiency:</strong> Streamline your operations and maximize productivity.</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle
                    size={24}
                    className="text-white mr-3 flex-shrink-0"
                  />
                  <span className="text-lg"><strong>Drive Innovation:</strong> Leverage the latest technology to stay ahead of the competition.</span>
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle
                    size={24}
                    className="text-white mr-3 flex-shrink-0"
                  />
                  <span className="text-lg"><strong>Achieve Sustainable Growth:</strong> Build long-term success with scalable digital strategies.</span>
                </li>
              </ul>
            </div>
          </FadeInUpOnScroll>

          {/* Right Form */}
          <FadeInUpOnScroll delay={0.2}>
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Claim Your Free Consultation Today
              </h3>

              <form onSubmit={handleContactSubmit}>
                {contactSubmitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{contactSubmitError}</p>
                  </div>
                )}

                {contactFormSuccess ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Thank you!
                    </h4>
                    <p className="text-gray-600">
                      Your consultation request has been recorded and we'll be
                      in touch soon!
                    </p>
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
                        value={partnerFormData.name}
                        onChange={(e) =>
                          setPartnerFormData({
                            ...partnerFormData,
                            name: e.target.value,
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
                          value={partnerFormData.email}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPartnerFormData({
                              ...partnerFormData,
                              email: value,
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
                      <FormSelect
                        label="Which sector are you interested in?"
                        options={[
                          { value: "experience-4.0", label: "Experience 4.0" },
                          { value: "agility-4.0", label: "Agility 4.0" },
                          { value: "farming-4.0", label: "Farming 4.0" },
                          { value: "plant-4.0", label: "Plant 4.0" },
                          {
                            value: "infrastructure-4.0",
                            label: "Infrastructure 4.0",
                          },
                          { value: "government-4.0", label: "Government 4.0" },
                          {
                            value: "hospitality-4.0",
                            label: "Hospitality 4.0",
                          },
                          { value: "retail-4.0", label: "Retail 4.0" },
                          { value: "service-4.0", label: "Service 4.0" },
                          { value: "logistics-4.0", label: "Logistics 4.0" },
                          { value: "wellness-4.0", label: "Wellness 4.0" },
                        ]}
                        value={partnerFormData.serviceCategory}
                        onChange={(e) =>
                          setPartnerFormData({
                            ...partnerFormData,
                            serviceCategory: e.target.value,
                          })
                        }
                      />
                      <FormSelect
                        label="What are you interested in?"
                        options={[
                          {
                            value: "general-enquiries",
                            label: "General Enquiries",
                          },
                          {
                            value: "business-development",
                            label: "Business Development",
                          },
                          {
                            value: "products-and-services",
                            label: "Products and Services",
                          },
                          {
                            value: "events-webinars-press",
                            label: "Events, Webinars and Press",
                          },
                          {
                            value: "corporate-training",
                            label: "Corporate Training",
                          },
                          { value: "request-demo", label: "Request Demo" },
                        ]}
                        value={partnerFormData.message}
                        onChange={(e) =>
                          setPartnerFormData({
                            ...partnerFormData,
                            message: e.target.value,
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
                      disabled={isSubmittingContact}
                      className={`w-full px-6 py-3.5 mt-2 font-bold text-sm rounded-lg shadow-lg bg-primary hover:bg-primary-600 text-white transition-all duration-300 flex items-center justify-center ${
                        isSubmittingContact
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isSubmittingContact ? (
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Book Your Free Consultation Today
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </FadeInUpOnScroll>
        </div>
      </div>
      {/* Toast notification */}
      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-30px) translateX(20px) rotate(5deg);
            opacity: 0.6;
          }
          66% {
            transform: translateY(20px) translateX(-15px) rotate(-3deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
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

export default CallToAction;
