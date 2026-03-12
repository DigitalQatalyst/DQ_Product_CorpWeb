-- Articles for Digital Perspectives Topics
-- This script inserts 2 articles for each of the 6 digital perspective categories

-- D1: Digital Economy 4.0 Articles
INSERT INTO articles (title, slug, excerpt, description, categoryName, category, status, publish_date, hero_image, type, author_id)
VALUES 
(
  'The Rise of Platform Economics in Digital Economy 4.0',
  'rise-of-platform-economics-digital-economy',
  'Discover how platform-based business models are reshaping the global economy and creating unprecedented value.',
  'Platform economics represents a fundamental shift in how businesses create and capture value in the digital age. This article explores the mechanisms behind successful digital platforms and their impact on traditional industries.',
  'Digital Economy 4.0',
  'Digital Economy 4.0',
  'published',
  '2025-02-15',
  '/images/Article 01_hero image.png',
  'article',
  1
),
(
  'Data as Currency: Monetizing Information in the Digital Economy',
  'data-as-currency-digital-economy',
  'Explore how organizations are transforming data into their most valuable asset and revenue stream.',
  'In Digital Economy 4.0, data has become the new currency. This article examines strategies for data monetization, ethical considerations, and the infrastructure needed to capitalize on information assets.',
  'Digital Economy 4.0',
  'Digital Economy 4.0',
  'published',
  '2025-02-12',
  '/images/Article 02_hero image.png',
  'article',
  2
);

-- D2: Digital Cognitive Organisation Articles
INSERT INTO articles (title, slug, excerpt, description, categoryName, category, status, publish_date, hero_image, type, author_id)
VALUES 
(
  'Building Intelligent Organizations: The DCO Framework',
  'building-intelligent-organizations-dco-framework',
  'Learn how Digital Cognitive Organizations leverage AI and machine learning to create self-learning, adaptive enterprises.',
  'Digital Cognitive Organizations represent the evolution of business intelligence. This comprehensive guide explores the architectural principles, technological foundations, and organizational changes required to build truly cognitive enterprises.',
  'Digital Cognitive Organisation',
  'Digital Cognitive Organisation',
  'published',
  '2025-02-10',
  '/images/Article 03_hero image.png',
  'article',
  1
),
(
  'From Reactive to Predictive: Cognitive Decision-Making Systems',
  'reactive-to-predictive-cognitive-decision-making',
  'Discover how cognitive systems are transforming organizational decision-making from reactive responses to predictive intelligence.',
  'Traditional organizations react to events after they occur. Cognitive organizations predict and prepare. This article explores the technologies and methodologies enabling predictive decision-making at scale.',
  'Digital Cognitive Organisation',
  'Digital Cognitive Organisation',
  'published',
  '2025-02-08',
  '/images/Article 01_hero image.png',
  'article',
  3
);

-- D3: Digital Business Platform Articles
INSERT INTO articles (title, slug, excerpt, description, categoryName, category, status, publish_date, hero_image, type, author_id)
VALUES 
(
  'Architecting Scalable Digital Business Platforms',
  'architecting-scalable-digital-business-platforms',
  'Master the principles of building digital platforms that scale seamlessly from startup to enterprise.',
  'Digital Business Platforms are the foundation of modern digital enterprises. This article provides a comprehensive guide to platform architecture, including microservices, APIs, and ecosystem design patterns.',
  'Digital Business Platform',
  'Digital Business Platform',
  'published',
  '2025-02-05',
  '/images/Article 02_hero image.png',
  'article',
  4
),
(
  'Platform Ecosystems: Creating Network Effects at Scale',
  'platform-ecosystems-network-effects',
  'Understand how to design and nurture platform ecosystems that generate exponential value through network effects.',
  'The most successful digital platforms create powerful network effects. This article examines strategies for ecosystem development, partner management, and value creation in multi-sided platforms.',
  'Digital Business Platform',
  'Digital Business Platform',
  'published',
  '2025-02-03',
  '/images/Article 03_hero image.png',
  'article',
  2
);

