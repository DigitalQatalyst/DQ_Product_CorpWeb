import { useState, useEffect } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import {
  Linkedin,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
} from "lucide-react";
import {
  blogService,
  authorService,
  Author,
  Blog,
} from "../../admin-ui/utils/supabase";

// Fallback author data when not in database
const fallbackAuthors: Author[] = [
  {
    id: "fallback-1",
    name: "Dr. Stéphane Niango",
    title: "DCO Strategy & Applied AI Specialist",
    bio: "Expert in Digital Cognitive Organizations & Strategic Transformation with 10+ published works",
    avatar: "/images/Stephane_Avatar.png",
    linkedIn: "linkedin.com/in/stephane-niango",
    location: "Global",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    name: "Kaylynn Océanne",
    title: "Experience Design & Human Insights Expert",
    bio: "Content Engagement Strategist specializing in coherent system design with 9+ published works",
    avatar: "/images/Kaylynn_Avatar.png",
    linkedIn: "linkedin.com/in/kaylynn-oceanne",
    location: "Global",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    name: "Mark Kerry",
    title: "DCO Strategy & Accounts Specialist",
    bio: "Explores leadership, culture, and strategy in driving meaningful organisational transformation",
    avatar: "/images/MK-Avatar.png",
    linkedIn: "linkedin.com/in/mark-kerry",
    location: "Global",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    name: "Sharavi Chander",
    title: "Solution Architecture & DBPs Expert",
    bio: "Explores frameworks, tools, and mindsets for building scalable and resilient digital solutions",
    avatar: "/images/Sharavi-Avatar.png",
    linkedIn: "linkedin.com/in/sharavi-chander",
    location: "Global",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    name: "Salem Wasike",
    title: "Product Strategy & Customer Experience Specialist",
    bio: "Explores the interplay of customer needs, business goals, and product strategy",
    avatar: "/images/Salem-Avatar.png",
    linkedIn: "linkedin.com/in/salem-wasike",
    location: "Global",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function AuthorBioPage() {
  const { slug: authorSlug } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherAuthors, setOtherAuthors] = useState<Author[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!authorSlug) return;
      setLoading(true);
      try {
        // Try to get authors from database
        const allAuthors = await authorService.getAuthors();

        // Combine database authors with fallback authors
        const combinedAuthors = [...allAuthors, ...fallbackAuthors];

        // Normalize slug for matching (handle special characters)
        const normalizeForSlug = (name: string) => {
          return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
        };

        const foundAuthor = combinedAuthors.find(
          (a) => normalizeForSlug(a.name) === authorSlug,
        );

        if (foundAuthor) {
          setAuthor(foundAuthor);
          setOtherAuthors(
            combinedAuthors.filter((a) => a.id !== foundAuthor.id),
          );

          // Try to get blogs for this author
          try {
            const allBlogs = await blogService.getBlogs();
            setBlogs(allBlogs.filter((b) => b.authorId === foundAuthor.id));
          } catch (err) {
            console.error("Failed to load blogs", err);
            setBlogs([]);
          }
        }
      } catch (err) {
        console.error("Failed to load author bio", err);

        // Fallback to using only fallback authors if database fails
        const normalizeForSlug = (name: string) => {
          return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        };

        const foundAuthor = fallbackAuthors.find(
          (a) => normalizeForSlug(a.name) === authorSlug,
        );

        if (foundAuthor) {
          setAuthor(foundAuthor);
          setOtherAuthors(
            fallbackAuthors.filter((a) => a.id !== foundAuthor.id),
          );
          setBlogs([]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authorSlug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  if (!author)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Author not found
      </div>
    );

  // Get expanded content based on author
  const getExpandedContent = () => {
    if (authorSlug === "kaylynn-oceanne") {
      return {
        continuedSummary: (
          <p className="text-gray-700 leading-relaxed mb-4">
            Alongside this system work, Kaylynn conducts ongoing research and
            contributes directly to content creation through academic-style
            whitepapers, thought pieces, and blogs on digital transformation,
            attention, and the emerging digital worker. Working with content,
            production, and marketing teams, she helps shape scripts,
            storyboards, and videos that hold attention and make complex ideas
            accessible.
          </p>
        ),
        sections: [
          {
            title: "Academic Background",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kaylynn holds a BSc in Psychology with a minor in Film Studies
                  from the University of Groningen (2024). Her thesis in
                  organizational psychology examined how employees'
                  self-efficacy is affected by the presence of dysfunctional
                  leadership within organizations, deepening her understanding
                  of the conditions under which people feel empowered to
                  contribute.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The combination of psychology, organizational dynamics, and
                  film has shaped Kaylynn's perspective on how people process
                  information, make sense of messages, and pay attention, as
                  well as how narrative, pacing, and visual language influence
                  engagement and emotional response.
                </p>
              </div>
            ),
          },
          {
            title: "Focus & Interests",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kaylynn's interests sit at the intersection of attention,
                  psychology, and the digital economy. Her focus areas include
                  the attention economy and its impact on digital workers, the
                  cognitive dimension of digital experiences within Digital
                  Cognitive Organizations, and the design of content that is
                  both engaging and personally and societally relevant.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  She is particularly interested in how humans shape the digital
                  world, as well as the rapid evolution of AI and its
                  implications for content, work, and learning.
                </p>
              </div>
            ),
          },
          {
            title: "Professional Contributions & Impact",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kaylynn works across multiple DigitalQatalyst initiatives,
                  contributing to content strategy and production workflows that
                  serve as the backbone for consistent, high-quality content
                  delivery. Her work includes:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Designing frameworks, guides, and templates that embed
                    clarity and repeatability into content production.
                  </li>
                  <li className="text-gray-700">
                    Conducting research and contributing to academic-style
                    whitepapers, thought pieces, and blogs on digital
                    transformation.
                  </li>
                  <li className="text-gray-700">
                    Collaborating with content, production, and marketing teams
                    to shape scripts, storyboards, and videos that hold
                    attention.
                  </li>
                  <li className="text-gray-700">
                    Strengthening campaign execution through structured
                    techniques for engagement and narrative clarity.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Her role centers on diagnosing and strengthening foundations:
                  identifying why content or campaigns fail to land, isolating
                  root causes, and codifying solutions into practical frameworks
                  that can be reused across DigitalQatalyst's mission.
                </p>
              </div>
            ),
          },
        ],
        expertise: [
          {
            title: "Content Framework Design",
            description:
              "Designing frameworks, guides, and templates that embed clarity and repeatability into content production.",
          },
          {
            title: "Script & Storyboard Structure",
            description:
              "Structuring scripts and storyboards to improve flow, engagement, and narrative coherence.",
          },
          {
            title: "Content Optimization",
            description:
              "Reviewing and optimizing content for clarity, message alignment, and audience engagement.",
          },
          {
            title: "Performance Analysis",
            description:
              "Analyzing underperforming content or campaigns and addressing root causes through better foundations.",
          },
          {
            title: "Research & Synthesis",
            description:
              "Researching and synthesizing ideas around attention, digital work, and AI to inform content strategies.",
          },
        ],
      };
    } else if (authorSlug === "mark-kerry") {
      return {
        continuedSummary: (
          <p className="text-gray-700 leading-relaxed mb-4">
            Mark brings a unique blend of strategic thinking and practical
            execution to digital transformation initiatives. His work focuses on
            creating alignment between leadership vision, organizational
            culture, and transformation outcomes.
          </p>
        ),
        sections: [
          {
            title: "Leadership Philosophy",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mark believes that successful digital transformation starts
                  with people, not technology. His approach emphasizes building
                  leadership capability, fostering adaptive cultures, and
                  creating environments where teams can thrive during periods of
                  significant change.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  He works with executives and leadership teams to develop
                  transformation strategies that balance ambition with
                  pragmatism, ensuring that digital initiatives deliver
                  measurable business value while building organizational
                  resilience.
                </p>
              </div>
            ),
          },
          {
            title: "Focus Areas",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mark's work spans several critical areas of digital
                  transformation:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Leadership development for digital-first organizations
                  </li>
                  <li className="text-gray-700">
                    Culture transformation and change management
                  </li>
                  <li className="text-gray-700">
                    Strategic account management and client partnerships
                  </li>
                  <li className="text-gray-700">
                    Organizational design for agility and innovation
                  </li>
                </ul>
              </div>
            ),
          },
        ],
        expertise: [
          {
            title: "Leadership Development",
            description:
              "Building leadership capability for digital transformation through coaching, workshops, and strategic guidance.",
          },
          {
            title: "Culture & Change Management",
            description:
              "Designing and implementing culture transformation initiatives that enable organizational agility.",
          },
          {
            title: "Strategic Account Management",
            description:
              "Managing complex client relationships and ensuring transformation initiatives deliver business value.",
          },
          {
            title: "Organizational Design",
            description:
              "Creating organizational structures and operating models that support digital-first ways of working.",
          },
        ],
      };
    } else if (authorSlug === "sharavi-chander") {
      return {
        continuedSummary: (
          <p className="text-gray-700 leading-relaxed mb-4">
            Sharavi specializes in designing and implementing scalable digital
            platforms that power modern enterprises. Her expertise spans
            solution architecture, digital business platforms, and the technical
            frameworks that enable organizational transformation.
          </p>
        ),
        sections: [
          {
            title: "Technical Expertise",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sharavi brings deep technical knowledge in cloud architecture,
                  microservices, API design, and platform engineering. She works
                  at the intersection of business strategy and technical
                  implementation, ensuring that architectural decisions support
                  long-term business goals.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Her approach emphasizes building resilient, scalable systems
                  that can evolve with changing business needs while maintaining
                  security, performance, and reliability.
                </p>
              </div>
            ),
          },
          {
            title: "Platform Thinking",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sharavi advocates for platform-based approaches to digital
                  transformation, where reusable components and services
                  accelerate innovation and reduce complexity. Her work
                  includes:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Designing digital business platforms (DBPs) that enable
                    rapid product development
                  </li>
                  <li className="text-gray-700">
                    Implementing API-first architectures for ecosystem
                    integration
                  </li>
                  <li className="text-gray-700">
                    Building data platforms that support AI and analytics
                    initiatives
                  </li>
                  <li className="text-gray-700">
                    Creating technical frameworks for cloud-native applications
                  </li>
                </ul>
              </div>
            ),
          },
        ],
        expertise: [
          {
            title: "Solution Architecture",
            description:
              "Designing end-to-end technical solutions that align with business strategy and enable scalability.",
          },
          {
            title: "Digital Business Platforms",
            description:
              "Building platform ecosystems that accelerate innovation and enable new business models.",
          },
          {
            title: "Cloud Architecture",
            description:
              "Implementing cloud-native architectures using modern patterns and best practices.",
          },
          {
            title: "API & Integration Design",
            description:
              "Creating API strategies and integration architectures that enable ecosystem connectivity.",
          },
          {
            title: "Technical Framework Development",
            description:
              "Developing reusable frameworks and patterns that improve development velocity and quality.",
          },
        ],
      };
    } else if (authorSlug === "salem-wasike") {
      return {
        continuedSummary: (
          <p className="text-gray-700 leading-relaxed mb-4">
            Salem's work focuses on bridging the gap between what customers
            need, what businesses aim to achieve, and how products can deliver
            on both fronts. He brings a customer-centric approach to product
            development, ensuring that strategic decisions are grounded in real
            user insights and business value.
          </p>
        ),
        sections: [
          {
            title: "Product Philosophy",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Salem believes that great products emerge from a deep
                  understanding of customer problems, clear business objectives,
                  and disciplined execution. His approach emphasizes continuous
                  discovery, rapid experimentation, and data-driven
                  decision-making to build products that customers love and
                  businesses can scale.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  He works with product teams to establish clear product
                  visions, prioritize features based on customer value and
                  business impact, and create roadmaps that balance short-term
                  wins with long-term strategic goals.
                </p>
              </div>
            ),
          },
          {
            title: "Focus Areas",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Salem's expertise spans several critical areas of product
                  strategy and customer experience:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Product strategy and roadmap development
                  </li>
                  <li className="text-gray-700">
                    Customer research and user experience design
                  </li>
                  <li className="text-gray-700">
                    Product-market fit validation and optimization
                  </li>
                  <li className="text-gray-700">
                    Cross-functional team collaboration and alignment
                  </li>
                  <li className="text-gray-700">
                    Metrics definition and product analytics
                  </li>
                </ul>
              </div>
            ),
          },
          {
            title: "Approach & Methodology",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Salem employs a structured yet flexible approach to product
                  development that combines:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Continuous customer discovery to uncover unmet needs and
                    validate assumptions
                  </li>
                  <li className="text-gray-700">
                    Lean experimentation to test hypotheses quickly and learn
                    from failures
                  </li>
                  <li className="text-gray-700">
                    Data-driven prioritization frameworks to maximize value
                    delivery
                  </li>
                  <li className="text-gray-700">
                    Collaborative workshops to align stakeholders and build
                    shared understanding
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  His work ensures that product decisions are informed by both
                  qualitative customer insights and quantitative business
                  metrics, creating a balanced approach to product development.
                </p>
              </div>
            ),
          },
        ],
        expertise: [
          {
            title: "Product Strategy",
            description:
              "Developing product visions, strategies, and roadmaps that align customer needs with business objectives.",
          },
          {
            title: "Customer Research & Insights",
            description:
              "Conducting user research, interviews, and usability testing to uncover customer needs and pain points.",
          },
          {
            title: "Product-Market Fit",
            description:
              "Validating product concepts and optimizing offerings to achieve strong product-market fit.",
          },
          {
            title: "User Experience Design",
            description:
              "Designing intuitive, customer-centric experiences that drive engagement and satisfaction.",
          },
          {
            title: "Product Analytics",
            description:
              "Defining success metrics, analyzing product data, and using insights to drive continuous improvement.",
          },
          {
            title: "Stakeholder Management",
            description:
              "Aligning cross-functional teams and managing stakeholder expectations throughout the product lifecycle.",
          },
        ],
      };
    } else {
      // Dr. Stéphane Niango content (existing)
      return {
        continuedSummary: (
          <p className="text-gray-700 leading-relaxed mb-4">
            He is the Founder and Principal Architect of{" "}
            <strong>DigitalQatalyst (DQ)</strong>, an organization at the
            forefront of accelerating enterprise digital transformations. Under
            his leadership, DQ developed the{" "}
            <strong>Digital Transformation Management Framework (DTMF)</strong>,
            an advanced methodology that enables organizations to align their
            transformation initiatives with best practices, architectural data,
            and a unified portfolio-driven approach.
          </p>
        ),
        sections: [
          {
            title: "Thought Leadership",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dr. Niango's vision is to democratize digital transformation,
                  ensuring organizations of all sizes leverage AI and cognitive
                  technologies to unlock exponential growth, innovation, and
                  operational excellence. His{" "}
                  <strong>Digital Cognitive Organization (DCO) Model</strong> is
                  rapidly being adopted as a next-generation blueprint for
                  enterprises looking to transition from traditional operations
                  to fully AI-powered digital ecosystems.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Through DigitalQatalyst, DTO4T (Digital Twin for
                  Transformation), and TMaaS (Transformation Management as a
                  Service), he continues to push the boundaries of digital
                  transformation, enabling businesses to lead in the global
                  AI-driven economy.
                </p>
              </div>
            ),
          },
          {
            title: "Academic Background & Research Contributions",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dr. Niango holds a{" "}
                  <strong>Ph.D. in Business and Management</strong> from the
                  University of South Australia, where his research focused on:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Strategy, Capability, and Enterprise Modelling in Emerging
                    Economies
                  </li>
                  <li className="text-gray-700">
                    The Role of Strategic Planning in the UAE's Fast-Growing
                    Economy
                  </li>
                  <li className="text-gray-700">
                    Enterprise Modelling for Organizational Alignment and
                    Capability Development
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  His doctoral thesis (2014) provided a ground-breaking analysis
                  of how strategic planning, capability management, and
                  enterprise modelling drive organizational performance.
                </p>
              </div>
            ),
          },
          {
            title: "Notable Industry Contributions & Leadership",
            content: (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dr. Niango has advised and collaborated with leading
                  multinational organizations, government entities, and
                  technology firms, assisting them in:
                </p>
                <ul className="space-y-2 mb-4 list-disc pl-6">
                  <li className="text-gray-700">
                    Developing AI-powered digital strategies for large-scale
                    organizational transformation.
                  </li>
                  <li className="text-gray-700">
                    Implementing AI-driven organizational designs to create
                    smart, adaptive, and self-optimizing enterprises.
                  </li>
                  <li className="text-gray-700">
                    Architecting digital twins and next-generation business
                    operating models.
                  </li>
                  <li className="text-gray-700">
                    Bridging the gap between enterprise architecture and
                    business strategy using real-time data-driven decision
                    frameworks.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  As a thought leader in digital transformation, he has spoken
                  at global conferences and contributed to academic and industry
                  research on the future of work, AI in enterprise strategy, and
                  digital organizational evolution.
                </p>
              </div>
            ),
          },
        ],
        expertise: [
          {
            title: "Digital Cognitive Organizations (DCOs)",
            description:
              "Establishing best practices for the transition from traditional to fully AI-powered digital enterprises.",
          },
          {
            title: "Strategic Planning & Capability Development",
            description:
              "Enabling organizations to adapt, compete, and thrive in dynamic economic landscapes.",
          },
          {
            title: "Enterprise Modelling & Digital Architecture",
            description:
              "Designing highly scalable and automated business ecosystems using AI, data analytics, and cognitive tech.",
          },
          {
            title: "Transformation Management as a Service (TMaaS)",
            description:
              "A structured approach to accelerating transformation initiatives through AI-powered blueprints.",
          },
          {
            title: "AI & Data-Driven Decision Making",
            description:
              "Developing next-generation AI assistants to guide business leaders in strategic decision-making.",
          },
        ],
      };
    }
  };

  const expandedContent = getExpandedContent();

  // Get author's articles - from real data
  const authorArticles = blogs.slice(0, 3).map((blog) => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    heroImage: blog.heroImage,
    publishDate: new Date(blog.publishDate).toLocaleDateString(),
    readTime: `${blog.readTime} min read`,
  }));
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Simple Hero Section - Deloitte Style */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-5xl mx-auto">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="font-medium">Back</span>
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>

                {/* Header Info */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {author.name}
                  </h1>
                  <p className="text-xl text-gray-900 font-medium mb-4">
                    {author.title}
                  </p>

                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin size={18} />
                    <span>{author.location}</span>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://${author.linkedIn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:border-brand-navy hover:text-brand-navy transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a
                      href="mailto:contact@digitalqatalyst.com"
                      className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:border-brand-navy hover:text-brand-navy transition-colors"
                      aria-label="Email"
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - White Background */}
        <div className="bg-white">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="max-w-5xl mx-auto">
              {/* Professional Summary - Always Visible */}
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Professional Summary
                </h2>
                <div className="prose prose-lg max-w-none">
                  {authorSlug === "kaylynn-oceanne" ? (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Kaylynn Océanne is a Content Engagement Strategist at
                      DigitalQatalyst, specializing in the design of the
                      underlying systems that make content coherent, engaging,
                      and repeatable at scale. She architects and refines the
                      frameworks, design systems, templates, guides, and
                      production workflows that sit across multiple
                      DigitalQatalyst initiatives and serve as the backbone for
                      consistent, high-quality content delivery.
                    </p>
                  ) : authorSlug === "mark-kerry" ? (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Mark Kerry is a DCO Strategy & Accounts Specialist at
                      DigitalQatalyst, focusing on leadership, culture, and
                      strategy in driving meaningful organizational
                      transformation. He works with executives and leadership
                      teams to develop transformation strategies that balance
                      ambition with pragmatism, ensuring digital initiatives
                      deliver measurable business value.
                    </p>
                  ) : authorSlug === "sharavi-chander" ? (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Sharavi Chander is a Solution Architecture & Digital
                      Business Platforms Expert at DigitalQatalyst. She
                      specializes in designing and implementing scalable digital
                      platforms that power modern enterprises, with expertise
                      spanning cloud architecture, microservices, API design,
                      and platform engineering.
                    </p>
                  ) : authorSlug === "salem-wasike" ? (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Salem Wasike is a Product Strategy & Customer Experience
                      Specialist at DigitalQatalyst. He explores the critical
                      interplay between customer needs, business goals, and
                      product strategy, helping organizations build products
                      that deliver exceptional value and drive meaningful
                      business outcomes.
                    </p>
                  ) : (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Dr. Stéphane Niango is a globally recognized Digital
                      Transformation Architect, Strategy Consultant, and
                      Organizational Design Expert specializing in the evolution
                      of Digital Cognitive Organizations (DCOs). With a
                      distinguished academic and professional background, he has
                      been a pioneering force in shaping strategic and digital
                      business frameworks that help organizations thrive in the
                      era of Industry 4.0 and AI-driven transformation.
                    </p>
                  )}
                </div>
              </section>

              {/* Read More Button - Orange */}
              {!isExpanded && (
                <div className="mb-8">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-2 text-brand-coral hover:text-brand-coral-dark font-semibold text-lg transition-colors"
                  >
                    <span>Read more</span>
                    <ChevronDown size={24} />
                  </button>
                </div>
              )}

              {/* Expandable Content */}
              {isExpanded && (
                <>
                  {/* Professional Summary - Continued */}
                  <section className="mb-16">
                    <div className="prose prose-lg max-w-none">
                      {expandedContent.continuedSummary}
                    </div>
                  </section>

                  {/* Dynamic Sections */}
                  {expandedContent.sections.map((section, index) => (
                    <section key={index} className="mb-16">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        {section.title}
                      </h2>
                      {section.content}
                    </section>
                  ))}

                  {/* Key Areas of Expertise */}
                  <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Key Areas of Expertise
                    </h2>
                    <div className="prose prose-lg max-w-none mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {authorSlug === "kaylynn-oceanne"
                          ? "Kaylynn is building and applying expertise in content strategy, engagement design, and research analysis. Her key areas include:"
                          : authorSlug === "mark-kerry"
                            ? "Mark has expertise in leadership development, culture transformation, and strategic account management. His work focuses on:"
                            : authorSlug === "sharavi-chander"
                              ? "Sharavi has expertise in solution architecture, digital platforms, and cloud-native technologies. Her work focuses on:"
                              : authorSlug === "salem-wasike"
                                ? "Salem has expertise in product strategy, customer experience, and user-centered design. His work focuses on:"
                                : "Dr. Niango has expertise in digital enterprise transformation, strategic planning, AI-driven business models, and agile organizational architectures. His work focuses on:"}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {expandedContent.expertise.map((expertise, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-brand-teal hover:shadow-md transition-all"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {expertise.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {expertise.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Show Less Button - Orange */}
                  <div className="mb-8">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="flex items-center gap-2 text-brand-coral hover:text-brand-coral-dark font-semibold text-lg transition-colors"
                    >
                      <span>Show less</span>
                      <ChevronUp size={24} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Latest Thinking Section - White Background */}
        <div className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {author.name}'s Latest Thinking
              </h2>

              {authorArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {authorArticles.map((article) => (
                    <a
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={article.heroImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-navy transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{article.publishDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No articles available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Discover Other Contributors Section */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Discover Other Contributors
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherAuthors.map((otherAuthor) => {
                  // Generate slug for the other author
                  const otherAuthorSlug = otherAuthor.name
                    .toLowerCase()
                    .replace(/[éèêë]/g, "e")
                    .replace(/[àáâãä]/g, "a")
                    .replace(/[ìíîï]/g, "i")
                    .replace(/[òóôõö]/g, "o")
                    .replace(/[ùúûü]/g, "u")
                    .replace(/[ñ]/g, "n")
                    .replace(/[ç]/g, "c")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();

                  return (
                    <a
                      key={otherAuthor.id}
                      href={`/authors/${otherAuthorSlug}`}
                      className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-brand-teal transition-all"
                    >
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={
                            otherAuthor.avatar || "/images/default-avatar.png"
                          }
                          alt={otherAuthor.name}
                          className="w-20 h-20 rounded-full object-cover mb-4 group-hover:scale-105 transition-transform"
                        />
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-navy transition-colors">
                          {otherAuthor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {otherAuthor.title}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="max-w-5xl mx-auto">
              <section className="bg-white border border-gray-200 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Connect with {author.name}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  {authorSlug === "kaylynn-oceanne"
                    ? "Interested in learning more about content strategy, engagement design, or collaboration opportunities? Get in touch."
                    : authorSlug === "mark-kerry"
                      ? "Interested in learning more about leadership development, culture transformation, or exploring collaboration opportunities? Get in touch."
                      : authorSlug === "sharavi-chander"
                        ? "Interested in learning more about solution architecture, digital platforms, or exploring collaboration opportunities? Get in touch."
                        : authorSlug === "salem-wasike"
                          ? "Interested in learning more about product strategy, customer experience, or exploring collaboration opportunities? Get in touch."
                          : "Interested in learning more about Digital Cognitive Organizations or exploring collaboration opportunities? Get in touch."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://${author.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy-light transition-colors inline-flex items-center gap-2"
                  >
                    <Linkedin size={18} />
                    Connect on LinkedIn
                  </a>
                  <a
                    href="mailto:contact@digitalqatalyst.com"
                    className="px-6 py-3 bg-brand-coral hover:bg-brand-coral-dark text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Send Email
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
