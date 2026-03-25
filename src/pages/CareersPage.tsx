import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Heart,
  Zap,
  Globe,
  Award,
  Target,
  Sparkles,
} from "lucide-react";
import CallToAction from "../components/CallToAction";

const careerStats = [
  { value: "50+", label: "Team Members" },
  { value: "6+", label: "Countries" },
  { value: "100+", label: "Projects Delivered" },
  { value: "95%", label: "Employee Satisfaction" },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Continuous learning opportunities and clear career progression paths.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Work on transformative projects across multiple countries and industries.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description: "Join a diverse team of experts passionate about digital transformation.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "Flexible working arrangements and comprehensive wellness programs.",
  },
  {
    icon: Award,
    title: "Competitive Package",
    description: "Industry-leading compensation and benefits tailored to your needs.",
  },
  {
    icon: Zap,
    title: "Innovation First",
    description: "Access to cutting-edge tools and technologies to drive innovation.",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Self-Development",
    description: "We invest in continuous learning and personal growth.",
  },
  {
    icon: Target,
    title: "Lean Working",
    description: "Focus on what matters, deliver value efficiently.",
  },
  {
    icon: Users,
    title: "Value Co-Creation",
    description: "Partner with clients to shape measurable outcomes.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/images/about_us_hero.png" 
              alt="Careers at DigitalQatalyst" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/85 to-secondary-900/60" />
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Shape the Future of Digital Transformation
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Join a team of innovators, strategists, and technologists building 
                Digital Cognitive Organizations for Economy 4.0.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Open Positions
                  <ArrowRight size={20} />
                </Link>
                <button
                  onClick={() => {
                    document.getElementById('why-join-us')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-secondary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Learn More
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {careerStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section id="why-join-us" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Why Join DigitalQatalyst?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're building the future of digital transformation, and we want you to be part of it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="text-primary" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and shape our culture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
