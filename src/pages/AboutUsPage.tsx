import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Sparkles,
  ArrowRight,
  Target,
  Users,
  Globe,
  Brain,
  LineChart,
  Shield,
} from "lucide-react";
import ModernDQChatbot from "../components/ModernDQChatbot";
import { leadershipTeam } from "../data/leadershipTeam";
import ClientLogosCarousel from "../components/ClientLogosCarousel";
import CallToActionSimple from "../components/CallToActionSimple";

const impactStats = [
  { value: "2015", label: "Founded in Dubai, UAE" },
  { value: "100+", label: "Global Customers" },
  { value: "50+", label: "Transformation Experts" },
  { value: "6+", label: "Countries Present" },
];

const values = [
  {
    title: "Self-Development",
    description:
      "We continuously grow our expertise to deliver innovative solutions, driving measurable results for clients.",
    icon: Sparkles,
  },
  {
    title: "Lean Working",
    description:
      "We eliminate inefficiencies, ensuring faster and higher-quality results for our clients.",
    icon: Target,
  },
  {
    title: "Value Co-Creation",
    description:
      "We partner with clients to ensure our services generate tangible outcomes and measurable value.",
    icon: Users,
  },
];

const beliefs = [
  {
    title: "Economy 4.0",
    description:
      "Adapting to the global economy by leveraging technology to scale businesses and drive growth.",
    icon: Globe,
  },
  {
    title: "Digital Cognitive Organizations",
    description:
      "Empowering businesses with agility and intelligence to make real-time, data-driven decisions.",
    icon: Brain,
  },
  {
    title: "Digital Business Platforms",
    description:
      "Building integrated platforms that connect data, people, and processes to support smarter decisions.",
    icon: LineChart,
  },
];

export default function AboutUsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height: "100vh" }}>
          <div className="absolute inset-0">
            <img 
              src="/images/about_us_hero.png" 
              alt="About Us Hero background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/70 to-secondary-900/30" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">
                DigitalQatalyst
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 mx-auto max-w-4xl text-white">
                Transform Your Business for the Digital Future
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-10 mx-auto">
                We simplify digital transformation, combining strategy, technology, and expertise to guide your success in the digital economy.
              </p>
              <div className="flex justify-center">
                <a 
                  href="/consultation"
                  className="h-14 px-8 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-all transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2 group"
                >
                  Start Your Transformation Journey
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Impact section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold mb-8">
                From Vision to Impact
              </p>
              
              {/* Statistics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="relative">
                    <p className="text-4xl md:text-5xl font-bold text-secondary-900 mb-3">
                      {stat.value}
                    </p>
                    <div className="w-12 h-1 bg-primary mb-3"></div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Since 2015, we&apos;ve been empowering organizations to become Digital Cognitive Organizations (DCOs)...
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    Founded by Dr. Stephane Niango, DigitalQatalyst simplifies digital transformation for organizations globally. Our solutions are built for businesses looking to adapt, grow, and lead in a rapidly changing digital world.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We empower organizations to build the future of business by providing tools, frameworks, and expertise to thrive in the digital economy. Whether you&apos;re a growing startup or a global enterprise, we help you stay ahead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <ClientLogosCarousel />

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Values That Drive Your Digital Transformation
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
              At DQ, our values are the foundation of everything we do. They guide how we operate and ensure we create lasting, impactful transformation for our clients.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article
                    key={value.title}
                    className="rounded-3xl bg-white shadow-sm border border-gray-100 p-6 hover:-translate-y-1 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Beliefs */}
        <section className="py-16 bg-secondary-900 text-white">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center max-w-4xl mx-auto">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-2">
                Our Beliefs
              </p>
              <h2 className="text-3xl font-bold mb-4">
                Key Pillars Driving Digital Transformation
              </h2>
              <p className="text-white/70">
                Our core pillars define how we guide organizations through their digital transformation journey. These principles shape how we drive sustainable growth and innovation.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {beliefs.map((belief) => {
                const Icon = belief.icon;
                return (
                  <article
                    key={belief.title}
                    className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {belief.title}
                    </h3>
                    <p className="text-white/80 text-sm">{belief.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story + media */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold mb-3">
                Perfecting Life&apos;s Transactions
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Transformation should feel human—and measurable.
              </h2>
              <p className="text-gray-600 mb-6">
                At DigitalQatalyst, we empower organizations with affordable, results-oriented digital transformations, helping them thrive in the Economy 4.0.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg aspect-video bg-gray-900 relative">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                poster="/images/Landing page video thumbnail.png"
              >
                <source src="/videos/Why Work with Us - DQ.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet the Leaders Driving Your Digital Transformation
              </h2>
              <p className="text-gray-600">
                At DQ, our leadership team brings deep expertise and a passion for empowering businesses to succeed in the digital era. Meet the visionaries guiding our clients through their digital transformation journey.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipTeam.map((leader) => {
                const initials =
                  leader.initials ??
                  leader.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                return (
                <article
                  key={leader.name}
                  className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:-translate-y-1 transition-transform"
                >
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {leader.image ? (
                      <img 
                        src={leader.image} 
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-secondary-900">{initials}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">{leader.role}</p>
                </article>
              )})}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CallToActionSimple />
      </main>

      <Footer isLoggedIn={false} />
      
      {/* DQ AI Chatbot */}
      <ModernDQChatbot />
    </div>
  );
}
