import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { blogService, Blog } from '../../admin-ui/utils/supabase';

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch blogs from database
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const data = await blogService.getBlogs({
          status: 'Published',
          visibility: 'Public'
        });
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Fallback to empty array
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const categories = ['All', 'Digital Transformation', 'Future of Work', 'AI Ethics'];

  const handleAvatarClick = (authorName: string) => {
    // Create a slug from the author name - handle special characters properly
    let authorSlug = authorName.toLowerCase()
      .replace(/é/g, 'e')  // Handle accented characters
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '');  // Remove other special characters

    // Handle specific author name mappings
    if (authorName === 'Kaylynn Océanne') {
      authorSlug = 'kaylynn-oceanne';
    } else if (authorName === 'Dr. Stéphane Niango') {
      authorSlug = 'dr-stephane-niango';
    }

    navigate(`/authors/${authorSlug}`);
  };

  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  const featuredBlog = blogs.find(blog => blog.featured) || blogs[0];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Digital Transformation Insights
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore the latest trends, strategies, and innovations shaping the future of business in the digital age.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Blog */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[4/3] lg:aspect-auto">
              <img
                src={featuredBlog.heroImage || '/images/default-blog-hero.jpg'}
                alt={featuredBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Featured
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {featuredBlog.category}
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                <a
                  href={`/blog/${featuredBlog.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {featuredBlog.title}
                </a>
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {featuredBlog.excerpt}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => handleAvatarClick(featuredBlog.author?.name || 'Unknown Author')} className="group">
                  <img
                    src={featuredBlog.author?.avatar || '/images/default-avatar.png'}
                    alt={featuredBlog.author?.name || 'Unknown Author'}
                    className="w-12 h-12 rounded-full object-cover hover:shadow-lg transition-all duration-200 group-hover:scale-105 cursor-pointer"
                  />
                </button>
                <div>
                  <p className="font-semibold text-gray-900">{featuredBlog.author?.name || 'Unknown Author'}</p>
                  <p className="text-sm text-gray-600">
                    {featuredBlog.publishDate ? new Date(featuredBlog.publishDate).toLocaleDateString() : 'Recent'} • {featuredBlog.readTime || 5} min read
                  </p>
                </div>
              </div>

              <a
                href={`/blog/${featuredBlog.slug}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Read Full Article
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={blog.heroImage || '/images/default-blog-hero.jpg'}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-500">{blog.readTime} min read</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  <a
                    href={`/blog/${blog.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {blog.title}
                  </a>
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {blog.excerpt}
                </p>

                <div className="flex items-center gap-3">
                  <button onClick={() => handleAvatarClick(blog.author?.name || 'Unknown Author')} className="group">
                    <img
                      src={blog.author?.avatar || '/images/default-avatar.png'}
                      alt={blog.author?.name || 'Unknown Author'}
                      className="w-8 h-8 rounded-full object-cover hover:shadow-lg transition-all duration-200 group-hover:scale-105 cursor-pointer"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {blog.author?.name || 'Unknown Author'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Latest Insights
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter and never miss the latest trends in digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}