import {
  getKnowledgeHubItems,
  mockKnowledgeHubItems,
} from "../utils/mockMarketplaceData";
import { getSupabase } from "../admin-ui/utils/supabaseClient";

export type GridCursor = {
  p: string; // published_at ISO
  id: string | number;
};

export function encodeCursor(cur: GridCursor | null): string | null {
  if (!cur) return null;
  try {
    // Use browser-safe base64
    return btoa(unescape(encodeURIComponent(JSON.stringify(cur))));
  } catch {
    return null;
  }
}

export function decodeCursor(s: string | null | undefined): GridCursor | null {
  if (!s) return null;
  try {
    const json = decodeURIComponent(escape(atob(String(s))));
    const obj = JSON.parse(json);
    if (obj && obj.p && obj.id !== undefined) return obj as GridCursor;
  } catch {}
  return null;
}

export interface ListPublicMediaParams {
  limit?: number;
  after?: string | null; // base64 cursor from encodeCursor
  tag?: string | null;
  q?: string | null;
  subMarketplace?: "written" | "multimedia" | null;
  // Marketplace filter fields
  digital_perspective?: string | null;
  digital_stream?: string | null;
  digital_domain?: string | null;
  digital_sector?: string | null;
  content_type?: string | null;
  format?: string | null;
  popularity?: string | null;
}

export interface PublicMediaItem {
  id: string;
  title: string;
  summary: string | null;
  thumbnail_url: string | null;
  type: string | null;
  tags: string[] | null;
  published_at: string | null;
  blogUrl?: string | null;
  articleUrl?: string | null;
  newsUrl?: string;
  guideUrl?: string;
  expertInterviewUrl?: string;
  detailsUrl?: string;
  // Marketplace filter fields
  digital_perspective?: string | null;
  digital_stream?: string | null;
  digital_domain?: string | null;
  digital_sector?: string | null;
  content_type?: string | null;
  format?: string | null;
  popularity?: string | null;
  provider?: {
    name: string;
    logoUrl: string;
    description?: string;
  };
}

export interface ListPublicMediaResult {
  items: PublicMediaItem[];
  nextCursor: string | null;
  totalCount: number;
}

