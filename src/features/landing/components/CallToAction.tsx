"use client";

import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const SECTORS = [
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
  { value: "wellness-4-0", label: "Wellness 4.0" },
];

const INTERESTS = [
  { value: "general-enquiries", label: "General Enquiries" },
  { value: "business-development", label: "Business Development" },
  { value: "products-and-services", label: "Products and Services" },
  { value: "events-webinars-press", label: "Events, Webinars and Press" },
  { value: "corporate-training", label: "Corporate Training" },
  { value: "request-demo", label: "Request Demo" },
];

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#030F35] focus:border-[#030F35] transition-all";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export function CallToAction() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    sector: "",
    interest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // TODO: wire to server action
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({
          name: "",
          email: "",
          company: "",
          phone: "",
          sector: "",
          interest: "",
          message: "",
        });
      }, 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="consultation"
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/Form_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#030F35]/75" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Your Path to Digital Excellence Starts Here
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-2xl">
              At DQ, we partner with you to unlock innovative solutions that
              transform your business. Our approach blends cutting-edge
              technology with practical expertise, ensuring your digital journey
              is efficient, impactful, and future-ready.
            </p>
            <ul className="space-y-4">
              {[
                {
                  bold: "Unlock Efficiency:",
                  rest: " Streamline your operations and maximize productivity.",
                },
                {
                  bold: "Drive Innovation:",
                  rest: " Leverage the latest technology to stay ahead of the competition.",
                },
                {
                  bold: "Achieve Sustainable Growth:",
                  rest: " Build long-term success with scalable digital strategies.",
                },
              ].map((item) => (
                <li key={item.bold} className="flex items-center text-white">
                  <CheckCircle size={24} className="text-white mr-3 shrink-0" />
                  <span className="text-lg">
                    <strong>{item.bold}</strong>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Claim Your Free Consultation Today
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Thank you!
                </h4>
                <p className="text-gray-600">
                  Your consultation request has been recorded and we&apos;ll be
                  in touch soon!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelCls}>Your Name</label>
                    <input
                      className={inputCls}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={set("name")}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input
                      type="email"
                      className={inputCls}
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelCls}>Company Name</label>
                    <input
                      className={inputCls}
                      placeholder="Your Company"
                      value={form.company}
                      onChange={set("company")}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      type="tel"
                      className={inputCls}
                      placeholder="+971 XX XXX XXXX"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelCls}>
                      Which sector are you interested in?
                    </label>
                    <select
                      className={inputCls}
                      value={form.sector}
                      onChange={set("sector")}
                    >
                      <option value="">Select an option</option>
                      {SECTORS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>
                      What are you interested in?
                    </label>
                    <select
                      className={inputCls}
                      value={form.interest}
                      onChange={set("interest")}
                    >
                      <option value="">Select an option</option>
                      {INTERESTS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelCls}>
                    Kindly provide enough information about your organization
                    and needs...
                  </label>
                  <textarea
                    className={inputCls}
                    rows={4}
                    placeholder="Tell us about your digital transformation needs..."
                    value={form.message}
                    onChange={set("message")}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-6 py-3.5 mt-2 font-bold text-sm rounded-lg shadow-lg bg-secondary hover:bg-secondary/80 text-white transition-all duration-300 flex items-center justify-center ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {submitting ? (
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
                      Book Your Free Consultation Today
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
