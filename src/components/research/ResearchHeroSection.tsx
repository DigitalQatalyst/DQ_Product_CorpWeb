import React from 'react';
import { FileText, Users, Calendar, Clock, BookOpen, Share2, Download, Heart } from 'lucide-react';

interface ResearchHeroSectionProps {
  title?: string;
  description?: string;
  authors?: string[];
  date?: string;
  journalName?: string;
  pages?: number;
  readTime?: number;
  citations?: number;
  views?: number;
  heroImage?: string;
}

const ResearchHeroSection: React.FC<ResearchHeroSectionProps> = ({
  title = "The Impact of Artificial Intelligence on Modern Healthcare Diagnostics",
  description,
  authors = ["Dr. Sarah Chen", "Dr. Michael Roberts", "Dr. Emily Watson"],
  date = "January 15, 2025",
  journalName = "Journal of Medical AI Research",
  pages = 42,
  readTime = 18,
  citations = 2847,
  views = 15200,
  heroImage = "/images/hero-healthcare-ai.jpg"
}) => {
  return (
    <header className="relative min-h-[70vh] flex items-end overflow-hidden pb-12 pt-20">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80"></div>
      </div>

      {/* Hero Content - Left Aligned */}
      <div className="relative z-10 px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
            {/* Main Content - Aligned with TOC */}
            <div className="lg:col-span-2">
              <div className="text-left max-w-4xl">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
                  <FileText className="w-4 h-4" />
                  Research Report
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                  {title}
                </h1>

                {description && (
                  <p className="text-lg text-white/80 max-w-3xl mb-8">
                    {description}
                  </p>
                )}

                {/* Author & Meta Info */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{authors.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{date}</span>
                  </div>
                  {journalName && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>{journalName}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mb-8 text-sm text-white/60">
                  {pages > 0 && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>{pages} Pages</span>
                    </div>
                  )}
                  {readTime > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{readTime} min read</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Stats & Actions */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Metrics with enhanced styling */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Heart className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white">{citations.toLocaleString()}</span>
                      <span className="text-xs text-white/60">Citations</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Users className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white">{views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}</span>
                      <span className="text-xs text-white/60">Views</span>
                    </div>
                  </div>

                  <div className="hidden sm:block h-10 w-px bg-white/20 mx-2" />

                  {/* Enhanced CTA Buttons */}
                  <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-sm">
                    <Share2 className="w-4 h-4 text-white/60 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-white">Share</span>
                  </button>

                  <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResearchHeroSection;