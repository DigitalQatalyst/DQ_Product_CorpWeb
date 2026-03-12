import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { BlogHeader } from "../../components/blog/BlogHeader";
import { BlogContent } from "./BlogContent";
import { BlogSidebar } from "../../components/blog/BlogSidebar";
import { AuthorCard } from "../../components/blog/AuthorCard";
import { RelatedPosts } from "../../components/blog/RelatedPosts";
import { blogService, Blog } from "../../admin-ui/utils/supabase";
import { useBlogTracking } from "../../hooks/useAnalytics";
import { mockBlogs } from "../../data/mockBlogs";

export default function BlogPage() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [stickyStyle, setStickyStyle] = useState<React.CSSProperties>({});
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blogContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const relatedPostsRef = useRef<HTMLDivElement>(null);

  // Fetch blog data from database or fallback to mockBlogs
  useEffect(() => {
    async function fetchBlog() {
      if (!slug && !id) return;

      try {
        setLoading(true);
        setError(null);
        let blogData;
        
        // Try to fetch from database first
        try {
          if (slug) {
            blogData = await blogService.getBlogBySlug(slug);
          } else if (id) {
            blogData = await blogService.getBlogById(id);
          }
        } catch (dbError) {
          console.log("Blog not found in database, checking mockBlogs...");
          // Fallback to mockBlogs if database fetch fails
          if (slug) {
            const mockBlog = mockBlogs.find(b => b.slug === slug);
            if (mockBlog) {
              blogData = mockBlog as any;
            }
          } else if (id) {
            const mockBlog = mockBlogs.find(b => b.id === id);
            if (mockBlog) {
              blogData = mockBlog as any;
            }
          }
        }
        
        if (!blogData) {
          throw new Error("Blog not found");
        }
        
        setBlog(blogData);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Blog post not found");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug, id]);

  useEffect(() => {
    const handleScroll = () => {
      // Only apply sticky behavior on desktop (lg breakpoint and above)
      if (window.innerWidth < 1024) {
        setStickyStyle({});
        return;
      }

      if (
        !blogContentRef.current ||
        !sidebarRef.current ||
        !relatedPostsRef.current
      )
        return;

      const contentRect = blogContentRef.current.getBoundingClientRect();
      const relatedPostsRect = relatedPostsRef.current.getBoundingClientRect();
      const sidebarHeight = sidebarRef.current.offsetHeight;

      // Capture the original sidebar width and position when it's in normal flow
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const sidebarWidth = sidebarRef.current.offsetWidth;
      const sidebarLeft = sidebarRect.left;

      // Blog content section boundaries
      const contentTop = contentRect.top;

      // Related posts section top
      const relatedPostsTop = relatedPostsRect.top;

      // Calculate when sidebar should stop being sticky
      const stopStickyPoint = relatedPostsTop - sidebarHeight - 32; // 32px margin from related posts section

      if (contentTop <= 16 && stopStickyPoint > 16) {
        // Sticky behavior within blog content - preserve width and position
        setStickyStyle({
          position: "fixed",
          top: "16px",
          left: `${sidebarLeft}px`,
          width: `${sidebarWidth}px`,
          zIndex: 10,
        });
      } else if (stopStickyPoint <= 16) {
        // Stop sticky and position relative to related posts section - preserve width
        const offset = relatedPostsTop - sidebarHeight - 32;
        setStickyStyle({
          position: "fixed",
          top: `${offset}px`,
          left: `${sidebarLeft}px`,
          width: `${sidebarWidth}px`,
          zIndex: 10,
        });
      } else {
        // Default position - no width constraint needed
        setStickyStyle({
          position: "sticky",
          top: "16px",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  // Initialize blog tracking (used for side effects - analytics tracking)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const blogTracking = useBlogTracking({
    id: blog?.id || "",
    title: blog?.title || "",
    category: blog?.category || "",
    author: blog?.author?.name || "Unknown Author",
  });

  // Update document head with SEO metadata
  useEffect(() => {
    if (blog) {
      // Update title
      document.title = blog.title || `${blog.title} | DigitalQatalyst`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", blog.excerpt);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = blog.excerpt;
        document.head.appendChild(meta);
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", blog.tags.join(", "));
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = blog.tags.join(", ");
        document.head.appendChild(meta);
      }

      // Add Open Graph tags
      const updateOrCreateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute("content", content);
        } else {
          meta = document.createElement("meta");
          meta.setAttribute("property", property);
          meta.setAttribute("content", content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateMetaTag("og:title", blog.title);
      updateOrCreateMetaTag("og:description", blog.excerpt);
      updateOrCreateMetaTag("og:image", blog.heroImage);
      updateOrCreateMetaTag(
        "og:url",
        `https://digitalqatalyst.com/blog/${blog.slug}`,
      );
      updateOrCreateMetaTag("og:type", "article");
    }
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Blog post not found
          </h1>
          <p className="text-gray-600">
            {error || "The blog post you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Blog Header */}
      <BlogHeader
        title={blog.title}
        subtitle={blog.excerpt}
        author={{
          name: blog.author?.name || "Unknown Author",
          role: blog.author?.title || "",
          avatar: blog.author?.avatar || "/images/default-avatar.png",
        }}
        date={new Date(blog.publishDate).toLocaleDateString()}
        readTime={`${blog.readTime} min read`}
        category={blog.category}
        image={blog.heroImage}
      />

      {/* Main Content */}
      <div
        ref={blogContentRef}
        className="container mx-auto px-4 md:px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Blog Content */}
            <div className="lg:col-span-2">
              <BlogContent blog={blog as any} />

              {/* Author Card */}
              <AuthorCard
                author={{
                  name: blog.author?.name || "Unknown Author",
                  role: blog.author?.title || "",
                  avatar: blog.author?.avatar || "/images/default-avatar.png",
                  bio: blog.author?.bio || "",
                  linkedIn: blog.author?.linkedIn || undefined,
                  twitter: blog.author?.twitter || undefined,
                  website: blog.author?.website || undefined,
                  email: blog.author?.email || undefined,
                }}
              />
            </div>

            {/* Smart Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div ref={sidebarRef} style={stickyStyle}>
                <BlogSidebar blogTitle={blog.title} blogSlug={blog.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div ref={relatedPostsRef}>
        <RelatedPosts currentPostId={blog.id} />
      </div>

      <Footer />
    </div>
  );
}
