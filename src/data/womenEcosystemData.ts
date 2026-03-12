// Data model for Women Entrepreneurs Ecosystem Map
// Global entity registry for organizations that appear in multiple emirates
export const entityRegistry = {
  entities: {
    Hub71: {
      type: 'sme_operator',
      link: 'https://hub71.com',
      description:
        'Tech hub supporting women-led startups and scaleups with global expansion ambitions.',
      emirates: ['Abu Dhabi', 'Dubai'],
      coordinates: [24.5037, 54.3875], // Abu Dhabi Global Market, Al Maryah Island
    },
    'Khalifa Fund': {
      type: 'sme_operator',
      link: 'https://khalifafund.ae',
      description:
        'Funding and mentorship for Emirati entrepreneurs with dedicated programs for women-led businesses.',
      emirates: ['Abu Dhabi', 'Dubai', 'Sharjah'],
      coordinates: [24.4539, 54.3969], // Khalifa Fund headquarters, Abu Dhabi
    },
    startAD: {
      type: 'academic_partner',
      link: 'https://startad.ae',
      description:
        'Accelerator and mentorship program for women entrepreneurs based at NYU Abu Dhabi.',
      emirates: ['Abu Dhabi'],
      coordinates: [24.5246, 54.4346], // NYU Abu Dhabi, Saadiyat Island
    },
    'Dubai Business Women Council': {
      type: 'local_enabler',
      link: 'https://dbwc.ae',
      description:
        'Networking, mentorship, and international exposure for women entrepreneurs in Dubai.',
      emirates: ['Dubai'],
      coordinates: [25.2648, 55.3291], // Dubai Chamber of Commerce, Deira
    },
    'DIFC Innovation Hub': {
      type: 'tech_support',
      link: 'https://difc.ae/innovation',
      description:
        'Innovation hub located in Dubai International Financial Centre supporting fintech startups.',
      emirates: ['Dubai'],
      coordinates: [25.2125, 55.2808], // DIFC, Gate Village
    },
    'Sharjah Business Women Council': {
      type: 'local_enabler',
      link: 'https://sbwc.ae',
      description:
        'Business support, training, and exhibitions for women entrepreneurs in Sharjah.',
      emirates: ['Sharjah'],
      coordinates: [25.3573, 55.3927], // Sharjah Chamber of Commerce
    },
    Sheraa: {
      type: 'academic_partner',
      link: 'https://sheraa.ae',
      description:
        'Entrepreneurship center providing incubation, acceleration, and investment opportunities.',
      emirates: ['Sharjah'],
      coordinates: [25.3051, 55.5008], // Sheraa, American University of Sharjah area
    },
    'NAMA Women Advancement': {
      type: 'private_sector',
      link: 'https://namawomen.ae',
      description:
        'Organization dedicated to advancing women economically through various programs and initiatives.',
      emirates: ['Sharjah'],
      coordinates: [25.3286, 55.4025], // Sharjah city center
    },
    'Ajman Chamber of Commerce': {
      type: 'local_enabler',
      link: 'https://ajmanchamber.ae',
      description:
        'Supporting local businesses and entrepreneurs through various services and initiatives.',
      emirates: ['Ajman'],
      coordinates: [25.4111, 55.4352], // Ajman Chamber, downtown
    },
    'RAKEZ Economic Zone': {
      type: 'local_enabler',
      link: 'https://rakez.com',
      description:
        'Economic zone offering business setup and support services for entrepreneurs.',
      emirates: ['Ras Al Khaimah'],
      coordinates: [25.6866, 55.9455], // RAKEZ headquarters, Al Hamra area
    },
    'Fujairah Chamber of Commerce': {
      type: 'local_enabler',
      link: 'https://fujcci.ae',
      description:
        'Supporting local businesses with a focus on trade and logistics.',
      emirates: ['Fujairah'],
      coordinates: [25.1288, 56.3265], // Fujairah Chamber, city center
    },
    'UAQ Business Center': {
      type: 'local_enabler',
      link: 'https://uaqchamber.ae',
      description:
        'Business center offering facilities and support services for local entrepreneurs.',
      emirates: ['Umm Al Quwain'],
      coordinates: [25.5644, 55.5471], // Umm Al Quwain city center
    },
    'Emirates Business Women Council': {
      type: 'federal_enabler',
      link: 'https://fbccouncil.ae',
      description:
        'Federal council supporting business women across all emirates through advocacy and policy development.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [24.4685, 54.3721], // Abu Dhabi government district
    },
    'UAE Gender Balance Council': {
      type: 'federal_enabler',
      link: 'https://gbc.gov.ae',
      description:
        'Federal entity focused on reducing the gender gap across all sectors including entrepreneurship.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [25.2048, 55.2708], // Dubai government offices, Trade Centre area
    },
    'Female Fusion': {
      type: 'private_sector',
      link: 'https://femalefusion.ae',
      description:
        "UAE's largest community of women entrepreneurs providing networking, resources and support.",
      emirates: ['Dubai', 'Abu Dhabi', 'Sharjah'],
      coordinates: [25.08, 55.15], // Dubai, Business Bay area
    },
    'Etisalat by e&': {
      type: 'tech_support',
      link: 'https://etisalat.ae',
      description:
        'Telecommunications provider offering digital solutions and support for women entrepreneurs.',
      emirates: [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
      ],
      coordinates: [24.4764, 54.3705], // Etisalat headquarters, Abu Dhabi
    },
    Snapchat: {
      type: 'tech_support',
      link: 'https://snap.com',
      description:
        'Social media platform providing digital marketing support and training for women entrepreneurs.',
      emirates: ['Dubai'],
      coordinates: [25.1405, 55.2747], // Dubai, Business Bay/DIFC area
    },
    'Khalifa University': {
      type: 'academic_partner',
      link: 'https://ku.ac.ae',
      description:
        'University providing research support, innovation labs, and educational programs for women entrepreneurs.',
      emirates: ['Abu Dhabi'],
      coordinates:[24.45, 54.39], // Khalifa University main campus
    },
    'Abu Dhabi Business Women Council': {
      type: 'local_enabler',
      link: 'https://adbwc.ae',
      description:
        'Supporting business women in Abu Dhabi through networking, training, and advocacy programs.',
      emirates: ['Abu Dhabi'],
      coordinates: [24.49, 54.35], // Approx as per Google
    },
  },
}
// Emirate-specific data
export const emiratesData = [
  {
    id: 'abudhabi',
    emirate: 'Abu Dhabi',
    coordinates: [24.4539, 54.3773],
    zoomLevel: 9,
    boundingBox: [
      [23.4, 51.5],
      [24.8, 55.0],
    ],
    overview: {
      title: 'Driving Innovation Through Inclusive Entrepreneurship',
      description:
        'A thriving ecosystem of enablers focusing on innovation, funding, and sustainability, supporting women entrepreneurs through comprehensive programs and initiatives.',
      tags: ['Federal', 'Local', 'Operator', 'Academic', 'Tech'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['Abu Dhabi Business Women Council'],
    sme_operators: ['Hub71', 'Khalifa Fund'],
    private_sector: ['Female Fusion'],
    academic_partners: ['Khalifa University', 'startAD'],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'SheTech Accelerator',
        organization: 'Hub71',
        action_label: 'Apply Now',
        link: 'https://example.com',
      },
      {
        program_name: 'Women Entrepreneurs Academy',
        organization: 'Khalifa Fund',
        action_label: 'Join Program',
        link: 'https://example.com',
      },
      {
        program_name: 'Ibtikari Female Leaders',
        organization: 'startAD',
        action_label: 'Learn More',
        link: 'https://example.com',
      },
    ],
  },
  {
    id: 'dubai',
    emirate: 'Dubai',
    coordinates: [25.2048, 55.2708],
    zoomLevel: 9,
    boundingBox: [
      [24.8, 54.9],
      [25.4, 55.6],
    ],
    overview: {
      title: 'Global Hub for Women Entrepreneurship',
      description:
        'A dynamic ecosystem that connects women entrepreneurs to global markets through innovative programs, funding opportunities, and mentorship networks.',
      tags: ['Federal', 'Local', 'Tech', 'Private'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['Dubai Business Women Council'],
    sme_operators: ['Khalifa Fund'],
    private_sector: ['Female Fusion'],
    academic_partners: [],
    tech_support: ['DIFC Innovation Hub', 'Etisalat by e&', 'Snapchat'],
    programs: [
      {
        program_name: 'She Leads Program',
        organization: 'Dubai Business Women Council',
        action_label: 'Register Now',
        link: 'https://example.com',
      },
      {
        program_name: 'FinTech Hive Accelerator',
        organization: 'DIFC Innovation Hub',
        action_label: 'Apply Now',
        link: 'https://example.com',
      },
    ],
  },
  {
    id: 'sharjah',
    emirate: 'Sharjah',
    coordinates: [25.3562, 55.4272],
    zoomLevel: 9,
    boundingBox: [
      [25.2, 55.3],
      [25.6, 55.7],
    ],
    overview: {
      title: 'Empowering Women Through Cultural Innovation',
      description:
        'A supportive ecosystem that combines cultural heritage with innovation to empower women entrepreneurs through targeted programs and initiatives.',
      tags: ['Federal', 'Local', 'Academic', 'Private'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['Sharjah Business Women Council'],
    sme_operators: ['Khalifa Fund'],
    private_sector: ['NAMA Women Advancement', 'Female Fusion'],
    academic_partners: ['Sheraa'],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'SBWC Accelerator',
        organization: 'Sharjah Business Women Council',
        action_label: 'Join Now',
        link: 'https://example.com',
      },
      {
        program_name: 'Badiri E-Academy',
        organization: 'NAMA Women Advancement',
        action_label: 'Enroll Today',
        link: 'https://example.com',
      },
    ],
  },
  {
    id: 'ajman',
    emirate: 'Ajman',
    coordinates: [25.4052, 55.5136],
    zoomLevel: 10,
    boundingBox: [
      [25.3, 55.4],
      [25.5, 55.6],
    ],
    overview: {
      title: 'Fostering Local Entrepreneurial Talent',
      description:
        'A growing ecosystem focused on developing local entrepreneurial talent through targeted support programs and community initiatives.',
      tags: ['Federal', 'Local'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['Ajman Chamber of Commerce'],
    sme_operators: [],
    private_sector: [],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'Ajman Entrepreneurs Program',
        organization: 'Ajman Chamber of Commerce',
        action_label: 'Learn More',
        link: 'https://example.com',
      },
    ],
  },
  {
    id: 'rak',
    emirate: 'Ras Al Khaimah',
    coordinates: [25.6741, 55.9804,
    zoomLevel: 10,
    boundingBox: [
      [25.5, 55.7],
      [26.0, 56.2],
    ],
    overview: {
      title: 'Connecting Tourism and Entrepreneurship',
      description:
        'An ecosystem that leverages tourism and natural resources to create unique opportunities for women entrepreneurs.',
      tags: ['Federal', 'Local'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['RAKEZ Economic Zone'],
    sme_operators: [],
    private_sector: [],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'RAK SME Program',
        organization: 'RAKEZ Economic Zone',
        action_label: 'Register Interest',
        link: 'https://example.com',
      },
    ],
  },
  {
    id: 'fujairah',
    emirate: 'Fujairah',
    coordinates: [25.1221, 56.3345],
    zoomLevel: 10,
    boundingBox: [
      [25.0, 56.2],
      [25.6, 56.5],
    ],
    overview: {
      title: 'Blending Trade and Innovation',
      description:
        'A unique ecosystem that combines port trade advantages with innovation to support women-led businesses in various sectors.',
      tags: ['Federal', 'Local'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['Fujairah Chamber of Commerce'],
    sme_operators: [],
    private_sector: [],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'Fujairah Entrepreneurs Initiative',
        organization: 'Fujairah Chamber of Commerce',
        action_label: 'Discover More',
        link: 'https://example.com',
      },
    ],
  },
  {
    id: 'uaq',
    emirate: 'Umm Al Quwain',
    coordinates: [25.5508, 55.5524],
    zoomLevel: 10,
    boundingBox: [
      [25.5, 55.4],
      [25.7, 55.7],
    ],
    overview: {
      title: 'Building Community-Based Entrepreneurship',
      description:
        'A community-focused ecosystem that nurtures local talent and traditional businesses with modern approaches.',
      tags: ['Federal', 'Local'],
    },
    federal_enablers: [
      'Emirates Business Women Council',
      'UAE Gender Balance Council',
    ],
    local_enablers: ['UAQ Business Center'],
    sme_operators: [],
    private_sector: [],
    academic_partners: [],
    tech_support: ['Etisalat by e&'],
    programs: [
      {
        program_name: 'UAQ Women in Business',
        organization: 'UAQ Business Center',
        action_label: 'Join Network',
        link: 'https://example.com',
      },
    ],
  },
]
// Category mapping for UI elements
export const categoryMapping = {
  federal_enabler: {
    label: 'Federal Enabler',
    color: {
      bg: 'bg-primary',
      text: 'text-white',
      marker: '#0030E3',
      border: '#ffffff',
      hover: 'hover:bg-primary-dark',
      pill: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
      active: 'bg-primary text-white',
    },
  },
  local_enabler: {
    label: 'Local Enabler',
    color: {
      bg: 'bg-teal',
      text: 'text-white',
      marker: '#00E5D1',
      border: '#ffffff',
      hover: 'hover:bg-teal-dark',
      pill: 'bg-teal/10 text-teal hover:bg-teal hover:text-white',
      active: 'bg-teal text-white',
    },
  },
  sme_operator: {
    label: 'SME Operator',
    color: {
      bg: 'bg-purple',
      text: 'text-white',
      marker: '#954BF9',
      border: '#ffffff',
      hover: 'hover:bg-purple-dark',
      pill: 'bg-purple/10 text-purple hover:bg-purple hover:text-white',
      active: 'bg-purple text-white',
    },
  },
  private_sector: {
    label: 'Private Sector',
    color: {
      bg: 'bg-purple-light',
      text: 'text-purple-dark',
      marker: '#C499FF',
      border: '#954BF9',
      hover: 'hover:bg-purple-light/80',
      pill: 'bg-purple-light/30 text-purple-dark hover:bg-purple-light hover:text-purple-dark',
      active: 'bg-purple-light text-purple-dark',
    },
  },
  academic_partner: {
    label: 'Academic Partner',
    color: {
      bg: 'bg-teal-light',
      text: 'text-teal-dark',
      marker: '#99FFF5',
      border: '#00E5D1',
      hover: 'hover:bg-teal-light/80',
      pill: 'bg-teal-light/30 text-teal-dark hover:bg-teal-light hover:text-teal-dark',
      active: 'bg-teal-light text-teal-dark',
    },
  },
  tech_support: {
    label: 'Tech Support',
    color: {
      bg: 'bg-primary-light',
      text: 'text-primary-dark',
      marker: '#99B2FF',
      border: '#0030E3',
      hover: 'hover:bg-primary-light/80',
      pill: 'bg-primary-light/30 text-primary-dark hover:bg-primary-light hover:text-primary-dark',
      active: 'bg-primary-light text-primary-dark',
    },
  },
}
// GeoJSON data for UAE emirates (simplified)
export const emirateGeoJSON = {
  abudhabi: {
    type: 'Polygon',
    coordinates: [
      [
        [51.5, 24.0],
        [52.0, 24.3],
        [52.5, 24.4],
        [53.0, 24.5],
        [53.5, 24.6],
        [54.0, 24.7],
        [54.3, 24.4],
        [54.5, 24.2],
        [54.0, 24.0],
        [53.5, 23.8],
        [53.0, 23.6],
        [52.5, 23.5],
        [52.0, 23.7],
        [51.8, 24.0],
        [51.5, 24.0],
      ],
    ],
  },
  dubai: {
    type: 'Polygon',
    coordinates: [
      [
        [55.0, 25.0],
        [55.1, 25.3],
        [55.3, 25.4],
        [55.4, 25.3],
        [55.6, 25.1],
        [55.5, 24.9],
        [55.3, 24.8],
        [55.1, 24.9],
        [55.0, 25.0],
      ],
    ],
  },
  sharjah: {
    type: 'Polygon',
    coordinates: [
      [
        [55.4, 25.3],
        [55.5, 25.4],
        [55.7, 25.5],
        [55.8, 25.4],
        [55.7, 25.3],
        [55.5, 25.2],
        [55.4, 25.3],
      ],
    ],
  },
  ajman: {
    type: 'Polygon',
    coordinates: [
      [
        [55.4, 25.4],
        [55.5, 25.5],
        [55.6, 25.4],
        [55.5, 25.3],
        [55.4, 25.4],
      ],
    ],
  },
  rak: {
    type: 'Polygon',
    coordinates: [
      [
        [55.9, 25.6],
        [56.0, 25.8],
        [56.2, 26.0],
        [56.3, 25.9],
        [56.2, 25.7],
        [56.0, 25.6],
        [55.9, 25.6],
      ],
    ],
  },
  fujairah: {
    type: 'Polygon',
    coordinates: [
      [
        [56.2, 25.1],
        [56.3, 25.3],
        [56.4, 25.5],
        [56.5, 25.3],
        [56.4, 25.1],
        [56.3, 25.0],
        [56.2, 25.1],
      ],
    ],
  },
  uaq: {
    type: 'Polygon',
    coordinates: [
      [
        [55.5, 25.5],
        [55.6, 25.6],
        [55.7, 25.5],
        [55.6, 25.4],
        [55.5, 25.5],
      ],
    ],
  },
}
// Helper function to get all organizations from a specific emirate
export const getEmirateOrganizations = (emirateId: string) => {
  const emirate = emiratesData.find((e) => e.id === emirateId)
  if (!emirate) return []
  const organizations: any[] = []
  // Combine all organization types from the emirate
  const addOrganizations = (orgNames: string[], type: string) => {
    orgNames.forEach((name) => {
      const entity =
        entityRegistry.entities[name as keyof typeof entityRegistry.entities]
      if (entity) {
        organizations.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          category: type,
          type:
            categoryMapping[entity.type as keyof typeof categoryMapping]
              ?.label || type,
          description: entity.description,
          link: entity.link,
          coordinates: entity.coordinates,
        })
      }
    })
  }
  addOrganizations(emirate.federal_enablers, 'federal_enabler')
  addOrganizations(emirate.local_enablers, 'local_enabler')
  addOrganizations(emirate.sme_operators, 'sme_operator')
  addOrganizations(emirate.private_sector, 'private_sector')
  addOrganizations(emirate.academic_partners, 'academic_partner')
  addOrganizations(emirate.tech_support, 'tech_support')
  return organizations
}
// Helper function to get all organizations across all emirates
export const getAllOrganizations = () => {
  const allOrgs: any[] = []
  const addedOrgIds = new Set()
  emiratesData.forEach((emirate) => {
    const emirateOrgs = getEmirateOrganizations(emirate.id)
    emirateOrgs.forEach((org) => {
      if (!addedOrgIds.has(org.id)) {
        allOrgs.push(org)
        addedOrgIds.add(org.id)
      }
    })
  })
  return allOrgs
}
// Helper function to get all programs from all emirates
export const getAllPrograms = () => {
  return emiratesData.flatMap((emirate) =>
    emirate.programs.map((program) => ({
      ...program,
      emirate: emirate.emirate,
    })),
  )
}
// Helper function to get programs from a specific emirate
export const getEmiratePrograms = (emirateId: string) => {
  const emirate = emiratesData.find((e) => e.id === emirateId)
  return emirate ? emirate.programs : []
}
