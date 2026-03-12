import React from 'react';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface BlogHeaderProps {
  title: string;
  subtitle: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  category: string;
  image: string;
}
export function BlogHeader({
  title,
  subtitle,
  author,
  date,
  readTime,
  category,
  image
}: BlogHeaderProps) {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    // Create a slug from the author name - handle special characters properly
    let authorSlug = author.name.toLowerCase()
      .replace(/é/g, 'e')  // Handle accented characters
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '');  // Remove other special characters

    // Handle specific author name mappings
    if (author.name === 'Kaylynn Océanne') {
      authorSlug = 'kaylynn-oceanne';
    } else if (author.name === 'Dr. Stéphane Niango') {
      authorSlug = 'dr-stephane-niango';
    }

    navigate(`/authors/${authorSlug}`);
  };

  return <div className="relative bg-white">
    {/* Hero Image */}
    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      {/* Slight overall overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      {/* Gradient overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* Back Button Overlay */}
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
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-6">
            <Tag size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-200">
            {/* Author */}
            <div className="flex items-center gap-3">
              <button onClick={handleAvatarClick} className="group">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover hover:shadow-lg transition-all duration-200 group-hover:scale-105 cursor-pointer"
                />
              </button>
              <div>
                <div className="font-semibold text-gray-900">
                  {author.name}
                </div>
                <div className="text-sm text-gray-600">{author.role}</div>
              </div>
            </div>

            {/* Date & Read Time */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}