// Fetch lean grid items using keyset pagination against v_media_public
export async function listPublicMedia({
  limit = 12,
  after,
  tag,
  q,
  subMarketplace,
  digital_perspective,
  digital_stream,
  digital_domain,
  digital_sector,
  content_type,
  format,
  popularity,
}: ListPublicMediaParams = {}): Promise<ListPublicMediaResult> {
  try {
    // Use our enhanced getKnowledgeHubItems function that combines real + mock data
    const allItems = await getKnowledgeHubItems();

    let filteredItems = allItems;

    // Apply sub-marketplace filter
    if (subMarketplace) {
      if (subMarketplace === "written") {
        filteredItems = filteredItems.filter((item) =>
          [
            "Blog",
            "Article",
            "News",
            "Guide",
            "Report",
            "Expert Interview",
            "Prediction Analysis",
            "Whitepaper",
            "Case Study",
          ].includes(item.mediaType),
        );
      } else if (subMarketplace === "multimedia") {
        filteredItems = filteredItems.filter((item) =>
          ["Video", "Podcast", "Event"].includes(item.mediaType),
        );
      }
    }

    // Apply tag/type filter
    if (tag) {
      const filterTypes = tag.split(",").map((t) => t.trim().toLowerCase());

      filteredItems = filteredItems.filter((item) => {
        const itemType = (item.mediaType || "").toLowerCase();
        // Check if item's mediaType matches any of the filter types
        const typeMatch = filterTypes.includes(itemType);

        // Also check if any of the filter types exist in the item's tags
        const tagMatch =
          Array.isArray(item.tags) &&
          item.tags.some(
            (t) =>
              filterTypes.includes(String(t).toLowerCase()) ||
              filterTypes.some((ft) => String(t).toLowerCase().includes(ft)),
          );

        return typeMatch || tagMatch;
      });
    }

    // Apply search filter
    if (q && q.trim()) {
      const searchQuery = q.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery)) ||
          (Array.isArray(item.tags) &&
            item.tags.some((tag) =>
              String(tag).toLowerCase().includes(searchQuery),
            )),
      );
    }

    // Apply marketplace filter fields
    const hasMarketplaceFilters = !![
      digital_perspective,
      digital_stream,
      digital_domain,
      digital_sector,
      content_type,
      format,
      popularity,
    ].filter((f) => f).length;
    if (hasMarketplaceFilters) {
      filteredItems = filteredItems.filter((item) => {
        if (
          digital_perspective &&
          item.digital_perspective !== digital_perspective
        )
          return false;
        if (digital_stream && item.digital_stream !== digital_stream)
          return false;
        if (digital_domain && item.digital_domain !== digital_domain)
          return false;
        if (digital_sector && item.digital_sector !== digital_sector)
          return false;
        if (content_type && item.content_type !== content_type) return false;
        if (format && item.format !== format) return false;
        if (popularity && item.popularity !== popularity) return false;
        return true;
      });
    }

    // Convert marketplace items to PublicMediaItem format
    const publicItems: PublicMediaItem[] = filteredItems.map((item) => ({
      id: String(item.id),
      title: item.title,
      summary: item.description || null,
      thumbnail_url: item.imageUrl || null,
      type: item.mediaType || null,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : null,
      published_at: item.date || new Date().toISOString(),
      blogUrl: item.blogUrl || null,
      articleUrl: item.articleUrl || null,
      newsUrl: item.newsUrl,
      guideUrl: item.guideUrl,
      expertInterviewUrl: item.expertInterviewUrl,
      detailsUrl: item.detailsUrl,
      // Marketplace filter fields
      digital_perspective: item.digital_perspective || null,
      digital_stream: item.digital_stream || null,
      digital_domain: item.digital_domain || null,
      digital_sector: item.digital_sector || null,
      content_type: item.content_type || null,
      format: item.format || null,
      popularity: item.popularity || null,
      provider: item.provider,
    }));

    // Proper pagination using cursor
    const cursor = decodeCursor(after);
    const startIndex =
      cursor && cursor.id ? parseInt(String(cursor.id), 10) : 0;
    const endIndex = startIndex + limit;
    const paginatedItems = publicItems.slice(startIndex, endIndex);

    // Simple next cursor
    const nextCursor =
      paginatedItems.length === limit && endIndex < publicItems.length
        ? encodeCursor({ p: new Date().toISOString(), id: String(endIndex) })
        : null;

    return {
      items: paginatedItems,
      nextCursor,
      totalCount: publicItems.length,
    };
  } catch (error) {
    console.error(
      "❌ [KnowledgeHubGrid] Error in listPublicMedia, falling back to original Supabase query:",
      error,
    );

    // Fallback to original Supabase query if our new function fails
    try {
      const supabase = getSupabase();
      let query = supabase
        .from("v_blogs_all")
        .select(
          "id,title,summary:excerpt,thumbnail_url:hero_image,type,tags,published_at:publish_date,digital_perspective,digital_stream,digital_domain,digital_sector,content_type,format,popularity",
        )
        .order("publish_date", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit);

      // Keyset cursor
      const cur = decodeCursor(after);
      if (cur && cur.p && cur.id !== undefined && cur.id !== null) {
        const p = String(cur.p);
        const id = String(cur.id);
        query = query.or(
          `publish_date.lt.${p},and(publish_date.eq.${p},id.lt.${id})`,
        );
      }

      // Tag filter
      if (tag) {
        try {
          query = query.contains("tags", [tag]);
        } catch {
          // Ignore if data type is not jsonb/array
        }
      }

      // Search filter
      if (q && q.trim()) {
        const safe = q.replace(/%/g, "");
        query = query.ilike("title", `%${safe}%`);
      }

      const { data, error: supabaseError } = await query;
      if (supabaseError) throw supabaseError;

      let items = (data || []) as PublicMediaItem[];

      const last = items[items.length - 1];
      const nextCursor =
        last && (last as any).publish_date
          ? encodeCursor({ p: (last as any).publish_date, id: last.id })
          : null;

      return { items, nextCursor, totalCount: items.length }; // Fallback count is just current set
    } catch (supabaseError) {
      console.error(
        "❌ [KnowledgeHubGrid] Supabase fallback also failed, using mock data:",
        supabaseError,
      );
      return getFallbackKnowledgeHubData({ limit, after, tag, q });
    }
  }
}

