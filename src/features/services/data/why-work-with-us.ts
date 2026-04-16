import { DollarSign, Clock, TrendingUp, type LucideIcon } from "lucide-react";

export interface ValueProp { icon: LucideIcon; title: string; description: string }

export const valueProps: ValueProp[] = [
  { icon: DollarSign, title: "Save Money",           description: "Cut costs on your digital projects by optimizing your strategy, reducing capital spending by up to 50%." },
  { icon: Clock,      title: "Save Time",            description: "Speed up your digital transformation with over 1000 ready-to-use practices and solutions." },
  { icon: TrendingUp, title: "Improve Market Share", description: "Leverage digital transformation to capture new market segments and strengthen your competitive edge." },
];
