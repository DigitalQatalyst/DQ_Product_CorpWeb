export interface HeroData {
  title: string;
  subtitleOptions: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  metrics: Metric[];
}
export interface Metric {
  label: string;
  value: number;
}
export const heroData: HeroData = {
  title: 'Empowering Women Entrepreneurs Across the UAE',
  subtitleOptions: ['Learn', 'Connect', 'Grow', 'Lead'],
  ctaPrimary: 'Start Your Journey',
  ctaSecondary: 'Join the Community',
  metrics: [{
    label: 'Businesses Supported',
    value: 10000
  }, {
    label: 'Programs',
    value: 120
  }, {
    label: 'Partners',
    value: 45
  }]
};