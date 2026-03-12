import { getSupabase, getSupabaseAdmin } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML content
  heroImage: string;
  category?: string; // Legacy/Display
  categoryId?: string;
  categoryName?: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  authorId: string;
  featured: boolean;
  author?: Author;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  whitepaperUrl?: string;
  // Expert Interview specific
  introduction?: string;
  insights?: string[];
  sections?: { question: string; answer: string }[];
  conclusion?: string;
  location?: string;
  interviewDate?: string;
  // Compatibility and extended fields
  summary?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  videoUrl?: string;
  podcastUrl?: string;
  audioUrl?: string;
  documentUrl?: string;
  bodyHtml?: string;
  body?: string;
  highlights?: string[] | null;
  // Filter fields for marketplace
  digital_perspective?: string;
  digital_stream?: string;
  digital_domain?: string;
  digital_sector?: string;
  content_type?: string;
  format?: string;
  popularity?: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const deleteStorageFileFromUrl = async (url: string | null | undefined) => {
  if (!url || typeof url !== "string") return;
  const bucketName = "blog-content";
  if (!url.includes(bucketName)) return;

  // URL format usually ends with: /blog-content/hero-images/filename or /blog-content/avatars/filename
  const pathParts = url.split(`${bucketName}/`);
  if (pathParts.length < 2) return;

  const path = pathParts[1];
  const { error } = await getSupabaseAdmin()
    .storage.from(bucketName)
    .remove([path]);

  if (error) {
    console.error(`Error deleting file [${path}] from storage:`, error);
  } else {
    console.log(`Successfully deleted file [${path}] from storage`);
  }
};

