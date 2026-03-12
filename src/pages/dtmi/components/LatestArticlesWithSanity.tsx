// Example component showing how to integrate Sanity CMS
import { useLatestArticles } from '../api/hooks';

export const LatestArticlesWithSanity = () => {
  const { data: articles, loading, error } = useLatestArticles();

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading articles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-600">Error loading articles: {error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {article.mainImageLqip && (
                  <img
                    src={article.mainImageLqip}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-sm"
                  />
                )}
                <img
                  src={article.mainImageUrl}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                {article.categories && article.categories.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {article.categories.map((cat) => (
                      <span key={cat._id} className="text-sm text-blue-600 font-semibold">
                        {cat.title}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-xl font-bold mt-2 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {article.author?.imageUrl && (
                      <img
                        src={article.author.imageUrl}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700">{article.author?.name}</span>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
