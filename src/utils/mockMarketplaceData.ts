// Mock data for Knowledge Hub marketplace
import { mediaService } from '../admin-ui/utils/supabase';

const getFirstHeroImageFromContent = (content: string | null, type: string): string | null => {
  // Only extract hero images for whitepapers
  if (type !== 'White Paper' || !content) return null;

  try {
    const parsedContent = JSON.parse(content);
    if (parsedContent.heroImages) {
      // Get the first hero image from the available sections
      const sections = ['hook', 'foreword', 'executiveSummary', 'chapter1', 'chapter2', 'chapter3', 'conclusion', 'references'];
      for (const section of sections) {
        if (parsedContent.heroImages[section]) {
          return parsedContent.heroImages[section];
        }
      }
    }
  } catch (error) {
    // Failed to parse whitepaper content for hero image extraction
  }

  return null;
};

// Function to fetch real blog data and map it to marketplace format
export const fetchKnowledgeHubItems = async () => {
  try {
    // Fetch published media items from the database
    const mediaItems = await mediaService.getMediaItems({});

    if (!mediaItems.data || mediaItems.data.length === 0) {
      return [];
    }

    // Map database items to marketplace format
    const mappedItems = mediaItems.data.map((item: any) => {
      const rawType = item.type || 'blog';
      let type = 'Blog';

      const t = rawType.toLowerCase();
      if (t === 'article') type = 'Article';
      else if (t === 'blog') type = 'Blog';
      else if (t === 'news' || t === 'announcement') type = 'News';
      else if (t === 'guide') type = 'Guide';
      else if (t === 'report' || t === 'research' || t === 'research report') type = 'Research Report';
      else if (t === 'whitepaper' || t === 'white paper') type = 'White Paper';
      else if (t === 'expert-interview' || t === 'expert interview') type = 'Expert Interview';
      else if (t === 'prediction-analysis' || t === 'prediction analysis') type = 'Prediction Analysis';
      else if (t === 'case-study' || t === 'case study' || t === 'case-studies') type = 'Case Study';
      else if (t === 'video') type = 'Video';
      else if (t === 'podcast') type = 'Podcast';
      else if (t === 'event') type = 'Event';

      const contentTypeFallbackMap: Record<string, string> = {
        Blog: "Blogs",
        Article: "Articles",
        News: "News",
        Guide: "Guides",
        "Research Report": "Research Reports",
        "White Paper": "Whitepapers",
        "Expert Interview": "Expert Interviews",
        "Prediction Analysis": "Prediction Analysis",
        "Case Study": "Case Studies",
        Video: "Videos",
        Podcast: "Podcasts",
        Event: "Events",
      };
      const contentTypeFallback = contentTypeFallbackMap[type] || null;

      // Define base mapping
      const mappedEntry: any = {
        id: String(item.id),
        title: item.title,
        description: item.summary || item.excerpt || 'No description available',
        mediaType: type,
        filterType: type === 'Expert Interview' || type === 'Prediction Analysis' ? type : `${type}s`,
        businessStage: item.businessStage || 'All Stages',
        domain: item.domain || getDomainFromTags(Array.isArray(item.tags) ? item.tags : []),
        category: item.category || null,
        format: item.format || getFormatFromType(type),
        popularity: item.popularity || getPopularityFromDate(item.publishedAt || item.publishDate),
        provider: {
          name: getProviderFromAuthor(item),
          logoUrl: item.provider?.logoUrl || 'https://placehold.co/400x400/FF6B4D/white?text=DQ',
          description: item.provider?.description || 'Leading digital transformation consultancy specializing in cognitive organizations.',
        },
        digital_perspective: item.digital_perspective || null,
        digital_stream: item.digital_stream || null,
        digital_domain: item.digital_domain || null,
        digital_sector: item.digital_sector || null,
        content_type: item.content_type || contentTypeFallback,
        tags: Array.isArray(item.tags) ? item.tags : [],
        imageUrl: item.thumbnailUrl || item.heroImage || getFirstHeroImageFromContent(item.content, type) || getDefaultImageForType(type),
        date: formatDate(item.publishedAt || item.publishDate || item.createdAt),
        readTime: getReadTime(item),
        author: getAuthorInfo(item),
      };

      // Map type-specific URLs
      if (item.slug) {
        const slug = item.slug;
        if (type === 'Blog') mappedEntry.blogUrl = `/blog/${slug}`;
        else if (type === 'Article') mappedEntry.articleUrl = `/dtmi/article/${slug}`;
        else if (type === 'News') mappedEntry.newsUrl = `/news/${slug}`;
        else if (type === 'Guide') mappedEntry.guideUrl = `/guides/${slug}`;
        else if (type === 'Expert Interview') mappedEntry.expertInterviewUrl = `/expert-interviews/${slug}`;
        else if (type === 'Prediction Analysis') mappedEntry.detailsUrl = `/marketplace/dtmi/prediction-analysis/${slug}`;
        else if (type === 'Podcast') mappedEntry.detailsUrl = `/podcast/${slug}`;
      } else {
        // Fallback to ID if slug is missing
        if (type === 'Blog') mappedEntry.blogUrl = `/blog/${item.id}`;
        else if (type === 'Article') mappedEntry.articleUrl = `/dtmi/article/${item.id}`;
        else if (type === 'News') mappedEntry.newsUrl = `/news/${item.id}`;
        else if (type === 'Guide') mappedEntry.guideUrl = `/guides/${item.id}`;
        else if (type === 'Expert Interview') mappedEntry.expertInterviewUrl = `/expert-interviews/${item.id}`;
        else if (type === 'Prediction Analysis') mappedEntry.detailsUrl = `/marketplace/dtmi/prediction-analysis/${item.id}`;
        else if (type === 'Podcast') mappedEntry.detailsUrl = `/podcast/${item.id}`;
      }

      // Add additional fields based on type
      if (type === 'Video') {
        mappedEntry.videoUrl = (item as any).videoUrl;
        mappedEntry.duration = formatDuration((item as any).durationSec);
      } else if (type === 'Podcast') {
        mappedEntry.audioUrl = (item as any).podcastUrl;
        mappedEntry.duration = formatDuration((item as any).durationSec);
        mappedEntry.episodes = 1;
      } else if (type === 'Event') {
        mappedEntry.location = (item as any).eventLocation;
        mappedEntry.date = formatEventDate(item);
      } else if (type === 'Report') {
        mappedEntry.downloadCount = (item as any).downloadCount || Math.floor(Math.random() * 5000) + 100;
        mappedEntry.fileSize = (item as any).fileSize || '2.5 MB';
      }

      return mappedEntry;
    });

    return mappedItems;
  } catch (error) {
    console.error('❌ [Marketplace] Error fetching knowledge hub items:', error);
    return [];
  }
};

// Helper functions for mapping
const getDomainFromTags = (tags: string[]): string => {
  if (!Array.isArray(tags)) return 'Strategy & Growth';

  const tagToDomain: Record<string, string> = {
    'Technology': 'Technology & Innovation',
    'AI': 'Technology & Innovation',
    'Digital': 'Technology & Innovation',
    'Finance': 'Finance & Funding',
    'Funding': 'Finance & Funding',
    'Marketing': 'Marketing & Sales',
    'Sales': 'Marketing & Sales',
    'Operations': 'Operations & Productivity',
    'Legal': 'Legal & Compliance',
    'Strategy': 'Strategy & Growth',
    'Growth': 'Strategy & Growth',
  };

  for (const tag of tags) {
    if (tagToDomain[tag]) {
      return tagToDomain[tag];
    }
  }

  return 'Strategy & Growth'; // Default domain
};

