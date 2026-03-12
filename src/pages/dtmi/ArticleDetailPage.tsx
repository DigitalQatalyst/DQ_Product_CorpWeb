import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Calendar, Clock, Eye } from "lucide-react";
import { sampleArticle } from "../../data/sampleArticle";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // For now, only show our sample article
  if (slug !== "why-traditional-business-models-are-doomed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate("/dtmi")}
            className="text-primary hover:text-primary-600"
          >
            Back to DTMI
          </button>
        </div>
      </div>
    );
  }

  const article = sampleArticle;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {article.publishedAt}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {article.readTime}
          </div>
          <div className="flex items-center gap-2">
            <Eye size={16} />
            {article.views.toLocaleString()} views
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-12 rounded-2xl overflow-hidden">
          <img
            src={article.mainImage}
            alt={article.title}
            className="w-full h-auto"
          />
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
            <p className="text-sm text-gray-600">{article.author.title}</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content.introduction}
          </p>
        </div>

        {/* Content Sections */}
        {article.content.sections.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {section.heading}
            </h2>
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
            {section.image && (
              <div className="my-8 rounded-xl overflow-hidden">
                <img
                  src={section.image}
                  alt={section.heading}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        ))}

        {/* Call to Action */}
        <div className="my-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {article.content.callToAction.title}
          </h3>
          <p className="text-lg mb-6 text-white/90">
            {article.content.callToAction.description}
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            {article.content.callToAction.buttonText}
          </button>
        </div>

        {/* Tags */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {article.relatedArticles.map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/dtmi/article/${related.id}`)}
              >
                <img
                  src={related.image}
                  alt={related.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                    {related.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {related.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-secondary-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never miss a story
          </h2>
          <p className="text-white/80 mb-8">
            Subscribe to the DQ Newsletter and get the latest insights on digital transformation delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
