import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { submitWaitlistRequest } from '../../services/airtableService';

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

const ProductDemoRequestForm: React.FC = () => {
  const { productCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const productNames = {
    'dtmp': 'Digital Transformation Management Platform (DTMP)',
    'plant40': 'Plant 4.0'
  };

  const productName = productNames[productCode?.toLowerCase() || ''] || 'Product';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit to Airtable using waitlist table with demo type
      await submitWaitlistRequest({
        name: formData.name,
        email: formData.email,
        companyName: formData.company,
        productName: productName,
        productCode: productCode?.toUpperCase() || '',
        requestType: 'demo'
      });
      
      console.log('✅ Product demo request saved to Airtable successfully');

      // Send email notification
      const emailFormData = new FormData();
      emailFormData.append('Name', formData.name);
      emailFormData.append('Email Address', formData.email);
      emailFormData.append('Company Name', formData.company);
      emailFormData.append('Product', productName);
      emailFormData.append('Request Type', 'Product Demo');
      emailFormData.append('_subject', `🎯 Product Demo Request - ${productName}`);
      emailFormData.append('_captcha', 'false');
      emailFormData.append('_template', 'table');
      emailFormData.append('_next', 'https://digitalqatalyst.com/thank-you');
      emailFormData.append('_cc', 'leads@digitalqatalyst.com');
      
      fetch("https://formsubmit.co/info@digitalqatalyst.com", {
        method: "POST",
        body: emailFormData,
        mode: 'no-cors'
      }).then(() => {
        console.log('📧 Email notification sent via FormSubmit');
      }).catch(error => {
        console.log('⚠️ Email notification failed (non-critical):', error);
      });

      setFormSuccess(true);
      
      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    } catch (error) {
      console.error('❌ Error submitting demo request:', error);
      setSubmitError('Failed to submit request. Please try again or contact us directly at info@digitalqatalyst.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <section 
          className="min-h-screen relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/Form_background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-secondary-900/75"></div>

          <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex items-center justify-center p-8 lg:p-16">
              <div className="text-white max-w-lg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Request Product Demo
                </h1>
                <h2 className="text-2xl font-semibold mb-6 text-primary-300">
                  {productName}
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  See how our solution can transform your organization. Schedule a personalized demo with our experts.
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Live product demonstration</span>
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Customized to your use case</span>
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Expert guidance and Q&A</span>
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle size={24} className="text-white mr-4 flex-shrink-0" />
                    <span className="text-lg">Implementation roadmap discussion</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex items-center justify-center p-8 lg:p-16">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Schedule Your Demo
                </h3>
                
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
                        Demo Request Submitted!
                      </h4>
                      <p className="text-gray-600">Our team will contact you within 24 hours to schedule your personalized demo.</p>
                    </div>
                  ) : (
                    <>
                      <FormInput
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      
                      <FormInput
                        label="Email Address"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      
                      <FormInput
                        label="Company Name"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-6 py-3.5 mt-6 font-bold text-sm rounded-lg shadow-lg bg-primary hover:bg-primary-600 text-white transition-all duration-300 flex items-center justify-center ${
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

export default ProductDemoRequestForm;