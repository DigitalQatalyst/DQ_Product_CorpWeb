import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { submitServiceRequest } from '../../services/airtableService';

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
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
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

const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get('service') || 'Digital Transformation Service';
  const serviceId = searchParams.get('serviceId') || searchParams.get('service') || 'unknown-service';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    serviceInterest: serviceName,
    serviceSlug: serviceId, // Add service slug from URL
    projectTimeline: '',
    budget: '',
    requirements: '',
    hearAboutUs: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit to Airtable (primary data storage)
      await submitServiceRequest({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        jobTitle: formData.jobTitle,
        industry: formData.industry,
        companySize: formData.companySize,
        serviceInterest: formData.serviceInterest,
        serviceSlug: formData.serviceSlug,
        projectTimeline: formData.projectTimeline,
        budget: formData.budget,
        requirements: formData.requirements,
      });
      
      console.log('✅ Service request saved to Airtable successfully');
      
      // Also send email notification via FormSubmit (backup notification system)
      const formSubmitData = new FormData();
      
      // Basic contact information
      formSubmitData.append('First Name', formData.firstName);
      formSubmitData.append('Last Name', formData.lastName);
      formSubmitData.append('Email Address', formData.email);
      formSubmitData.append('Phone Number', formData.phone);
      formSubmitData.append('Company Name', formData.company);
      formSubmitData.append('Job Title', formData.jobTitle);
      
      // Service and project details
      formSubmitData.append('Industry', formData.industry);
      formSubmitData.append('Company Size', formData.companySize);
      formSubmitData.append('Service Requested', formData.serviceInterest);
      formSubmitData.append('Service ID', formData.serviceSlug);
      formSubmitData.append('Project Timeline', formData.projectTimeline);
      formSubmitData.append('Estimated Budget', formData.budget || 'Not specified');
      formSubmitData.append('Project Requirements', formData.requirements);
      
      // FormSubmit configuration
      formSubmitData.append('_subject', `🚀 New Service Request: ${serviceName}`);
      formSubmitData.append('_captcha', 'false');
      formSubmitData.append('_template', 'table');
      formSubmitData.append('_next', 'https://digitalqatalyst.com/thank-you');
      formSubmitData.append('_cc', 'leads@digitalqatalyst.com'); // CC to leads email
      
      // Send email notification (runs in background, don't wait for it)
      fetch("https://formsubmit.co/info@digitalqatalyst.com", {
        method: "POST",
        body: formSubmitData,
        mode: 'no-cors'
      }).then(() => {
        console.log('📧 Email notification sent via FormSubmit');
      }).catch(error => {
        console.log('⚠️ Email notification failed (non-critical):', error);
      });

      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          jobTitle: '',
          industry: '',
          companySize: '',
          serviceInterest: serviceName,
          serviceSlug: serviceId,
          projectTimeline: '',
          budget: '',
          requirements: '',
          hearAboutUs: ''
        });
      }, 5000);
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setSubmitError('Failed to submit request. Please try again or contact us directly at info@digitalqatalyst.com');
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
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-secondary-900/75"></div>

          <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex items-center justify-center p-8 lg:p-16">
              <div className="text-white max-w-lg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Request Service
                </h1>
                <p className="text-xl text-white/90 mb-4 leading-relaxed">
                  Interested in: <span className="font-semibold text-primary-200">{serviceName}</span>
                </p>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Let us help you transform your organization with our expert digital transformation services. Our team will work closely with you to deliver results that exceed expectations.
                </p>
                
                {/* Benefits List */}
                <ul className="space-y-4">
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Expert consultation and strategy</span>
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Implementation-ready specifications</span>
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Validated prototypes and demos</span>
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Ongoing support and guidance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex items-center justify-center p-8 lg:p-16">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Get Started Today
                </h3>
                
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}
                  
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Request Submitted Successfully!
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Thank you for your interest in our {serviceName}. Your request has been recorded and our team will review it and get back to you within 24-48 hours.
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate('/marketplace/services')}
                          className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          Back to Services
                        </button>
                        <button
                          onClick={() => navigate('/')}
                          className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Go to Homepage
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          label="First Name"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                        <FormInput
                          label="Last Name"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          label="Email Address"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                        <FormInput
                          label="Phone Number"
                          type="tel"
                          placeholder="+971 XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          label="Company Name"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          required
                        />
                        <FormInput
                          label="Job Title"
                          placeholder="Your Position"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormSelect
                          label="Industry"
                          options={[
                            { value: 'technology', label: 'Technology' },
                            { value: 'healthcare', label: 'Healthcare' },
                            { value: 'finance', label: 'Finance' },
                            { value: 'retail', label: 'Retail' },
                            { value: 'manufacturing', label: 'Manufacturing' },
                            { value: 'education', label: 'Education' },
                            { value: 'government', label: 'Government' },
                            { value: 'other', label: 'Other' },
                          ]}
                          value={formData.industry}
                          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                          required
                        />
                        <FormSelect
                          label="Company Size"
                          options={[
                            { value: '1-10', label: '1-10 employees' },
                            { value: '11-50', label: '11-50 employees' },
                            { value: '51-200', label: '51-200 employees' },
                            { value: '201-1000', label: '201-1000 employees' },
                            { value: '1000+', label: '1000+ employees' },
                          ]}
                          value={formData.companySize}
                          onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormSelect
                          label="Project Timeline"
                          options={[
                            { value: 'immediate', label: 'Immediate (within 1 month)' },
                            { value: 'short-term', label: 'Short-term (1-3 months)' },
                            { value: 'medium-term', label: 'Medium-term (3-6 months)' },
                            { value: 'long-term', label: 'Long-term (6+ months)' },
                          ]}
                          value={formData.projectTimeline}
                          onChange={(e) => setFormData(prev => ({ ...prev, projectTimeline: e.target.value }))}
                          required
                        />
                        <FormSelect
                          label="Estimated Budget"
                          options={[
                            { value: 'under-50k', label: 'Under $50,000' },
                            { value: '50k-100k', label: '$50,000 - $100,000' },
                            { value: '100k-250k', label: '$100,000 - $250,000' },
                            { value: '250k-500k', label: '$250,000 - $500,000' },
                            { value: '500k+', label: '$500,000+' },
                          ]}
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        />
                      </div>

                      <FormTextarea
                        label="Project Requirements & Goals"
                        placeholder="Please describe your project requirements, goals, and any specific challenges you're facing..."
                        value={formData.requirements}
                        onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
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
                            Submit Request
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

export default ServiceRequestForm;