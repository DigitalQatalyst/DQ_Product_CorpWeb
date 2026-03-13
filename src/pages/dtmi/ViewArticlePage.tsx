import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Article1Content } from "./Article1Content";
import { Article2Content } from "./Article2Content";
import { Article3Content } from "./Article3Content";
import { ArticleLayout } from "./components/ArticleLayout";
import { useArticleBySlug } from "./api/hooks";
import { useToast } from "../../components/ui/Toast";
import AttractButton from "../../components/ui/AttractButton";

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
    Content: Article2Content
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
  const [stickyStyle, setStickyStyle] = useState<React.CSSProperties>({});
  const articleContentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleContentRef.current || !buttonsRef.current || !subscribeRef.current) return;

      const articleRect = articleContentRef.current.getBoundingClientRect();
      const subscribeRect = subscribeRef.current.getBoundingClientRect();
      const buttonsHeight = buttonsRef.current.offsetHeight;

      // Article content section boundaries
      const articleTop = articleRect.top;
      const articleBottom = articleRect.bottom;

      // Subscribe section top
      const subscribeTop = subscribeRect.top;

      // Calculate when buttons should stop being sticky
      const stopStickyPoint = subscribeTop - buttonsHeight - 32; // 32px margin from subscribe section

      if (articleTop <= 16 && stopStickyPoint > 16) {
        // Sticky behavior within article content
        setStickyStyle({
          position: 'fixed',
          top: '16px',
          zIndex: 10
        });
      } else if (stopStickyPoint <= 16) {
        // Stop sticky and position relative to subscribe section
        const offset = subscribeTop - buttonsHeight - 32;
        setStickyStyle({
          position: 'fixed',
          top: `${offset}px`,
          zIndex: 10
        });
      } else {
        // Default position
        setStickyStyle({
          position: 'sticky',
          top: '16px'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If it's our dummy articles, show appropriate content
  if (slug === "why-traditional-business-models-are-doomed") {
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
              Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations
            </h1>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
            <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8">
              {/* Sticky Save/Share Buttons - Left Column */}
              <div className="hidden lg:block">
                <div ref={buttonsRef} style={stickyStyle}>
                  <div className="flex flex-col gap-4">
                    <button className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200">
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-1">Save</span>
                    </button>

                    <button className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200">
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-1">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Article Content - Right Column */}
              <div className="prose prose-lg max-w-none">
                <Article1Content />
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Banner */}
        <div ref={subscribeRef} className="bg-gray-100 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Never miss a story
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest insights on digital transformation and cognitive organizations delivered to your inbox
            </p>
            <AttractButton>
              Subscribe
            </AttractButton>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Article 2: Traditional Digital Transformation is Dead
  if (slug === "traditional-digital-transformation-is-dead") {
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
              Traditional Digital Transformation is Dead: Meet the Future of Business
            </h1>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
            <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8">
              {/* Sticky Save/Share Buttons - Left Column */}
              <div className="hidden lg:block">
                <div ref={buttonsRef} style={stickyStyle}>
                  <div className="flex flex-col gap-4">
                    <button className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200">
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-1">Save</span>
                    </button>

                    <button className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200">
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-1">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Article Content - Right Column */}
              <div className="prose prose-lg max-w-none">
                <Article2Content />
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Banner */}
        <div ref={subscribeRef} className="bg-gray-100 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Never miss a story
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest insights on digital transformation and cognitive organizations delivered to your inbox
            </p>
            <AttractButton>
              Subscribe
            </AttractButton>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Article 3: Why Traditional Organizations Are Obsolete
  if (slug === "why-traditional-organizations-are-obsolete") {
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
              Why Traditional Organizations Are Obsolete in Today's Digital Economy
            </h1>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
            <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8">
              {/* Sticky Save/Share Buttons - Left Column */}
              <div className="hidden lg:block">
                <div ref={buttonsRef} style={stickyStyle}>
                  <div className="flex flex-col gap-4">
                    <button className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200">
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-1">Save</span>
                    </button>

                    <button className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200">
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-1">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Article Content - Right Column */}
              <div className="prose prose-lg max-w-none">
                <Article3Content />
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Banner */}
        <div ref={subscribeRef} className="bg-gray-100 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Never miss a story
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest insights on digital transformation and cognitive organizations delivered to your inbox
            </p>
            <AttractButton>
              Subscribe
            </AttractButton>
          </div>
        </div>

        <Footer />
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
