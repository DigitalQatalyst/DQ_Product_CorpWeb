import React from 'react';
import { mockBlogs } from '../../data/mockBlogs';

interface RelatedBlogsProps {
  currentBlogId: string;
}

export const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ currentBlogId }) => {
  // Get related blogs (excluding current blog)
  const relatedBlogs = mockBlogs
    .filter(blog => blog.id !== currentBlogId)
    .slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Continue Reading</h2>
        <a
          href="/blog"
          className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
        >
          View All Posts
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog) => (
          <article key={blog.id} className="group cursor-pointer">
            <a href={`/blog/${blog.slug}`} className="block">
              <div className="aspect-[16/10] overflow-hidden rounded-lg mb-4">
                <img
                  src={blog.heroImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{blog.publishDate}</span>
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};