// GROQ queries for DTMI content

export const queries = {
  // Latest Articles (Posts)
  latestArticles: `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    _type,
    title,
    subtitle,
    slug,
    publishedAt,
    minread,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot,
      crop
    },
    "mainImageUrl": mainImage.asset->url + "?w=1600&auto=format",
    "mainImageLqip": mainImage.asset->metadata.lqip,
    "author": author->{
      _id,
      name,
      bio,
      role,
      "slug": slug.current,
      "imageUrl": image.asset->url + "?w=200&h=200&fit=crop"
    },
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    summaryoverviewdescription,
    body,
    summaryinsights
  }`,

  // Filtered Articles with category filter
  filteredArticles: (filters: { category?: string; limit?: number }) => {
    const categoryFilter = filters.category
      ? ` && "${filters.category}" in categories[]->slug.current`
      : "";
    const limit = filters.limit || 10;

    return `*[_type == "post" && !(_id in path("drafts.**"))${categoryFilter}] | order(publishedAt desc)[0...${limit}] {
      _id,
      _type,
      title,
      subtitle,
      slug,
      publishedAt,
      minread,
      mainImage {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        hotspot,
        crop
      },
      "mainImageUrl": mainImage.asset->url + "?w=1600&auto=format",
      "mainImageLqip": mainImage.asset->metadata.lqip,
      "author": author->{
        _id,
        name,
        bio,
        "slug": slug.current,
        "imageUrl": image.asset->url + "?w=200&h=200&fit=crop"
      },
      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current
      },
      summaryoverviewdescription,
      body,
      summaryinsights
    }`;
  },

  // Get all unique categories for filter pills
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }`,

  // Single Article by Slug
  articleBySlug: (
    slug: string
  ) => `*[_type == "post" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0]{
    _id,
    _type,
    title,
    subtitle,
    slug,
    publishedAt,
    minread,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot,
      crop
    },
    "mainImageUrl": mainImage.asset->url + "?w=1600&auto=format",
    "mainImageLqip": mainImage.asset->metadata.lqip,
    "author": author->{
      _id,
      name,
      bio,
      role,
      "slug": slug.current,
      "imageUrl": image.asset->url + "?w=200&h=200&fit=crop"
    },
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    summaryoverviewdescription,
    body,
    summaryinsights
  }`,

  // Search Articles
  searchArticles: (
    searchTerm: string
  ) => `*[_type == "post" && !(_id in path("drafts.**")) && (
    title match "${searchTerm}*" ||
    subtitle match "${searchTerm}*" ||
    pt::text(body) match "${searchTerm}*"
  )] | order(publishedAt desc)[0...20]{
    _id,
    title,
    subtitle,
    slug,
    publishedAt,
    minread,
    "mainImageUrl": mainImage.asset->url + "?w=800&auto=format",
    "mainImageLqip": mainImage.asset->metadata.lqip,
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }`,
};
