import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Bell,
  TrendingUp,
  Lightbulb,
  Users,
} from "lucide-react";

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
        className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-brand-coral focus:border-brand-coral transition-all duration-200 text-sm"
      />
    </div>
  );
};

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
        className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-brand-coral focus:border-brand-coral transition-all duration-200 bg-white text-sm appearance-none"
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

export function NewsletterSignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    interests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formSubmitData = new FormData();
      formSubmitData.append("Name", formData.name);
      formSubmitData.append("Email Address", formData.email);
      formSubmitData.append("Company", formData.company || "Not provided");
      formSubmitData.append("Role", formData.role || "Not provided");
      formSubmitData.append("Interests", formData.interests || "Not provided");
      formSubmitData.append(
        "_subject",
        "📰 New Newsletter Subscription - DTMI Insights",
      );
      formSubmitData.append("_captcha", "false");
      formSubmitData.append("_template", "table");
      formSubmitData.append("_next", "https://digitalqatalyst.com/thank-you");
      formSubmitData.append("_cc", "insights@digitalqatalyst.com");

      await fetch("https://formsubmit.co/info@digitalqatalyst.com", {
        method: "POST",
        body: formSubmitData,
        mode: "no-cors",
      });

      setFormSuccess(true);

      setTimeout(() => {
        setFormSuccess(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          role: "",
          interests: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error submitting newsletter signup:", error);
      setSubmitError(
        "Failed to submit. Please try again or contact us at insights@digitalqatalyst.com",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter-signup" className="py-0">
      <div
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
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                <Bell size={18} className="mr-2" />
                <span className="text-sm font-medium">
                  DTMI Insights Newsletter
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Stay Updated with Our Insights
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Get exclusive access to cutting-edge research, AI-driven
                strategies, and actionable insights delivered directly to your
                inbox.
              </p>

              {/* Benefits List */}
              <ul className="space-y-4">
                <li className="flex items-start text-white">
                  <TrendingUp
                    size={24}
                    className="text-white mr-4 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Latest Industry Trends
                    </h3>
                    <p className="text-white/80 text-sm">
                      Stay ahead with insights on digital transformation and
                      emerging technologies
                    </p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <Lightbulb
                    size={24}
                    className="text-white mr-4 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Actionable Strategies
                    </h3>
                    <p className="text-white/80 text-sm">
                      Practical frameworks and methodologies you can implement
                      immediately
                    </p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <Users
                    size={24}
                    className="text-white mr-4 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Expert Perspectives
                    </h3>
                    <p className="text-white/80 text-sm">
                      Exclusive content from industry leaders and digital
                      transformation experts
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex items-center justify-center p-8 lg:p-16">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Subscribe to DTMI Insights
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
                      Welcome aboard!
                    </h4>
                    <p className="text-gray-600">
                      You're now subscribed to DTMI Insights. Check your inbox
                      for a confirmation email.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormInput
                        label="Your Name"
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
                        label="Email Address"
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
                        label="Company (Optional)"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: e.target.value,
                          })
                        }
                      />
                      <FormInput
                        label="Job Title (Optional)"
                        placeholder="Your Role"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value,
                          })
                        }
                      />
                    </div>

                    <FormSelect
                      label="What topics interest you most?"
                      options={[
                        {
                          value: "digital-transformation",
                          label: "Digital Transformation",
                        },
                        { value: "ai-innovation", label: "AI & Innovation" },
                        { value: "industry-4.0", label: "Industry 4.0" },
                        { value: "data-analytics", label: "Data & Analytics" },
                        {
                          value: "change-management",
                          label: "Change Management",
                        },
                        { value: "all-topics", label: "All Topics" },
                      ]}
                      value={formData.interests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interests: e.target.value,
                        })
                      }
                    />

                    <p className="text-xs text-gray-500 mb-6 mt-4">
                      By subscribing, you agree to receive emails from
                      DigitalQatalyst. You can unsubscribe at any time.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3.5 mt-2 font-bold text-sm rounded-lg shadow-lg bg-brand-coral hover:bg-brand-coral/90 text-white transition-all duration-300 flex items-center justify-center ${
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
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe Now
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
      </div>
    </section>
  );
}
