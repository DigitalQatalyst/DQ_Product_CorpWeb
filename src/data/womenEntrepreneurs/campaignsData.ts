export interface Campaign {
  id: number;
  title: string;
  tagline: string;
  date: string;
  image: string;
  partner: string;
  active: boolean;
}
export const campaignsData: Campaign[] = [{
  id: 1,
  title: 'Women in Tech Summit 2023',
  tagline: 'Connecting women entrepreneurs with technology leaders across the UAE',
  date: '2023-11-15',
  image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  partner: 'Hub71',
  active: true
}, {
  id: 2,
  title: 'Funding the Future',
  tagline: 'Venture capital and investment opportunities for women-led startups',
  date: '2023-12-05',
  image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  partner: 'Abu Dhabi Global Market',
  active: false
}, {
  id: 3,
  title: 'Sustainable Business Forum',
  tagline: 'Building environmentally conscious enterprises in the UAE',
  date: '2024-01-20',
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  partner: 'Masdar',
  active: false
}, {
  id: 4,
  title: 'Cross-Border E-commerce Workshop',
  tagline: 'Expanding your business globally through digital channels',
  date: '2024-02-12',
  image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  partner: 'Dubai Business Women Council',
  active: false
}];