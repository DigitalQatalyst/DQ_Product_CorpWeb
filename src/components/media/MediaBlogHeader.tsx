import React from 'react';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MediaBlogHeaderProps {
  title: string;
  description: string;
  provider: {
    name: string;
    logoUrl?: string;
  };
  author?: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    linkedIn?: string;
  };
  date: string;
  mediaType: string;
  imageUrl?: string;
  readTime?: number;
  category?: string;
}

export function MediaBlogHeader({
  title,
  description,
  provider,
  author,
  date,
  mediaType,
  imageUrl,
  readTime,
  category
}: MediaBlogHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white">
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={imageUrl || '/images/default-hero.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-8 left-4 md:left-6 z-20">
          <button
            onClick={() => navigate('/marketplace/dtmi')}
            className="inline-flex items-center gap-2 text-white hover:text-primary bg-black/20 hover:bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Knowledge Hub</span>
          </button>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto -mt-32 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Media Type Badge */}
            <div className="flex items-center gap-2 mb-6">
              <Tag size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                {mediaType}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-200">
              {/* Author (for blogs) or Provider (for other content) */}
              <div className="flex items-center gap-3">
                <img
                  src={author?.avatar || provider.logoUrl || '/mzn_logo.png'}
                  alt={author?.name || provider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {author?.name || provider.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {author?.title || 'Content Provider'}
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {category && (
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>{category}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(date).toLocaleDateString()}</span>
                </div>
                {readTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{readTime} min read</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}