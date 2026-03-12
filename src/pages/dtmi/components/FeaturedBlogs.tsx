import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getKnowledgeHubItems } from "../../../utils/mockMarketplaceData";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  readTime?: string;
  date: string;
}

export function FeaturedBlogs() {
  const navigate = useNavigate();
  const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      // Fetch all knowledge hub items (same as marketplace)
      const allItems = await getKnowledgeHubItems();

      // Filter for blogs only
      const blogs = allItems.filter((item) => item.mediaType === "Blog");

      console.log("Featured Blogs - fetched blogs:", blogs.length);

      if (blogs && blogs.length > 0) {
        // Map knowledge hub items to component format
        const mappedBlogs = blogs.slice(0, 5).map((blog: any) => {
          console.log("Blog image URL:", blog.title, "→", blog.imageUrl);
          return {
            id: blog.id,
            title: blog.title,
            description:
              blog.summary ||
              blog.description ||
              "Explore this blog on digital transformation.",
            image: blog.imageUrl || "/images/Article 01_hero image.png",
            link: blog.blogUrl || `/blog/${blog.slug}`,
            category: blog.category || "Digital Transformation",
            readTime: "5 min read",
            date: blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Recently published",
          };
        });

        setFeaturedBlog(mappedBlogs[0]);
        setRelatedBlogs(mappedBlogs.slice(1, 5));
      } else {
        useFallbackData();
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackData = () => {
    setFeaturedBlog({
      id: 1,
      title: "Are We Watching the Rise of Compute Nationalism?",
      description:
        "As nations race to control AI infrastructure and computing resources, we explore how geopolitical tensions are reshaping the global technology landscape and what it means for businesses.",
      image: "/images/Article 01_hero image.png",
      link: "/blog",
      category: "Geopolitics & Technology",
      readTime: "12 min read",
      date: "December 15, 2025",
    });

    setRelatedBlogs([
      {
        id: 2,
        title: "Is Beijing Building the World's First AI Superstate?",
        date: "December 12, 2025",
        image: "/images/Article 02_hero image.png",
        link: "/blog",
        description: "",
        category: "",
      },
      {
        id: 3,
        title: "Europe Wants Ethical AI. But Without Compute, Can It Compete?",
        date: "December 10, 2025",
        image: "/images/Article 03_hero image.png",
        link: "/blog",
        description: "",
        category: "",
      },
      {
        id: 4,
        title:
          "AI Without Compute: Is the Global South Being Left Out of the New Digital Economy?",
        date: "December 8, 2025",
        image: "/images/Article 01_hero image.png",
        link: "/blog",
        description: "",
        category: "",
      },
      {
        id: 5,
        title:
          "The Race for Computing Power: Who Will Control the Digital Future?",
        date: "December 5, 2025",
        image: "/images/Article 02_hero image.png",
        link: "/blog",
        description: "",
        category: "",
      },
    ]);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-gray-600">Loading blogs...</div>
        </div>
      </section>
    );
  }

  if (!featuredBlog) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Featured Blogs
          </h2>
          <button
            onClick={() => navigate("/marketplace/dtmi?contentType=blogs")}
            className="text-brand-coral hover:text-brand-coral/80 transition-colors font-semibold flex items-center gap-2"
          >
            View all blogs
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Featured Blog */}
          <div
            className="group cursor-pointer"
            onClick={() => navigate(featuredBlog.link)}
          >
            {/* Image */}
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <img
                src={featuredBlog.image}
                alt={featuredBlog.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Category Badge */}
            <span className="inline-block text-sm text-gray-600 mb-3">
              {featuredBlog.category}
            </span>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-brand-coral transition-colors leading-tight">
              {featuredBlog.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              {featuredBlog.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {featuredBlog.readTime && <span>• {featuredBlog.readTime}</span>}
              <span>• {featuredBlog.date}</span>
            </div>
          </div>

          {/* Right Column - Related Blogs */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Related Blogs
            </h3>
            <div className="space-y-5">
              {relatedBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group flex gap-4 cursor-pointer pb-5 border-b border-gray-200 last:border-b-0"
                  onClick={() => navigate(blog.link)}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500">{blog.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
