import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { mediaService, blogService } from '../../admin-ui/utils/supabase';
import { getExpertInterviewBySlug, getRelatedContentForInterview } from '../../utils/mockMarketplaceData';
import { Trash2, AlertCircle, Loader } from 'lucide-react';
import Modal from '../../admin-ui/components/Modal';

interface ExpertInterviewPageProps {
  interviewId?: string;
  slug?: string;
}

const ExpertInterviewPage: React.FC<ExpertInterviewPageProps> = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadInterview() {
      if (!slug) return;
      setLoading(true);
      try {
        // Fetch from database first
        const { data } = await mediaService.getMediaItems({ slug, type: 'expert-interview' });
        if (data && data.length > 0) {
          const item = data[0];

          // Parse complex content if it's stored as JSON string
          let parsedContent: any = item.content;
          if (typeof item.content === 'string' && item.content.trim().startsWith('{')) {
            try {
              parsedContent = JSON.parse(item.content);
            } catch (e) {
              console.error('Failed to parse interview content JSON', e);
            }
          }

          // Build consistent interview object
          const interviewObj = {
            ...item,
            expert: item.author || { name: 'Expert', title: 'DTMI Guest Expert', avatar: '/images/default_avatar.png' },
            content: typeof parsedContent === 'object' && parsedContent !== null ? {
              introduction: parsedContent.introduction || item.excerpt || '',
              insights: parsedContent.insights || [],
              sections: parsedContent.sections || [],
              conclusion: parsedContent.conclusion || '',
              location: parsedContent.location || item.location || '',
              interviewDate: parsedContent.interviewDate || item.interviewDate || ''
            } : {
              introduction: item.content || item.excerpt || '',
              insights: [],
              sections: [],
              conclusion: '',
              location: item.location || '',
              interviewDate: item.interviewDate || ''
            },
            metadata: {
              publishDate: new Date(item.publishDate || item.createdAt || new Date()).toLocaleDateString(),
              readTime: (item.readTime || 5) + ' min read',
              tags: item.tags || [],
              location: (typeof parsedContent === 'object' ? parsedContent?.location : null) || item.location || '',
              interviewDate: (typeof parsedContent === 'object' ? parsedContent?.interviewDate : null) || item.interviewDate
                ? new Date((typeof parsedContent === 'object' ? parsedContent?.interviewDate : null) || item.interviewDate).toLocaleDateString()
                : ''
            }
          };

          setInterview(interviewObj);
          setLoading(false);
          return;
        }

        // Fallback to mock data for backwards compatibility
        const mock = getExpertInterviewBySlug(slug);
        if (mock) {
          setInterview(mock);
          setLoading(false);
          return;
        }
      }
      catch (err) {
        console.error('Error loading interview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInterview();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!slug || !interview) {
    return <Navigate to="/coming-soon/expert-interviews" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left Content - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              {/* Category Tags */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-cyan-400 text-white text-sm font-medium rounded-full">
                  {interview.category || (interview.tags && interview.tags[0]) || 'Expert Interview'}
                </span>
                {interview.tags && interview.tags[1] && (
                  <span className="px-3 py-1 border border-gray-400 text-white text-sm font-medium rounded-full">
                    {interview.tags[1]}
                  </span>
                )}
                {(!interview.tags || !interview.tags[1]) && (
                  <span className="px-3 py-1 border border-gray-400 text-white text-sm font-medium rounded-full">
                    Executive Dialogue
                  </span>
                )}
              </div>

              {/* DTMI Label */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-blue-300 text-sm font-medium">DTMI Executive Dialogue</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {interview.title}
              </h1>

              {/* Author and Meta Info */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">👤</span>
                  </div>
                  <span className="text-blue-300 text-sm">Guest: {interview.expert.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">⏱</span>
                  </div>
                  <span className="text-blue-300 text-sm">{interview.metadata.readTime}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">📅</span>
                  </div>
                  <span className="text-blue-300 text-sm">{interview.metadata.publishDate}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(interview.metadata.tags || []).map((tag: string) => (
                  <span key={tag} className="text-blue-300 text-sm">#{tag.replace(/\s+/g, '')}</span>
                ))}
              </div>
            </div>

            {/* Right Image - Takes 1/3 of the space */}
            <div className="lg:col-span-1 lg:block">
              <div className="relative">
                <img
                  src={interview.thumbnail_url || interview.hero_image || interview.heroImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"}
                  alt={interview.title}
                  className="w-full h-80 lg:h-96 object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white">
              <div className="prose prose-base max-w-none">
                {/* Introduction Section */}
                <div className="bg-gray-50 rounded-lg mb-12 relative">
                  {/* Full height left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-lg"></div>

                  <div className="p-8 pl-12">
                    <div className="flex items-center mb-6">
                      <svg className="w-4 h-4 text-cyan-400 mr-3 -mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                      </svg>
                      <h2 className="text-xl font-bold text-gray-900 m-0">Introduction</h2>
                    </div>

                    <div className="space-y-4 text-gray-700 text-sm">
                      <p className="font-semibold text-cyan-600 mb-4">DTMI Host:</p>
                      <div
                        className="prose prose-sm max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: interview.content.introduction }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Insights Section */}
                <div className="bg-gray-100 rounded-lg mb-12">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">💡</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 m-0">Key Insights from this Interview</h2>
                    </div>

                    <div className="space-y-1">
                      {(interview.content.insights || []).map((insight: string, i: number) => (
                        <div key={i} className="flex items-center">
                          <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 flex-shrink-0"></div>
                          <div
                            className="text-gray-700 leading-tight text-sm"
                            dangerouslySetInnerHTML={{ __html: insight }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  {(interview.content.sections || []).map((section: any, index: number) => (
                    <div key={section.id || index} className="space-y-4">
                      {/* Question */}
                      <div className="relative bg-gray-50 p-6 rounded-lg">
                        {/* Seamless curved dark border */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800 rounded-l-full"></div>

                        <div className="pl-6">
                          <div className="text-gray-500 text-xs font-medium mb-2">DTMI:</div>
                          <div className="text-gray-900 font-semibold text-base leading-relaxed">
                            Q{index + 1}: {section.question}
                          </div>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="relative pl-4">
                        {/* Thinner blue vertical strip */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400"></div>

                        <div className="space-y-3">
                          <div className="text-cyan-500 font-semibold text-sm">{interview.expert.name}:</div>
                          <div
                            className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: section.answer }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conclusion */}
                {interview.content.conclusion && (
                  <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Takeaways</h3>
                    <div
                      className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: interview.content.conclusion }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Expert Profile */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={interview.expert.avatar}
                    alt={interview.expert.name}
                    className="w-16 h-16 rounded-full flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{interview.expert.name}</h4>
                    <p className="text-sm text-gray-600">
                      {interview.expert.title || "DTMI Guest Expert"}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm mb-6">
                  {interview.expert.bio || interview.expert.description || "Leading expert in digital transformation and cognitive organizational architecture."}
                </p>

                {/* Social Links */}
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 10.91l10.091-7.09h.273c.904 0 1.636.732 1.636 1.636z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Interview Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Interview Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Published:</span>
                    <span className="text-sm font-medium text-gray-900">{interview.metadata.publishDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reading Time:</span>
                    <span className="text-sm font-medium text-gray-900">{interview.metadata.readTime}</span>
                  </div>
                  {interview.metadata.interviewDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interview Date:</span>
                      <span className="text-sm font-medium text-gray-900">{interview.metadata.interviewDate}</span>
                    </div>
                  )}
                  {interview.metadata.location && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium text-gray-900">{interview.metadata.location}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Interview</h3>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Share
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Save
                  </button>
                </div>
              </div>

              {/* Admin Actions (Simple Local Detection) */}
              {/* {(window.location.hostname === 'localhost' || window.location.search.includes('admin=true')) && (
                <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                  <h3 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                    <Trash2 size={16} /> Admin Operations
                  </h3>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Delete Interview
                  </button>
                  <p className="text-[10px] text-red-400 mt-2 italic text-center">
                    Authorized locally for database maintenance.
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Related Expert Interviews */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Expert Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Expert Interview 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80"
                  alt="Digital Leadership Strategies"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Expert Interview
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    DTMI
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  Expert Interview: Digital Leadership Strategies for Modern Organizations
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  An in-depth conversation with industry leaders about the latest trends and strategies for digital leadership in today's rapidly evolving business landscape.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Jan 15, 2025</span>
                  <span>~8 min read</span>
                </div>
              </div>
            </div>

            {/* Mock Expert Interview 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="AI Innovation in Enterprise"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Expert Interview
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    DTMI
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  Expert Interview: AI Innovation and the Future of Enterprise Technology
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  Exploring how artificial intelligence is reshaping enterprise operations and what leaders need to know about implementing AI-driven solutions.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Jan 10, 2025</span>
                  <span>~7 min read</span>
                </div>
              </div>
            </div>

            {/* Mock Expert Interview 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Sustainable Business Transformation"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Expert Interview
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    DTMI
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  Expert Interview: Sustainable Business Transformation in the Digital Age
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  A comprehensive discussion on how organizations can balance digital transformation with sustainability goals and environmental responsibility.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Jan 8, 2025</span>
                  <span>~6 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Consign to Void"
        footer={(
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Abort
            </button>
            <button
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await blogService.deleteBlog(interview.id);
                  navigate('/admin-ui/media');
                } catch (err) {
                  console.error('Failed to delete:', err);
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-700 shadow-xl shadow-red-100 border border-red-500 transition-all flex items-center gap-2"
            >
              {isDeleting ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Delete Permanently
            </button>
          </div>
        )}
      >
        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100 mb-6">
          <AlertCircle className="text-red-500 shrink-0" size={24} />
          <div>
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Existential Warning</p>
            <p className="text-xs text-red-600/70 font-medium">This contribution will be erased from the collective memory.</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed italic">
          Are you certain you wish to delete "{interview.title}"? This protocol is non-restitutive.
        </p>
      </Modal>
    </div>
  );
};

export default ExpertInterviewPage;