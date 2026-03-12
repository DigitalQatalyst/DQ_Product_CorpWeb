export interface Story {
  id: number;
  category: string;
  title: string;
  author: string;
  image: string;
  excerpt: string;
  content?: string;
}
export const storiesData: Story[] = [{
  id: 1,
  category: 'Stories',
  title: 'Building a Tech Empire in Abu Dhabi',
  author: 'Reem Al Shamsi',
  image: 'https://images.unsplash.com/photo-1512075135822-67cdd9dd7314?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'From startup to industry leader in the UAE tech sector.',
  content: "When I launched my tech startup in Abu Dhabi five years ago, I was one of only a handful of women in the sector. Today, our AI solutions company employs over 40 people and serves clients across the GCC. The support from Hub71 and the Abu Dhabi Investment Office was instrumental in our growth, providing not just funding but mentorship and connections that helped us navigate the unique business landscape of the UAE. Our journey reflects the transformation happening in Abu Dhabi's digital economy, where innovation is being prioritized alongside traditional industries."
}, {
  id: 2,
  category: 'Innovation',
  title: 'Revolutionizing Healthcare in the Emirates',
  author: 'Fatima Al Mansoori',
  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'Building technology that brings healthcare to remote UAE communities.',
  content: "Our mobile health platform now serves over 5,000 patients in remote areas of the UAE, connecting them with specialists they would otherwise never have access to. What began as a simple telemedicine app has evolved into a comprehensive healthcare ecosystem that's changing lives across the Emirates. The Department of Health - Abu Dhabi has been a key partner, helping us navigate regulations and scale our impact to reach the most underserved communities in the Northern Emirates."
}, {
  id: 3,
  category: 'Leadership',
  title: 'Leading an Emirati Workforce',
  author: 'Layla Al Nasser',
  image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'Leadership lessons from scaling a UAE startup to 50 employees.',
  content: "Building a diverse team that includes both Emirati nationals and expatriates has been both challenging and rewarding. Our company has benefited tremendously from the UAE's Emiratization initiatives, which have helped us identify talented local graduates. I've learned that effective leadership in the UAE context requires understanding the unique cultural dynamics at play while fostering an environment where innovation can thrive. Creating mentorship programs specifically for young Emirati women has been one of our most successful initiatives."
}, {
  id: 4,
  category: 'Finance',
  title: 'Securing Investment in Abu Dhabi',
  author: 'Mariam Al Hashimi',
  image: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'How I raised $3M for my fintech startup in the UAE capital.',
  content: 'After 47 rejections, I finally secured my first round of venture funding from the Abu Dhabi Investment Office and a consortium of regional investors. The journey taught me invaluable lessons about resilience, refining my pitch, and finding investors who truly understood my vision for financial inclusion in the Arab world. The Abu Dhabi Global Market (ADGM) provided a regulatory sandbox that allowed us to test our solutions before full market launch, which proved critical to our success and credibility with investors.'
}, {
  id: 5,
  category: 'Growth',
  title: 'From Abu Dhabi to Global Markets',
  author: 'Noura Al Kaabi',
  image: 'https://images.unsplash.com/photo-1554576575-a4e7b6e8409d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'Scaling an Emirati business internationally.',
  content: "What started in my kitchen in Al Ain is now exported to 12 countries across the Middle East and Europe. The transition from local entrepreneur to international business owner came with countless challenges, from logistics and regulations to cultural adaptations. The UAE's strategic location between East and West gave us a unique advantage, and programs like Abu Dhabi Exports Office provided crucial support for our international expansion. Each new market required us to adapt our products while maintaining our authentic Emirati identity."
}, {
  id: 6,
  category: 'Stories',
  title: 'Second Chances: My Abu Dhabi Comeback',
  author: 'Hessa Al Falasi',
  image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'How failure in the UAE market led to my biggest breakthrough.',
  content: 'After my first business failed during the pandemic, I spent months rebuilding my confidence before launching again in Abu Dhabi. The lessons from that first venture proved invaluable, and now my educational technology platform serves thousands of students across the UAE. The Khalifa Fund provided not just financial support but also restructured mentorship that helped me avoid previous mistakes. Sometimes our greatest setbacks lead to our most meaningful opportunities, especially in a market as dynamic and forgiving as the UAE.'
}, {
  id: 7,
  category: 'Sustainability',
  title: 'Pioneering Sustainable Fashion in the UAE',
  author: 'Amna Al Qubaisi',
  image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'Creating eco-friendly fashion inspired by Emirati heritage.',
  content: "Combining traditional Emirati textile techniques with sustainable materials has allowed us to create a fashion brand that honors our heritage while looking to the future. The UAE's vision for sustainability, exemplified by Masdar City and other initiatives, has created a supportive ecosystem for businesses like ours. We've partnered with local artisans in Al Ain and Fujairah to revive traditional crafts while introducing eco-friendly innovations that reduce water usage and waste in our production process."
}, {
  id: 8,
  category: 'Technology',
  title: 'Developing AI Solutions for Arabic Markets',
  author: 'Shamma Al Mazrouei',
  image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  excerpt: 'Creating language technology tailored for the Arab world.',
  content: "The unique challenges of Arabic natural language processing inspired me to develop solutions specifically designed for our region. With support from the Technology Innovation Institute in Abu Dhabi, we've created AI tools that understand Arabic dialects, including Emirati Arabic, with unprecedented accuracy. Our work is helping businesses across the UAE better connect with their customers through chatbots and voice assistants that truly understand local expressions and cultural context."
}];
export const categories = ['All', 'Stories', 'Innovation', 'Leadership', 'Finance', 'Growth', 'Sustainability', 'Technology'];