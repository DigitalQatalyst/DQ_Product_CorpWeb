import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WaitlistModal } from "../components/WaitlistModal";
import { dqProducts } from "../utils/productData";
import type { ProductType } from "../types/product";
import { HomeIcon, ChevronRightIcon, CheckCircleIcon } from "lucide-react";

// Feature descriptions mapping to reduce cognitive complexity
const getFeatureDescription = (productId: string, tag: string): string => {
  const featureDescriptions: Record<string, Record<string, string>> = {
    tmaas: {
      "Architecture-led": "Strategic blueprints and frameworks that guide your transformation with proven architectural patterns and best practices.",
      "Data-driven": "AI-powered insights and analytics that inform decision-making and optimize transformation outcomes.",
      "Best-Practice-based": "Leverage industry-proven methodologies and ready-to-launch blueprints for accelerated implementation."
    },
    dtmp: {
      "Repository": "A comprehensive architectural repository to store, manage, and track digital transformation assets and blueprints.",
      "Analytics": "Integrated analytics provide actionable insights, tracking KPIs and progress across transformation initiatives for effective decision-making.",
      "Portal": "A user-friendly portal to access, manage, and collaborate on transformation blueprints, reports, and metrics."
    },
    dtma: {
      "Training Programs": "Tailored training programs that build key skills for effective digital leadership and execution.",
      "Certification": "Certification tracks to validate expertise in digital transformation methodologies and strategies for measurable career growth.",
      "Expert-Led Workshops": "Interactive workshops led by industry experts to dive deep into transformation strategies and real-world applications."
    },
    dtmb: {
      "Actionable Insights": "Provides concise, expert-authored content that simplifies complex digital transformation concepts for executives and leaders.",
      "Bite-Sized Learning": "Short, digestible chapters allow busy leaders to quickly grasp key transformation strategies and methodologies.",
      "Practical Case Studies": "Real-world case studies provide actionable examples and solutions for overcoming digital transformation challenges."
    },
    dtmi: {
      "Market Intelligence": "Access comprehensive management insights and trends in digital transformation across industries and sectors.",
      "Research Insights": "Expert-driven research and analysis on emerging technologies, methodologies, and transformation strategies.",
      "Industry Analysis": "Deep-dive analysis of sector-specific transformation patterns, challenges, and opportunities."
    },
    dtmcc: {
      "Digital Worker Enablement": "Spaces designed for human-machine collaboration, empowering professionals to thrive in Economy 4.0.",
      "AI-Ready Infrastructure": "High-speed connectivity and AI-integrated workstations for seamless human-AI collaboration.",
      "Global Network": "Access to a growing network of studios worldwide, starting with our Nairobi location with more coming soon."
    },
    plant40: {
      "Asset Management": "Integrates advanced digital tools to optimize asset performance, reduce downtime, and enhance lifecycle management.",
      "Operational Efficiency": "Streamlines operations, improving productivity and reducing costs with smart automation and real-time monitoring.",
      "Sustainability Focus": "Supports sustainable practices through data-driven insights and eco-friendly transformation strategies in energy-intensive industries."
    }
  };

  return featureDescriptions[productId]?.[tag] || 
    `Comprehensive ${tag.toLowerCase()} capabilities designed to accelerate your digital transformation journey.`;
};