-- D4: Digital Transformation 2.0 Articles
INSERT INTO articles (title, slug, excerpt, description, categoryName, category, status, publish_date, hero_image, type, author_id)
VALUES 
(
  'Beyond Digitization: The Evolution to Transformation 2.0',
  'beyond-digitization-transformation-2-0',
  'Explore how Digital Transformation 2.0 goes beyond technology adoption to fundamentally reimagine business models.',
  'Digital Transformation 2.0 represents a paradigm shift from digitizing existing processes to reimagining entire business models. This article explores the key differences and provides a roadmap for organizations ready to make the leap.',
  'Digital Transformation',
  'Digital Transformation 2.0',
  'published',
  '2025-02-01',
  '/images/Article 01_hero image.png',
  'article',
  1
),
(
  'AI-Driven Transformation: From Automation to Augmentation',
  'ai-driven-transformation-automation-augmentation',
  'Discover how AI is evolving from automating tasks to augmenting human capabilities in transformative ways.',
  'The next wave of digital transformation leverages AI not just for automation, but for augmenting human decision-making and creativity. This article explores practical applications and implementation strategies.',
  'Digital Transformation',
  'Digital Transformation 2.0',
  'published',
  '2025-01-28',
  '/images/Article 02_hero image.png',
  'article',
  3
);

-- D5: Digital Worker & Digital Workspace Articles
INSERT INTO articles (title, slug, excerpt, description, categoryName, category, status, publish_date, hero_image, type, author_id)
VALUES 
(
  'The Hybrid Workforce Revolution: Designing Digital Workspaces',
  'hybrid-workforce-revolution-digital-workspaces',
  'Learn how to create digital workspaces that empower distributed teams and enhance productivity.',
  'The future of work is hybrid. This article provides comprehensive guidance on designing digital workspaces that support collaboration, productivity, and employee wellbeing in distributed environments.',
  'Digital Workspace',
  'Digital Worker & Digital Workspace',
  'published',
  '2025-01-25',
  '/images/Article 03_hero image.png',
  'article',
  4
),
(
  'Upskilling for the Digital Age: Building Tomorrow''s Workforce',
  'upskilling-digital-age-building-workforce',
  'Explore strategies for developing digital skills and capabilities in your workforce for long-term success.',
  'Digital transformation requires a digitally skilled workforce. This article examines effective upskilling strategies, learning platforms, and organizational approaches to building digital capabilities at scale.',
  'Digital Workspace',
  'Digital Worker & Digital Workspace',
  'published',
  '2025-01-22',
  '/images/Article 01_hero image.png',
  'article',
  2
);

-- D6: Digital Accelerators (Tools) Articles
INSERT INTO articles (title, slug, excerpt, description, categoryName, category, status, publish_date, hero_image, type, author_id)
VALUES 
(
  'Essential Digital Tools for Enterprise Transformation',
  'essential-digital-tools-enterprise-transformation',
  'A comprehensive guide to the digital tools and technologies accelerating business transformation.',
  'Digital accelerators are the tools and technologies that enable rapid transformation. This article provides an overview of essential platforms, from low-code development to AI-powered analytics.',
  'Digital Tools',
  'Digital Accelerators (Tools)',
  'published',
  '2025-01-20',
  '/images/Article 02_hero image.png',
  'article',
  1
),
(
  'Low-Code/No-Code Platforms: Democratizing Digital Innovation',
  'low-code-no-code-democratizing-innovation',
  'Discover how low-code and no-code platforms are empowering business users to drive digital innovation.',
  'Low-code and no-code platforms are revolutionizing how organizations build digital solutions. This article explores the capabilities, use cases, and best practices for leveraging these powerful accelerators.',
  'Digital Tools',
  'Digital Accelerators (Tools)',
  'published',
  '2025-01-18',
  '/images/Article 03_hero image.png',
  'article',
  3
);
