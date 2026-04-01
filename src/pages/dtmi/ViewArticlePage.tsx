import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Article1Content } from "./Article1Content";
// import { Article2Content } from "./Article2Content"; // Temporarily commented out
import { Article3Content } from "./Article3Content";
import { ArticleLayout } from "./components/ArticleLayout";
import { useArticleBySlug } from "./api/hooks";
import { useToast } from "../../components/ui/Toast";

// Article metadata configuration
const ARTICLE_CONFIG: Record<string, {
  title: string;
  heroImage: string;
  category: string;
  date: string;
  readTime: string;
  Content: React.ComponentType;
}> = {
  "why-traditional-business-models-are-doomed": {
    title: "Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations",
    heroImage: "/images/Article 01_hero image.png",
    category: "Digital Economy 4.0",
    date: "December 18, 2025",
    readTime: "8 min read",
    Content: Article1Content
  },
  "traditional-digital-transformation-is-dead": {
    title: "Traditional Digital Transformation is Dead: Meet the Future of Business",
    heroImage: "/images/Article 02_hero image.png",
    category: "Digital Economy 4.0",
    date: "December 20, 2025",
    readTime: "10 min read",
    Content: () => <div>Article content temporarily unavailable</div> // Article2Content
  },
  "why-traditional-organizations-are-obsolete": {
    title: "Why Traditional Organizations Are Obsolete in Today's Digital Economy",
    heroImage: "/images/Article 03_hero image.png",
    category: "Digital Economy 4.0",
    date: "December 22, 2025",
    readTime: "7 min read",
    Content: Article3Content
  }
};

export default function ViewArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const articleContentRef = useRef<HTMLDivElement>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = (platform: string, title: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
    setShowShareModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareModal(false);
      }, 2000);
    });
  };

  const ShareModal = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Article</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => handleShare('twitter', title)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </div>
            <span className="text-gray-700">Share on Twitter</span>
          </button>

          <button
            onClick={() => handleShare('linkedin', title)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <span className="text-gray-700">Share on LinkedIn</span>
          </button>

          <button
            onClick={() => handleShare('facebook', title)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span className="text-gray-700">Share on Facebook</span>
          </button>

          <button
            onClick={() => handleShare('email', title)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span className="text-gray-700">Share via Email</span>
          </button>

          <div className="border-t pt-3">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                {copySuccess ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                )}
              </div>
              <span className="text-gray-700">
                {copySuccess ? 'Link Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // If it's our dummy articles, show appropriate content
  if (slug === "why-traditional-business-models-are-doomed") {
    const articleTitle = "Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations";
    
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <article className="max-w-5xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back Home
          </button>

          {/* Article Header */}
          <header className="mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              {articleTitle}
            </h1>

            {/* Share Button */}
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors border border-orange-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Hero Image */}
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src="/images/Article 01_hero image.png"
                alt="Cognitive Organizations"
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-base text-gray-700">
              <span className="font-semibold text-secondary-600">Digital Economy 4.0</span>
              <span className="text-gray-400">|</span>
              <span>December 18, 2025</span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>8 min read</span>
              </div>
            </div>
          </header>

        </article>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Article Content Section */}
        <div ref={articleContentRef} className="bg-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <Article1Content />
            </div>
          </div>
        </div>

        <Footer />
        
        {/* Share Modal */}
        {showShareModal && <ShareModal title={articleTitle} onClose={() => setShowShareModal(false)} />}
      </div>
    );
  }

  // Article 2: Traditional Digital Transformation is Dead
  if (slug === "traditional-digital-transformation-is-dead") {
    const articleTitle = "Traditional Digital Transformation is Dead: Meet the Future of Business";
    
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <article className="max-w-5xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back Home
          </button>

          {/* Article Header */}
          <header className="mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              {articleTitle}
            </h1>

            {/* Share Button */}
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors border border-orange-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Hero Image */}
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src="/images/Article 02_hero image.png"
                alt="Digital Cognitive Organizations"
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-base text-gray-700">
              <span className="font-semibold text-secondary-600">Digital Economy 4.0</span>
              <span className="text-gray-400">|</span>
              <span>December 20, 2025</span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>10 min read</span>
              </div>
            </div>
          </header>

        </article>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Article Content Section */}
        <div ref={articleContentRef} className="bg-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <div>Article content temporarily unavailable</div>
            </div>
          </div>
        </div>

        <Footer />
        
        {/* Share Modal */}
        {showShareModal && <ShareModal title={articleTitle} onClose={() => setShowShareModal(false)} />}
      </div>
    );
  }

  // Article 3: Why Traditional Organizations Are Obsolete
  if (slug === "why-traditional-organizations-are-obsolete") {
    const articleTitle = "Why Traditional Organizations Are Obsolete in Today's Digital Economy";
    
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <article className="max-w-5xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back Home
          </button>

          {/* Article Header */}
          <header className="mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              {articleTitle}
            </h1>

            {/* Share Button */}
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors border border-orange-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Hero Image */}
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src="/images/Article 03_hero image.png"
                alt="Traditional Organizations"
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-base text-gray-700">
              <span className="font-semibold text-secondary-600">Digital Economy 4.0</span>
              <span className="text-gray-400">|</span>
              <span>December 22, 2025</span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>7 min read</span>
              </div>
            </div>
          </header>

        </article>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Article Content Section */}
        <div ref={articleContentRef} className="bg-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <Article3Content />
            </div>
          </div>
        </div>

        <Footer />
        
        {/* Share Modal */}
        {showShareModal && <ShareModal title={articleTitle} onClose={() => setShowShareModal(false)} />}
      </div>
    );
  }

  // Then try to load from Supabase
  return <SupabaseArticleView slug={slug || ''} />;
}

// Component for Supabase articles with premium layout
function SupabaseArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { blogService } = await import("../../admin-ui/utils/supabase");
        const result = await blogService.getBlogs({ slug });
        if (result.data.length > 0) {
          const fetchedArticle = result.data[0];
          console.log('📰 Fetched Article Data:', fetchedArticle);
          console.log('👤 Author Object:', fetchedArticle.author);
          setArticle(fetchedArticle);
        }
      } catch (err) {
        console.error("Failed to fetch article from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    // Fallback to Sanity if not in Supabase
    return <SanityArticleView slug={slug} />;
  }

  console.log('🎨 Rendering Article with Author:', article.author);

  return (
    <ArticleLayout
      id={article.id}
      slug={article.slug}
      title={article.title}
      heroImage={article.heroImage || article.hero_image}
      category={article.categoryName || article.category || "Digital Economy 4.0"}
      date={new Date(article.publishDate || article.publish_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })}
      readTime={`${article.readTime || article.read_time || 5} min read`}
      excerpt={article.excerpt}
      author={article.author}
      tags={article.tags}
      whitepaperUrl={article.whitepaperUrl || article.whitepaper_url}
    >
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </ArticleLayout>
  );
}

// Separate component for Sanity articles to avoid hook rules violation
function SanityArticleView({ slug }: { slug: string }) {
  const { data: article, loading } = useArticleBySlug(slug);
  const { ToastContainer } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ArticleLayout
      slug={slug}
      title={article.title}
      heroImage={article.mainImage || ""}
      category={article.categories?.[0]?.title || "Digital Economy 4.0"}
      date={new Date(article.publishedAt || "").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })}
      readTime={`${article.estimatedReadTime || 5} min read`}
    >
      <div className="prose prose-lg max-w-none">
        <p>Sanity article view - coming soon</p>
      </div>
    </ArticleLayout>
  );
}
