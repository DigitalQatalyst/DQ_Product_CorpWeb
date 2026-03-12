import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getSupabase } from '../../admin-ui/utils/supabaseClient';

interface RelatedPost {
  id: string;
  title: string;
  summary: string;
  hero_image?: string;
  thumbnail_url?: string;
  published_at: string;
  read_time?: number;
  slug: string;
  category?: string;
  type?: string;
  // Author information (optional – currently unused in UI)
  author_name?: string;
  author_title?: string;
  author_avatar?: string;
  author_bio?: string;
  author_linkedin?: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory?: string;
}

export function RelatedPosts({ currentPostId, currentCategory }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const supabase = getSupabase();

        let query = supabase
          .from('v_media_all')
          .select(
            'id, title, summary, hero_image, thumbnail_url, published_at, read_time, slug, category, type'
          )
          .in('type', ['Blog', 'Article', 'News', 'Guide'])
          .eq('status', 'Published')
          .eq('visibility', 'Public')
          .neq('id', currentPostId)
          .order('published_at', { ascending: false })
          .limit(6);

        const { data, error } = await query;
        if (error) throw error;

        let posts = data || [];

        // Prioritize same-category content
        if (currentCategory && posts.length > 3) {
          const sameCategoryPosts = posts.filter((post) => post.category === currentCategory);
          const otherPosts = posts.filter((post) => post.category !== currentCategory);

          // Take 3 from same category if possible, then fill with others
          posts = [
            ...sameCategoryPosts.slice(0, 3),
            ...otherPosts.slice(0, 3 - sameCategoryPosts.length),
          ].slice(0, 3); // final cap at 3 (you can increase this)
        } else {
          posts = posts.slice(0, 3);
        }

        setRelatedPosts(posts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, currentCategory]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6">
                      <div className="h-48 bg-gray-300 rounded mb-4" />
                      <div className="h-6 bg-gray-300 rounded mb-2" />
                      <div className="h-4 bg-gray-300 rounded mb-4" />
                      <div className="h-4 bg-gray-300 rounded w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Related Content</h2>
            <a
              href="/marketplace/knowledge-hub"
              className="inline-flex items-center text-primary hover:text-primary-600 font-medium transition-colors"
            >
              View All Posts
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => {
              const imageSrc = post.hero_image || post.thumbnail_url || '/images/default-blog.jpg';

              // You can decide later to use slug instead of id
              const postUrl = `/media/${(post.type || 'article').toLowerCase()}/${post.slug || post.id}`;

              return (
                <a
                  key={post.id}
                  href={postUrl}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={imageSrc}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.type && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                          {post.type}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{post.summary}</p>

                    <div className="flex items-center gap-5 text-sm text-gray-500 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <time dateTime={post.published_at}>
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>

                      {post.read_time && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{post.read_time} min read</span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}