// Fallback function to use mock data with similar pagination behavior
function getFallbackKnowledgeHubData({
  limit = 12,
  after,
  tag,
  q,
}: ListPublicMediaParams): ListPublicMediaResult {
  let items = mockKnowledgeHubItems;

  // Apply search filter
  if (q && q.trim()) {
    const searchQuery = q.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery)) ||
        (Array.isArray(item.tags) &&
          item.tags.some((tag) =>
            String(tag).toLowerCase().includes(searchQuery),
          )),
    );
  }

  // Apply tag filter
  if (tag) {
    items = items.filter(
      (item) =>
        Array.isArray(item.tags) &&
        item.tags.some((t) => String(t).toLowerCase() === tag.toLowerCase()),
    );
  }

  // Convert to PublicMediaItem format
  const publicItems: PublicMediaItem[] = items.map((item) => ({
    id: String(item.id),
    title: item.title,
    summary: item.description || null,
    thumbnail_url: item.imageUrl || null,
    type: item.mediaType || null,
    tags: Array.isArray(item.tags) ? item.tags.map(String) : null,
    published_at: item.date || new Date().toISOString(),
  }));

  // Simple pagination - just slice the array
  const startIndex = after ? 0 : 0; // For simplicity, ignore cursor in fallback
  const endIndex = startIndex + limit;
  const paginatedItems = publicItems.slice(startIndex, endIndex);

  // Simple next cursor - just return null for now since it's fallback data
  const nextCursor =
    paginatedItems.length === limit && endIndex < publicItems.length
      ? encodeCursor({ p: new Date().toISOString(), id: String(endIndex) })
      : null;

  return { items: paginatedItems, nextCursor, totalCount: publicItems.length };
}

// Map grid item to KnowledgeHubCard shape (preserving all necessary fields)
export function mapGridToCard(item: PublicMediaItem) {
  const baseCard = {
    id: String(item.id),
    title: item.title,
    description: item.summary || "",
    mediaType: item.type || undefined,
    provider: item.provider || { name: "DTMI", logoUrl: "/mzn_logo.png" },
    imageUrl: item.thumbnail_url || undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
    date: item.published_at || undefined,
    // Default values for fields that might be needed
    businessStage: undefined,
    domain: undefined,
    format: item.format || undefined,
    popularity: item.popularity || undefined,
    filterType: undefined,
    readTime: undefined,
    author: undefined,
    blogUrl: item.blogUrl || undefined,
    articleUrl: item.articleUrl || undefined,
    newsUrl: item.newsUrl,
    guideUrl: item.guideUrl,
    expertInterviewUrl: item.expertInterviewUrl,
    detailsUrl: item.detailsUrl,
    // Marketplace filter fields
    digital_perspective: item.digital_perspective || undefined,
    digital_stream: item.digital_stream || undefined,
    digital_domain: item.digital_domain || undefined,
    digital_sector: item.digital_sector || undefined,
    content_type: item.content_type || undefined,
  };

  // Special handling for prediction analysis items - prepare for dynamic routing
  if (item.type && item.type.toLowerCase().includes("prediction analysis")) {
    // Remove specific detailsUrl to allow dynamic routing through MarketplaceGrid
    return {
      ...baseCard,
      // No detailsUrl set - will be handled by dynamic routing in MarketplaceGrid
    };
  }

  // Special handling for specific prediction analysis items that need custom routing
  if (item.id === "prediction-analysis-dco") {
    return {
      ...baseCard,
      detailsUrl: "/marketplace/dtmi/prediction-analysis",
    };
  }

  // Special handling for content governance prediction analysis - add the custom detailsUrl
  if (item.id === "content-governance-prediction") {
    return {
      ...baseCard,
      detailsUrl: "/marketplace/dtmi/content-governance-prediction",
    };
  }

  // Special handling for AI decision making prediction analysis - add the custom detailsUrl
  if (item.id === "ai-decision-making-prediction") {
    return {
      ...baseCard,
      detailsUrl: "/marketplace/dtmi/ai-decision-making-prediction",
    };
  }

  // Special handling for expert interviews - add the custom detailsUrl
  if (item.id === "expert-interview-1") {
    return {
      ...baseCard,
      detailsUrl:
        "/expert-interviews/digital-transformation-strategies-modern-businesses",
    };
  }

  return baseCard;
}
