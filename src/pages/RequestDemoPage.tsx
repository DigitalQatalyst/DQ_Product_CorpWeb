import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowRight, CheckCircle, Zap, Target, Users } from "lucide-react";
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
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 text-sm"
      />
    </div>
  );
};

// Form select component
const FormSelect = ({ label, options, value, onChange, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 bg-white text-sm appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
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
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-sm"
      />
    </div>
  );
};

const RequestDemoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    jobTitle: "",
    productInterest: "",
    companySize: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit to Airtable
      await submitConsultationRequest({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        sector: formData.productInterest,
        interest: "Request Demo",
        message: `Job Title: ${formData.jobTitle}\nCompany Size: ${formData.companySize}\n\n${formData.message}`,
      });

      // Send email notification
      const emailFormData = new FormData();
      emailFormData.append("Name", formData.name);
      emailFormData.append("Email Address", formData.email);
      emailFormData.append("Company Name", formData.company);
      emailFormData.append("Phone Number", formData.phone);
      emailFormData.append("Job Title", formData.jobTitle);
      emailFormData.append("Product Interest", formData.productInterest);
      emailFormData.append("Company Size", formData.companySize);
      emailFormData.append("Message", formData.message);
      emailFormData.append("_subject", "🎯 New Demo Request - DigitalQatalyst");
      emailFormData.append("_captcha", "false");
      emailFormData.append("_template", "table");
      emailFormData.append("_next", "https://digitalqatalyst.com/thank-you");
      emailFormData.append("_cc", "leads@digitalqatalyst.com");

      fetch("https://formsubmit.co/info@digitalqatalyst.com", {
        method: "POST",
        body: emailFormData,
        mode: "no-cors",
      })
        .then(() => {
          // Email notification sent successfully
        })
        .catch((error) => {
          console.error("Email notification failed:", error);
        });

      setFormSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSuccess(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          jobTitle: "",
          productInterest: "",
          companySize: "",
          message: "",
        });
      }, 3000);
    } catch (error) {
      console.error("❌ Error submitting demo request:", error);
      setSubmitError(
        "Failed to submit request. Please try again or contact us directly at info@digitalqatalyst.com",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Split Screen Layout */}
        <section
          className="min-h-screen relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/Form_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-secondary-900/75"></div>

          <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex items-center justify-center p-8 lg:p-16">
              <div className="text-white max-w-lg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Request a Product Demo
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Experience firsthand how DQ's revolutionary digital platforms
                  can transform your organization and accelerate your digital
                  transformation journey.
                </p>

                {/* Benefits List */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <Zap className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Live Product Walkthrough
                      </h3>
                      <p className="text-white/80">
                        See our products in action with a personalized demo
                        tailored to your needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <Target className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Customized Solutions
                      </h3>
                      <p className="text-white/80">
                        Discover how our products can be configured for your
                        specific industry and use case
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <Users className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Expert Guidance
                      </h3>
                      <p className="text-white/80">
                        Get answers from our product specialists and
                        transformation experts
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <p className="text-white/90 text-sm">
                    <strong className="text-white">What to expect:</strong> Our
                    team will reach out within 24 hours to schedule a convenient
                    time for your personalized demo session.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex items-center justify-center p-8 lg:p-16">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Schedule Your Demo
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Fill out the form below and we'll get back to you shortly
                </p>

                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}

                  {formSuccess ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Thank you!
                      </h4>
                      <p className="text-gray-600">
                        Your demo request has been received. Our team will
                        contact you within 24 hours to schedule your
                        personalized demo session!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          label="Full Name *"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                        <FormInput
                          label="Work Email *"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          label="Company Name *"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          required
                        />
                        <FormInput
                          label="Phone Number *"
                          type="tel"
                          placeholder="+971 XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          label="Job Title"
                          placeholder="e.g., CTO, Digital Manager"
                          value={formData.jobTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jobTitle: e.target.value,
                            })
                          }
                        />
                        <FormSelect
                          label="Company Size"
                          options={[
                            { value: "1-50", label: "1-50 employees" },
                            { value: "51-200", label: "51-200 employees" },
                            { value: "201-500", label: "201-500 employees" },
                            { value: "501-1000", label: "501-1000 employees" },
                            { value: "1000+", label: "1000+ employees" },
                          ]}
                          value={formData.companySize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companySize: e.target.value,
                            })
                          }
                        />
                      </div>

                      <FormSelect
                        label="Which product are you interested in? *"
                        options={[
                          {
                            value: "DTMP",
                            label:
                              "DTMP - Specification & Orchestration Platform",
                          },
                          {
                            value: "TMaaS",
                            label: "TMaaS - Transformation as a Service",
                          },
                          {
                            value: "DTO4T",
                            label:
                              "DTO4T (TwinGM AI) - AI-Guided Transformation",
                          },
                          {
                            value: "DTMI",
                            label:
                              "DTMI - Digital Transformation Market Insights",
                          },
                          {
                            value: "DTMA",
                            label: "DTMA - Digital Transformation Academy",
                          },
                          {
                            value: "DTMB",
                            label: "DTMB - Published Intellectual Foundation",
                          },
                          {
                            value: "TxM-B2B2C",
                            label: "TxM (B2B2C) - Consumer Ecosystems",
                          },
                          {
                            value: "TxM-B2B2B",
                            label: "TxM (B2B2B) - Enterprise Ecosystems",
                          },
                          {
                            value: "DBP-Services",
                            label: "DBP Services - Design & Deploy",
                          },
                          { value: "Multiple", label: "Multiple Products" },
                          { value: "Not-Sure", label: "Not Sure Yet" },
                        ]}
                        value={formData.productInterest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productInterest: e.target.value,
                          })
                        }
                        required
                      />

                      <FormTextarea
                        label="Tell us about your needs and goals"
                        placeholder="What challenges are you looking to solve? What are your digital transformation goals?"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
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
                            Request Demo
                            <ArrowRight size={18} className="ml-2" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default RequestDemoPage;
