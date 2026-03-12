import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBlogs } from '../../../data/mockBlogs';

// Get the first 4 featured blogs from mockBlogs
const featuredBlogs = mockBlogs.filter(blog => blog.featured).slice(0, 4);
const mainFeaturedBlog = featuredBlogs[0];
const relatedBlogs = featuredBlogs.slice(1, 4);

export function FeaturedForecasts() {
  const navigate = useNavigate();

  const handleBlogClick = (slug: string) => {
    console.log('Navigating to blog:', slug);
    navigate(`/blog/${slug}`);
  };

  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Blogs
          </h2>
          <a
            href="/marketplace/dtmi"
            className="inline-flex items-center text-brand-coral hover:text-brand-coral/80 font-semibold"
          >
            View all blogs
            <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Featured Blog */}
          <div className="flex flex-col h-full cursor-pointer group" onClick={() => handleBlogClick(mainFeaturedBlog.slug)}>
            <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
              <img src={mainFeaturedBlog.heroImage} alt={mainFeaturedBlog.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="inline-block px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-md mb-4 self-start">
              {mainFeaturedBlog.category}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-brand-coral transition-colors">
              {mainFeaturedBlog.title}
            </h2>
            <p className="text-gray-700 text-lg mb-6 flex-grow">
              {mainFeaturedBlog.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>• {mainFeaturedBlog.readTime} min read</span>
              <span>• {mainFeaturedBlog.publishDate}</span>
            </div>
          </div>
          {/* Right side - Related Blogs */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Related Blogs
              </h3>
              <div className="space-y-8">
                {relatedBlogs.map(blog => <div key={blog.id} className="flex gap-4 group cursor-pointer" onClick={() => handleBlogClick(blog.slug)}>
                    <div className="flex-shrink-0">
                      <img src={blog.heroImage} alt={blog.title} className="w-28 h-24 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors">
                        {blog.title}
                      </h4>
                      <p className="text-sm text-gray-500">{blog.publishDate}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="mt-8" />
          </div>
        </div>
      </div>
    </section>;
}
