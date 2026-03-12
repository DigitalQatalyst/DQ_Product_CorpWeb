// TypeScript types for Sanity content

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  bio?: PortableTextBlock[] | string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string | null;
}

export interface MainImage {
  asset: {
    _id: string;
    url: string;
    metadata: {
      lqip: string;
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
  hotspot: any;
  crop: any;
}

// Portable Text types
export interface PortableTextChild {
  _key: string;
  _type: string;
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _key: string;
  _type: "block";
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
  children: PortableTextChild[];
  markDefs?: any[];
  listItem?: "bullet" | "number";
  level?: number;
}

export interface Article {
  _id: string;
  _type: string;
  title: string;
  subtitle: string;
  slug: {
    _type: string;
    current: string;
  };
  publishedAt: string;
  minread: number;
  mainImage: MainImage;
  mainImageUrl: string;
  mainImageLqip: string;
  author: Author;
  categories: Category[];
  summaryoverviewdescription: PortableTextBlock[];
  body: PortableTextBlock[];
  summaryinsights: string[];
}

export interface HeroSection {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: SanityImage;
  ctaButton?: {
    text: string;
    link: string;
  };
}

export interface ContentCategory {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  slug: {
    current: string;
  };
  order: number;
}

export interface SectorInsight {
  _id: string;
  title: string;
  sector: string;
  excerpt: string;
  image?: SanityImage;
  publishedAt: string;
  slug: {
    current: string;
  };
}

export interface Forecast {
  _id: string;
  title: string;
  excerpt: string;
  forecastPeriod: string;
  image?: SanityImage;
  publishedAt: string;
  slug: {
    current: string;
  };
  featured?: boolean;
}

export interface CaseStudy {
  _id: string;
  title: string;
  client: string;
  industry: string;
  excerpt: string;
  image?: SanityImage;
  results?: string[];
  slug: {
    current: string;
  };
  featured?: boolean;
}
