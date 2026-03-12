import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { MediaBlogHeader } from "../../components/media/MediaBlogHeader";
import { BlogSidebar } from "../../components/blog/BlogSidebar";
import { BlogContent } from "../../components/blog/BlogContent";
import { AuthorCard } from "../../components/blog/AuthorCard";
import { RelatedPosts } from "../../components/blog/RelatedPosts";
import { mediaService } from "../../admin-ui/utils/supabase";

export default function MediaDetailBlogLayout() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Use the mediaService to fetch the media item by ID
        // The service will handle the mapping from the new schema
        const mediaItem = await mediaService.getMediaItemById(id);

        if (mediaItem) {
          console.log("📊 Media data fetched:", {
            id: mediaItem.id,
            type: mediaItem.type,
            title: mediaItem.title,
            author: mediaItem.author,
          });

          // Map author information from the mediaItem
          const authorInfo = mediaItem.author?.name
            ? {
                name: mediaItem.author.name,
                title: mediaItem.author.title || "Content Creator",
                bio:
                  mediaItem.author.bio || "Expert content creator and analyst",
                avatar: mediaItem.author.avatar || "/mzn_logo.png",
                linkedIn: mediaItem.author.linkedIn || null,
                twitter: mediaItem.author.twitter || null,
                website: mediaItem.author.website || null,
                email: mediaItem.author.email || null,
              }
            : null;

          console.log("👤 Author info mapped:", authorInfo);
          console.log("🔗 LinkedIn URL:", authorInfo?.linkedIn);

          setItem({
            id: mediaItem.id,
            title: mediaItem.title,
            description: mediaItem.summary,
            content: mediaItem.bodyHtml || mediaItem.body || "",
            mediaType: mediaItem.type || "Article",
            provider: {
              name: "Knowledge Hub",
              logoUrl: null,
            },
            // Use author info from the mapped media item
            author: authorInfo || {
              name: "Knowledge Hub",
              title: "Content Team",
              bio: "Expert content creator and analyst",
              avatar: "/mzn_logo.png",
              linkedIn: null,
              twitter: null,
              website: null,
              email: null,
            },
            imageUrl: mediaItem.thumbnailUrl || mediaItem.heroImage,
            videoUrl: mediaItem.videoUrl,
            audioUrl: mediaItem.podcastUrl,
            downloadUrl: mediaItem.documentUrl,
            tags: mediaItem.tags || [],
            date: mediaItem.publishedAt,
            category: mediaItem.category,
            readTime: mediaItem.readTime,
            highlights: mediaItem.highlights,
          });
        }
      } catch (err) {
        console.error("Error fetching media details:", err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Content not found
          </h1>
          <p className="text-gray-600">
            The content you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Media Header (Blog-style) */}
      <MediaBlogHeader
        title={item.title}
        description={item.description}
        provider={item.provider}
        author={item.author}
        date={item.date}
        mediaType={item.mediaType}
        imageUrl={item.imageUrl}
        readTime={item.readTime}
        category={item.category}
      />

      {/* Main Content (Blog-style layout) */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Media Content */}
              <div className="mb-8">
                {/* Video Player */}
                {item.videoUrl && (
                  <div className="aspect-w-16 aspect-h-9 mb-8">
                    <video
                      src={item.videoUrl}
                      controls
                      className="w-full rounded-lg"
                      poster={item.imageUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Audio Player */}
                {item.audioUrl && !item.videoUrl && (
                  <div className="bg-gray-100 rounded-lg p-6 mb-8">
                    <audio src={item.audioUrl} controls className="w-full">
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}

                {/* Blog Content with proper styling */}
                {item.content && <BlogContent content={item.content} />}
              </div>

              {/* Author Card for Blogs or Provider Card for other content */}
              {item.mediaType === "Blog" ? (
                <>
                  {console.log("🎯 AuthorCard Debug:", {
                    mediaType: item.mediaType,
                    hasAuthor: !!item.author,
                    authorName: item.author?.name,
                    authorData: item.author,
                  })}
                  <AuthorCard
                    author={{
                      name: item.author?.name || "Blog Author",
                      role: item.author?.title || "Content Creator",
                      avatar: item.author?.avatar || "/mzn_logo.png",
                      bio:
                        item.author?.bio ||
                        "Expert content creator and analyst specializing in digital transformation and business insights.",
                      linkedIn: item.author?.linkedIn,
                      twitter: item.author?.twitter,
                      website: item.author?.website,
                      email: item.author?.email,
                    }}
                  />
                </>
              ) : (
                <>
                  {console.log("🎯 Provider Card Debug:", {
                    mediaType: item.mediaType,
                    hasAuthor: !!item.author,
                    authorName: item.author?.name,
                    provider: item.provider,
                  })}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.provider.logoUrl || "/mzn_logo.png"}
                        alt={item.provider.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.provider.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Content provided by {item.provider.name} - your
                          trusted source for business insights and digital
                          transformation resources.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <BlogSidebar blogTitle={item.title} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section - Show for all content types */}
      <RelatedPosts currentPostId={item.id} currentCategory={item.category} />

      <Footer />
    </div>
  );
}
