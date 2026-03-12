export interface EcosystemPartner {
  id: number;
  name: string;
  category: string;
  region: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
}
export const ecosystemData: EcosystemPartner[] = [{
  id: 1,
  name: 'Khalifa Fund for Enterprise Development',
  category: 'Finance',
  region: 'Abu Dhabi',
  description: 'Provides financial support and mentorship for Emirati entrepreneurs and SMEs.',
  coordinates: [24.4539, 54.3773]
}, {
  id: 2,
  name: 'Hub71',
  category: 'Incubator',
  region: 'Abu Dhabi',
  description: 'Global tech ecosystem offering incentive programs for startups and scale-ups.',
  coordinates: [24.5331, 54.4276]
}, {
  id: 3,
  name: 'Abu Dhabi Global Market (ADGM)',
  category: 'Finance',
  region: 'Abu Dhabi',
  description: 'International financial center with regulatory framework for fintech innovation.',
  coordinates: [24.5018, 54.383]
}, {
  id: 4,
  name: 'Abu Dhabi Business Women Council',
  category: 'Network',
  region: 'Abu Dhabi',
  description: 'Network supporting women entrepreneurs through training and networking opportunities.',
  coordinates: [24.4667, 54.3667]
}, {
  id: 5,
  name: 'startAD',
  category: 'Incubator',
  region: 'Abu Dhabi',
  description: 'NYU Abu Dhabi-based incubator for early-stage startups in the UAE.',
  coordinates: [24.5239, 54.4346]
}, {
  id: 6,
  name: 'Flat6Labs Abu Dhabi',
  category: 'Incubator',
  region: 'Abu Dhabi',
  description: 'Startup accelerator program offering seed funding and mentorship.',
  coordinates: [24.488, 54.3773]
}, {
  id: 7,
  name: 'Sheraa Hub',
  category: 'Incubator',
  region: 'Sharjah',
  description: 'Entrepreneurship center supporting innovative startups in the region.',
  coordinates: [25.3463, 55.4209]
}, {
  id: 8,
  name: 'In5 Innovation Hub',
  category: 'Workspace',
  region: 'Dubai',
  description: 'Creative space offering infrastructure and support for entrepreneurs.',
  coordinates: [25.0657, 55.2144]
}, {
  id: 9,
  name: 'Dubai Business Women Council',
  category: 'Network',
  region: 'Dubai',
  description: 'Official representative of businesswomen in Dubai providing resources and support.',
  coordinates: [25.2048, 55.2708]
}, {
  id: 10,
  name: 'Abu Dhabi Investment Office',
  category: 'Finance',
  region: 'Abu Dhabi',
  description: "Government entity facilitating investment in Abu Dhabi's priority sectors.",
  coordinates: [24.4821, 54.3563]
}, {
  id: 11,
  name: 'TwoFour54',
  category: 'Workspace',
  region: 'Abu Dhabi',
  description: 'Media free zone and creative ecosystem for content creators and entrepreneurs.',
  coordinates: [24.4214, 54.4348]
}, {
  id: 12,
  name: 'Masdar City',
  category: 'Workspace',
  region: 'Abu Dhabi',
  description: 'Sustainable urban development offering workspace for clean technology startups.',
  coordinates: [24.4267, 54.618]
}];
export const categories = ['All', 'Finance', 'Incubator', 'Network', 'Workspace'];