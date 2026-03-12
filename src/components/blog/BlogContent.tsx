import React from 'react';
interface BlogContentProps {
  content: string;
}
export function BlogContent({
  content
}: BlogContentProps) {
  return <article className="prose prose-lg max-w-none">
      <style>{`
        .prose {
          color: #374151;
          line-height: 1.8;
        }
        
        .prose .lead {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #4B5563;
          margin-bottom: 2rem;
          font-weight: 400;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .prose h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }
        
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .prose strong {
          color: #111827;
          font-weight: 600;
        }
        
        .prose blockquote {
          border-left: 4px solid #FF6B4D;
          padding-left: 1.5rem;
          margin: 2.5rem 0;
          font-size: 1.25rem;
          font-style: italic;
          color: #1F2937;
          background: #FFF7F5;
          padding: 1.5rem;
          padding-left: 2rem;
          border-radius: 0.5rem;
        }
        
        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin-bottom: 0.75rem;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .prose a {
          color: #FF6B4D;
          text-decoration: underline;
          text-decoration-color: #FF6B4D;
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
          transition: all 0.2s;
        }
        
        .prose a:hover {
          color: #e55a3d;
          text-decoration-color: #e55a3d;
        }
        
        .prose code {
          background: #F3F4F6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #1F2937;
        }
        
        .prose img {
          border-radius: 0.75rem;
          margin: 2rem 0;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{
      __html: content
    }} />
    </article>;
}