export const blogService = {
  async getBlogs(filters: any = {}) {
    let query = getSupabase()
      .from("v_blogs_all" as any)
      .select("*", { count: "exact" });

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
      );
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    if (filters.featured) {
      query = query.eq("featured", true);
    }

    if (filters.slug) {
      query = query.eq("slug", filters.slug);
    }

    if (filters.authorId) {
      query = query.eq("author_id", filters.authorId);
    }

    // Marketplace filter fields
    if (filters.digital_perspective) {
      query = query.eq("digital_perspective", filters.digital_perspective);
    }

    if (filters.digital_stream) {
      query = query.eq("digital_stream", filters.digital_stream);
    }

    if (filters.digital_domain) {
      query = query.eq("digital_domain", filters.digital_domain);
    }

    if (filters.digital_sector) {
      query = query.eq("digital_sector", filters.digital_sector);
    }

    if (filters.content_type) {
      query = query.eq("content_type", filters.content_type);
    }

    if (filters.format) {
      query = query.eq("format", filters.format);
    }

    if (filters.popularity) {
      query = query.eq("popularity", filters.popularity);
    }

    query = query.order("publish_date", { ascending: false });

    if (filters.limit) {
      const from = filters.offset || 0;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []).map((row) => blogService.mapBlogRow(row)),
      count: count || 0,
    };
  },

  // Get unique values for a marketplace filter field
  async getFilterValues(fieldName: string): Promise<string[]> {
    const validFields = [
      "digital_perspective",
      "digital_stream",
      "digital_domain",
      "digital_sector",
      "content_type",
      "format",
      "popularity",
    ];
    if (!validFields.includes(fieldName)) {
      throw new Error(`Invalid filter field: ${fieldName}`);
    }

    const { data, error } = await getSupabase()
      .from("blogs" as any)
      .select(fieldName)
      .not(fieldName, "is", null)
      .order(fieldName, { ascending: true });

    if (error) throw error;

    // Extract unique values
    const values = new Set<string>();
    (data || []).forEach((row: any) => {
      if (row[fieldName]) {
        values.add(row[fieldName]);
      }
    });

    return Array.from(values);
  },

  mapBlogRow(row: any): Blog {
    const blog = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      heroImage: row.hero_image,
      category: row.category_name || row.category,
      categoryId: row.category_id,
      categoryName: row.category_name,
      tags: row.tags || [],
      publishDate: row.publish_date,
      readTime: row.read_time,
      authorId: row.author_id,
      featured: row.featured,
      type: row.type || "blog",
      location: row.location,
      interviewDate: row.interview_date,
      whitepaperUrl: row.whitepaper_url,

      // Compatibility fields for different front-end layouts
      summary: row.summary || row.excerpt,
      thumbnailUrl: row.thumbnail_url || row.hero_image,
      publishedAt: row.published_at || row.publish_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,

      // Extended fields
      videoUrl: row.video_url,
      podcastUrl: row.podcast_url || row.audio_url,
      documentUrl: row.document_url || row.whitepaper_url,
      bodyHtml: row.body_html || row.content,
      body: row.body || row.excerpt || row.content,

      author: {
        id: row.author_id,
        name: row.author_name,
        title: row.author_title,
        avatar: row.author_avatar,
        bio: row.author_bio,
        linkedIn: row.author_linkedin,
        twitter: row.author_twitter,
        website: row.author_website,
      },
      // Marketplace filter fields
      digital_perspective: row.digital_perspective,
      digital_stream: row.digital_stream,
      digital_domain: row.digital_domain,
      digital_sector: row.digital_sector,
      content_type: row.content_type,
      format: row.format,
      popularity: row.popularity,
    } as Blog;

    // Handle parsed content for JSON-heavy types
    if (
      blog.type === "podcast" ||
      blog.type === "expert-interview" ||
      blog.type === "research" ||
      blog.type === "report"
    ) {
      try {
        if (
          typeof row.content === "string" &&
          (row.content.startsWith("{") || row.content.startsWith("["))
        ) {
          const parsed = JSON.parse(row.content);
          if (blog.type === "podcast") {
            const episodes = parsed.episodes || [];
            if (episodes.length > 0) {
              const firstEp = episodes[0];
              (blog as any).audioUrl = firstEp.audioUrl;
              blog.podcastUrl = firstEp.audioUrl || blog.podcastUrl;
              blog.thumbnailUrl = firstEp.thumbnailUrl || blog.thumbnailUrl;
              blog.body = firstEp.showNotes || blog.body;
              blog.bodyHtml = firstEp.showNotes || blog.bodyHtml;
            } else {
              (blog as any).audioUrl = parsed.audioUrl;
              blog.podcastUrl = parsed.audioUrl || blog.podcastUrl;
              blog.thumbnailUrl = parsed.thumbnailUrl || blog.thumbnailUrl;
              blog.body = parsed.showNotes || blog.body;
              blog.bodyHtml = parsed.showNotes || blog.bodyHtml;
            }
          } else if (blog.type === "expert-interview") {
            blog.body = parsed.introduction || blog.body;
            blog.bodyHtml = parsed.introduction || blog.bodyHtml;
          } else if (blog.type === "research" || blog.type === "report") {
            blog.body = parsed.abstract || blog.body;
            blog.bodyHtml = parsed.abstract || blog.bodyHtml;
          }
        }
      } catch (e) {
        console.warn("Failed to parse content JSON for mapping:", e);
      }
    }

    return blog;
  },

  async getBlogById(id: string) {
    const { data, error } = (await getSupabase()
      .from("v_blogs_all" as any)
      .select("*")
      .eq("id", id)
      .limit(1)) as any;

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Blog not found");

    return blogService.mapBlogRow(data[0]);
  },

  async getBlogBySlug(slug: string) {
    const { data, error } = (await getSupabase()
      .from("v_blogs_all" as any)
      .select("*")
      .eq("slug", slug)
      .limit(1)) as any;

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Blog not found");

    return blogService.mapBlogRow(data[0]);
  },

  async createBlog(blogData: Partial<Blog>) {
    const payload = {
      title: blogData.title,
      slug: blogData.slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      hero_image: blogData.heroImage,
      category_id:
        blogData.categoryId && blogData.categoryId.length > 0
          ? blogData.categoryId
          : null,
      category: blogData.categoryName || blogData.category || "General",
      tags: blogData.tags || [],
      publish_date: blogData.publishDate || new Date().toISOString(),
      read_time: blogData.readTime || 0,
      author_id:
        blogData.authorId && blogData.authorId.length > 0
          ? blogData.authorId
          : null,
      featured: blogData.featured || false,
      type: blogData.type || "blog",
      location: blogData.location || null,
      interview_date: blogData.interviewDate || null,
      whitepaper_url: blogData.whitepaperUrl || null,
      // Filter fields
      digital_perspective: blogData.digital_perspective || null,
      digital_stream: blogData.digital_stream || null,
      digital_domain: blogData.digital_domain || null,
      digital_sector: blogData.digital_sector || null,
      content_type: blogData.content_type || null,
      format: blogData.format || null,
      popularity: blogData.popularity || null,
    };

    const { data, error } = await (
      getSupabaseAdmin().from("blogs" as any) as any
    )
      .insert([payload])
      .select();

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  async updateBlog(id: string, blogData: Partial<Blog>) {
    // If heroImage is being updated, handle old image deletion
    if (blogData.heroImage) {
      try {
        const { data: existing } = (await getSupabase()
          .from("blogs" as any)
          .select("hero_image")
          .eq("id", id)
          .limit(1)) as any;

        const existingRow =
          existing && existing.length > 0 ? existing[0] : null;

        if (
          existingRow?.hero_image &&
          existingRow.hero_image !== blogData.heroImage
        ) {
          await deleteStorageFileFromUrl(existingRow.hero_image);
        }
      } catch (err) {
        console.warn("Could not check for old image to delete:", err);
      }
    }

    const payload = {
      title: blogData.title,
      slug: blogData.slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      hero_image: blogData.heroImage,
      category_id:
        blogData.categoryId && blogData.categoryId.length > 0
          ? blogData.categoryId
          : null,
      category: blogData.categoryName || blogData.category || "General",
      tags: blogData.tags,
      publish_date: blogData.publishDate,
      read_time: blogData.readTime,
      author_id:
        blogData.authorId && blogData.authorId.length > 0
          ? blogData.authorId
          : null,
      featured: blogData.featured,
      type: blogData.type,
      location: blogData.location || null,
      interview_date: blogData.interviewDate || null,
      whitepaper_url: blogData.whitepaperUrl || null,
      // Filter fields
      digital_perspective: blogData.digital_perspective || null,
      digital_stream: blogData.digital_stream || null,
      digital_domain: blogData.digital_domain || null,
      digital_sector: blogData.digital_sector || null,
      content_type: blogData.content_type || null,
      format: blogData.format || null,
      popularity: blogData.popularity || null,
    };

    const { data, error } = await (
      getSupabaseAdmin().from("blogs" as any) as any
    )
      .update(payload as any)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  async deleteBlog(id: string) {
    // Fetch old image URL before deleting record
    try {
      const { data: existing } = (await getSupabase()
        .from("blogs" as any)
        .select("hero_image")
        .eq("id", id)
        .limit(1)) as any;

      const existingRow = existing && existing.length > 0 ? existing[0] : null;

      if (existingRow?.hero_image) {
        await deleteStorageFileFromUrl(existingRow.hero_image);
      }
    } catch (err) {
      console.warn("Could not fetch blog for image deletion:", err);
    }

    const { error } = await getSupabaseAdmin()
      .from("blogs" as any)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async deleteBlogs(ids: string[]) {
    // Bulk delete with image cleanup
    for (const id of ids) {
      await blogService.deleteBlog(id);
    }
  },

  async uploadHeroImage(file: File): Promise<string> {
    const supabase = getSupabaseAdmin();
    const key = `hero-images/${uuidv4()}-${file.name.replace(/[^a-z0-9.]/gi, "-")}`;

    const { error } = await supabase.storage
      .from("blog-content")
      .upload(key, file);

    if (error) throw error;

    const { data } = supabase.storage.from("blog-content").getPublicUrl(key);
    return data.publicUrl;
  },

  async uploadAudioFile(file: File): Promise<string> {
    const supabase = getSupabaseAdmin();
    const key = `podcast-audio/${uuidv4()}-${file.name.replace(/[^a-z0-9.]/gi, "-")}`;

    const { error } = await supabase.storage
      .from("blog-content")
      .upload(key, file);

    if (error) throw error;

    const { data } = supabase.storage.from("blog-content").getPublicUrl(key);
    return data.publicUrl;
  },
};

export const authorService = {
  async getAuthors() {
    const { data, error } = await getSupabase()
      .from("users" as any)
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return (data || []).map((user: any) => ({
      id: user.id,
      name: user.name,
      title: user.title,
      avatar: user.avatar_url,
      bio: user.bio,
    })) as Author[];
  },

  async createAuthor(authorData: Partial<Author>) {
    const userData = {
      id: uuidv4(),
      name: authorData.name,
      title: authorData.title,
      avatar_url: authorData.avatar,
      bio: authorData.bio,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (
      getSupabaseAdmin().from("users" as any) as any
    )
      .insert([userData])
      .select("id, name, title, avatar_url, bio");

    if (error) throw error;
    if (!data || data.length === 0) return null as any;

    const user = data[0];
    return {
      id: user.id,
      name: user.name,
      title: user.title,
      avatar: user.avatar_url,
      bio: user.bio,
    } as Author;
  },

  async updateAuthor(id: string, authorData: Partial<Author>) {
    // If avatar is being updated, handle old avatar deletion
    if (authorData.avatar) {
      try {
        const { data: existing } = (await getSupabase()
          .from("users" as any)
          .select("avatar")
          .eq("id", id)
          .limit(1)) as any;

        const existingAuthor =
          existing && existing.length > 0 ? existing[0] : null;

        if (
          existingAuthor?.avatar_url &&
          existingAuthor.avatar_url !== authorData.avatar
        ) {
          await deleteStorageFileFromUrl(existingAuthor.avatar_url);
        }
      } catch (err) {
        console.warn("Could not check for old avatar to delete:", err);
      }
    }

    const userData: any = {
      updated_at: new Date().toISOString(),
    };
    if (authorData.name) userData.name = authorData.name;
    if (authorData.title) userData.title = authorData.title;
    if (authorData.avatar) userData.avatar_url = authorData.avatar;
    if (authorData.bio) userData.bio = authorData.bio;

    const { data, error } = await (
      getSupabaseAdmin().from("users" as any) as any
    )
      .update(userData)
      .eq("id", id)
      .select("id, name, title, avatar_url, bio");

    if (error) throw error;
    if (!data || data.length === 0) return null as any;

    const user = data[0];
    return {
      id: user.id,
      name: user.name,
      title: user.title,
      avatar: user.avatar_url,
      bio: user.bio,
    } as Author;
  },

  async deleteAuthor(id: string) {
    // Fetch old avatar URL before deleting record
    try {
      const { data: existing } = (await getSupabase()
        .from("users" as any)
        .select("avatar_url")
        .eq("id", id)
        .limit(1)) as any;

      const existingAuthor =
        existing && existing.length > 0 ? existing[0] : null;

      if (existingAuthor?.avatar_url) {
        await deleteStorageFileFromUrl(existingAuthor.avatar_url);
      }
    } catch (err) {
      console.warn("Could not fetch author for avatar deletion:", err);
    }

    const { error } = await getSupabaseAdmin()
      .from("users" as any)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async deleteAuthors(ids: string[]) {
    for (const id of ids) {
      await authorService.deleteAuthor(id);
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    const supabase = getSupabaseAdmin();
    const key = `avatars/${uuidv4()}-${file.name.replace(/[^a-z0-9.]/gi, "-")}`;

    const { error } = await supabase.storage
      .from("blog-content")
      .upload(key, file);

    if (error) throw error;

    const { data } = supabase.storage.from("blog-content").getPublicUrl(key);
    return data.publicUrl;
  },
};

export const categoryService = {
  async getCategories() {
    const { data, error } = await getSupabase()
      .from("categories" as any)
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data as Category[];
  },

  async createCategory(categoryData: Partial<Category>) {
    const { data, error } = await (
      getSupabaseAdmin().from("categories" as any) as any
    )
      .insert([categoryData])
      .select();

    if (error) throw error;
    return data && data.length > 0 ? (data[0] as Category) : (null as any);
  },

  async updateCategory(id: string, categoryData: Partial<Category>) {
    const { data, error } = await (
      getSupabaseAdmin().from("categories" as any) as any
    )
      .update(categoryData as any)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data && data.length > 0 ? (data[0] as Category) : (null as any);
  },

  async deleteCategory(id: string) {
    const { error } = await getSupabaseAdmin()
      .from("categories" as any)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

export const expertInterviewService = {
  createExpertInterview: blogService.createBlog,
  getExpertInterviews: async () => {
    const result = await blogService.getBlogs({ type: "expert-interview" });
    return result.data;
  },
};

// Compatibility for existing components using mediaService
export const mediaService = {
  getMediaItems: async (params: any) => {
    return blogService.getBlogs(params);
  },
  getMediaItemById: blogService.getBlogById,
  getMediaItemBySlug: blogService.getBlogBySlug,
  createMediaItem: blogService.createBlog,
  updateMediaItem: blogService.updateBlog,
  deleteMediaItem: blogService.deleteBlog,
  uploadThumbnail: blogService.uploadHeroImage,
};

export const contentSubmissionService = {
  async getSubmissions(filters: any = {}) {
    let query = getSupabase().from("content_submissions" as any).select(`
        *,
        mediaItem:media_items(*),
        author:users(*)
      `);

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    query = query.order("submitted_at", { ascending: false });

    const { data, error } = (await query) as any;
    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      mediaId: row.media_id,
      authorId: row.author_id,
      status: row.status,
      reviewerId: row.reviewer_id,
      reviewNotes: row.review_notes,
      submittedAt: row.submitted_at,
      reviewedAt: row.reviewed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      mediaItem: row.mediaItem,
      author: row.author,
    }));
  },

  async updateSubmissionStatus(
    id: string,
    status: string,
    reviewerId: string,
    reviewNotes = "",
  ) {
    const { data, error } = await (
      getSupabaseAdmin().from("content_submissions" as any) as any
    )
      .update({
        status,
        reviewer_id: reviewerId,
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },
};
