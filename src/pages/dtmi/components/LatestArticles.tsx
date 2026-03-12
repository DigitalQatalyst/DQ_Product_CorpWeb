import { useMemo, useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAllCategories } from '../api/hooks';

export function LatestArticles() {
  const navigate = useNavigate();
  const { data: sanityCategories = [] } = useAllCategories();
  
  // Use Sanity categories if available, otherwise fallback to hardcoded
  const categories = sanityCategories.length > 0 
    ? sanityCategories.map(cat => cat.title)
    : ['Digital Economy 4.0', 'Digital Cognitive Organisation', 'Digital Business Platform', 'Digital Transformation 2.0', 'Digital Worker & Digital Workspace', 'Digital Accelerators'];
  
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  // Add dummy articles - only 3 articles as per moat task
  const dummyArticles = [
    {
      id: 'why-traditional-organizations-are-obsolete',
      slug: 'why-traditional-organizations-are-obsolete',
      title: 'Why Traditional Organizations Are Obsolete in Today\'s Digital Economy',
      category: 'Digital Economy 4.0',
      date: 'Dec 22, 2025',
      readTime: '7 min read',
      image: '/images/Article 01_hero image.png'
    },
    {
      id: 'traditional-digital-transformation-is-dead',
      slug: 'traditional-digital-transformation-is-dead',
      title: 'Traditional Digital Transformation is Dead: Meet the Future of Business',
      category: 'Digital Economy 4.0',
      date: 'Dec 20, 2025',
      readTime: '10 min read',
      image: '/images/Article 02_hero image.png'
    },
    {
      id: 'cognitive-organizations-article',
      slug: 'why-traditional-business-models-are-doomed',
      title: 'Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations',
      category: 'Digital Economy 4.0',
      date: 'Dec 15, 2025',
      readTime: '12 min read',
      image: '/images/Article 03_hero image.png'
    }
  ];

  // Transform Sanity articles to match the existing UI structure
  const articles = useMemo(() => {
    // Only use dummy articles (our 3 real articles) - ignore Sanity articles to avoid fake articles
    return dummyArticles;
  }, []);

  const filteredArticles = useMemo(() => 
    articles.filter(article => article.category === activeCategory), 
    [articles, activeCategory]
  );
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Latest Articles
          </h2>
          <a
            href="/marketplace/dtmi"
            className="inline-flex items-center gap-2 text-brand-coral font-semibold hover:text-brand-coral/80 transition-colors"
          >
            See All Articles
            <ArrowRight size={18} />
          </a>
        </div>
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => <button key={index} onClick={() => setActiveCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === activeCategory ? 'bg-brand-coral text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-brand-coral/10 hover:text-brand-coral'}`} aria-pressed={category === activeCategory}>
                {category}
              </button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {filteredArticles.map(article => <div 
              key={article.id} 
              className="group cursor-pointer"
              onClick={() => navigate(`/dtmi/article/${article.slug}`)}
            >
              <div className="overflow-hidden rounded-xl mb-4">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="mb-2">
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {article.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {article.date}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {article.readTime}
                </div>
              </div>
            </div>)}
          {filteredArticles.length === 0 && <div className="col-span-full text-center text-gray-500 py-8 rounded-lg border border-dashed border-gray-200">
              No articles in this track yet. Check back soon!
            </div>}
        </div>
      </div>
    </section>;
}