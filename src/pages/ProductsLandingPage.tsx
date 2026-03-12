import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Users,
  LayoutGrid,
  BookOpen,
  Briefcase,
  RotateCcw,
  Lightbulb,
  ArrowRightLeft,
  CheckCircle,
} from "lucide-react";
import CallToAction from "../components/CallToAction";
import { ProductCard } from "../components/ProductCard";
import { dqProducts } from "../utils/productData";
import { submitConsultationRequest } from "../services/airtableService";

// Form input component
const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}: any) => {
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
const FormSelect = ({
  label,
  options,
  value,
  onChange,
  required = false,
}: any) => {
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
        {options.map((option: any) => (
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
}: any) => {
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

const benefits = [
  {
    icon: Zap,
    title: "Accelerate Transformation",
    description:
      "Achieve faster digital transformation with proven methodologies and expert guidance.",
  },
  {
    icon: Target,
    title: "Measurable Results",
    description:
      "Track progress and measure the impact of your transformation with actionable, data-driven insights.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "Benefit from robust security and compliance protocols, ensuring your organization's data integrity and protection.",
  },
  {
    icon: Globe,
    title: "Global Best Practices",
    description:
      "Access industry-leading practices and insights from successful transformations across the globe.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description:
      "Get continuous support from transformation experts and a dedicated team for seamless execution.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Innovation",
    description:
      "Stay ahead of digital trends with regular updates and new features to continuously improve your solutions.",
  },
];

const productCategories = [
  {
    icon: LayoutGrid,
    title: "Platforms",
    description:
      "Unified Digital Business Platforms (DBP) that integrate data, systems, and processes for smarter operations.",
    count: 2,
    framework: "Perspective 3: Platform",
  },
  {
    icon: Users,
    title: "Services",
    description:
      "Expert-led transformation management services guiding your journey to becoming a Digital Cognitive Organization.",
    count: 1,
    framework: "Perspective 4: Transformation",
  },
  {
    icon: BookOpen,
    title: "Learning & Resources",
    description:
      "Comprehensive training and knowledge resources to build digital transformation capabilities across your organization.",
    count: 2,
    framework: "Perspective 6: Accelerators",
  },
  {
    icon: Globe,
    title: "Collaboration",
    description:
      "Digital working spaces integrating human and machine intelligence for enhanced productivity and innovation.",
    count: 1,
    framework: "Perspective 5: Workforce",
  },
];

export default function ProductsLandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedClass, setSelectedClass] = useState("all");

  // Demo form state
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

  const testimonials = [
    {
      quote:
        "DigitalQatalyst brought architectural clarity and execution discipline that significantly elevated our Digital Business Products growth agenda. This was not simply advisory work; it was structured design that positioned us for sustainable digital growth.",
      name: "Dr. Tariq Aslam",
      title: "VP Digital | ABB EMEA",
      initials: "TA",
    },
    {
      quote:
        "DigitalQatalyst helped us rethink how research operations can function in a digitally enabled environment. The result has been improved efficiency, stronger clarity on digital priorities, and a more future-ready research function.",
      name: "Cho Edwards",
      title: "Product Manager | Procter & Gamble (UK)",
      initials: "CE",
    },
  ];

  // Auto-slide testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitConsultationRequest({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        sector: formData.productInterest,
        interest: "Request Demo",
        message: `Job Title: ${formData.jobTitle}\nCompany Size: ${formData.companySize}\n\n${formData.message}`,
      });

      setFormSuccess(true);

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
      setSubmitError(
        "Failed to submit request. Please try again or contact us directly at info@digitalqatalyst.com",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/images/Service_landing_hero_image.png"
              alt="Products at DigitalQatalyst"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/85 to-secondary-900/60" />

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Digital Products That Turn Strategy into Execution.
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                DQ products operationalize your vision through unified, scalable
                systems built for measurable growth and sustained
                transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products/marketplace"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore Our Products
                  <ArrowRight size={20} />
                </Link>
                <button
                  onClick={() => {
                    document
                      .getElementById("request-demo-form")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-secondary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Request Demo
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Our Products Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Why Choose Our Products?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our products accelerate digital transformation, deliver
                measurable results, and ensure expert support with top-tier
                security.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    50%
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    Cut Transformation Costs
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  DQ's productized solutions save you significantly compared to
                  traditional consulting models, delivering cost-effective
                  results without compromising quality.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    80%
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    Accelerate Transformation
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Our streamlined approach allows you to reach Digital
                  Organization maturity in a fraction of the time, optimizing
                  your resources and boosting efficiency.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    360°
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    Unlock Insights for Growth
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Enhance services, products, and positioning with data-driven
                  insights that continuously improve your business, helping you
                  stay competitive and innovative.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    15+
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    Years of Product Development
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  With 15+ years of product development, DQ has refined more
                  than 10 products and services to meet market needs, driving
                  long-term growth and transformation.
                </p>
              </div>
            </div>

            {/* Client Testimonials Carousel */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentTestimonial * 100}%)`,
                    }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="min-w-full px-4">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 md:p-12 rounded-2xl border border-primary/10">
                          <div className="flex items-start mb-6">
                            <svg
                              className="w-12 h-12 text-primary/30"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                          </div>
                          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                            "{testimonial.quote}"
                          </p>
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg mr-4">
                              {testimonial.initials}
                            </div>
                            <div>
                              <div className="font-bold text-secondary">
                                {testimonial.name}
                              </div>
                              <div className="text-gray-600 text-sm">
                                {testimonial.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentTestimonial === index
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                      aria-label={`View testimonial ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Transformation Roadmap Overview - 6XD Framework */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Pioneer your Business Future with 6XD
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The Six Dimensions of Digital Transformation (6XD) redefines
                digital transformation, unlocking growth and driving faster,
                more efficient outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* 1. Digital Economy */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary">
                    Digital Economy (DE)
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  Transform your business to thrive in the digital economy with
                  data-driven decisions that unlock new revenue and increase
                  profitability.
                </p>
                <Link
                  to="/dtmi/article/why-traditional-organizations-are-obsolete"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors mt-auto"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* 2. Digital Cognitive Organization */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary">
                    Digital Cognitive Organization (DCO)
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  Leverage AI and automation to drive smarter decision-making
                  and enhance operational agility in real-time.
                </p>
                <Link
                  to="/dtmi/article/why-traditional-business-models-are-doomed"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors mt-auto"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* 3. Digital Business Platform */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary">
                    Digital Business Platform (DBP)
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  Streamline workflows and improve collaboration with a unified
                  platform that integrates all key business functions.
                </p>
                <Link
                  to="/dtmi/article/traditional-digital-transformation-is-dead"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors mt-auto"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* 4. Digital Transformation */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary">
                    Digital Transformation (DT2.0)
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  Accelerate your transformation with strategic digital
                  technologies that enhance performance and meet evolving
                  customer needs.
                </p>
                <Link
                  to="/expert-interviews/digital-transformation-strategies-modern-businesses"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors mt-auto"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* 5. Digital Worker & Workspace */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary">
                    Digital Worker & Workspace (DW/WS)
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  Empower your workforce with intelligent tools that boost
                  productivity, collaboration, and engagement in the digital
                  workspace.
                </p>
                <Link
                  to="/dtmi/article/why-traditional-business-models-are-doomed"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors mt-auto"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* 6. Digital Accelerators */}
              <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">6</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary">
                    Digital Accelerators
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow mb-4">
                  Speed up your transformation with ready-to-use, scalable
                  solutions that drive fast implementation and continuous
                  growth.
                </p>
                <Link
                  to="/marketplace/dtmi/prediction-analysis"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold text-sm transition-colors mt-auto"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Four Classes of DQ Offerings Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                The Four Classes of DQ Offerings
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                DQ offerings progress from blueprint advisory to automated
                transformation platforms and live economic ecosystems.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedClass("all")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedClass === "all"
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                All Offerings
              </button>
              <button
                onClick={() => setSelectedClass("class01")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedClass === "class01"
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Class 01 DBP Services
              </button>
              <button
                onClick={() => setSelectedClass("class02")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedClass === "class02"
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Class 02 DT 2.0 Products
              </button>
              <button
                onClick={() => setSelectedClass("class03")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedClass === "class03"
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Class 03 DCO Products
              </button>
              <button
                onClick={() => setSelectedClass("class04")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedClass === "class04"
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Class 04 TxM Platforms
              </button>
            </div>

            {/* Class 01 - DBP Services */}
            {(selectedClass === "all" || selectedClass === "class01") && (
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-primary" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">
                      Class 01 — DBP Services
                    </h3>
                    <p className="text-gray-600">
                      Blueprint-based advisory and implementation forming the
                      architectural foundation of transformation.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DBP Designs – Strategy, Architecture, Roadmaps
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Blueprint-based advisory defining digital strategy,
                      architecture, operating models, and sector transformation
                      roadmaps.
                    </p>
                    <Link
                      to="/services/design-4-0"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Explore DQ Design Services
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DBP Deploys – Platform Implementation
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Blueprint-driven implementation of Experience 4.0, Agility
                      4.0, Intelligence 4.0, Workspace 4.0, and Sector 4.0
                      platforms.
                    </p>
                    <Link
                      to="/services/deploy-4-0"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Explore DQ Deploy Services
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Class 02 - DT 2.0 */}
            {(selectedClass === "all" || selectedClass === "class02") && (
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <RotateCcw className="text-primary" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">
                      Class 02 — DT 2.0 Products
                    </h3>
                    <p className="text-gray-600">
                      Platforms that industrialize and automate transformation
                      execution across the organization.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DTMP – Specification & Orchestration Platform
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      End-to-end DBP specification and orchestration platform
                      accelerating strategy, design, deployment, and adoption.
                    </p>
                    <Link
                      to="/products/dtmp"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Learn More
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      TMaaS – Transformation as a Service
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Marketplace-driven managed transformation initiatives
                      delivered as scalable Transformation-as-a-Service.
                    </p>
                    <Link
                      to="/products/tmaas"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Learn More
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DTO4T (TwinGM AI) – AI-Guided Transformation
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      AI-guided digital twin transformation platform reinforcing
                      precision execution as a continuous discipline.
                    </p>
                    <Link
                      to="/products/plant40"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Learn More
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Class 03 - DCO */}
            {(selectedClass === "all" || selectedClass === "class03") && (
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Lightbulb className="text-primary" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">
                      Class 03 — DCO Products
                    </h3>
                    <p className="text-gray-600">
                      Intellectual infrastructure enabling organizations to
                      understand and operate as Digital Cognitive Organizations.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DTMI – Digital Transformation Market Insights
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Global digital transformation insight platform structured
                      by 6xD and sector lenses.
                    </p>
                    <Link
                      to="/marketplace/dtmi"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Browse DTMI
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DTMA – Digital Transformation Academy
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Structured learning programs building competencies for
                      operating in Digital Cognitive Organizations.
                    </p>
                    <Link
                      to="/products/dtma"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Browse Courses
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      DTMB (6xD / GHC Series) – Published Intellectual
                      Foundation
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Published intellectual foundation codifying DQ's digital
                      transformation frameworks.
                    </p>
                    <Link
                      to="/products/dtmb"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Browse Books
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Class 04 - TxM */}
            {(selectedClass === "all" || selectedClass === "class04") && (
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ArrowRightLeft className="text-primary" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">
                      Class 04 — TxM Platforms
                    </h3>
                    <p className="text-gray-600">
                      Live transaction ecosystems operationalizing
                      transformation into economic infrastructure.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      TxM (B2B2C) – Consumer Ecosystems
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Consumer and experience ecosystems powered by unified DBPs
                      enabling near-perfect life transactions.
                    </p>
                    <Link
                      to="/consultation"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Book Consultation
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <h4 className="text-xl font-bold text-secondary mb-3">
                      TxM (B2B2B) – Enterprise Ecosystems
                    </h4>
                    <p className="text-gray-600 mb-4 flex-grow">
                      Enterprise transaction ecosystems enabling scalable
                      partner and supply chain collaboration.
                    </p>
                    <Link
                      to="/consultation"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold transition-colors mt-auto"
                    >
                      Book Consultation
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Request Demo Section */}
        <section
          id="request-demo-form"
          className="py-20 relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/Form_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-secondary-900/75"></div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left Content */}
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Request a Product Demo
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Experience firsthand how DQ's revolutionary digital platforms
                  can transform your organization and accelerate your digital
                  transformation journey.
                </p>

                {/* Benefits List */}
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <CheckCircle className="text-white" size={32} />
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
                      <CheckCircle className="text-white" size={32} />
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
                      <CheckCircle className="text-white" size={32} />
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

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mt-8">
                  <p className="text-white/90 text-sm">
                    <strong className="text-white">What to expect:</strong> Our
                    team will reach out within 24 hours to schedule a convenient
                    time for your personalized demo session.
                  </p>
                </div>
              </div>

              {/* Right Form */}
              <div className="bg-white rounded-xl shadow-2xl p-8">
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
                          onChange={(e: any) =>
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
                          onChange={(e: any) =>
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
                          onChange={(e: any) =>
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
                          onChange={(e: any) =>
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
                          onChange={(e: any) =>
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
                          onChange={(e: any) =>
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
                        onChange={(e: any) =>
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
                        onChange={(e: any) =>
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

      <Footer />
    </div>
  );
}