// Product content mapping to reduce cognitive complexity
const getProductContent = (productId: string) => {
  const productContents: Record<string, React.ReactNode> = {
    tmaas: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Organizations face high costs, complexity, and inflexibility in digital transformation, lacking tailored and efficient tools. Traditional approaches often result in lengthy implementation timelines, budget overruns, and solutions that don't scale with business needs.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          TMaaS is a low-cost, architecture-led marketplace for digital transformation initiatives using AI-powered, ready-to-launch blueprints. We accelerate impact, reduce costs, and ensure scalability through our architecture-led, data-driven, and best-practice-based approach to digital transformation services.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">TMaaS Services</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Design</h4>
            <p className="text-gray-700">Translate insights into clear blueprints and actionable digital strategies.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Deploy</h4>
            <p className="text-gray-700">Turn your transformation roadmap into reality with seamless execution and delivery tracking.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Drive</h4>
            <p className="text-gray-700">Support teams, optimise outcomes, and ensure long-term digital performance.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Low-Cost Entry</h4>
              <p className="text-gray-600">Affordable starting point for transformation initiatives</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Faster Results</h4>
              <p className="text-gray-600">Reduced time to value from transformation programs</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Higher Success</h4>
              <p className="text-gray-600">Increased success rate of transformation programs</p>
            </div>
          </div>
        </div>
      </>
    ),
    dtmp: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Organizations struggle to manage digital transformation without unified visibility. Fragmented tools, disconnected portfolios, and lack of real-time tracking create chaos—making it impossible for leaders to see progress clearly or for teams to execute with discipline and speed.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          DTMP is a unified platform that enables organizations to plan, track, and manage digital transformation with clarity. It integrates portfolios, analytics, workflows, and compliance into a single system, giving leaders end-to-end visibility and enabling teams to execute transformation with discipline and speed.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">DTMP Capabilities</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Portfolio Management</h4>
            <p className="text-gray-700">Unified view of all transformation initiatives—enabling leaders to plan, prioritize, and track progress across the entire portfolio.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Analytics & Insights</h4>
            <p className="text-gray-700">Real-time analytics and KPI tracking that provide end-to-end visibility into transformation performance and business impact.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Workflows & Compliance</h4>
            <p className="text-gray-700">Integrated workflows and compliance tracking that ensure teams execute with discipline while maintaining governance standards.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">End-to-End Visibility</h4>
              <p className="text-gray-600">Complete transparency across all transformation initiatives</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Faster Execution</h4>
              <p className="text-gray-600">Teams execute with discipline and speed</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Unified System</h4>
              <p className="text-gray-600">Single platform for portfolios, analytics, and compliance</p>
            </div>
          </div>
        </div>
      </>
    ),
    dtma: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Digital transformation projects often fail due to skill gaps, lack of structured approaches, and resistance to change. Organizations struggle to build internal capabilities, leading to increased delivery risk, poor adoption rates, and transformation initiatives that don't deliver expected value.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          DTMA is your organization's gateway to building digital transformation capabilities. We equip your teams with practical skills, proven methodologies, and industry certifications through blended training, hands-on labs, and expert coaching—reducing risk, accelerating adoption, and ensuring measurable outcomes.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">DTMA Services</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Training Programs</h4>
            <p className="text-gray-700">Blended learning programs with flexible online and in-person training that builds key skills for effective digital leadership and execution.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Certification</h4>
            <p className="text-gray-700">Industry-recognized credentials that validate transformation expertise and signal change enablement capabilities.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Expert-Led Workshops</h4>
            <p className="text-gray-700">Hands-on labs and coaching sessions with transformation specialists using real-world scenarios and practical exercises.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Faster Delivery</h4>
              <p className="text-gray-600">60% faster project delivery with trained teams</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Higher Adoption</h4>
              <p className="text-gray-600">85% higher adoption rates across initiatives</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Reduced Risk</h4>
              <p className="text-gray-600">40% reduction in transformation risks</p>
            </div>
          </div>
        </div>
      </>
    ),
    dtmb: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Busy executives need quick access to transformation knowledge without wading through dense technical jargon or lengthy academic texts. Traditional resources are too time-consuming and often fail to provide practical, actionable insights that leaders can apply immediately to their organizations.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          DTMB is DQ's series of insightful and accessible books designed for executives and decision-makers. Each book offers concise, bite-sized insights that break down critical concepts into practical, actionable information—delivering clear advice aligned with the latest industry trends without overwhelming busy leaders with jargon.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">DTMB Features</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Actionable Insights</h4>
            <p className="text-gray-700">Concise, expert-authored content that simplifies complex digital transformation concepts for executives and leaders.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Bite-Sized Learning</h4>
            <p className="text-gray-700">Short, digestible chapters allow busy leaders to quickly grasp key transformation strategies and methodologies.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Practical Case Studies</h4>
            <p className="text-gray-700">Real-world case studies provide actionable examples and solutions for overcoming digital transformation challenges.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Faster Decisions</h4>
              <p className="text-gray-600">80% faster executive decision-making</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Better Alignment</h4>
              <p className="text-gray-600">90% improved strategic alignment</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Better Outcomes</h4>
              <p className="text-gray-600">65% better transformation outcomes</p>
            </div>
          </div>
        </div>
      </>
    ),
    dtmcc: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Traditional workspaces aren't designed for the AI-powered workflows of Economy 4.0. Organizations struggle to provide environments optimized for human-machine collaboration, limiting their teams' ability to leverage AI tools effectively and hindering innovation in the digital economy.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Digital Working Studios (DWS) are purpose-built environments that enable powerful collaboration between human intelligence and machine intelligence (AI). Our studios provide AI-ready infrastructure, high-speed connectivity, and collaborative spaces where professionals seamlessly integrate AI tools into daily workflows—maximizing productivity and innovation.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">DWS Features</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Digital Worker Enablement</h4>
            <p className="text-gray-700">Spaces designed for human-machine collaboration, empowering professionals to thrive in Economy 4.0.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">AI-Ready Infrastructure</h4>
            <p className="text-gray-700">High-speed connectivity and AI-integrated workstations for seamless human-AI collaboration.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Global Network</h4>
            <p className="text-gray-700">Access to a growing network of studios worldwide, starting with our Nairobi location with more coming soon.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Higher Productivity</h4>
              <p className="text-gray-600">45% increase in team productivity</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Better AI Adoption</h4>
              <p className="text-gray-600">75% better AI tool adoption</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Faster Innovation</h4>
              <p className="text-gray-600">60% faster innovation cycles</p>
            </div>
          </div>
        </div>
      </>
    ),
    plant40: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Asset-intensive industries like manufacturing, oil & gas, and utilities face complex challenges: aging infrastructure, unplanned downtime, inefficient operations, and mounting pressure for sustainability. Traditional approaches lack the real-time insights and predictive capabilities needed to optimize performance and reduce environmental impact.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Plant 4.0 is DQ's specialized digital transformation solution that combines advanced digital tools, real-time monitoring, and smart automation to optimize asset performance, minimize downtime, and drive sustainability. We help you manage the entire asset lifecycle while reducing costs and environmental footprint.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Plant 4.0 Capabilities</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Asset Management</h4>
            <p className="text-gray-700">Optimize asset performance, reduce downtime, and enhance lifecycle management with advanced digital tools and predictive analytics.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Operational Efficiency</h4>
            <p className="text-gray-700">Streamline operations, improve productivity, and reduce costs with smart automation and real-time monitoring.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Sustainability Focus</h4>
            <p className="text-gray-700">Reduce environmental footprint and adopt eco-friendly practices through data-driven insights and compliance with modern industry standards.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Reduced Downtime</h4>
              <p className="text-gray-600">Predictive maintenance minimizes unplanned outages</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Lower Costs</h4>
              <p className="text-gray-600">Optimize operations and reduce maintenance expenses</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Sustainability</h4>
              <p className="text-gray-600">Achieve environmental goals with data-driven insights</p>
            </div>
          </div>
        </div>
      </>
    ),
    dtmi: (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem Space</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Organizations struggle to access reliable, structured insights about digital transformation trends, management intelligence, and industry-specific transformation patterns. Traditional research is fragmented, expensive, and often lacks the sector-specific depth needed for strategic decision-making.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Unique Solution</h3>
        <p className="text-gray-700 mb-5 leading-relaxed">
          DTMI is a comprehensive digital transformation management insights platform that provides structured intelligence through our 6xD framework and sector-specific lenses. Access expert-driven research, industry analysis, case studies, and transformation insights that inform strategic decisions and accelerate your transformation journey.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">DTMI Features</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Market Intelligence</h4>
            <p className="text-gray-700">Access comprehensive management insights and trends in digital transformation across industries and sectors.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Research Insights</h4>
            <p className="text-gray-700">Expert-driven research and analysis on emerging technologies, methodologies, and transformation strategies.</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h4 className="font-bold text-gray-900 mb-2">Industry Analysis</h4>
            <p className="text-gray-700">Deep-dive analysis of sector-specific transformation patterns, challenges, and opportunities.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Practical Value</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Better Decisions</h4>
              <p className="text-gray-600">70% improvement in strategic decision quality</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Faster Insights</h4>
              <p className="text-gray-600">85% faster access to market intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Reduced Risk</h4>
              <p className="text-gray-600">50% reduction in transformation risks</p>
            </div>
          </div>
        </div>
      </>
    )
  };

  return productContents[productId] || (
    <p className="text-gray-700 leading-relaxed">
      This solution is designed to help organizations navigate the complexities of digital transformation. 
      It provides the tools and insights needed to drive meaningful change and achieve lasting results.
    </p>
  );
};

