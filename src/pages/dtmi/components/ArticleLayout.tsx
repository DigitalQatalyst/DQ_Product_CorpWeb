import { useRef, useState, useEffect } from "react";
import { Header } from "../../../components/Header/Header";
import { Footer } from "../../../components/Footer/Footer";
import AttractButton from "../../../components/ui/AttractButton";
import { useToast } from "../../../components/ui/Toast";
import { submitNewsletterSubscription } from "../../../services/airtableService";
import { ArticleAuthorCard } from "../ArticleAuthorCard";
import { RelatedPosts } from "../../../components/blog/RelatedPosts";
import { WhitepaperAccessModal } from "../../../components/WhitepaperAccessModal";

interface ArticleLayoutProps {
  id?: string;
  slug: string;
  title: string;
  heroImage: string;
  category: string;
  date: string;
  readTime: string;
  excerpt?: string;
  author?: {
    id?: string;
    name: string;
    title: string;
    avatar?: string;
    bio?: string;
  };
  tags?: string[];
  whitepaperUrl?: string;
  children: React.ReactNode;
}

export function ArticleLayout({
  id,
  slug,
  title,
  heroImage,
  category,
  date,
  readTime,
  excerpt,
  author,
  tags = [],
  whitepaperUrl,
  children
}: ArticleLayoutProps) {
  const [stickyStyle, setStickyStyle] = useState<React.CSSProperties>({});
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const articleContentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (!articleContentRef.current || !buttonsRef.current || !subscribeRef.current) return;

      const articleRect = articleContentRef.current.getBoundingClientRect();
      const subscribeRect = subscribeRef.current.getBoundingClientRect();
      const buttonsHeight = buttonsRef.current.offsetHeight;
      const articleTop = articleRect.top;
      const subscribeTop = subscribeRect.top;
      const stopStickyPoint = subscribeTop - buttonsHeight - 32;

      if (articleTop <= 16 && stopStickyPoint > 16) {
        setStickyStyle({ position: 'fixed', top: '16px', zIndex: 10 });
      } else if (stopStickyPoint <= 16) {
        setStickyStyle({ position: 'fixed', top: `${subscribeTop - buttonsHeight - 32}px`, zIndex: 10 });
      } else {
        setStickyStyle({ position: 'sticky', top: '16px' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copied to clipboard! 🎉', 'success'))
      .catch(() => showToast('Failed to copy link. Please try again.', 'error'));
  };

  const handleSubscribeClick = () => {
    if (!showEmailInput) setShowEmailInput(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitNewsletterSubscription({
        email: email.trim(),
        source: `Article - ${slug}`,
        ipAddress: '',
        userAgent: navigator.userAgent
      });
      showToast('Successfully subscribed! 🎉', 'success');
      setEmail('');
      setShowEmailInput(false);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      showToast('Failed to subscribe. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ToastContainer />

      <article className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to DTMI Content Marketplace
        </button>

        <header className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">{title}</h1>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, '_blank')}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-all border border-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={heroImage} alt={title} className="w-full h-[400px] object-cover" />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-base text-gray-700">
            <span className="font-semibold text-secondary-600">{category}</span>
            <span className="text-gray-400">|</span>
            <span>{date}</span>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readTime}</span>
            </div>
          </div>
        </header>

        {excerpt && (
          <div className="mb-12">
            <p className="text-xl text-gray-700 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-6">
              {excerpt}
            </p>
          </div>
        )}

        {(() => {
          console.log('🔍 ArticleLayout - Author prop received:', author);
          console.log('🔍 ArticleLayout - Author exists?', !!author);
          console.log('🔍 ArticleLayout - Author name:', author?.name);
          return null;
        })()}

        {author && (
          <ArticleAuthorCard author={{
            name: author.name,
            title: author.title,
            avatar: author.avatar || '/images/default-avatar.png',
            bio: author.bio || '',
            slug: author.name.toLowerCase().replace(/\s+/g, '-')
          }} />
        )}
      </article>

      <div className="border-t border-gray-200" />

      <div ref={articleContentRef} className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8">
            <div className="hidden lg:block">
              <div ref={buttonsRef} style={stickyStyle}>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => showToast('Article saved to your library! 📚', 'success')}
                    className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200"
                  >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-xs text-gray-600 mt-1">Save</span>
                  </button>

                  <button
                    onClick={handleShareClick}
                    className="w-14 h-14 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center transition-all group border border-gray-200"
                  >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs text-gray-600 mt-1">Share</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              {children}

              {whitepaperUrl && (
                <div className="bg-gradient-to-r from-[#1E3C8B] to-cyan-400 px-8 py-8 rounded-2xl my-12 shadow-lg border border-white/10">
                  <h3 className="text-2xl font-bold mb-3 text-white leading-tight">
                    Read the Full Whitepaper
                  </h3>
                  <p className="text-base mb-6 text-white/90 leading-relaxed max-w-2xl font-medium">
                    To learn more about the cognitive revolution and how Digital Cognitive Organizations will reshape your industry, read our full analysis.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-block px-8 py-3.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl active:scale-95"
                  >
                    Access Whitepaper
                  </button>
                </div>
              )}


              <div className="mt-16 pt-8 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                  Featured Topics
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {(tags && tags.length > 0 ? tags : [category, 'Digital Transformation', 'Business Strategy']).map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold border border-gray-100 hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <RelatedPosts currentPostId={id || slug} currentCategory={category} />
      </div>

      {whitepaperUrl && (
        <WhitepaperAccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          whitepaperUrl={whitepaperUrl}
          whitepaperTitle={title}
        />
      )}

      <div ref={subscribeRef} className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Never miss a story</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest insights on digital transformation and cognitive organizations delivered to your inbox
          </p>

          {!showEmailInput ? (
            <AttractButton onClick={handleSubscribeClick}>Subscribe</AttractButton>
          ) : (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                  autoFocus
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEmailInput(false); setEmail(''); }}
                    className="px-4 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
