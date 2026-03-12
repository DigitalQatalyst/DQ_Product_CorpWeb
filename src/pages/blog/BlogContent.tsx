import React from 'react';
import { BlogPost } from '../../data/mockBlogs';

interface BlogContentProps {
  blog: BlogPost;
}

export const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
  // Process content to add IDs to headings for navigation
  const processContent = (content: string) => {
    return content.replace(/<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/g, (_, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
    });
  };

  return (
    <article className="max-w-none">
      {/* Blog Content with Enhanced Typography */}
      <div 
        className="blog-content prose prose-lg prose-gray max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
          prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 
          prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg
          prose-blockquote:text-gray-800 prose-blockquote:font-medium prose-blockquote:italic
          prose-ul:my-6 prose-ul:space-y-2
          prose-ol:my-6 prose-ol:space-y-2
          prose-li:text-gray-700 prose-li:leading-relaxed
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: processContent(blog.content) }}
      />

      {/* Tags */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};