// Category description mapping
const getCategoryDescription = (productId: string, category: string): string => {
  if (productId === "dtmcc") {
    return "Digital Working Studios belongs to the Collaboration category, enabling digital workers who thrive through human-machine collaboration. In Economy 4.0, our studios provide the environment where professionals seamlessly integrate AI and machine intelligence into their work, driving innovation and productivity in the digital economy.";
  }
  
  if (productId === "dtmi") {
    return "DTMI belongs to the Intelligence category, providing comprehensive management insights and research-driven intelligence for digital transformation. This category focuses on delivering structured knowledge, industry analysis, and strategic insights that inform decision-making and accelerate transformation initiatives across sectors.";
  }
  
  return `This product belongs to the ${category} category, providing specialized solutions for organizations looking to enhance their digital transformation capabilities. The ${category} category encompasses comprehensive solutions designed to address complex organizational challenges through strategic guidance, proven methodologies, and practical tools.`;
};

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  useEffect(() => {
    const foundProduct = dqProducts.find((item) => item.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    }
  }, [productId, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const handleJoinWaitlist = () => {
    setIsWaitlistModalOpen(true);
  };

  const handleProductDemo = () => {
    navigate(`/forms/product-demo/${product.code.toLowerCase()}`);
  };

  const handleTourRequest = () => {
    navigate('/consultation');
  };

  const getCtaButton = () => {
    switch (product.id) {
      case 'dtmp':
        return (
          <button
            onClick={handleProductDemo}
            className="px-6 py-3 text-white font-bold rounded-md bg-primary-500 hover:bg-primary-600 transition-colors shadow-md"
          >
            Request Product Demo
          </button>
        );
      case 'plant40':
        return (
          <button
            onClick={handleProductDemo}
            className="px-6 py-3 text-white font-bold rounded-md bg-primary-500 hover:bg-primary-600 transition-colors shadow-md"
          >
            Request Product Demo
          </button>
        );
      case 'dtmcc':
        return (
          <button
            onClick={handleTourRequest}
            className="px-6 py-3 text-white font-bold rounded-md bg-primary-500 hover:bg-primary-600 transition-colors shadow-md"
          >
            Request Tour
          </button>
        );
      default:
        return (
          <button
            onClick={handleJoinWaitlist}
            className="px-6 py-3 text-white font-bold rounded-md bg-primary-500 hover:bg-primary-600 transition-colors shadow-md"
          >
            Join Waitlist
          </button>
        );
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                >
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <a
                    href="/products"
                    className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    Products
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">
                    {product.code}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="w-full bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="lg:w-2/3">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                  {product.name} ({product.code})
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200">
                    {product.category}
                  </span>
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {getCtaButton()}
                </div>
              </div>

              <div className="lg:w-1/3 w-full">
                <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        {product.icon && (
                          <div className="mb-4 flex justify-center">
                            <div className="w-24 h-24 flex items-center justify-center">
                              {product.icon}
                            </div>
                          </div>
                        )}
                        <p className="text-gray-600 font-medium">
                          {product.code}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-start p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CheckCircleIcon
                    size={24}
                    className="text-primary-500 mr-4 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tag}</h3>
                    <p className="text-gray-600 text-sm">
                      {getFeatureDescription(product.id, tag)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About {product.code}
            </h2>
            <div className="prose max-w-none">
              {!["dtmp", "dtma", "dtmb", "dtmcc", "plant40"].includes(product.id) && (
                <p className="text-gray-700 mb-5 leading-relaxed">
                  {product.description}
                </p>
              )}

              {getProductContent(product.id)}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Product Category
            </h2>
            <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-xl p-8 border border-orange-100 shadow-sm">
              <div className="flex items-start gap-6">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg 
                      className="w-8 h-8 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-semibold bg-white text-primary-700 border-2 border-primary-200 shadow-sm">
                      {product.category}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {getCategoryDescription(product.id, product.category)}
                  </p>

                  {/* Additional Category Info */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Fast Implementation</p>
                        <p className="text-xs text-gray-500">Quick deployment</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Enterprise Ready</p>
                        <p className="text-xs text-gray-500">Scalable solution</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">24/7 Support</p>
                        <p className="text-xs text-gray-500">Always available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer isLoggedIn={false} />
      
      {product && !['dtmp', 'plant40', 'dtmcc'].includes(product.id) && (
        <WaitlistModal
          isOpen={isWaitlistModalOpen}
          onClose={() => setIsWaitlistModalOpen(false)}
          productName={`${product.name} (${product.code})`}
          productCode={product.code}
        />
      )}
    </div>
  );
}
