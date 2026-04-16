import { TrendingUp, Globe, Users, Heart, Award, Zap, Sparkles, Target } from "lucide-react";

export const careerStats = [
  { value: "50+", label: "Team Members" },
  { value: "6+", label: "Countries" },
  { value: "100+", label: "Projects Delivered" },
  { value: "95%", label: "Employee Satisfaction" },
];

export const benefits = [
  { icon: TrendingUp, title: "Career Growth", description: "Continuous learning opportunities and clear career progression paths." },
  { icon: Globe, title: "Global Impact", description: "Work on transformative projects across multiple countries and industries." },
  { icon: Users, title: "Collaborative Culture", description: "Join a diverse team of experts passionate about digital transformation." },
  { icon: Heart, title: "Work-Life Balance", description: "Flexible working arrangements and comprehensive wellness programs." },
  { icon: Award, title: "Competitive Package", description: "Industry-leading compensation and benefits tailored to your needs." },
  { icon: Zap, title: "Innovation First", description: "Access to cutting-edge tools and technologies to drive innovation." },
];

export const values = [
  { icon: Sparkles, title: "Self-Development", description: "We invest in continuous learning and personal growth." },
  { icon: Target, title: "Lean Working", description: "Focus on what matters, deliver value efficiently." },
  { icon: Users, title: "Value Co-Creation", description: "Partner with clients to shape measurable outcomes." },
];

export interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills?: { core: string[]; behavioral: string[] };
  openPositions?: number;
  postedDate: string;
}
