export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  imageUrl: string;
  listenUrl: string;
  episodeNumber: number;
  isNew?: boolean;
}

export const episodes: Episode[] = [
  {
    id: "1",
    title: "The Future of AI in Creative Industries",
    description: "Exploring how artificial intelligence is reshaping music, art, and storytelling. We dive deep into the tools creators are using today.",
    duration: "45 min",
    date: "Jan 25, 2026",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
    listenUrl: "https://open.spotify.com",
    episodeNumber: 12,
    isNew: true,
  },
  {
    id: "2",
    title: "Building a Remote-First Company Culture",
    description: "Insights from founders who've scaled distributed teams across multiple time zones while maintaining strong company values.",
    duration: "38 min",
    date: "Jan 18, 2026",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
    listenUrl: "https://open.spotify.com",
    episodeNumber: 11,
  },
  {
    id: "3",
    title: "The Psychology of Peak Performance",
    description: "What separates top performers from the rest? A conversation with sports psychologists and executive coaches.",
    duration: "52 min",
    date: "Jan 11, 2026",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    listenUrl: "https://open.spotify.com",
    episodeNumber: 10,
  },
  {
    id: "4",
    title: "Sustainable Tech: Beyond the Buzzwords",
    description: "Real stories of companies making genuine impact on environmental sustainability through technology innovation.",
    duration: "41 min",
    date: "Jan 4, 2026",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop",
    listenUrl: "https://open.spotify.com",
    episodeNumber: 9,
  },
  {
    id: "5",
    title: "From Side Project to Startup",
    description: "Three founders share their journey of transforming weekend experiments into venture-backed companies.",
    duration: "47 min",
    date: "Dec 28, 2025",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop",
    listenUrl: "https://open.spotify.com",
    episodeNumber: 8,
  },
  {
    id: "6",
    title: "The Art of Deep Work",
    description: "Practical strategies for maintaining focus in a world of constant distractions and notifications.",
    duration: "35 min",
    date: "Dec 21, 2025",
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=400&fit=crop",
    listenUrl: "https://open.spotify.com",
    episodeNumber: 7,
  },
];

export const podcastInfo = {
  name: "The Forward Thinkers",
  tagline: "Conversations with innovators shaping tomorrow",
  description: "Every week, we sit down with founders, creators, and thought leaders who are pushing boundaries and challenging the status quo. Get inspired by stories of resilience, creativity, and breakthrough thinking.",
  host: "Sarah Chen",
  subscriberCount: "50K+",
};