const getFormatFromType = (type: string): string => {
  const typeToFormat: Record<string, string> = {
    'Blog': 'In-Depth Reports',
    'Article': 'In-Depth Reports',
    'News': 'Quick Reads',
    'Guide': 'In-Depth Reports',
    'Video': 'Recorded Media',
    'Podcast': 'Recorded Media',
    'Event': 'Live Events',
    'Report': 'Downloadable Templates',
    'Research Report': 'Downloadable Templates',
    'Tool': 'Interactive Tools',
    'White Paper': 'Downloadable Templates',
    'Whitepaper': 'Downloadable Templates',
    'Case Study': 'Downloadable Templates',
    'Expert Interview': 'Interactive Tools',
    'Prediction Analysis': 'Interactive Tools',
  };

  return typeToFormat[type] || 'Quick Reads';
};

const getPopularityFromDate = (publishedAt: string | null): string => {
  if (!publishedAt) return 'Latest';

  const publishDate = new Date(publishedAt);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 7) return 'Latest';
  if (daysDiff <= 30) return 'Trending';
  return "Editor's Pick";
};

const getProviderFromAuthor = (item: any): string => {
  const author = item.author?.name || (typeof item.author === 'string' ? item.author : null) || item.byline;
  if (typeof author === 'string') {
    if (author.includes('Stéphane') || author.includes('Niango')) return 'DigitalQatalyst';
    if (author.includes('Kaylynn') || author.includes('Océanne')) return 'DigitalQatalyst';
  }
  return 'DigitalQatalyst'; // Default provider
};

const getDefaultImageForType = (type: string): string => {
  const typeToImage: Record<string, string> = {
    'Blog': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Article': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Guide': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Video': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Podcast': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Event': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Report': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'Tool': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  };

  return typeToImage[type] || typeToImage['Article'];
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getReadTime = (item: any): string => {
  // Try to get read time from item data
  if (item.readTime) return `${item.readTime} min read`;
  if ((item as any).read_time) return `${(item as any).read_time} min read`;

  // Estimate based on content length
  const content = item.body || item.bodyHtml || item.summary || '';
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)); // Assume 200 words per minute

  return `${readTimeMinutes} min read`;
};

const getAuthorInfo = (item: any) => {
  const authorName = item.author?.name || (typeof item.author === 'string' ? item.author : null) || item.byline;

  if (!authorName) return item.author && typeof item.author === 'object' ? item.author : undefined;

  // Map known authors to their info
  if (authorName.includes('Stéphane') || authorName.includes('Niango')) {
    return {
      name: 'Dr. Stéphane Niango',
      title: 'Expert in Digital Cognitive Organizations & Strategic Transformation',
      avatar: '/images/Stephane_Avatar.png'
    };
  }

  if (authorName.includes('Kaylynn') || authorName.includes('Océanne')) {
    return {
      name: 'Kaylynn Océanne',
      title: 'Content Engagement Strategist | Research Analyst',
      avatar: '/images/Kaylynn_Avatar.png'
    };
  }

  // If we have an author object but it's not a known name, return it as is if it has required fields
  if (item.author && typeof item.author === 'object' && item.author.name) {
    return {
      name: item.author.name,
      title: item.author.title || 'Content Author',
      avatar: item.author.avatar || '/images/default_avatar.png'
    };
  }

  // Default author info
  return {
    name: authorName,
    title: 'Content Author',
    avatar: '/images/default_avatar.png'
  };
};

const formatDuration = (durationSec: number | null): string => {
  if (!durationSec) return '';

  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;

  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return `${seconds} seconds`;
};

const formatEventDate = (item: any): string => {
  const eventDate = (item as any).eventDate;
  if (eventDate) {
    return new Date(eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return formatDate(item.publishedAt || item.createdAt);
};

// Enhanced function that combines real data with mock data as fallback
export const getKnowledgeHubItems = async () => {
  try {
    const realItems = await fetchKnowledgeHubItems();

    // COMMENTED OUT - Now using only real database items
    // // Filter out mock items that have the same ID as real items to prevent duplicate keys
    // const realIds = new Set(realItems.map(i => String(i.id)));
    // const uniqueMockItems = mockKnowledgeHubItems.filter(i => !realIds.has(String(i.id)));

    // // Combine real database items with unique mock items
    // const combinedItems = [...realItems, ...uniqueMockItems].sort((a, b) => {
    //   const getTs = (item: any) => {
    //     const d = item.date || item.lastUpdated || item.publishedAt || item.publishDate || 0;
    //     const ts = new Date(d).getTime();
    //     return isNaN(ts) ? 0 : ts;
    //   };

    //   const tsA = getTs(a);
    //   const tsB = getTs(b);

    //   if (tsB !== tsA) return tsB - tsA;
    //   // Stable sort as fallback
    //   return String(b.id).localeCompare(String(a.id));
    // });

    // return combinedItems;
    return realItems; // Only return real database items
  } catch (error) {
    console.error('❌ [Marketplace] Error in getKnowledgeHubItems:', error);
    // COMMENTED OUT - No fallback to mock data
    // // Fallback to mock data sorted by date
    // return [...mockKnowledgeHubItems].sort((a, b) => {
    //   const dateA = new Date(a.date || 0).getTime();
    //   const dateB = new Date(b.date || 0).getTime();
    //   return dateB - dateA;
    // });
    return []; // Return empty array on error
  }
};

export const mockKnowledgeHubItems = [
  {
    id: "cognitive-enterprises-prediction",
    title: "The Next Decade in Digital Transformation: How Cognitive Enterprises Will Drive Global Economic Growth",
    description: "By 2030, the rise of Digital Cognitive Organizations (DCOs) will fundamentally reshape the global economy, driving growth through AI-powered automation, cross-sector collaboration, and data-driven decision-making.",
    mediaType: "Prediction Analysis",
    filterType: "Prediction Analysis",
    businessStage: "All Stages",
    domain: "Technology & Innovation",
    format: "In-Depth Reports",
    popularity: "Latest",
    provider: {
      name: "DTMI Research",
      logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=126&q=80',
      description: 'Digital Transformation Management Insights - Leading research in enterprise AI and cognitive systems.',
    },
    tags: ["Cognitive Enterprises", "Digital Transformation", "Economic Growth", "AI Automation", "2030 Vision"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
    date: "January 21, 2026",
    downloadCount: 1247,
    fileSize: "9.5 MB",
    readTime: "12 min",
    author: {
      name: "Dr. Chen Wei",
      title: "Senior Economic Analyst, DTMI Research Institute",
      avatar: "/images/Chen_Avatar.png"
    },
    detailsUrl: "/marketplace/knowledge-hub/cognitive-enterprises-prediction"
  },
  {
    id: "expert-interview-new",
    title: "Strategy Spotlight: Digital Transformation in 2026",
    description: "An exclusive session on the latest digital transformation strategies for modern businesses.",
    mediaType: "Expert Interview",
    filterType: "Expert Interviews",
    businessStage: "Growth",
    domain: "Technology & Innovation",
    format: "In-Depth Reports",
    popularity: "Featured",
    provider: {
      name: "DigitalQatalyst",
      logoUrl: "https://placehold.co/400x400/FF6B4D/white?text=DQ",
      description: "Leading digital transformation consultancy.",
    },
    tags: ["Expert Interview", "Digital Transformation", "Business Strategy"],
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1274&q=80",
    date: "January 16, 2026",
    readTime: "12 min read",
    expertInterviewUrl: "/expert-interviews/digital-transformation-strategies-modern-businesses",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "expert-interview-1",
    title: "Expert Interview: Digital Transformation Strategies for Modern Businesses",
    description:
      'An in-depth conversation with industry leaders about the latest trends and strategies in digital transformation for businesses in the digital economy.',
    mediaType: 'Expert Interview',
    filterType: 'Expert Interviews',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Latest',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Expert Interview", "Digital Transformation", "Business Strategy"],
    imageUrl: "/images/interview1_thumbnail.png",
    date: "January 5, 2025",
    readTime: "15 min read",
    expertInterviewUrl: "/expert-interviews/digital-transformation-strategies-modern-businesses",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "prediction-analysis-dco",
    title: "The Rise of Digital Cognitive Organizations: 2025-2030 Outlook Analysis",
    description:
      "An in-depth prediction analysis of how AI-driven cognitive architectures will reshape enterprise operations and decision-making frameworks over the next five years.",
    mediaType: "Prediction Analysis",
    filterType: "Prediction Analysis",
    businessStage: "All Stages",
    domain: "Technology & Innovation",
    format: "In-Depth Reports",
    popularity: "Editor's Pick",
    provider: {
      name: "DTMI Research",
      logoUrl:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=126&q=80',
      description: 'Digital Transformation Management Insights - Leading research in enterprise AI and cognitive systems.',
    },
    tags: ["AI", "Digital Transformation", "Prediction"],
    imageUrl: "/images/prediction1-thumbnail.png",
    date: "January 15, 2025",
    downloadCount: 5847,
    fileSize: "8.2 MB",
    readTime: "12 min",
    author: "Dr. Sarah Chen",
    detailsUrl: "/marketplace/dtmi/prediction-analysis"
  },
  {
    id: "content-governance-prediction",
    title: "2030 Vision: The Future of AI-Powered Digital Platforms in Driving Organizational Agility and Innovation",
    description:
      "By 2030, AI-enabled digital platforms will become the core enabler of organizational agility and innovation. These platforms will allow businesses to automate workflows, personalize customer experiences, and adapt rapidly to market changes.",
    mediaType: "Prediction Analysis",
    filterType: "Prediction Analysis",
    businessStage: "All Stages",
    domain: "Technology & Innovation",
    format: "In-Depth Reports",
    popularity: "Latest",
    provider: {
      name: "DTMI Research",
      logoUrl:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=126&q=80',
      description: 'Digital Transformation Management Insights - Leading research in enterprise AI and cognitive systems.',
    },
    tags: ["AI Platforms", "Digital Innovation", "Organizational Agility", "2030 Vision"],
    imageUrl: "/images/prediction-hero.jpg",
    date: "January 12, 2026",
    downloadCount: 3247,
    fileSize: "6.8 MB",
    readTime: "15 min",
    author: {
      name: "Dr. Stephane Niango",
      title: "DTMI Head of Research",
      avatar: "/images/Stephane_Avatar.png"
    },
    detailsUrl: "/marketplace/dtmi/content-governance-prediction"
  },
  {
    id: "ai-decision-making-prediction",
    title: "From 2025 to 2030: How AI-Driven Decision Making Will Shape Corporate Strategy and Governance",
    description:
      "By 2030, AI-driven decision-making will redefine how corporations make strategic decisions, manage risks, and enforce governance. With the rise of predictive analytics and AI insights, businesses will increasingly rely on decentralized, data-driven decision-making processes.",
    mediaType: "Prediction Analysis",
    filterType: "Prediction Analysis",
    businessStage: "All Stages",
    domain: "Technology & Innovation",
    format: "In-Depth Reports",
    popularity: "Latest",
    provider: {
      name: "DTMI Research",
      logoUrl:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=126&q=80',
      description: 'Digital Transformation Management Insights - Leading research in enterprise AI and cognitive systems.',
    },
    tags: ["AI Decision Making", "Corporate Strategy", "Governance", "Predictive Analytics", "2030 Vision"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    date: "January 15, 2026",
    downloadCount: 2847,
    fileSize: "7.2 MB",
    readTime: "18 min",
    author: {
      name: "Dr. Elena Rodriguez",
      title: "DTMI Senior AI Strategy Researcher",
      avatar: "/images/Elena_Avatar.png"
    },
    detailsUrl: "/marketplace/dtmi/ai-decision-making-prediction"
  },
  {
    id: "12",
    title: "Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations",
    description:
      'Explore why traditional business models are becoming obsolete and how Digital Cognitive Organizations (DCOs) are revolutionizing the way businesses operate in the digital economy.',
    mediaType: 'Article',
    filterType: 'Articles',
    businessStage: 'All Stages',
    domain: 'Strategy & Growth',
    format: 'In-Depth Reports',
    popularity: 'Latest',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Digital Economy 4.0", "Cognitive Organizations", "Business Transformation", "AI Strategy"],
    imageUrl:
      "/images/Article 01_hero image.png",
    date: "December 10, 2025",
    readTime: "8 min read",
    articleUrl: "/dtmi/article/why-traditional-business-models-are-doomed",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "13",
    title: "Traditional Digital Transformation is Dead: Meet the Future of Business",
    description:
      'Discover why traditional digital transformation strategies are no longer enough and how Digital Cognitive Organizations represent the future of business in Economy 4.0.',
    mediaType: 'Article',
    filterType: 'Articles',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Latest',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Digital Economy 4.0", "Cognitive Organizations", "Business Transformation", "AI Strategy"],
    imageUrl:
      "/images/Article 02_hero image.png",
    date: "December 10, 2025",
    readTime: "10 min read",
    articleUrl: "/dtmi/article/traditional-digital-transformation-is-dead",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "14",
    title: "Why Traditional Organizations Are Obsolete in Today's Digital Economy",
    description:
      'Learn why traditional organizational structures are becoming obsolete and how businesses can transform into adaptive, intelligent Digital Cognitive Organizations.',
    mediaType: 'Article',
    filterType: 'Articles',
    businessStage: 'All Stages',
    domain: 'Strategy & Growth',
    format: 'In-Depth Reports',
    popularity: 'Latest',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Digital Economy 4.0", "Cognitive Organizations", "Business Transformation", "AI Strategy"],
    imageUrl:
      "/images/Article 03_hero image.png",
    date: "December 10, 2025",
    readTime: "7 min read",
    articleUrl: "/dtmi/article/why-traditional-organizations-are-obsolete",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "15",
    title: "Are We Watching the Rise of Compute Nationalism?",
    description:
      'As nations race to control AI infrastructure and computing resources, we explore how geopolitical tensions are reshaping the global technology landscape and what it means for businesses.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Geopolitics & Technology", "AI", "Digital Sovereignty", "Compute Infrastructure", "Technology Policy"],
    imageUrl:
      "/images/Blog 01_hero.png",
    date: "December 15, 2025",
    readTime: "12 min read",
    blogUrl: "/blog/rise-of-compute-nationalism",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "16",
    title: "Is Beijing Building the World's First AI Superstate?",
    description:
      'While the U.S. pushes a loud "compute nationalism" agenda, China is quietly executing a parallel strategy that is more coordinated, vertically integrated, and harder to track.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["AI Nations", "AI", "China", "Geopolitics", "Compute Infrastructure", "AI Superstate"],
    imageUrl:
      "/images/Blog 02_hero.png",
    date: "December 12, 2025",
    readTime: "8 min read",
    blogUrl: "/blog/china-ai-superstate",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "17",
    title: "Europe Wants Ethical AI. But Without Compute, Can It Compete?",
    description:
      'The European Union has positioned itself as the global moral compass on AI, but ethical leadership doesn\'t matter if you don\'t have compute leadership.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Economy 4.0", "AI", "Europe", "Compute Infrastructure", "Digital Sovereignty", "AI Ethics"],
    imageUrl:
      "/images/Blog 03_hero.png",
    date: "December 10, 2025",
    readTime: "7 min read",
    blogUrl: "/blog/europe-ai-compute-challenge",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "18",
    title: "AI Without Compute: Is the Global South Being Left Out of the New Digital Economy?",
    description:
      'There\'s a growing fear across Africa, Southeast Asia, and parts of Latin America: Is the AI revolution about to leave the Global South behind?',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Economy 4.0", "AI", "Global South", "Digital Divide", "Compute Infrastructure", "Digital Economy"],
    imageUrl:
      "/images/Blog 04_hero.png",
    date: "December 8, 2025",
    readTime: "9 min read",
    blogUrl: "/blog/global-south-ai-compute-divide",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "19",
    title: "The Rise of the Half-Attention Worker",
    description:
      'Why digital environments hardwire workers into split-attention behaviors that harm quality, and how Digital Cognitive Organizations can reclaim the conditions for full attention.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Digital Worker", "Attention Economy", "Workplace Psychology", "DCO", "Productivity"],
    imageUrl:
      "/images/Blog 05_hero.png",
    date: "December 5, 2025",
    readTime: "10 min read",
    blogUrl: "/blog/rise-of-half-attention-worker",
    author: {
      name: "Kaylynn Océanne",
      title: "Content Engagement Strategist | Research Analyst",
      avatar: "/images/Kaylynn_Avatar.png"
    }
  },
  {
    id: "20",
    title: "How Nations Weaponize Attention Before Missiles",
    description:
      'When influence campaigns, coordinated misinformation, and AI-generated narratives shape public sentiment and global alliances before any physical conflict begins.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Digital Warfare", "Geopolitics", "AI Propaganda", "Misinformation", "Attention Economy"],
    imageUrl:
      "/images/Blog 06_hero.png",
    date: "December 3, 2025",
    readTime: "11 min read",
    blogUrl: "/blog/nations-weaponize-attention-before-missiles",
    author: {
      name: "Kaylynn Océanne",
      title: "Content Engagement Strategist | Research Analyst",
      avatar: "/images/Kaylynn_Avatar.png"
    }
  },
  {
    id: "21",
    title: "The Architecture of Addiction: How Interface Design Creates Digital Habits",
    description:
      'Small triggers, frictionless actions, and micro-gratifications engineered into UI patterns — and why they matter in the Digital Cognitive era.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Social Media", "Behavioral Design", "Digital Addiction", "UI/UX", "Attention Economy"],
    imageUrl:
      "/images/Blog 07_hero.png",
    date: "December 1, 2025",
    readTime: "12 min read",
    blogUrl: "/blog/architecture-of-addiction-interface-design",
    author: {
      name: "Kaylynn Océanne",
      title: "Content Engagement Strategist | Research Analyst",
      avatar: "/images/Kaylynn_Avatar.png"
    }
  },
  {
    id: "22",
    title: "Why Digital Life Feeds Emotion but Starves Meaning",
    description:
      'Overstimulated and Underfulfilled: The psychological gap between constant excitement and genuine wellbeing in our hyper-connected world.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Digital Wellbeing", "Neuroscience", "Mental Health", "Attention Economy", "Digital Psychology"],
    imageUrl:
      "/images/Blog 08_hero.png",
    date: "November 29, 2025",
    readTime: "10 min read",
    blogUrl: "/blog/digital-life-feeds-emotion-starves-meaning",
    author: {
      name: "Kaylynn Océanne",
      title: "Content Engagement Strategist | Research Analyst",
      avatar: "/images/Kaylynn_Avatar.png"
    }
  },
  {
    id: "23",
    title: "The End of Multitasking? How Automation Will Free Humans for High-Value Cognitive Work",
    description:
      'The shift from reactive execution to reflective, strategic contribution as AI and automation reshape the nature of work and human attention.',
    mediaType: 'Blog',
    filterType: 'Blogs',
    businessStage: 'All Stages',
    domain: 'Technology & Innovation',
    format: 'In-Depth Reports',
    popularity: 'Featured',
    provider: {
      name: "DigitalQatalyst",
      logoUrl:
        'https://placehold.co/400x400/FF6B4D/white?text=DQ',
      description: 'Leading digital transformation consultancy specializing in cognitive organizations.',
    },
    tags: ["Future of Work", "AI Automation", "Cognitive Partnership", "Digital Transformation", "DCO"],
    imageUrl:
      "/images/Blog 09_hero.png",
    date: "November 27, 2025",
    readTime: "9 min read",
    blogUrl: "/blog/end-of-multitasking-automation-cognitive-work",
    author: {
      name: "Kaylynn Océanne",
      title: "Content Engagement Strategist | Research Analyst",
      avatar: "/images/Kaylynn_Avatar.png"
    }
  },
  {
    id: "whitepaper-1",
    title: "Digital Economy 4.0",
    description: "This comprehensive whitepaper explores the evolving landscape of digital transformation, providing actionable insights and strategic frameworks for organizations looking to thrive in the digital economy.",
    mediaType: "Whitepaper",
    filterType: "Whitepapers",
    businessStage: "All Stages",
    domain: "Technology & Innovation",
    format: "Downloadable Templates",
    popularity: "Featured",
    provider: {
      name: "DigitalQatalyst",
      logoUrl: "https://placehold.co/400x400/FF6B4D/white?text=DQ",
      description: "Leading digital transformation consultancy specializing in cognitive organizations."
    },
    tags: ["Digital Transformation", "Strategy", "Technology", "Enterprise", "Innovation"],
    imageUrl: "/images/whitepaper/whitepaper-hero.jpg",
    date: "January 15, 2026",
    downloadCount: 2847,
    fileSize: "4.2 MB",
    readTime: "25 min read",
    whitepaperUrl: "/whitepaper/digital-economy-4-0",
    author: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      avatar: "/images/Stephane_Avatar.png"
    }
  },
  {
    id: "podcast-1",
    title: "Digital Transformation Insights: The Future of AI in Business",
    description: "Join our expert panel as they discuss the latest trends in artificial intelligence and how businesses can leverage AI for digital transformation. This episode covers practical implementation strategies, common challenges, and success stories from leading organizations.",
    mediaType: "Podcast",
    filterType: "Podcasts",
    businessStage: "All Stages",
    domain: "Technology & Innovation",
    format: "Audio Content",
    popularity: "Latest",
    provider: {
      name: "DigitalQatalyst",
      logoUrl: "https://placehold.co/400x400/FF6B4D/white?text=DQ",
      description: "Leading digital transformation consultancy specializing in cognitive organizations."
    },
    tags: ["AI", "Digital Transformation", "Business Strategy", "Technology", "Podcast"],
    imageUrl: "/images/prediction-hero.jpg",
    date: "January 15, 2026",
    duration: "45:30",
    episodes: 1,
    audioUrl: "/audio/sample-podcast.mp3",
    podcastUrl: "/podcast/podcast-1",
    author: {
      name: "Dr. Sarah Chen",
      title: "AI Strategy Consultant",
      avatar: "/images/Stephane_Avatar.png"
    }
  }
];

// Mock data for Knowledge Hub filter options
export const mockKnowledgeHubFilterOptions = {
  mediaTypes: [
    { id: "articles", name: "Articles" },
    { id: "blogs", name: "Blogs" },
    { id: "expert-interviews", name: "Expert Interviews" },
    { id: "prediction-analysis", name: "Prediction Analysis" },
    { id: "podcasts", name: "Podcasts" },
    { id: "whitepapers", name: "Whitepapers" },
  ],
  businessStages: [
    { id: "all", name: "All Stages" },
  ],
  domains: [
    { id: "strategy", name: "Strategy & Growth" },
    { id: "technology", name: "Technology & Innovation" },
  ],
  formats: [
    { id: "indepth", name: "In-Depth Reports" },
  ],
  popularity: [
    { id: "latest", name: "Latest" },
    { id: "featured", name: "Featured" },
  ],
};

// Mock data for financial services
export const mockFinancialServices = [
  {
    id: "fin-1",
    title: "SME Growth Loan: Low-Interest Financing for Business Expansion in Abu Dhabi",
    description:
      "Low-interest loans designed specifically for small and medium enterprises looking to expand their operations in Abu Dhabi.",
    category: "Loans",
    serviceType: "Financing",
    businessStage: "Growth",
    provider: {
      name: "Abu Dhabi Commercial Bank",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/80/ADCB_Logo.svg",
      description:
        "One of the largest banks in the UAE, offering a wide range of financial services for businesses.",
    },
    amount: "Up to AED 5 million",
    duration: "5-7 years",
    interestRate: "Starting from 3%",
    eligibility: "At least 2 years of operation",
    details: [
      "No collateral required for loans up to AED 1 million",
      "Flexible repayment options",
      "Dedicated relationship manager",
      "Fast approval process within 5 business days",
      "Option for grace period of up to 6 months",
    ],
    tags: ["Loans", "Financing", "Growth"],
  },
  {
    id: "fin-2",
    title: "Startup Capital Fund: Equity Financing for Technology and Healthcare Innovators",
    description:
      "Equity financing for innovative startups in technology, healthcare, and sustainable energy sectors in Abu Dhabi.",
    category: "Financing",
    serviceType: "Equity",
    businessStage: "Conception",
    provider: {
      name: "Hub71",
      logoUrl: "https://hub71.com/wp-content/uploads/2023/05/hub71-logo-1.png",
      description:
        "Abu Dhabi's global tech ecosystem that enables startups to scale globally.",
    },
    amount: "AED 500,000 - 2 million",
    duration: "Equity investment",
    interestRate: "N/A (Equity-based)",
    eligibility: "At least 2 years of operation",
    details: [
      "Equity investment ranging from 10-25%",
      "Access to Hub71's ecosystem and mentorship",
      "Connection to potential clients and partners",
      "Support with future funding rounds",
      "No repayment obligations",
    ],
    tags: ["Financing", "Equity", "Conception"],
  },
  {
    id: "fin-3",
    title: "Business Insurance Package: Comprehensive Coverage for Abu Dhabi Enterprises",
    description:
      "Comprehensive insurance coverage tailored for businesses operating in Abu Dhabi, protecting against various risks.",
    category: "Insurance",
    serviceType: "Risk Management",
    businessStage: "All Stages",
    provider: {
      name: "Abu Dhabi National Insurance Company",
      logoUrl:
        "https://www.adnic.ae/wp-content/themes/adnic/assets/images/logo.svg",
      description:
        "Leading insurance provider in the UAE offering comprehensive coverage for businesses.",
    },
    amount: "Coverage up to AED 10 million",
    duration: "Annual, renewable",
    interestRate: "N/A",
    eligibility: "At least 2 years of operation",
    details: [
      "Property and asset protection",
      "Business interruption coverage",
      "Liability insurance",
      "Employee health and accident coverage",
      "Customizable package based on business needs",
    ],
    tags: ["Insurance", "Risk Management", "All Stages"],
  },
  {
    id: "fin-4",
    title: "Export Credit Guarantee: Financial Protection for International Trade Activities",
    description:
      "Financial protection for Abu Dhabi businesses engaged in export activities, minimizing risks of international trade.",
    category: "Insurance",
    serviceType: "Credit",
    businessStage: "Maturity",
    provider: {
      name: "Abu Dhabi Exports Office",
      logoUrl: "https://www.adexporters.ae/sites/default/files/adex-logo.png",
      description:
        "Government entity supporting Abu Dhabi-based exporters to expand globally.",
    },
    amount: "Up to 90% of export value",
    duration: "Transaction-based",
    interestRate: "N/A",
    eligibility: "At least 2 years of operation",
    details: [
      "Protection against non-payment by international buyers",
      "Coverage for commercial and political risks",
      "Improved cash flow management",
      "Enhanced credibility with international partners",
      "Access to competitive financing terms",
    ],
    tags: ["Insurance", "Credit", "Maturity"],
  },
  {
    id: "fin-5",
    title: "Business Credit Card: Specialized Solutions with Rewards for Business Expenses",
    description:
      "Specialized credit card for business expenses with rewards tailored to business needs and spending patterns.",
    category: "Credit Card",
    serviceType: "Credit",
    businessStage: "All Stages",
    provider: {
      name: "First Abu Dhabi Bank",
      logoUrl:
        "https://www.bankfab.com/-/media/fabgroup/home/images/fab-logo.svg",
      description:
        "The largest bank in the UAE, offering comprehensive financial services for businesses of all sizes.",
    },
    amount: "Credit limit up to AED 500,000",
    duration: "Revolving credit",
    interestRate: "18% APR",
    eligibility: "  Registered businesses with good credit history",
    details: [
      "Business-specific rewards and cashback",
      "Multiple cards for employees with spending controls",
      "Detailed expense reporting and categorization",
      "Travel insurance and purchase protection",
      "Integration with accounting software",
    ],
    tags: ["Credit Card", "Credit", "All Stages"],
  },
  {
    id: "fin-6",
    title: "Equipment Financing: Flexible Solutions for Business Machinery and Equipment",
    description:
      "Specialized financing solution for purchasing business equipment and machinery with flexible terms.",
    category: "Loans",
    serviceType: "Financing",
    businessStage: "Growth",
    provider: {
      name: "Abu Dhabi Islamic Bank",
      logoUrl: "https://www.adib.ae/en/PublishingImages/ADIB_Logo_2016_En.svg",
      description:
        "Leading Islamic financial services group providing Sharia-compliant solutions for businesses.",
    },
    amount: "Up to AED 3 million",
    duration: "3-5 years",
    interestRate: "Profit rate from 4%",
    eligibility: "At least 2 years of operation",
    details: [
      "Sharia-compliant financing structure",
      "Equipment serves as collateral",
      "Flexible payment schedules",
      "Option to purchase equipment at end of term",
      "Quick approval process",
    ],
    tags: ["Loans", "Financing", "Growth"],
  },
  {
    id: "fin-7",
    title: "Working Capital Solution",
    description:
      "Short-term financing to optimize cash flow and cover operational expenses during growth or seasonal fluctuations.",
    category: "Financing",
    serviceType: "Credit",
    businessStage: "Growth",
    provider: {
      name: "Abu Dhabi Commercial Bank",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/80/ADCB_Logo.svg",
      description:
        "One of the largest banks in the UAE, offering a wide range of financial services for businesses.",
    },
    amount: "AED 250,000 - 3 million",
    duration: "6-12 months",
    interestRate: "Starting from 4.5%",
    eligibility: "At least 2 years of operation",
    details: [
      "Revolving credit facility",
      "Flexible withdrawal and repayment",
      "Online account management",
      "No prepayment penalties",
      "Competitive interest rates",
    ],
    tags: ["Financing", "Credit", "Growth"],
  },
  {
    id: "fin-8",
    title: "Trade Finance Facility",
    description:
      "Comprehensive trade finance solutions for businesses engaged in import and export activities.",
    category: "Financing",
    serviceType: "Credit",
    businessStage: "Maturity",
    provider: {
      name: "First Abu Dhabi Bank",
      logoUrl:
        "https://www.bankfab.com/-/media/fabgroup/home/images/fab-logo.svg",
      description:
        "The largest bank in the UAE, offering comprehensive financial services for businesses of all sizes.",
    },
    amount: "Up to AED 10 million",
    duration: "Transaction-based",
    interestRate: "Varies by product",
    eligibility: "At least 2 years of operation",
    details: [
      "Letters of credit and guarantees",
      "Import and export financing",
      "Supply chain financing",
      "Documentary collections",
      "Trade risk mitigation",
    ],
    tags: ["Financing", "Credit", "Maturity"],
  },
  {
    id: "fin-9",
    title: "Business Restructuring Loan",
    description:
      "Specialized financing to support business transformation, debt consolidation, or operational restructuring.",
    category: "Loans",
    serviceType: "Financing",
    businessStage: "Restructuring",
    provider: {
      name: "Abu Dhabi Islamic Bank",
      logoUrl: "https://www.adib.ae/en/PublishingImages/ADIB_Logo_2016_En.svg",
      description:
        "Leading Islamic financial services group providing Sharia-compliant solutions for businesses.",
    },
    amount: "Up to AED 7 million",
    duration: "Up to 10 years",
    interestRate: "Profit rate from 3.5%",
    eligibility: "At least 2 years of operation",
    details: [
      "Debt consolidation options",
      "Customized repayment schedule",
      "Business advisory services",
      "Grace period options",
      "Sharia-compliant structure",
    ],
    tags: ["Loans", "Financing", "Restructuring"],
  },
  {
    id: "fin-10",
    title: "Commercial Property Mortgage",
    description:
      "Long-term financing for purchasing commercial real estate or business premises in Abu Dhabi.",
    category: "Loans",
    serviceType: "Financing",
    businessStage: "Maturity",
    provider: {
      name: "First Abu Dhabi Bank",
      logoUrl:
        "https://www.bankfab.com/-/media/fabgroup/home/images/fab-logo.svg",
      description:
        "The largest bank in the UAE, offering comprehensive financial services for businesses of all sizes.",
    },
    amount: "Up to AED 20 million",
    duration: "Up to 15 years",
    interestRate: "Starting from 3.75%",
    eligibility: "At least 2 years of operation",
    details: [
      "Up to 70% financing of property value",
      "Fixed and variable rate options",
      "Flexible repayment terms",
      "Option to refinance existing property",
      "No early settlement fees after 5 years",
    ],
    tags: ["Loans", "Financing", "Maturity"],
  },
  {
    id: "fin-11",
    title: "Invoice Factoring Service",
    description:
      "Convert outstanding invoices into immediate cash flow to support business operations and growth.",
    category: "Financing",
    serviceType: "Credit",
    businessStage: "Growth",
    provider: {
      name: "Abu Dhabi Commercial Bank",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/80/ADCB_Logo.svg",
      description:
        "One of the largest banks in the UAE, offering a wide range of financial services for businesses.",
    },
    amount: "Up to 85% of invoice value",
    duration: "30-90 days",
    interestRate: "2-3% monthly fee",
    eligibility: "At least 2 years of operation",
    details: [
      "Immediate access to working capital",
      "No additional debt on balance sheet",
      "Optional accounts receivable management",
      "Confidential and non-confidential options",
      "Online platform for invoice submission and tracking",
    ],
    tags: ["Financing", "Credit", "Growth"],
  },
  {
    id: "fin-12",
    title: "Green Business Financing",
    description:
      "Specialized financing for environmentally sustainable projects and business initiatives in Abu Dhabi.",
    category: "Loans",
    serviceType: "Financing",
    businessStage: "All Stages",
    provider: {
      name: "First Abu Dhabi Bank",
      logoUrl:
        "https://www.bankfab.com/-/media/fabgroup/home/images/fab-logo.svg",
      description:
        "The largest bank in the UAE, offering comprehensive financial services for businesses of all sizes.",
    },
    amount: "Up to AED 15 million",
    duration: "Up to 10 years",
    interestRate: "Preferential rates from 2.5%",
    eligibility: "At least 2 years of operation",
    details: [
      "Preferential interest rates",
      "Extended repayment periods",
      "Technical assistance for project development",
      "Compliance with international green standards",
      "Enhanced reputation through green certification",
    ],
    tags: ["Loans", "Financing", "All Stages"],
  },
];

// Mock data for non-financial services
export const mockNonFinancialServices = [
  {
    id: "nfin-1",
    title: "Business Setup Consultancy",
    description:
      "Comprehensive guidance for establishing your business in Abu Dhabi, including legal structure, licensing, and location selection.",
    category: "Consultancy",
    serviceType: "Advisory",
    deliveryMode: "Hybrid",
    businessStage: "Conception",
    provider: {
      name: "Khalifa Fund",
      logoUrl:
        "https://uploadthingy.s3.us-west-1.amazonaws.com/hFf47Y1ehebABQyP4p31yY/image.png",
      description:
        "Supporting entrepreneurs and SMEs in Abu Dhabi with comprehensive business development services.",
    },
    duration: "2-4 weeks",
    price: "AED 5,000 - 15,000",
    details: [
      "Business structure and legal form consultation",
      "License and permit application assistance",
      "Location selection guidance",
      "Initial business plan review",
      "Introduction to relevant government entities",
    ],
    tags: ["Consultancy", "Advisory", "Conception"],
  },
  {
    id: "nfin-2",
    title: "Digital Transformation Package",
    description:
      "End-to-end digital transformation services to help businesses adopt technology solutions that enhance efficiency and competitiveness.",
    category: "Technology",
    serviceType: "Implementation",
    deliveryMode: "Hybrid",
    businessStage: "Growth",
    provider: {
      name: "Hub71",
      logoUrl: "https://hub71.com/wp-content/uploads/2023/05/hub71-logo-1.png",
      description:
        "Abu Dhabi's global tech ecosystem that enables startups to scale globally.",
    },
    duration: "3-6 months",
    price: "AED 20,000 - 100,000",
    details: [
      "Digital readiness assessment",
      "Technology roadmap development",
      "System selection and implementation",
      "Staff training and change management",
      "Post-implementation support",
    ],
    tags: ["Technology", "Implementation", "Growth"],
  },
  {
    id: "nfin-3",
    title: "Market Research Service",
    description:
      "Comprehensive market analysis to identify opportunities, understand competition, and inform strategic decision-making.",
    category: "Research",
    serviceType: "Information",
    deliveryMode: "Online",
    businessStage: "All Stages",
    provider: {
      name: "Abu Dhabi Chamber of Commerce",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/en/0/08/Abu_Dhabi_Chamber_Logo.png",
      description:
        "Supporting business growth and economic development in Abu Dhabi.",
    },
    duration: "4-8 weeks",
    price: "AED 15,000 - 50,000",
    details: [
      "Market size and growth analysis",
      "Competitor landscape assessment",
      "Consumer behavior and preferences study",
      "Pricing strategy recommendations",
      "Market entry strategy development",
    ],
    tags: ["Research", "Information", "All Stages"],
  },
  {
    id: "nfin-4",
    title: "Export Development Program",
    description:
      "Comprehensive support to help Abu Dhabi businesses expand into international markets and increase export capabilities.",
    category: "Export",
    serviceType: "Program",
    deliveryMode: "Hybrid",
    businessStage: "Maturity",
    provider: {
      name: "Abu Dhabi Export Office",
      logoUrl: "https://www.adexporters.ae/sites/default/files/adex-logo.png",
      description:
        "Supporting Abu Dhabi-based companies to export their products globally.",
    },
    duration: "6-12 months",
    price: "Partially subsidized",
    details: [
      "Export readiness assessment",
      "Market selection and entry strategy",
      "Regulatory compliance guidance",
      "International business matchmaking",
      "Export documentation training",
    ],
    tags: ["Export", "Program", "Maturity"],
  },
  {
    id: "nfin-5",
    title: "Business Mentorship Program",
    description:
      "Personalized mentorship from experienced business leaders to guide entrepreneurs through challenges and growth opportunities.",
    category: "Consultancy",
    serviceType: "Advisory",
    deliveryMode: "Hybrid",
    businessStage: "Growth",
    provider: {
      name: "Khalifa Fund",
      logoUrl:
        "https://uploadthingy.s3.us-west-1.amazonaws.com/hFf47Y1ehebABQyP4p31yY/image.png",
      description:
        "Supporting entrepreneurs and SMEs in Abu Dhabi with comprehensive business development services.",
    },
    duration: "6 months",
    price: "Free (application required)",
    details: [
      "One-on-one sessions with industry experts",
      "Strategic business planning support",
      "Problem-solving and decision-making guidance",
      "Networking opportunities",
      "Progress tracking and accountability",
    ],
    tags: ["Consultancy", "Advisory", "Growth"],
  },
  {
    id: "nfin-6",
    title: "Innovation Lab Access",
    description:
      "Access to state-of-the-art innovation facilities, equipment, and expertise to develop and test new products or services.",
    category: "Technology",
    serviceType: "Implementation",
    deliveryMode: "In-person",
    businessStage: "Conception",
    provider: {
      name: "Hub71",
      logoUrl: "https://hub71.com/wp-content/uploads/2023/05/hub71-logo-1.png",
      description:
        "Abu Dhabi's global tech ecosystem that enables startups to scale globally.",
    },
    duration: "Flexible membership",
    price: "AED 1,000 - 5,000 monthly",
    details: [
      "Access to prototyping equipment",
      "Technical expertise and guidance",
      "Collaborative workspace",
      "Innovation workshops and events",
      "Connection to potential partners and investors",
    ],
    tags: ["Technology", "Implementation", "Conception"],
  },
  {
    id: "nfin-7",
    title: "Business Process Optimization",
    description:
      "Expert analysis and improvement of business processes to enhance efficiency, reduce costs, and increase productivity.",
    category: "Consultancy",
    serviceType: "Implementation",
    deliveryMode: "Hybrid",
    businessStage: "Growth",
    provider: {
      name: "Abu Dhabi Chamber of Commerce",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/en/0/08/Abu_Dhabi_Chamber_Logo.png",
      description:
        "Supporting business growth and economic development in Abu Dhabi.",
    },
    duration: "2-3 months",
    price: "AED 30,000 - 80,000",
    details: [
      "Comprehensive process audit",
      "Bottleneck identification and resolution",
      "Workflow redesign and optimization",
      "Implementation of efficiency metrics",
      "Staff training on new processes",
    ],
    tags: ["Consultancy", "Implementation", "Growth"],
  },
  {
    id: "nfin-8",
    title: "Sustainability Certification Program",
    description:
      "Guidance and support for businesses to achieve recognized sustainability certifications and implement eco-friendly practices.",
    category: "Consultancy",
    serviceType: "Program",
    deliveryMode: "Hybrid",
    businessStage: "Maturity",
    provider: {
      name: "Environment Agency - Abu Dhabi",
      logoUrl: "https://www.ead.gov.ae/TempFile.aspx?id=107",
      description:
        "Government agency responsible for environmental protection and sustainable development in Abu Dhabi.",
    },
    duration: "3-6 months",
    price: "Partially subsidized",
    details: [
      "Sustainability assessment and gap analysis",
      "Environmental management system development",
      "Certification preparation and application",
      "Staff training on sustainable practices",
      "Ongoing compliance monitoring",
    ],
    tags: ["Consultancy", "Program", "Maturity"],
  },
  {
    id: "nfin-9",
    title: "Business Restructuring Advisory",
    description:
      "Specialized guidance for businesses undergoing significant changes, including reorganization, pivoting, or recovery strategies.",
    category: "Consultancy",
    serviceType: "Advisory",
    deliveryMode: "Hybrid",
    businessStage: "Restructuring",
    provider: {
      name: "Khalifa Fund",
      logoUrl:
        "https://uploadthingy.s3.us-west-1.amazonaws.com/hFf47Y1ehebABQyP4p31yY/image.png",
      description:
        "Supporting entrepreneurs and SMEs in Abu Dhabi with comprehensive business development services.",
    },
    duration: "3-6 months",
    price: "AED 20,000 - 60,000",
    details: [
      "Business viability assessment",
      "Restructuring plan development",
      "Cost optimization strategies",
      "Change management support",
      "Implementation guidance and monitoring",
    ],
    tags: ["Consultancy", "Advisory", "Restructuring"],
  },
  {
    id: "nfin-10",
    title: "Intellectual Property Protection",
    description:
      "Comprehensive services to help businesses protect their intellectual property through patents, trademarks, and copyrights.",
    category: "Consultancy",
    serviceType: "Advisory",
    deliveryMode: "Online",
    businessStage: "All Stages",
    provider: {
      name: "Abu Dhabi Global Market",
      logoUrl: "https://www.adgm.com/img/logo/logo-dark.svg",
      description:
        "International financial center in Abu Dhabi offering business-friendly regulatory environment.",
    },
    duration: "2-6 months",
    price: "AED 8,000 - 25,000",
    details: [
      "IP audit and assessment",
      "Patent, trademark, and copyright registration",
      "IP strategy development",
      "Infringement monitoring and enforcement",
      "International IP protection guidance",
    ],
    tags: ["Consultancy", "Advisory", "All Stages"],
  },
  {
    id: "nfin-11",
    title: "E-Commerce Enablement Package",
    description:
      "End-to-end support for businesses looking to establish or enhance their online sales capabilities and digital presence.",
    category: "Technology",
    serviceType: "Implementation",
    deliveryMode: "Online",
    businessStage: "Growth",
    provider: {
      name: "Hub71",
      logoUrl: "https://hub71.com/wp-content/uploads/2023/05/hub71-logo-1.png",
      description:
        "Abu Dhabi's global tech ecosystem that enables startups to scale globally.",
    },
    duration: "2-3 months",
    price: "AED 15,000 - 40,000",
    details: [
      "E-commerce platform setup",
      "Payment gateway integration",
      "Product catalog and content development",
      "Digital marketing strategy",
      "Order fulfillment and logistics optimization",
    ],
    tags: ["Technology", "Implementation", "Growth"],
  },
  {
    id: "nfin-12",
    title: "Industry 4.0 Readiness Program",
    description:
      "Assessment and implementation support for advanced manufacturing technologies and smart factory solutions.",
    category: "Technology",
    serviceType: "Program",
    deliveryMode: "Hybrid",
    businessStage: "Maturity",
    provider: {
      name: "Abu Dhabi Department of Economic Development",
      logoUrl:
        "https://added.gov.ae/-/media/Project/ADDED/ADDED/images/logo.svg",
      description:
        "Government entity responsible for economic development and business regulation in Abu Dhabi.",
    },
    duration: "6-12 months",
    price: "Partially subsidized",
    details: [
      "Industry 4.0 readiness assessment",
      "Technology roadmap development",
      "Smart manufacturing implementation",
      "Workforce skills development",
      "Integration of IoT and data analytics",
    ],
    tags: ["Technology", "Program", "Maturity"],
  },
];
// Expert Interview Data Structure
export interface QuestionAnswerSection {
  id: string;
  question: string;
  answer: string;
  timestamp?: string;
}

export interface ExpertProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  company?: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface InterviewMetadata {
  publishDate: string;
  readTime: string;
  interviewDate?: string;
  location?: string;
  tags: string[];
}

export interface ExpertInterview {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: {
    introduction?: string;
    sections: QuestionAnswerSection[];
    conclusion?: string;
  };
  expert: ExpertProfile;
  metadata: InterviewMetadata;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
  };
  relatedContent?: {
    interviews: string[];
    articles: string[];
  };
}

// Mock Expert Interviews Data
export const mockExpertInterviews: ExpertInterview[] = [
  {
    id: "expert-interview-1",
    slug: "digital-transformation-strategies-modern-businesses",
    title: "From Transformation to Cognition: Why the Future Belongs to Digital Cognitive Organizations",
    description: "An in-depth conversation with Dr. Stéphane Niango about the evolution from traditional digital transformation to cognitive organizations and what this means for the future of business.",
    content: {
      introduction: "In this comprehensive interview, we explore the evolving landscape of digital transformation with Dr. Stéphane Niango, a leading expert in Digital Cognitive Organizations. As businesses worldwide grapple with the rapid pace of technological change, Dr. Niango offers insights into why traditional approaches to digital transformation are no longer sufficient and how organizations must evolve to become truly cognitive entities.",
      sections: [
        {
          id: "q1",
          question: "Dr. Niango, you've been advocating for a shift from traditional digital transformation to what you call 'Digital Cognitive Organizations.' Can you explain what this means?",
          answer: "Traditional digital transformation has been about adopting new technologies to improve existing processes. But we're now entering what I call Economy 4.0, where the fundamental nature of business itself is changing. Digital Cognitive Organizations, or DCOs, are entities that can think, learn, and adapt in real-time. They don't just use AI as a tool—they become inherently intelligent systems that can process information, make decisions, and evolve continuously. Think of it as the difference between a calculator and a brain. A calculator performs operations when instructed, but a brain processes, learns, and adapts autonomously."
        },
        {
          id: "q2",
          question: "What are the key characteristics that distinguish a Digital Cognitive Organization from a traditionally digitized company?",
          answer: "There are several fundamental differences. First, DCOs have distributed intelligence—decision-making capabilities are embedded throughout the organization, not centralized in a few key positions. Second, they exhibit adaptive learning—they continuously improve their processes based on real-time feedback and data analysis. Third, they demonstrate predictive capabilities—they don't just respond to changes, they anticipate them. Fourth, they maintain contextual awareness—they understand not just what is happening, but why it's happening and what it means for the broader ecosystem. Finally, they operate with autonomous optimization—many processes self-improve without human intervention."
        },
        {
          id: "q3",
          question: "You've mentioned that traditional business models are becoming obsolete. Can you elaborate on this?",
          answer: "Absolutely. Traditional business models were designed for a world of scarcity and linear processes. They rely on hierarchical structures, sequential decision-making, and reactive strategies. But in Economy 4.0, we're dealing with abundance of data, exponential technologies, and network effects. Companies that try to apply old models to new realities are like trying to navigate a jet plane with a horse and buggy mindset. The speed, complexity, and interconnectedness of modern business require fundamentally different organizational architectures—ones that can process vast amounts of information simultaneously and make intelligent decisions at the speed of data."
        },
        {
          id: "q4",
          question: "What role does artificial intelligence play in this transformation, and how should organizations approach AI integration?",
          answer: "AI is not just a component of DCOs—it's the nervous system. But here's the critical point: most organizations are still thinking about AI as a tool to automate existing processes. That's like using a smartphone only to make phone calls. True cognitive organizations integrate AI into their DNA. They use AI for pattern recognition across multiple data streams, for predictive modeling of market dynamics, for real-time optimization of operations, and for continuous learning from every interaction. The key is to move from 'AI as automation' to 'AI as augmentation' to finally 'AI as integration'—where artificial and human intelligence work seamlessly together."
        },
        {
          id: "q5",
          question: "What are the biggest challenges organizations face when trying to become cognitive organizations?",
          answer: "The biggest challenge is mindset. Most leaders are still thinking in terms of efficiency improvements rather than fundamental transformation. They want to digitize their existing processes rather than reimagine what's possible. Technical challenges—like data integration, AI implementation, or system architecture—these are solvable. But changing organizational culture, developing new leadership capabilities, and creating structures that can handle ambiguity and rapid change? That's where most transformations fail. Organizations need to develop what I call 'cognitive readiness'—the ability to think and operate in fundamentally new ways."
        },
        {
          id: "q6",
          question: "Looking ahead, what do you see as the future of work in cognitive organizations?",
          answer: "The future of work in DCOs is about human-AI collaboration at an unprecedented level. Humans will focus on creativity, strategic thinking, emotional intelligence, and complex problem-solving—areas where human cognition excels. AI will handle data processing, pattern recognition, routine optimization, and predictive analysis. But the magic happens in the intersection—where human intuition guides AI capabilities, and AI insights enhance human decision-making. Workers in cognitive organizations won't be replaced by AI; they'll be amplified by it. The key is developing what I call 'cognitive literacy'—the ability to work effectively with intelligent systems."
        },
        {
          id: "q7",
          question: "What advice would you give to leaders who want to start this transformation journey?",
          answer: "Start by changing how you think about your organization. Stop seeing it as a collection of departments and processes, and start seeing it as a living, learning system. Begin with small experiments in cognitive capabilities—perhaps AI-driven customer insights or predictive maintenance. But most importantly, invest in developing your people's cognitive literacy. The technology will evolve rapidly, but your organization's ability to adapt and learn will determine your success. Remember, becoming a cognitive organization isn't a destination—it's a continuous evolution. The goal isn't to implement cognitive capabilities once, but to build an organization that can continuously develop new forms of intelligence."
        }
      ],
      conclusion: "As our conversation with Dr. Niango demonstrates, the shift to Digital Cognitive Organizations represents more than just technological advancement—it's a fundamental reimagining of what organizations can be. The companies that thrive in Economy 4.0 will be those that embrace this cognitive evolution, developing the ability to think, learn, and adapt at the speed of change itself."
    },
    expert: {
      name: "Dr. Stéphane Niango",
      title: "Expert in Digital Cognitive Organizations & Strategic Transformation",
      bio: "Dr. Stéphane Niango is a leading expert in digital transformation and cognitive organizations with over 15 years of experience helping businesses navigate the digital economy. As the founder of DigitalQatalyst, he has advised Fortune 500 companies and government organizations on developing cognitive capabilities and implementing AI-driven transformation strategies. His research focuses on the intersection of artificial intelligence, organizational behavior, and strategic innovation.",
      avatar: "/images/Stephane_Avatar.png",
      company: "DigitalQatalyst",
      socialLinks: [
        { platform: "linkedin", url: "https://linkedin.com/in/stephane-niango" },
        { platform: "twitter", url: "https://twitter.com/stephane_niango" }
      ]
    },
    metadata: {
      publishDate: "January 5, 2025",
      readTime: "15 min read",
      interviewDate: "December 20, 2024",
      location: "Abu Dhabi, UAE",
      tags: ["Digital Transformation", "AI Strategy", "Cognitive Organizations", "Future of Work", "Business Innovation"]
    },
    seo: {
      metaTitle: "Expert Interview: Digital Cognitive Organizations with Dr. Stéphane Niango",
      metaDescription: "Discover the future of business with Dr. Stéphane Niango as he explains how Digital Cognitive Organizations are revolutionizing the way companies operate in Economy 4.0.",
      keywords: ["digital transformation", "cognitive organizations", "AI strategy", "business innovation", "future of work", "artificial intelligence"],
      ogImage: "/images/expert-interview-og.jpg"
    },
    relatedContent: {
      interviews: [],
      articles: ["16", "17", "18"]
    }
  }
];

// Helper function to get expert interview by slug
export const getExpertInterviewBySlug = (slug: string): ExpertInterview | undefined => {
  return mockExpertInterviews.find(interview => interview.slug === slug);
};

// Helper function to get related content for an interview
export const getRelatedContentForInterview = (interviewId: string) => {
  const interview = mockExpertInterviews.find(i => i.id === interviewId);
  if (!interview?.relatedContent) return { articles: [], interviews: [] };

  const relatedArticles = mockKnowledgeHubItems.filter(item =>
    interview.relatedContent?.articles?.includes(item.id) &&
    (item.mediaType === 'Article' || item.mediaType === 'Blog')
  );

  const relatedInterviews = mockExpertInterviews.filter(i =>
    interview.relatedContent?.interviews?.includes(i.id)
  );

  return { articles: relatedArticles, interviews: relatedInterviews };
};
