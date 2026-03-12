import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Save,
  Image as ImageIcon,
  User as UserIcon,
  Hash,
  Tag,
  Calendar,
  Clock,
  FileText,
  Star,
  Loader,
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Newspaper,
  FileSearch,
  Book,
  Briefcase,
  Plus,
  X,
  Trash2,
  Mic,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Lightbulb,
  BarChart3,
  Zap,
  UserCheck,
  Shield,
  Eye,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import {
  blogService,
  Author,
  categoryService,
  Category,
  Blog,
  mediaService,
} from "../utils/supabase";
import { Toast, ToastType } from "../components/Toast";
import RichTextEditor from "../components/RichTextEditor";
import { AuthorSelector } from "../components/AuthorSelector";
import Modal from "../components/Modal";
import {
  DIGITAL_PERSPECTIVES,
  DIGITAL_STREAMS,
  DIGITAL_DOMAINS_BY_STREAM,
  DIGITAL_SECTORS,
  CONTENT_TYPES,
  FORMATS,
  POPULARITY_TAGS,
  getDomainsForStream,
} from "../utils/filterConfig";

type ContentType =
  | "blog"
  | "article"
  | "research"
  | "whitepaper"
  | "case-study"
  | "expert-interview"
  | "podcast"
  | "prediction-analysis";

export const BlogCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get initial tab from URL or default to 'blog'
  const initialTab =
    (searchParams.get("tab")?.toLowerCase() as ContentType) || "blog";
  const [activeTab, setActiveTab] = useState<ContentType>(initialTab);
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tags: [],
    publishDate: new Date().toISOString().split("T")[0],
    readTime: 0,
    authorId: "",
    featured: false,
    type: "blog",
    // Filter fields
    digital_perspective: "",
    digital_stream: "",
    digital_domain: "",
    digital_sector: "",
    content_type: "",
    format: "",
    popularity: "",
  });

  // Expert Interview specific state
  const [interviewData, setInterviewData] = useState({
    introduction: "",
    insights: [""],
    sections: [{ question: "", answer: "" }],
    conclusion: "",
    location: "",
    interviewDate: new Date().toISOString().split("T")[0],
  });

  // State for conditional domain filtering based on selected stream
  const [availableDomains, setAvailableDomains] = useState<any[]>([]);

  // Update available domains when stream changes
  useEffect(() => {
    if (formData.digital_stream) {
      const domains = getDomainsForStream(formData.digital_stream);
      setAvailableDomains(domains);
      // Reset domain if it's not available in the new stream
      if (!domains.find((d) => d.value === formData.digital_domain)) {
        setFormData((prev) => ({ ...prev, digital_domain: "" }));
      }
    } else {
      setAvailableDomains([]);
    }
  }, [formData.digital_stream]);

  // Helper to format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to get audio duration
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };
    });
  };

  // Research Report specific state
  const [researchData, setResearchData] = useState({
    authors: [""],
    publicationDate: new Date().toISOString().split("T")[0],
    journalName: "",
    pages: 0,
    citations: 0,
    views: 0,
    abstract: "",
    keywords: "",
    introduction: "",
    literatureReview: "",
    methodology: "",
    results: "",
    discussion: "",
    conclusion: "",
    references: "",
    appendices: "",
  });

  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Podcast specific state
  const [podcastData, setPodcastData] = useState({
    showTitle: "",
    episodes: [
      {
        title: "",
        episodeNumber: 1,
        duration: "",
        showNotes: "",
        audioUrl: "",
        audioFile: null as File | null,
        thumbnailUrl: "",
        thumbnailFile: null as File | null,
        thumbnailPreview: "",
      },
    ],
    topicsCovered: [""],
    spotifyUrl: "",
    downloadUrl: "",
    isNew: false,
    showDescription: "",
    showColor: "#f97316", // orange-500
    thumbnailUrl: "",
  });

  // Prediction Analysis specific state
  const [predictionData, setPredictionData] = useState({
    introduction: "",
    visualSummary: {
      title: "",
      subtitle: "",
      stats: [
        { icon: "users", value: "", label: "", trend: "" },
        { icon: "dollar", value: "", label: "", trend: "" },
        { icon: "target", value: "", label: "", trend: "" },
        { icon: "clock", value: "", label: "", trend: "" },
      ],
      keyTakeaway: "",
    },
    executiveSummary: {
      summary: "",
      keyInsights: [""],
    },
    metrics: [
      {
        title: "",
        value: "",
        percentage: 0,
        trend: "up" as "up" | "warning",
        description: "",
      },
    ],
    timeline: [
      {
        year: "",
        title: "",
        description: "",
        milestones: [""],
        adoptionRate: 0,
      },
    ],
    scenarios: [
      {
        id: "optimistic",
        name: "Accelerated Adoption",
        probability: 0,
        description: "",
        timeline: "",
        keyDrivers: [""],
        outcomes: { positive: [""], negative: [""] },
      },
      {
        id: "conservative",
        name: "Measured Progression",
        probability: 0,
        description: "",
        timeline: "",
        keyDrivers: [""],
        outcomes: { positive: [""], negative: [""] },
      },
      {
        id: "disruptive",
        name: "Regulatory Resistance",
        probability: 0,
        description: "",
        timeline: "",
        keyDrivers: [""],
        outcomes: { positive: [""], negative: [""] },
      },
    ],
    signals: [
      {
        title: "",
        category: "Technology",
        strength: "Strong",
        impact: "High Impact",
        description: "",
        keyIndicators: [""],
      },
    ],
    detailedSections: [{ title: "", content: "" }],
  });

  // Whitepaper specific state
  const [whitepaperData, setWhitepaperData] = useState({
    hero: {
      title: "",
      subtitle: "",
      volumeLabel: "",
      heroImage: null as File | null,
      heroImagePreview: "",
    },
    hookText: "",
    foreword: {
      title: "",
      heroImage: null as File | null,
      heroImagePreview: "",
      author: {
        name: "",
        title: "",
        image: null as File | null,
        imagePreview: "",
      },
    },
    executiveSummary: {
      heroImage: null as File | null,
      heroImagePreview: "",
    },
    chapters: [] as Array<{
      title: string;
      content: string;
      heroImage: File | null;
      heroImagePreview: string;
    }>,
    conclusion: {
      heroImage: null as File | null,
      heroImagePreview: "",
    },
    references: {
      heroImage: null as File | null,
      heroImagePreview: "",
      items: [] as Array<{
        title: string;
        authors: string;
        publication: string;
        year: string;
        url: string;
      }>,
    },
    footer: "",
  });

  
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Quick Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      setToast({
        message: "Category name and slug are required",
        type: "error",
      });
      return;
    }

    setIsCreatingCategory(true);
    try {
      const created = await categoryService.createCategory(newCategory);
      await fetchCategories();
      setFormData((prev) => ({ ...prev, categoryId: created.id }));
      setToast({ message: "Category created successfully", type: "success" });
      setIsCategoryModalOpen(false);
      setNewCategory({ name: "", slug: "", description: "" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, type: activeTab }));
  }, [activeTab]);

  const updatePredictionVisualSummary = (field: string, value: any) => {
    setPredictionData((prev) => ({
      ...prev,
      visualSummary: { ...prev.visualSummary, [field]: value },
    }));
  };

  const updatePredictionStat = (index: number, field: string, value: any) => {
    setPredictionData((prev) => {
      const newStats = [...prev.visualSummary.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return {
        ...prev,
        visualSummary: { ...prev.visualSummary, stats: newStats },
      };
    });
  };

  const updatePredictionExecutiveSummary = (field: string, value: any) => {
    setPredictionData((prev) => ({
      ...prev,
      executiveSummary: { ...prev.executiveSummary, [field]: value },
    }));
  };

  const updatePredictionTimelinePhase = (
    index: number,
    field: string,
    value: any,
  ) => {
    setPredictionData((prev) => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      return { ...prev, timeline: newTimeline };
    });
  };

  const updatePredictionMetric = (index: number, field: string, value: any) => {
    setPredictionData((prev) => {
      const newMetrics = [...prev.metrics];
      newMetrics[index] = { ...newMetrics[index], [field]: value };
      return {
        ...prev,
        metrics: newMetrics,
      };
    });
  };

  const updatePredictionScenario = (
    index: number,
    field: string,
    value: any,
  ) => {
    setPredictionData((prev) => {
      const newScenarios = [...prev.scenarios];
      newScenarios[index] = { ...newScenarios[index], [field]: value };
      return { ...prev, scenarios: newScenarios };
    });
  };

  const updatePredictionSignal = (index: number, field: string, value: any) => {
    setPredictionData((prev) => {
      const newSignals = [...prev.signals];
      newSignals[index] = { ...newSignals[index], [field]: value };
      return { ...prev, signals: newSignals };
    });
  };

  const updatePredictionDetailedSection = (
    index: number,
    field: string,
    value: any,
  ) => {
    setPredictionData((prev) => {
      const newSections = [...prev.detailedSections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, detailedSections: newSections };
    });
  };

  const updatePredictionRelatedAnalysis = (
    index: number,
    field: string,
    value: any,
  ) => {
    setPredictionData((prev) => {
      const newRelated = [...prev.relatedAnalyses];
      newRelated[index] = { ...newRelated[index], [field]: value };
      return { ...prev, relatedAnalyses: newRelated };
    });
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, title: value, slug }));
    } else if (name === "readTime") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!formData.title) return "Title is required";
    if (!formData.slug) return "Slug is required";
    if (activeTab === "blog") {
      if (!formData.content) return "Content is required";
      if (!formData.authorId) return "Author is required";
      if (!formData.categoryId) return "Category is required";
    }
    return null;
  };

  const validateInterview = () => {
    if (!formData.title) return "Title is required";
    if (!formData.slug) return "Slug is required";
    if (!formData.authorId) return "Expert is required";
    if (!interviewData.introduction) return "Introduction is required";
    if (interviewData.sections.some((s) => !s.question || !s.answer))
      return "All Q&A sections must be filled";
    return null;
  };

  const validateResearch = () => {
    if (!formData.title) return "Title is required";
    if (!formData.slug) return "Slug is required";
    if (researchData.authors.filter((a) => a.trim()).length === 0)
      return "At least one author is required";
    if (!researchData.abstract) return "Abstract is required";
    if (!researchData.keywords) return "Keywords are required";
    return null;
  };

  const validatePodcast = () => {
    if (!formData.title) return "Podcast title is required";
    if (!formData.slug) return "Slug is required";
    if (!podcastData.showTitle) return "Show title is required";
    if (!formData.authorId) return "Host (Author) is required";
    if (podcastData.episodes.length === 0)
      return "At least one episode is required";
    if (podcastData.episodes.some((e) => !e.title || !e.showNotes))
      return "All episodes must have a title and show notes";
    return null;
  };

  const validatePrediction = () => {
    if (!formData.title) return "Title is required";
    if (!formData.slug) return "Slug is required";
    if (!predictionData.visualSummary.title)
      return "Visual Summary title is required";
    if (!predictionData.visualSummary.subtitle)
      return "Visual Summary subtitle is required";
    if (!predictionData.visualSummary.keyTakeaway)
      return "Visual Summary key takeaway is required";
    if (!predictionData.executiveSummary.summary)
      return "Executive Summary is required";
    if (
      predictionData.visualSummary.stats.some(
        (stat) => !stat.value || !stat.label,
      )
    ) {
      return "All visual summary stats must have a value and label";
    }
    if (
      predictionData.metrics.some((metric) => !metric.title || !metric.value)
    ) {
      return "All prediction metrics must have a title and value";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isInterview = activeTab === "expert-interview";
    const isResearch = activeTab === "research";
    const isPodcast = activeTab === "podcast";
    const isPrediction = activeTab === "prediction-analysis";
    const err = isInterview
      ? validateInterview()
      : isResearch
        ? validateResearch()
        : isPodcast
          ? validatePodcast()
          : isPrediction
            ? validatePrediction()
            : validate();

    if (err) {
      setToast({ message: err, type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      let heroImageUrl = "";
      if (heroFile) {
        heroImageUrl = await blogService.uploadHeroImage(heroFile);
      }

      const selectedCategory = categories.find(
        (c) => c.id === formData.categoryId,
      );

      // Prepare content based on type
      let finalContent = formData.content;
      let finalExcerpt = formData.excerpt;

      if (isInterview) {
        finalContent = JSON.stringify({
          introduction: interviewData.introduction,
          insights: interviewData.insights.filter((i) => i.trim()),
          sections: interviewData.sections,
          conclusion: interviewData.conclusion,
          location: interviewData.location,
          interviewDate: interviewData.interviewDate,
        });
        finalExcerpt =
          interviewData.introduction.slice(0, 160) +
          (interviewData.introduction.length > 160 ? "..." : "");
      } else if (isResearch) {
        finalContent = JSON.stringify({
          authors: researchData.authors.filter((a) => a.trim()),
          publicationDate: researchData.publicationDate,
          journalName: researchData.journalName,
          pages: researchData.pages,
          citations: researchData.citations,
          views: researchData.views,
          abstract: researchData.abstract,
          keywords: researchData.keywords,
          introduction: researchData.introduction,
          literatureReview: researchData.literatureReview,
          methodology: researchData.methodology,
          results: researchData.results,
          discussion: researchData.discussion,
          conclusion: researchData.conclusion,
          references: researchData.references,
          appendices: researchData.appendices,
        });
        finalExcerpt =
          researchData.abstract.slice(0, 200) +
          (researchData.abstract.length > 200 ? "..." : "");
      } else if (isPodcast) {
        const episodes = await Promise.all(
          podcastData.episodes.map(async (ep) => {
            let audioUrl = ep.audioUrl;
            if (ep.audioFile) {
              audioUrl = await blogService.uploadAudioFile(ep.audioFile);
            }
            let epThumbnailUrl = ep.thumbnailUrl;
            if (ep.thumbnailFile) {
              epThumbnailUrl = await blogService.uploadHeroImage(
                ep.thumbnailFile,
              );
            }
            return {
              title: ep.title,
              episodeNumber: ep.episodeNumber,
              duration: ep.duration,
              showNotes: ep.showNotes,
              audioUrl: audioUrl,
              thumbnailUrl: epThumbnailUrl,
            };
          }),
        );

        finalContent = JSON.stringify({
          showTitle: podcastData.showTitle,
          episodes: episodes,
          topicsCovered: podcastData.topicsCovered.filter((t) => t.trim()),
          spotifyUrl: podcastData.spotifyUrl,
          downloadUrl: podcastData.downloadUrl,
          isNew: podcastData.isNew,
          showDescription: podcastData.showDescription,
          showColor: podcastData.showColor,
          thumbnailUrl: podcastData.thumbnailUrl,
        });

        const firstEpNotes =
          episodes[0]?.showNotes ||
          podcastData.showDescription ||
          formData.content ||
          "";
        finalExcerpt = stripHtml(firstEpNotes).slice(0, 160);
        if (stripHtml(firstEpNotes).length > 160) finalExcerpt += "...";
      } else if (isPrediction) {
        finalContent = JSON.stringify({
          header: {
            title: formData.title,
            subtitle: formData.excerpt,
            category: "Prediction Analysis",
            author:
              categories.find((c) => c.id === formData.categoryId)?.name ||
              "DigitalQatalyst",
            publishDate: formData.publishDate,
            readTime: `${formData.readTime} min`,
          },
          introduction: predictionData.introduction,
          visualSummary: predictionData.visualSummary,
          executiveSummary: predictionData.executiveSummary,
          metrics: predictionData.metrics,
          timeline: predictionData.timeline,
          scenarios: predictionData.scenarios,
          signals: predictionData.signals,
          detailedSections: predictionData.detailedSections,
        });
        finalExcerpt = formData.excerpt;
      }

      await mediaService.createMediaItem({
        ...formData,
        excerpt: finalExcerpt,
        heroImage: heroImageUrl,
        categoryName: selectedCategory?.name,
        type: activeTab,
        content: finalContent,
        location: isInterview ? interviewData.location : undefined,
        interviewDate: isInterview ? interviewData.interviewDate : undefined,
        tags:
          typeof formData.tags === "string"
            ? (formData.tags as string).split(",").map((s) => s.trim())
            : formData.tags,
      });

      setToast({
        message: `${activeTab.replace("-", " ").charAt(0).toUpperCase() + activeTab.replace("-", " ").slice(1)} posted successfully!`,
        type: "success",
      });
      setTimeout(() => navigate("/admin-ui/media"), 1500);
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Whitepaper Form Component
  const WhitepaperForm = React.memo(() => {
    const updateWhitepaperData = useCallback(
      (section: string, field: string, value: any) => {
        setWhitepaperData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [field]: value,
          },
        }));
      },
      [],
    );

    const updateNestedWhitepaperData = useCallback(
      (section: string, subsection: string, field: string, value: any) => {
        setWhitepaperData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [subsection]: {
              ...(prev[section as keyof typeof prev] as any)[subsection],
              [field]: value,
            },
          },
        }));
      },
      [],
    );

    const handleImageUpload = useCallback(
      (section: string, field: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (section.includes(".")) {
            const [mainSection, subSection] = section.split(".");
            updateNestedWhitepaperData(mainSection, subSection, field, file);
            updateNestedWhitepaperData(
              mainSection,
              subSection,
              `${field}Preview`,
              reader.result as string,
            );
          } else {
            updateWhitepaperData(section, field, file);
            updateWhitepaperData(
              section,
              `${field}Preview`,
              reader.result as string,
            );
          }
        };
        reader.readAsDataURL(file);
      },
      [],
    );

    const addChapter = useCallback(() => {
      setWhitepaperData((prev) => {
        const chapterNumber = prev.chapters.length + 1;
        return {
          ...prev,
          chapters: [
            ...prev.chapters,
            {
              id: `chapter-${chapterNumber}`,
              title: "",
              heroImage: null,
              heroImagePreview: "",
              content: "",
              subsections: [
                {
                  title: "",
                  content: "",
                  economyGrid: [{ icon: "", title: "", description: "" }],
                  figureCaption: "",
                },
              ],
            },
          ],
        };
      });
    }, []);

    const removeChapter = useCallback((index: number) => {
      setWhitepaperData((prev) => ({
        ...prev,
        chapters: prev.chapters.filter((_, i) => i !== index),
      }));
    }, []);

    const addReference = useCallback(() => {
      setWhitepaperData((prev) => ({
        ...prev,
        references: {
          ...prev.references,
          items: [
            ...prev.references.items,
            {
              text: "",
              url: "",
              authors: "",
              year: "",
              title: "",
              source: "",
            },
          ],
        },
      }));
    }, []);

    const removeReference = useCallback((index: number) => {
      setWhitepaperData((prev) => ({
        ...prev,
        references: {
          ...prev.references,
          items: prev.references.items.filter((_, i) => i !== index),
        },
      }));
    }, []);

    const handleWhitepaperSubmit = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Upload hero images
        const heroImageUrl = whitepaperData.hero.heroImage
          ? await blogService.uploadHeroImage(whitepaperData.hero.heroImage)
          : "";

        const forewordImageUrl = whitepaperData.foreword.heroImage
          ? await blogService.uploadHeroImage(whitepaperData.foreword.heroImage)
          : "";

        const executiveSummaryImageUrl = whitepaperData.executiveSummary
          .heroImage
          ? await blogService.uploadHeroImage(
              whitepaperData.executiveSummary.heroImage,
            )
          : "";

        const authorImageUrl = whitepaperData.foreword.author.image
          ? await blogService.uploadHeroImage(
              whitepaperData.foreword.author.image,
            )
          : "";

        // Upload chapter images
        const chaptersWithUrls = await Promise.all(
          whitepaperData.chapters.map(async (chapter) => {
            const chapterImageUrl = chapter.heroImage
              ? await blogService.uploadHeroImage(chapter.heroImage)
              : "";

            return {
              ...chapter,
              heroImageUrl: chapterImageUrl,
            };
          }),
        );

        const conclusionImageUrl = whitepaperData.conclusion.heroImage
          ? await blogService.uploadHeroImage(
              whitepaperData.conclusion.heroImage,
            )
          : "";

        const referencesImageUrl = whitepaperData.references.heroImage
          ? await blogService.uploadHeroImage(
              whitepaperData.references.heroImage,
            )
          : "";

        const finalContent = JSON.stringify({
          hero: {
            ...whitepaperData.hero,
            heroImageUrl,
          },
          hookText: whitepaperData.hookText,
          foreword: {
            ...whitepaperData.foreword,
            heroImageUrl: forewordImageUrl,
            author: {
              ...whitepaperData.foreword.author,
              imageUrl: authorImageUrl,
            },
          },
          executiveSummary: {
            ...whitepaperData.executiveSummary,
            heroImageUrl: executiveSummaryImageUrl,
          },
          chapters: chaptersWithUrls,
          conclusion: {
            ...whitepaperData.conclusion,
            heroImageUrl: conclusionImageUrl,
          },
          references: {
            ...whitepaperData.references,
            heroImageUrl: referencesImageUrl,
          },
          footer: whitepaperData.footer,
        });

        const blogData = {
          title: whitepaperData.hero.title,
          slug: formData.slug,
          excerpt: whitepaperData.hookText.slice(0, 200) + "...",
          content: finalContent,
          categoryId: formData.categoryId,
          tags: formData.tags,
          publishDate: formData.publishDate,
          readTime: formData.readTime,
          authorId: formData.authorId,
          featured: formData.featured,
          type: "whitepaper",
        };

        const result = await blogService.createBlog(blogData);

        if (result) {
          setToast({
            message: "Whitepaper published successfully!",
            type: "success",
          });
          setTimeout(() => navigate("/admin/media"), 2000);
        }
      } catch (error) {
        console.error("Error publishing whitepaper:", error);
        setToast({ message: "Failed to publish whitepaper", type: "error" });
      } finally {
        setIsSubmitting(false);
      }
    }, []);

    return (
      <form onSubmit={handleWhitepaperSubmit} className="space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Hero Section
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Subtitle
              </label>
              <input
                type="text"
                value={whitepaperData.hero.subtitle}
                onChange={(e) =>
                  handleWhitepaperChange("hero.subtitle", e.target.value)
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="Digital Transformation Management Book | Volume 0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Volume Label
              </label>
              <input
                type="text"
                value={whitepaperData.hero.volumeLabel}
                onChange={(e) =>
                  handleWhitepaperChange("hero.volumeLabel", e.target.value)
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="D1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Main Title
            </label>
            <input
              type="text"
              value={whitepaperData.hero.title}
              onChange={(e) =>
                handleWhitepaperChange("hero.title", e.target.value)
              }
              className="w-full p-4 text-2xl font-bold border border-gray-200 rounded-lg"
              placeholder="Digital Economy 4.0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hero Image
            </label>
            <div className="space-y-3">
              {whitepaperData.hero.heroImagePreview && (
                <img
                  src={whitepaperData.hero.heroImagePreview}
                  alt="Hero preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload("hero", "heroImage", e.target.files[0])
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Hook Text */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-green-600" />
            Hook Text
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Introduction Text
            </label>
            <RichTextEditor
              valueHtml={whitepaperData.hookText}
              onChange={(json, html) =>
                updateWhitepaperData("hookText", "", html)
              }
            />
          </div>
        </div>

        {/* Foreword */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserIcon className="text-purple-600" />
            Foreword
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Section Title
            </label>
            <input
              type="text"
              value={whitepaperData.foreword.title}
              onChange={(e) =>
                handleWhitepaperChange("foreword.title", e.target.value)
              }
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              placeholder="Foreword"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hero Image
            </label>
            <div className="space-y-3">
              {whitepaperData.foreword.heroImagePreview && (
                <img
                  src={whitepaperData.foreword.heroImagePreview}
                  alt="Foreword preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload("foreword", "heroImage", e.target.files[0])
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Author Name
              </label>
              <input
                type="text"
                value={whitepaperData.foreword.author.name}
                onChange={(e) =>
                  handleWhitepaperChange("foreword.author.name", e.target.value)
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="Dr. Stephane Niango"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Author Title
              </label>
              <input
                type="text"
                value={whitepaperData.foreword.author.title}
                onChange={(e) =>
                  handleWhitepaperChange(
                    "foreword.author.title",
                    e.target.value,
                  )
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                placeholder="CEO | Chief Architect at DigitalQatalyst (Bio)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Author Image
              </label>
              <div className="space-y-3">
                {whitepaperData.foreword.author.imagePreview && (
                  <img
                    src={whitepaperData.foreword.author.imagePreview}
                    alt="Author preview"
                    className="w-20 h-20 object-cover rounded-full border border-gray-200"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleImageUpload(
                      "foreword.author",
                      "image",
                      e.target.files[0],
                    )
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Content
            </label>
            <RichTextEditor
              valueHtml={whitepaperData.foreword.content}
              onChange={(json, html) =>
                updateWhitepaperData("foreword", "content", html)
              }
            />
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileSearch className="text-orange-600" />
            Executive Summary
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Section Title
            </label>
            <input
              type="text"
              value={whitepaperData.executiveSummary.title}
              onChange={(e) =>
                handleWhitepaperChange("executiveSummary.title", e.target.value)
              }
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              placeholder="Executive Summary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hero Image
            </label>
            <div className="space-y-3">
              {whitepaperData.executiveSummary.heroImagePreview && (
                <img
                  src={whitepaperData.executiveSummary.heroImagePreview}
                  alt="Executive Summary preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload(
                    "executiveSummary",
                    "heroImage",
                    e.target.files[0],
                  )
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Content
            </label>
            <RichTextEditor
              valueHtml={whitepaperData.executiveSummary.content}
              onChange={(json, html) =>
                updateWhitepaperData("executiveSummary", "content", html)
              }
            />
          </div>
        </div>

        {/* Chapters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Book className="text-indigo-600" />
              Chapters
            </h3>
            <button
              type="button"
              onClick={addChapter}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={16} /> Add Chapter
            </button>
          </div>

          {whitepaperData.chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.id}
              className="border border-gray-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Chapter {chapterIndex + 1}
                </h4>
                {whitepaperData.chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapter(chapterIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) =>
                    handleWhitepaperChange(
                      `chapters.${chapterIndex}.title`,
                      e.target.value,
                    )
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  placeholder="The Evolution of Economic Logics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Hero Image
                </label>
                <div className="space-y-3">
                  {chapter.heroImagePreview && (
                    <img
                      src={chapter.heroImagePreview}
                      alt={`Chapter ${chapterIndex + 1} preview`}
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newChapters = [...whitepaperData.chapters];
                          newChapters[chapterIndex].heroImage =
                            e.target.files![0];
                          newChapters[chapterIndex].heroImagePreview =
                            reader.result as string;
                          setWhitepaperData((prev) => ({
                            ...prev,
                            chapters: newChapters,
                          }));
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Content
                </label>
                <RichTextEditor
                  valueHtml={chapter.content}
                  onChange={(json, html) => {
                    const newChapters = [...whitepaperData.chapters];
                    newChapters[chapterIndex].content = html;
                    setWhitepaperData((prev) => ({
                      ...prev,
                      chapters: newChapters,
                    }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="text-teal-600" />
            Conclusion
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Section Title
            </label>
            <input
              type="text"
              value={whitepaperData.conclusion.title}
              onChange={(e) =>
                handleWhitepaperChange("conclusion.title", e.target.value)
              }
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              placeholder="Conclusion"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hero Image
            </label>
            <div className="space-y-3">
              {whitepaperData.conclusion.heroImagePreview && (
                <img
                  src={whitepaperData.conclusion.heroImagePreview}
                  alt="Conclusion preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload(
                    "conclusion",
                    "heroImage",
                    e.target.files[0],
                  )
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Content
            </label>
            <RichTextEditor
              valueHtml={whitepaperData.conclusion.content}
              onChange={(json, html) =>
                updateWhitepaperData("conclusion", "content", html)
              }
            />
          </div>
        </div>

        {/* References */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag className="text-yellow-600" />
              References
            </h3>
            <button
              type="button"
              onClick={addReference}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 flex items-center gap-2"
            >
              <Plus size={16} /> Add Reference
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Section Title
            </label>
            <input
              type="text"
              value={whitepaperData.references.title}
              onChange={(e) =>
                handleWhitepaperChange("references.title", e.target.value)
              }
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              placeholder="References"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hero Image
            </label>
            <div className="space-y-3">
              {whitepaperData.references.heroImagePreview && (
                <img
                  src={whitepaperData.references.heroImagePreview}
                  alt="References preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload(
                    "references",
                    "heroImage",
                    e.target.files[0],
                  )
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
            </div>
          </div>

          {whitepaperData.references.items.map((reference, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Reference {index + 1}
                </h4>
                {whitepaperData.references.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReference(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Full Text
                  </label>
                  <textarea
                    value={reference.text}
                    onChange={(e) =>
                      handleWhitepaperChange(
                        `references.items.${index}.text`,
                        e.target.value,
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    rows={3}
                    placeholder="Boston Consulting Group. (2020, September 30). Flipping the odds of digital transformation success."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    URL
                  </label>
                  <input
                    type="url"
                    value={reference.url}
                    onChange={(e) =>
                      handleWhitepaperChange(
                        `references.items.${index}.url`,
                        e.target.value,
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="https://www.bcg.com/publications/2020/increasing-odds-of-success-in-digital-transformation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Authors
                  </label>
                  <input
                    type="text"
                    value={reference.authors}
                    onChange={(e) =>
                      handleWhitepaperChange(
                        `references.items.${index}.authors`,
                        e.target.value,
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="Boston Consulting Group"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Year
                  </label>
                  <input
                    type="text"
                    value={reference.year}
                    onChange={(e) =>
                      handleWhitepaperChange(
                        `references.items.${index}.year`,
                        e.target.value,
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="2020"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Title
                  </label>
                  <input
                    type="text"
                    value={reference.title}
                    onChange={(e) =>
                      handleWhitepaperChange(
                        `references.items.${index}.title`,
                        e.target.value,
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="Flipping the odds of digital transformation success"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Source
                  </label>
                  <input
                    type="text"
                    value={reference.source}
                    onChange={(e) =>
                      handleWhitepaperChange(
                        `references.items.${index}.source`,
                        e.target.value,
                      )
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="BCG"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-gray-600" />
            Footer
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Copyright Text
            </label>
            <input
              type="text"
              value={whitepaperData.footer.copyright}
              onChange={(e) =>
                handleWhitepaperChange("footer.copyright", e.target.value)
              }
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              placeholder="© 2025 DigitalQatalyst. All rights reserved."
            />
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 shadow-xl shadow-gray-100 transition-all flex items-center gap-2 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting ? "Publishing Whitepaper..." : "Publish Whitepaper"}
          </button>
        </div>
      </form>
    );
  });

  const tabs = [
    { id: "blog" as ContentType, label: "Blog Post", icon: BookOpen },
    { id: "article" as ContentType, label: "Article", icon: Newspaper },
    {
      id: "research" as ContentType,
      label: "Research Report",
      icon: FileSearch,
    },
    { id: "whitepaper" as ContentType, label: "Whitepaper", icon: Book },
    { id: "case-study" as ContentType, label: "Case Study", icon: Briefcase },
    {
      id: "expert-interview" as ContentType,
      label: "Expert Interview",
      icon: UserIcon,
    },
    { id: "podcast" as ContentType, label: "Podcast", icon: Mic },
    {
      id: "prediction-analysis" as ContentType,
      label: "Prediction Analysis",
      icon: TrendingUp,
    },
  ];

  return (
    <AppLayout title="Create Media">
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-all"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to library
          </button>

          <div className="inline-flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {activeTab === "blog" || activeTab === "case-study" ? (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Post title"
                  className="w-full text-4xl font-black border-none focus:ring-0 placeholder-gray-200 p-0 bg-transparent"
                  autoFocus
                />
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50/50 p-2 rounded border border-gray-100 w-fit">
                  <Hash size={12} />
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="bg-transparent border-none focus:ring-0 p-0 text-gray-500 w-full min-w-[200px]"
                    placeholder="url-slug"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} /> Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm transition-all focus:ring-1 focus:ring-black outline-none leading-relaxed"
                  placeholder="Summarize your story in one or two sentences..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Editor
                </label>
                <div className="min-h-[600px] border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all focus-within:ring-1 focus-within:ring-black">
                  <RichTextEditor
                    valueHtml={formData.content || ""}
                    onChange={(json, html) =>
                      setFormData((prev) => ({ ...prev, content: html }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="lg:col-span-4 space-y-8">
              {/* Publish & Meta */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 shadow-xl shadow-gray-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </button>

                <div className="space-y-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <Star
                        size={14}
                        className={
                          formData.featured
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400"
                        }
                      />
                      Feature this post
                    </label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 text-black rounded focus:ring-black accent-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[10px] font-black text-black hover:underline uppercase tracking-widest flex items-center gap-1"
                      >
                        <Plus size={10} /> Quick Add
                      </button>
                    </div>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Author
                    </label>
                    <AuthorSelector
                      selectedAuthorId={formData.authorId}
                      onAuthorSelect={(a) =>
                        setFormData((prev) => ({ ...prev, authorId: a.id }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12} /> Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="Enter tags separated by commas..."
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  {/* Filter Fields Section */}
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Marketplace Filters
                    </h4>

                    {/* Content Type */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Content Type
                      </label>
                      <select
                        name="content_type"
                        value={formData.content_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      >
                        <option value="">Select Type</option>
                        {CONTENT_TYPES.map((ct) => (
                          <option key={ct.id} value={ct.value}>
                            {ct.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Digital Perspective */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Digital Perspective
                      </label>
                      <select
                        name="digital_perspective"
                        value={formData.digital_perspective}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      >
                        <option value="">Select Perspective</option>
                        {DIGITAL_PERSPECTIVES.map((dp) => (
                          <option key={dp.id} value={dp.value}>
                            {dp.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Digital Stream (conditional) */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Digital Stream
                      </label>
                      <select
                        name="digital_stream"
                        value={formData.digital_stream}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      >
                        <option value="">Select Stream</option>
                        {DIGITAL_STREAMS.map((ds) => (
                          <option key={ds.id} value={ds.value}>
                            {ds.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Digital Domain (conditional - only shown if stream is selected) */}
                    {formData.digital_stream && (
                      <div className="space-y-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          Digital Domain
                        </label>
                        <select
                          name="digital_domain"
                          value={formData.digital_domain}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        >
                          <option value="">Select Domain</option>
                          {availableDomains.map((domain) => (
                            <option key={domain.id} value={domain.value}>
                              {domain.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Digital Sector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Digital Sector
                      </label>
                      <select
                        name="digital_sector"
                        value={formData.digital_sector}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      >
                        <option value="">Select Sector</option>
                        {DIGITAL_SECTORS.map((ds) => (
                          <option key={ds.id} value={ds.value}>
                            {ds.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Format */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Format
                      </label>
                      <select
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      >
                        <option value="">Select Format</option>
                        {FORMATS.map((fmt) => (
                          <option key={fmt.id} value={fmt.value}>
                            {fmt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Popularity */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Popularity Tag
                      </label>
                      <select
                        name="popularity"
                        value={formData.popularity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      >
                        <option value="">Select Tag</option>
                        {POPULARITY_TAGS.map((pt) => (
                          <option key={pt.id} value={pt.value}>
                            {pt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} /> Hero Image
                </label>
                <div
                  className="relative aspect-video bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100/50 transition-all group"
                  onClick={() =>
                    document.getElementById("hero-upload")?.click()
                  }
                >
                  {heroPreview ? (
                    <>
                      <img
                        src={heroPreview}
                        alt="Hero"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={24} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload
                        className="mx-auto text-gray-200 mb-2"
                        size={24}
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Upload Cover
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="hero-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleHeroChange}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-2 font-medium">
                      <Calendar size={12} /> Date
                    </span>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleChange}
                      className="text-xs border-none focus:ring-0 font-bold bg-transparent p-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-2 font-medium">
                      <Clock size={12} /> Read Time
                    </span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleChange}
                        className="w-10 text-xs border-none focus:ring-0 font-bold bg-transparent p-0 text-right"
                      />
                      <span className="text-[10px] text-gray-400 ml-1 font-bold underline">
                        MIN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : activeTab === "whitepaper" ? (
          <WhitepaperForm key="whitepaper-form" />
        ) : activeTab === "article" ? (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500"
          >
            <div className="lg:col-span-8 space-y-8">
              {/* Title & Slug */}
              <div className="space-y-6 bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100 shadow-sm">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    Article Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. The Evolution of Digital Strategy"
                    className="w-full text-4xl font-black border-none focus:ring-0 placeholder-indigo-100 p-0 bg-transparent"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400/60 bg-white/50 w-fit px-3 py-1.5 rounded-lg border border-indigo-100">
                  <Hash size={12} />
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="bg-transparent border-none focus:ring-0 p-0 text-indigo-500 w-full min-w-[200px]"
                    placeholder="url-slug"
                  />
                </div>
              </div>

              {/* Excerpt/Summary */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} /> Narrative Summary
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-xl text-sm transition-all focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
                  placeholder="Summarize the core theme of this article..."
                />
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Article Content
                  </label>
                  <span className="text-[10px] text-gray-400 font-bold italic">
                    Rich Text Engine Active
                  </span>
                </div>
                <div className="min-h-[600px]">
                  <RichTextEditor
                    valueHtml={formData.content || ""}
                    onChange={(json, html) =>
                      setFormData((prev) => ({ ...prev, content: html }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              {/* Action Sidebar */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 sticky top-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 uppercase tracking-widest text-sm"
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSubmitting ? "Publishing..." : "Publish Article"}
                </button>

                <div className="space-y-6 pt-6 border-t border-gray-50">
                  {/* Category */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest flex items-center gap-1"
                      >
                        <Plus size={10} /> Quick Add
                      </button>
                    </div>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Author
                    </label>
                    <AuthorSelector
                      selectedAuthorId={formData.authorId}
                      onAuthorSelect={(a) =>
                        setFormData((prev) => ({ ...prev, authorId: a.id }))
                      }
                    />
                  </div>

                  {/* Topics/Tags */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12} /> Featured Topics
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g. Digital Economy 4.0, AI Strategy, Business Transformation"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 italic">
                      Separate topics with commas. These will appear in the
                      article's Topics section.
                    </p>
                  </div>

                  {/* Whitepaper URL */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={12} /> Whitepaper URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="whitepaperUrl"
                      value={formData.whitepaperUrl || ""}
                      onChange={handleChange}
                      placeholder="https://example.com/whitepaper"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 italic">
                      If provided, a "Read the Full Whitepaper" CTA will appear
                      in the article.
                    </p>
                  </div>

                  {/* Hero Image */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Hero Media
                    </label>
                    <div
                      className="relative aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-indigo-50 transition-all group"
                      onClick={() =>
                        document.getElementById("hero-upload-article")?.click()
                      }
                    >
                      {heroPreview ? (
                        <>
                          <img
                            src={heroPreview}
                            alt="Hero"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload
                            className="mx-auto text-gray-200 mb-2"
                            size={24}
                          />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Upload Header
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="hero-upload-article"
                        className="hidden"
                        accept="image/*"
                        onChange={handleHeroChange}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Read Time
                      </label>
                      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
                        <input
                          type="number"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleChange}
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold p-0"
                        />
                        <span className="text-[8px] font-black text-gray-400 uppercase">
                          Min
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Date
                      </label>
                      <input
                        type="date"
                        name="publishDate"
                        value={formData.publishDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <label className="text-xs font-bold text-indigo-900 flex items-center gap-2">
                      <Star
                        size={14}
                        className={
                          formData.featured
                            ? "text-indigo-500 fill-indigo-500"
                            : "text-indigo-300"
                        }
                      />
                      Highlight in Hub
                    </label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : activeTab === "research" ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {/* Hero Section Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl border border-blue-100 shadow-lg space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  Research Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. The Impact of Artificial Intelligence on Modern Healthcare Diagnostics"
                  className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 text-gray-900 placeholder-blue-200 p-0"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-blue-400/60 bg-white/50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
                <Hash size={12} />
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="bg-transparent border-none focus:ring-0 p-0 text-blue-600 w-full min-w-[200px]"
                  placeholder="url-slug"
                />
              </div>

              {/* Authors */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 uppercase tracking-widest">
                    Research Authors
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setResearchData({
                        ...researchData,
                        authors: [...researchData.authors, ""],
                      })
                    }
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Author
                  </button>
                </div>
                <div className="space-y-2">
                  {researchData.authors.map((author, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => {
                          const newAuthors = [...researchData.authors];
                          newAuthors[idx] = e.target.value;
                          setResearchData({
                            ...researchData,
                            authors: newAuthors,
                          });
                        }}
                        className="flex-1 px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Dr. Sarah Chen"
                      />
                      {researchData.authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newAuthors = researchData.authors.filter(
                              (_, i) => i !== idx,
                            );
                            setResearchData({
                              ...researchData,
                              authors: newAuthors,
                            });
                          }}
                          className="p-2 text-gray-300 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Publication Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={researchData.publicationDate}
                    onChange={(e) =>
                      setResearchData({
                        ...researchData,
                        publicationDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                    Journal Name
                  </label>
                  <input
                    type="text"
                    value={researchData.journalName}
                    onChange={(e) =>
                      setResearchData({
                        ...researchData,
                        journalName: e.target.value,
                      })
                    }
                    placeholder="Journal of Medical AI Research"
                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={researchData.pages}
                    onChange={(e) =>
                      setResearchData({
                        ...researchData,
                        pages: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="42"
                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                    Citations
                  </label>
                  <input
                    type="number"
                    value={researchData.citations}
                    onChange={(e) =>
                      setResearchData({
                        ...researchData,
                        citations: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="2847"
                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                    Views
                  </label>
                  <input
                    type="number"
                    value={researchData.views}
                    onChange={(e) =>
                      setResearchData({
                        ...researchData,
                        views: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="15200"
                    className="w-full px-4 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Abstract */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <FileText size={18} />
                </div>
                <h3 className="font-bold text-gray-900">Abstract</h3>
                <span className="text-xs text-red-500">*Required</span>
              </div>
              <RichTextEditor
                valueHtml={researchData.abstract}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, abstract: html })
                }
              />
            </div>

            {/* Keywords */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                  <Tag size={18} />
                </div>
                <h3 className="font-bold text-gray-900">Keywords</h3>
                <span className="text-xs text-red-500">*Required</span>
              </div>
              <input
                type="text"
                value={researchData.keywords}
                onChange={(e) =>
                  setResearchData({ ...researchData, keywords: e.target.value })
                }
                placeholder="Artificial Intelligence, Healthcare Diagnostics, Machine Learning, Medical Imaging"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <p className="text-xs text-gray-400 italic">
                Separate keywords with commas
              </p>
            </div>

            {/* Introduction */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={18} className="text-green-600" />
                Introduction
              </h3>
              <RichTextEditor
                valueHtml={researchData.introduction}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, introduction: html })
                }
              />
            </div>

            {/* Literature Review */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Literature Review</h3>
              <RichTextEditor
                valueHtml={researchData.literatureReview}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, literatureReview: html })
                }
              />
            </div>

            {/* Methodology */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Methodology</h3>
              <RichTextEditor
                valueHtml={researchData.methodology}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, methodology: html })
                }
              />
            </div>

            {/* Results */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Results</h3>
              <RichTextEditor
                valueHtml={researchData.results}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, results: html })
                }
              />
            </div>

            {/* Discussion */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Discussion</h3>
              <RichTextEditor
                valueHtml={researchData.discussion}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, discussion: html })
                }
              />
            </div>

            {/* Conclusion */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Conclusion</h3>
              <RichTextEditor
                valueHtml={researchData.conclusion}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, conclusion: html })
                }
              />
            </div>

            {/* References */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">References</h3>
              <RichTextEditor
                valueHtml={researchData.references}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, references: html })
                }
              />
              <p className="text-xs text-gray-400 italic">
                Enter each reference on a new line
              </p>
            </div>

            {/* Appendices */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Appendices</h3>
              <RichTextEditor
                valueHtml={researchData.appendices}
                onChange={(json, html) =>
                  setResearchData({ ...researchData, appendices: html })
                }
              />
            </div>

            {/* Sidebar Actions */}
            <div className="sticky bottom-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xl space-y-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 uppercase tracking-widest text-sm"
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {isSubmitting ? "Publishing..." : "Publish Research Report"}
              </button>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                {/* Hero Image */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> Hero Image
                  </label>
                  <div
                    className="relative aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-blue-50 transition-all group"
                    onClick={() =>
                      document.getElementById("hero-upload-research")?.click()
                    }
                  >
                    {heroPreview ? (
                      <>
                        <img
                          src={heroPreview}
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="text-white" size={24} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <Upload
                          className="mx-auto text-gray-200 mb-2"
                          size={24}
                        />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Upload Header
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="hero-upload-research"
                      className="hidden"
                      accept="image/*"
                      onChange={handleHeroChange}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Read Time
                    </label>
                    <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
                      <input
                        type="number"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold p-0"
                      />
                      <span className="text-[8px] font-black text-gray-400 uppercase">
                        Min
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <label className="text-xs font-bold text-blue-900 flex items-center gap-2">
                    <Star
                      size={14}
                      className={
                        formData.featured
                          ? "text-blue-500 fill-blue-500"
                          : "text-blue-300"
                      }
                    />
                    Feature Report
                  </label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </form>
        ) : activeTab === "expert-interview" ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Header Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-6 bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                      Interview Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. The Future of Cognitive Organizations"
                      className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 text-white placeholder-slate-700 p-0"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/60 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Hash size={12} />
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="bg-transparent border-none focus:ring-0 p-0 text-cyan-300 w-full min-w-[150px]"
                        placeholder="url-slug"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800/30 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Calendar size={12} />
                      <input
                        type="date"
                        value={interviewData.interviewDate}
                        onChange={(e) =>
                          setInterviewData({
                            ...interviewData,
                            interviewDate: e.target.value,
                          })
                        }
                        className="bg-transparent border-none focus:ring-0 p-0 text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Introduction & Highlights */}
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                        <FileText size={18} />
                      </div>
                      <h3 className="font-bold text-gray-900">Introduction</h3>
                    </div>
                    <RichTextEditor
                      valueHtml={interviewData.introduction}
                      onChange={(json, html) =>
                        setInterviewData({
                          ...interviewData,
                          introduction: html,
                        })
                      }
                    />
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                          <Star size={18} />
                        </div>
                        <h3 className="font-bold text-gray-900">
                          Key Insights (💡)
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setInterviewData({
                            ...interviewData,
                            insights: [...interviewData.insights, ""],
                          })
                        }
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Insight
                      </button>
                    </div>
                    <div className="space-y-3">
                      {interviewData.insights.map((insight, idx) => (
                        <div key={idx} className="flex gap-3">
                          <input
                            type="text"
                            value={insight}
                            onChange={(e) => {
                              const newInsights = [...interviewData.insights];
                              newInsights[idx] = e.target.value;
                              setInterviewData({
                                ...interviewData,
                                insights: newInsights,
                              });
                            }}
                            className="flex-1 p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-500"
                            placeholder="A core takeaway from this interview..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newInsights = interviewData.insights.filter(
                                (_, i) => i !== idx,
                              );
                              setInterviewData({
                                ...interviewData,
                                insights: newInsights,
                              });
                            }}
                            className="p-3 text-gray-300 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Structured Dialogue Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      Structured Dialogue
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setInterviewData({
                          ...interviewData,
                          sections: [
                            ...interviewData.sections,
                            { question: "", answer: "" },
                          ],
                        })
                      }
                      className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold hover:bg-cyan-100 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> New Question Block
                    </button>
                  </div>

                  <div className="space-y-10">
                    {interviewData.sections.map((section, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-cyan-200 hover:shadow-xl"
                      >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              const newSections = interviewData.sections.filter(
                                (_, i) => i !== idx,
                              );
                              setInterviewData({
                                ...interviewData,
                                sections: newSections,
                              });
                            }}
                            className="p-2 text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="p-8 space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Question {idx + 1} (Host)
                              </span>
                            </div>
                            <textarea
                              value={section.question}
                              onChange={(e) => {
                                const newSections = [...interviewData.sections];
                                newSections[idx].question = e.target.value;
                                setInterviewData({
                                  ...interviewData,
                                  sections: newSections,
                                });
                              }}
                              placeholder="Type the interviewer's question..."
                              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-slate-900 min-h-[80px]"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest italic">
                                Response (Expert)
                              </span>
                            </div>
                            <RichTextEditor
                              valueHtml={section.answer}
                              onChange={(json, html) => {
                                const newSections = [...interviewData.sections];
                                newSections[idx].answer = html;
                                setInterviewData({
                                  ...interviewData,
                                  sections: newSections,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="px-8 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          <span>Q&A Block {idx + 1}</span>
                          <span className="text-gray-300">#{activeTab}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conclusion */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <CheckCircle2 size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      Key Takeaways (Conclusion)
                    </h3>
                  </div>
                  <RichTextEditor
                    valueHtml={interviewData.conclusion}
                    onChange={(json, html) =>
                      setInterviewData({ ...interviewData, conclusion: html })
                    }
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-8 space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 text-sm uppercase tracking-widest"
                    >
                      {isSubmitting ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      {isSubmitting ? "Submitting..." : "Save Interview"}
                    </button>

                    <div className="space-y-6 pt-4 border-t border-gray-50">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          The Expert (Guest)
                        </label>
                        <AuthorSelector
                          selectedAuthorId={formData.authorId}
                          onAuthorSelect={(a) =>
                            setFormData((prev) => ({ ...prev, authorId: a.id }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Location
                        </label>
                        <input
                          type="text"
                          value={interviewData.location}
                          onChange={(e) =>
                            setInterviewData({
                              ...interviewData,
                              location: e.target.value,
                            })
                          }
                          placeholder="e.g. Abu Dhabi, UAE"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                          <span>Read Time</span>
                          <span className="text-cyan-500">
                            {formData.readTime || 0} MIN
                          </span>
                        </label>
                        <input
                          type="number"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleChange}
                          placeholder="Minutes"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Tags (Search Matrix)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          placeholder="DCO, Economy 4.0, AI..."
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>

                      <div className="pt-4 flex items-center justify-between p-3 bg-cyan-50/50 rounded-lg border border-cyan-100">
                        <label className="text-xs font-bold text-cyan-800 flex items-center gap-2">
                          <Star
                            size={14}
                            className={
                              formData.featured
                                ? "text-cyan-500 fill-cyan-500"
                                : "text-cyan-300"
                            }
                          />
                          Spotlight Hub Feature
                        </label>
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 accent-cyan-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Narrative Visualization
                    </label>
                    <div
                      className="relative aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100/50 transition-all group"
                      onClick={() =>
                        document.getElementById("hero-upload")?.click()
                      }
                    >
                      {heroPreview ? (
                        <>
                          <img
                            src={heroPreview}
                            alt="Hero"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload
                            className="mx-auto text-gray-200 mb-2"
                            size={24}
                          />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Select Header Media
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="hero-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleHeroChange}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 italic text-center">
                      Recommended: 1200x800px or larger
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "podcast" ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* Show Info */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 rounded-3xl border border-orange-100 shadow-lg space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">
                        Podcast Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Digital Transformation Series"
                        className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 text-gray-900 placeholder-orange-200 p-0"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest">
                        Show Title (Internal)
                      </label>
                      <input
                        type="text"
                        value={podcastData.showTitle}
                        onChange={(e) =>
                          setPodcastData({
                            ...podcastData,
                            showTitle: e.target.value,
                          })
                        }
                        placeholder="The Forward Thinkers"
                        className="w-full px-4 py-2 bg-white border border-orange-100 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-orange-400/60 bg-white/50 px-3 py-1.5 rounded-lg border border-orange-100 w-fit">
                    <Hash size={12} />
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="bg-transparent border-none focus:ring-0 p-0 text-orange-600 w-full min-w-[200px]"
                      placeholder="url-slug"
                    />
                  </div>
                </div>

                {/* Episodes List */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                      <Mic size={24} className="text-orange-600" />
                      Episodes
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setPodcastData({
                          ...podcastData,
                          episodes: [
                            ...podcastData.episodes,
                            {
                              title: "",
                              episodeNumber: podcastData.episodes.length + 1,
                              duration: "",
                              showNotes: "",
                              audioUrl: "",
                              audioFile: null,
                              thumbnailUrl: "",
                              thumbnailFile: null,
                              thumbnailPreview: "",
                            },
                          ],
                        })
                      }
                      className="px-6 py-3 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-100"
                    >
                      <Plus size={16} /> Add New Episode
                    </button>
                  </div>

                  <div className="space-y-12">
                    {podcastData.episodes.map((episode, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-orange-200 hover:shadow-xl"
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            type="button"
                            onClick={() => {
                              const newEpisodes = podcastData.episodes.filter(
                                (_, i) => i !== idx,
                              );
                              setPodcastData({
                                ...podcastData,
                                episodes: newEpisodes,
                              });
                            }}
                            className="p-2 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full shadow-sm"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="p-8 space-y-8">
                          {/* Episode Title and Meta */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-1 flex items-center justify-center">
                              <span className="text-3xl font-black text-orange-100">
                                #{idx + 1}
                              </span>
                            </div>
                            <div className="md:col-span-7 space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Episode Title
                              </label>
                              <input
                                type="text"
                                value={episode.title}
                                onChange={(e) => {
                                  const newEpisodes = [...podcastData.episodes];
                                  newEpisodes[idx].title = e.target.value;
                                  setPodcastData({
                                    ...podcastData,
                                    episodes: newEpisodes,
                                  });
                                }}
                                placeholder="Episode title..."
                                className="w-full text-xl font-bold border-none focus:ring-0 p-0 placeholder-gray-200"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Number
                              </label>
                              <input
                                type="number"
                                value={episode.episodeNumber}
                                onChange={(e) => {
                                  const newEpisodes = [...podcastData.episodes];
                                  newEpisodes[idx].episodeNumber =
                                    parseInt(e.target.value) || 0;
                                  setPodcastData({
                                    ...podcastData,
                                    episodes: newEpisodes,
                                  });
                                }}
                                className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-orange-500"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={episode.duration}
                                onChange={(e) => {
                                  const newEpisodes = [...podcastData.episodes];
                                  newEpisodes[idx].duration = e.target.value;
                                  setPodcastData({
                                    ...podcastData,
                                    episodes: newEpisodes,
                                  });
                                }}
                                placeholder="45 min"
                                className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-orange-500"
                              />
                            </div>
                          </div>

                          {/* Media Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                                <Mic size={14} /> Audio File
                              </label>
                              <div
                                onClick={() =>
                                  document
                                    .getElementById(`audio-upload-${idx}`)
                                    ?.click()
                                }
                                className="relative bg-orange-50/50 rounded-2xl border-2 border-dashed border-orange-100 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 transition-all group"
                              >
                                {episode.audioFile ? (
                                  <div className="text-center">
                                    <CheckCircle2
                                      className="mx-auto text-green-500 mb-2"
                                      size={24}
                                    />
                                    <span className="text-xs font-bold text-gray-700 block truncate max-w-[200px]">
                                      {episode.audioFile.name}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <Upload
                                      className="mx-auto text-orange-200 mb-2"
                                      size={24}
                                    />
                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                                      Upload Audio
                                    </span>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  id={`audio-upload-${idx}`}
                                  className="hidden"
                                  accept="audio/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const newEpisodes = [
                                        ...podcastData.episodes,
                                      ];
                                      newEpisodes[idx].audioFile = file;

                                      // Auto-calculate duration
                                      try {
                                        const durationSecs =
                                          await getAudioDuration(file);
                                        newEpisodes[idx].duration =
                                          formatDuration(durationSecs);
                                      } catch (err) {
                                        console.error(
                                          "Error getting audio duration:",
                                          err,
                                        );
                                      }

                                      setPodcastData({
                                        ...podcastData,
                                        episodes: newEpisodes,
                                      });
                                    }
                                  }}
                                />
                              </div>
                              <input
                                type="url"
                                value={episode.audioUrl}
                                onChange={(e) => {
                                  const newEpisodes = [...podcastData.episodes];
                                  newEpisodes[idx].audioUrl = e.target.value;
                                  setPodcastData({
                                    ...podcastData,
                                    episodes: newEpisodes,
                                  });
                                }}
                                placeholder="Or provide external Audio URL..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                              />
                            </div>

                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon size={14} /> Episode Thumbnail
                              </label>
                              <div
                                onClick={() =>
                                  document
                                    .getElementById(`thumbnail-upload-${idx}`)
                                    ?.click()
                                }
                                className="relative aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-orange-50 transition-all group"
                              >
                                {episode.thumbnailPreview ? (
                                  <>
                                    <img
                                      src={episode.thumbnailPreview}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-orange-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Upload
                                        className="text-white"
                                        size={24}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center">
                                    <Upload
                                      className="mx-auto text-gray-200 mb-2"
                                      size={24}
                                    />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      Upload Thumbnail
                                    </span>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  id={`thumbnail-upload-${idx}`}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const newEpisodes = [
                                        ...podcastData.episodes,
                                      ];
                                      newEpisodes[idx].thumbnailFile = file;
                                      newEpisodes[idx].thumbnailPreview =
                                        URL.createObjectURL(file);
                                      setPodcastData({
                                        ...podcastData,
                                        episodes: newEpisodes,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Show Notes */}
                          <div className="space-y-4">
                            <label className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                              <FileText size={14} /> Show Notes / Description
                            </label>
                            <RichTextEditor
                              valueHtml={episode.showNotes}
                              onChange={(json, html) => {
                                const newEpisodes = [...podcastData.episodes];
                                newEpisodes[idx].showNotes = html;
                                setPodcastData({
                                  ...podcastData,
                                  episodes: newEpisodes,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics Covered */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <BookOpen size={18} />
                      </div>
                      <h3 className="font-bold text-gray-900">
                        Key Themes (Across Podcast)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPodcastData({
                          ...podcastData,
                          topicsCovered: [...podcastData.topicsCovered, ""],
                        })
                      }
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Theme
                    </button>
                  </div>
                  <div className="space-y-3">
                    {podcastData.topicsCovered.map((topic, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => {
                            const newTopics = [...podcastData.topicsCovered];
                            newTopics[idx] = e.target.value;
                            setPodcastData({
                              ...podcastData,
                              topicsCovered: newTopics,
                            });
                          }}
                          className="flex-1 p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Key insight or topic discussed..."
                        />
                        {podcastData.topicsCovered.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newTopics =
                                podcastData.topicsCovered.filter(
                                  (_, i) => i !== idx,
                                );
                              setPodcastData({
                                ...podcastData,
                                topicsCovered: newTopics,
                              });
                            }}
                            className="p-3 text-gray-300 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Show Description */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Series Description (Optional)
                  </label>
                  <textarea
                    value={podcastData.showDescription}
                    onChange={(e) =>
                      setPodcastData({
                        ...podcastData,
                        showDescription: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 outline-none leading-relaxed"
                    placeholder="About the podcast series..."
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-8 space-y-8">
                  {/* Publish Button */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 uppercase tracking-widest text-sm"
                    >
                      {isSubmitting ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      {isSubmitting ? "Publishing..." : "Publish Episode"}
                    </button>

                    <div className="space-y-6 pt-4 border-t border-gray-50">
                      {/* New Badge Toggle */}
                      <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                        <label className="text-xs font-bold text-orange-900 flex items-center gap-2">
                          <Star
                            size={14}
                            className={
                              podcastData.isNew
                                ? "text-orange-500 fill-orange-500"
                                : "text-orange-300"
                            }
                          />
                          Mark as NEW
                        </label>
                        <input
                          type="checkbox"
                          checked={podcastData.isNew}
                          onChange={(e) =>
                            setPodcastData({
                              ...podcastData,
                              isNew: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 accent-orange-600"
                        />
                      </div>

                      {/* Featured Toggle */}
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                          <Star
                            size={14}
                            className={
                              formData.featured
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400"
                            }
                          />
                          Feature Episode
                        </label>
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="w-4 h-4 text-black rounded focus:ring-black accent-black"
                        />
                      </div>

                      {/* Host (Author) */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Host
                        </label>
                        <AuthorSelector
                          selectedAuthorId={formData.authorId}
                          onAuthorSelect={(a) =>
                            setFormData((prev) => ({ ...prev, authorId: a.id }))
                          }
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Category
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Tag size={12} /> Tags
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          placeholder="AI, Creative, Technology"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      </div>

                      {/* Publish Date */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          name="publishDate"
                          value={formData.publishDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      </div>

                      {/* Read/Listen Time */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Listen Time (minutes)
                        </label>
                        <input
                          type="number"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleChange}
                          placeholder="45"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Hero Image
                    </label>
                    <div
                      className="relative aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-orange-50 transition-all group"
                      onClick={() =>
                        document.getElementById("hero-upload-podcast")?.click()
                      }
                    >
                      {heroPreview ? (
                        <>
                          <img
                            src={heroPreview}
                            alt="Hero"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-orange-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload
                            className="mx-auto text-gray-200 mb-2"
                            size={24}
                          />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Upload Cover
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="hero-upload-podcast"
                        className="hidden"
                        accept="image/*"
                        onChange={handleHeroChange}
                      />
                    </div>
                  </div>

                  {/* External Links */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      External Links
                    </h3>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Spotify URL
                      </label>
                      <input
                        type="url"
                        value={podcastData.spotifyUrl}
                        onChange={(e) =>
                          setPodcastData({
                            ...podcastData,
                            spotifyUrl: e.target.value,
                          })
                        }
                        placeholder="https://open.spotify.com/episode/..."
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Download URL
                      </label>
                      <input
                        type="url"
                        value={podcastData.downloadUrl}
                        onChange={(e) =>
                          setPodcastData({
                            ...podcastData,
                            downloadUrl: e.target.value,
                          })
                        }
                        placeholder="https://example.com/download"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Show Branding */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Show Branding
                    </h3>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Brand Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={podcastData.showColor}
                          onChange={(e) =>
                            setPodcastData({
                              ...podcastData,
                              showColor: e.target.value,
                            })
                          }
                          className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={podcastData.showColor}
                          onChange={(e) =>
                            setPodcastData({
                              ...podcastData,
                              showColor: e.target.value,
                            })
                          }
                          placeholder="#f97316"
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : activeTab === "prediction-analysis" ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                {/* Header Information */}
                <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                      Prediction Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. The Road to 2030: AI Revolution"
                      className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 text-white placeholder-slate-700 p-0"
                    />
                  </div>

                  {/* Missing Paragraph After Title */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                      Introduction Paragraph
                    </label>
                    <textarea
                      value={predictionData.introduction || ""}
                      onChange={(e) =>
                        setPredictionData((prev) => ({
                          ...prev,
                          introduction: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="A comprehensive forecast exploring the evolution, key drivers, adoption rates, and challenges..."
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-rose-400/60 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Hash size={12} />
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="bg-transparent border-none focus:ring-0 p-0 text-rose-300 w-full min-w-[200px]"
                        placeholder="url-slug"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Executive Summary Highlights */}
                <div className="bg-gradient-to-br from-slate-50 to-rose-50 p-10 rounded-3xl border border-rose-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-rose-500" size={24} />
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                      Visual Dashboard Stats
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Dashboard Title
                      </label>
                      <input
                        type="text"
                        value={predictionData.visualSummary.title}
                        onChange={(e) =>
                          updatePredictionVisualSummary("title", e.target.value)
                        }
                        placeholder="DCO 2030 Executive Dashboard"
                        className="w-full px-4 py-3 bg-white border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Dashboard Subtitle
                      </label>
                      <input
                        type="text"
                        value={predictionData.visualSummary.subtitle}
                        onChange={(e) =>
                          updatePredictionVisualSummary(
                            "subtitle",
                            e.target.value,
                          )
                        }
                        placeholder="Enterprise transformation metrics"
                        className="w-full px-4 py-3 bg-white border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {predictionData.visualSummary.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-5 rounded-2xl border border-rose-100 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                            {stat.icon === "users" ? (
                              <Users size={16} />
                            ) : stat.icon === "dollar" ? (
                              <DollarSign size={16} />
                            ) : stat.icon === "target" ? (
                              <Target size={16} />
                            ) : (
                              <Clock size={16} />
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) =>
                            updatePredictionStat(idx, "value", e.target.value)
                          }
                          placeholder="Value (e.g. 85%)"
                          className="w-full text-lg font-bold border-none focus:ring-0 p-0"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) =>
                            updatePredictionStat(idx, "label", e.target.value)
                          }
                          placeholder="Label (e.g. Adoption)"
                          className="w-full text-xs font-medium text-gray-500 border-none focus:ring-0 p-0"
                        />
                        <input
                          type="text"
                          value={stat.trend}
                          onChange={(e) =>
                            updatePredictionStat(idx, "trend", e.target.value)
                          }
                          placeholder="Trend/Label (By 2030)"
                          className="w-full text-[10px] text-rose-400 font-mono border-none focus:ring-0 p-0"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Main Takeaway
                    </label>
                    <textarea
                      value={predictionData.visualSummary.keyTakeaway}
                      onChange={(e) =>
                        updatePredictionVisualSummary(
                          "keyTakeaway",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full p-4 bg-white border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="The central message for executives..."
                    />
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" size={24} />
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                      Executive Summary
                    </h3>
                  </div>
                  <RichTextEditor
                    valueHtml={predictionData.executiveSummary.summary}
                    onChange={(json, html) =>
                      updatePredictionExecutiveSummary("summary", html)
                    }
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Key Insights List
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updatePredictionExecutiveSummary("keyInsights", [
                            ...predictionData.executiveSummary.keyInsights,
                            "",
                          ])
                        }
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Insight
                      </button>
                    </div>
                    {predictionData.executiveSummary.keyInsights.map(
                      (insight, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={insight}
                            onChange={(e) => {
                              const newInsights = [
                                ...predictionData.executiveSummary.keyInsights,
                              ];
                              newInsights[idx] = e.target.value;
                              updatePredictionExecutiveSummary(
                                "keyInsights",
                                newInsights,
                              );
                            }}
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-rose-500"
                            placeholder="Insight description..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newInsights =
                                predictionData.executiveSummary.keyInsights.filter(
                                  (_, i) => i !== idx,
                                );
                              updatePredictionExecutiveSummary(
                                "keyInsights",
                                newInsights,
                              );
                            }}
                            className="p-2 text-gray-300 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-rose-500" size={24} />
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                        Evolution Timeline
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPredictionData((prev) => ({
                          ...prev,
                          timeline: [
                            ...prev.timeline,
                            {
                              year: "",
                              title: "",
                              description: "",
                              milestones: [""],
                              adoptionRate: 0,
                            },
                          ],
                        }))
                      }
                      className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100 flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Timeline Phase
                    </button>
                  </div>

                  <div className="space-y-8">
                    {predictionData.timeline.map((phase, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 relative"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPredictionData((prev) => ({
                              ...prev,
                              timeline: prev.timeline.filter(
                                (_, i) => i !== idx,
                              ),
                            }))
                          }
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Year Range
                            </label>
                            <input
                              type="text"
                              value={phase.year}
                              onChange={(e) =>
                                updatePredictionTimelinePhase(
                                  idx,
                                  "year",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 2025-2026"
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Phase Title
                            </label>
                            <input
                              type="text"
                              value={phase.title}
                              onChange={(e) =>
                                updatePredictionTimelinePhase(
                                  idx,
                                  "title",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Initial Adoption"
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Description
                          </label>
                          <RichTextEditor
                            valueHtml={phase.description}
                            onChange={(json, html) =>
                              updatePredictionTimelinePhase(
                                idx,
                                "description",
                                html,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Milestones
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const newTimeline = [
                                  ...predictionData.timeline,
                                ];
                                newTimeline[idx].milestones = [
                                  ...newTimeline[idx].milestones,
                                  "",
                                ];
                                setPredictionData({
                                  ...predictionData,
                                  timeline: newTimeline,
                                });
                              }}
                              className="text-[10px] font-bold text-rose-600 hover:underline"
                            >
                              + Add Milestone
                            </button>
                          </div>
                          {phase.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={m}
                                onChange={(e) => {
                                  const newTimeline = [
                                    ...predictionData.timeline,
                                  ];
                                  newTimeline[idx].milestones[mIdx] =
                                    e.target.value;
                                  setPredictionData({
                                    ...predictionData,
                                    timeline: newTimeline,
                                  });
                                }}
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-100 rounded text-xs"
                                placeholder="Milestone..."
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                            Adoption Rate
                            <span className="text-rose-500 font-bold">
                              {phase.adoptionRate}%
                            </span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={phase.adoptionRate}
                            onChange={(e) =>
                              updatePredictionTimelinePhase(
                                idx,
                                "adoptionRate",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="text-rose-500" size={24} />
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                        Prediction Metrics
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPredictionData((prev) => ({
                          ...prev,
                          metrics: [
                            ...prev.metrics,
                            {
                              title: "",
                              value: "",
                              percentage: 0,
                              trend: "up",
                              description: "",
                            },
                          ],
                        }))
                      }
                      className="text-xs font-bold text-rose-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Metric
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {predictionData.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-slate-50 rounded-2xl border border-gray-100 space-y-4 relative group"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPredictionData((prev) => ({
                              ...prev,
                              metrics: prev.metrics.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Metric Title
                          </label>
                          <input
                            type="text"
                            value={metric.title}
                            onChange={(e) =>
                              updatePredictionMetric(
                                idx,
                                "title",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm"
                            placeholder="e.g. Adoption"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Display Value
                            </label>
                            <input
                              type="text"
                              value={metric.value}
                              onChange={(e) =>
                                updatePredictionMetric(
                                  idx,
                                  "value",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm"
                              placeholder="85%"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Percentage (0-100)
                            </label>
                            <input
                              type="number"
                              value={metric.percentage}
                              onChange={(e) =>
                                updatePredictionMetric(
                                  idx,
                                  "percentage",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Description
                          </label>
                          <RichTextEditor
                            valueHtml={metric.description}
                            onChange={(json, html) =>
                              updatePredictionMetric(idx, "description", html)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scenarios */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Zap className="text-rose-500" size={24} />
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                      Scenario Analysis
                    </h3>
                  </div>

                  <div className="space-y-8">
                    {predictionData.scenarios.map((scenario, idx) => (
                      <div
                        key={idx}
                        className={`p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 bg-white ${scenario.id === "optimistic" ? "border-l-4 border-l-teal-500" : scenario.id === "conservative" ? "border-l-4 border-l-gray-500" : "border-l-4 border-l-rose-500"}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-lg text-gray-900 uppercase tracking-widest">
                            {scenario.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase">
                              Probability
                            </span>
                            <input
                              type="number"
                              value={scenario.probability}
                              onChange={(e) =>
                                updatePredictionScenario(
                                  idx,
                                  "probability",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-16 px-3 py-1 bg-gray-50 border border-gray-100 rounded text-sm font-bold text-rose-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Timeline Forecast
                            </label>
                            <input
                              type="text"
                              value={scenario.timeline}
                              onChange={(e) =>
                                updatePredictionScenario(
                                  idx,
                                  "timeline",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Maturity by 2028"
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Description
                            </label>
                            <RichTextEditor
                              valueHtml={scenario.description}
                              onChange={(json, html) =>
                                updatePredictionScenario(
                                  idx,
                                  "description",
                                  html,
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Key Drivers */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Key Drivers
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const newScenarios = [
                                    ...predictionData.scenarios,
                                  ];
                                  newScenarios[idx].keyDrivers = [
                                    ...newScenarios[idx].keyDrivers,
                                    "",
                                  ];
                                  updatePredictionScenario(
                                    idx,
                                    "keyDrivers",
                                    newScenarios[idx].keyDrivers,
                                  );
                                }}
                                className="text-[10px] font-bold text-rose-600"
                              >
                                + Add Driver
                              </button>
                            </div>
                            <div className="space-y-2">
                              {scenario.keyDrivers.map((driver, dIdx) => (
                                <div key={dIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={driver}
                                    onChange={(e) => {
                                      const newDrivers = [
                                        ...scenario.keyDrivers,
                                      ];
                                      newDrivers[dIdx] = e.target.value;
                                      updatePredictionScenario(
                                        idx,
                                        "keyDrivers",
                                        newDrivers,
                                      );
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded text-xs"
                                    placeholder="Driver..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updatePredictionScenario(
                                        idx,
                                        "keyDrivers",
                                        scenario.keyDrivers.filter(
                                          (_, i) => i !== dIdx,
                                        ),
                                      )
                                    }
                                    className="text-gray-300 hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Outcomes */}
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Outcomes
                            </label>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-teal-600">
                                    Positive
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newOutcomes = {
                                        ...scenario.outcomes,
                                        positive: [
                                          ...scenario.outcomes.positive,
                                          "",
                                        ],
                                      };
                                      updatePredictionScenario(
                                        idx,
                                        "outcomes",
                                        newOutcomes,
                                      );
                                    }}
                                    className="text-[10px] text-teal-600"
                                  >
                                    +
                                  </button>
                                </div>
                                {scenario.outcomes.positive.map((o, oIdx) => (
                                  <div key={oIdx} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={o}
                                      onChange={(e) => {
                                        const newPositive = [
                                          ...scenario.outcomes.positive,
                                        ];
                                        newPositive[oIdx] = e.target.value;
                                        updatePredictionScenario(
                                          idx,
                                          "outcomes",
                                          {
                                            ...scenario.outcomes,
                                            positive: newPositive,
                                          },
                                        );
                                      }}
                                      className="flex-1 px-3 py-1.5 bg-teal-50/30 border border-teal-100 rounded text-xs"
                                      placeholder="Positive outcome..."
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updatePredictionScenario(
                                          idx,
                                          "outcomes",
                                          {
                                            ...scenario.outcomes,
                                            positive:
                                              scenario.outcomes.positive.filter(
                                                (_, i) => i !== oIdx,
                                              ),
                                          },
                                        )
                                      }
                                      className="text-gray-300 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-rose-600">
                                    Negative/Risks
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newOutcomes = {
                                        ...scenario.outcomes,
                                        negative: [
                                          ...scenario.outcomes.negative,
                                          "",
                                        ],
                                      };
                                      updatePredictionScenario(
                                        idx,
                                        "outcomes",
                                        newOutcomes,
                                      );
                                    }}
                                    className="text-[10px] text-rose-600"
                                  >
                                    +
                                  </button>
                                </div>
                                {scenario.outcomes.negative.map((o, oIdx) => (
                                  <div key={oIdx} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={o}
                                      onChange={(e) => {
                                        const newNegative = [
                                          ...scenario.outcomes.negative,
                                        ];
                                        newNegative[oIdx] = e.target.value;
                                        updatePredictionScenario(
                                          idx,
                                          "outcomes",
                                          {
                                            ...scenario.outcomes,
                                            negative: newNegative,
                                          },
                                        );
                                      }}
                                      className="flex-1 px-3 py-1.5 bg-rose-50/30 border border-rose-100 rounded text-xs"
                                      placeholder="Risk/Negative..."
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updatePredictionScenario(
                                          idx,
                                          "outcomes",
                                          {
                                            ...scenario.outcomes,
                                            negative:
                                              scenario.outcomes.negative.filter(
                                                (_, i) => i !== oIdx,
                                              ),
                                          },
                                        )
                                      }
                                      className="text-gray-300 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signals */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="text-rose-500" size={24} />
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                        Signals to Watch
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPredictionData((prev) => ({
                          ...prev,
                          signals: [
                            ...prev.signals,
                            {
                              title: "",
                              category: "Technology",
                              strength: "Strong",
                              impact: "High Impact",
                              description: "",
                              keyIndicators: [""],
                            },
                          ],
                        }))
                      }
                      className="text-xs font-bold text-rose-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Signal
                    </button>
                  </div>

                  <div className="space-y-6">
                    {predictionData.signals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="p-8 bg-slate-50 rounded-2xl border border-gray-100 space-y-6 relative group"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPredictionData((prev) => ({
                              ...prev,
                              signals: prev.signals.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Signal Title
                            </label>
                            <input
                              type="text"
                              value={signal.title}
                              onChange={(e) =>
                                updatePredictionSignal(
                                  idx,
                                  "title",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. AI-Human Hybrid Teams"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Category
                            </label>
                            <select
                              value={signal.category}
                              onChange={(e) =>
                                updatePredictionSignal(
                                  idx,
                                  "category",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm"
                            >
                              <option>Technology</option>
                              <option>Social</option>
                              <option>Policy</option>
                              <option>Market</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Strength
                            </label>
                            <select
                              value={signal.strength}
                              onChange={(e) =>
                                updatePredictionSignal(
                                  idx,
                                  "strength",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm"
                            >
                              <option>Strong</option>
                              <option>Moderate</option>
                              <option>Emerging</option>
                              <option>Latent</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Impact
                            </label>
                            <select
                              value={signal.impact}
                              onChange={(e) =>
                                updatePredictionSignal(
                                  idx,
                                  "impact",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm"
                            >
                              <option>High Impact</option>
                              <option>Medium Impact</option>
                              <option>Low Impact</option>
                              <option>Transformational</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Description
                          </label>
                          <RichTextEditor
                            valueHtml={signal.description}
                            onChange={(json, html) =>
                              updatePredictionSignal(idx, "description", html)
                            }
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Key Indicators
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const newSignals = [...predictionData.signals];
                                newSignals[idx].keyIndicators = [
                                  ...newSignals[idx].keyIndicators,
                                  "",
                                ];
                                updatePredictionSignal(
                                  idx,
                                  "keyIndicators",
                                  newSignals[idx].keyIndicators,
                                );
                              }}
                              className="text-[10px] font-bold text-rose-600"
                            >
                              + Add Indicator
                            </button>
                          </div>
                          <div className="space-y-2">
                            {signal.keyIndicators.map((indicator, kIdx) => (
                              <div key={kIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={indicator}
                                  onChange={(e) => {
                                    const newIndicators = [
                                      ...signal.keyIndicators,
                                    ];
                                    newIndicators[kIdx] = e.target.value;
                                    updatePredictionSignal(
                                      idx,
                                      "keyIndicators",
                                      newIndicators,
                                    );
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-white border border-gray-100 rounded text-xs"
                                  placeholder="Indicator..."
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePredictionSignal(
                                      idx,
                                      "keyIndicators",
                                      signal.keyIndicators.filter(
                                        (_, i) => i !== kIdx,
                                      ),
                                    )
                                  }
                                  className="text-gray-300 hover:text-red-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Analysis Content */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-rose-500" size={24} />
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                        Detailed Analysis Sections
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPredictionData((prev) => ({
                          ...prev,
                          detailedSections: [
                            ...prev.detailedSections,
                            { title: "", content: "" },
                          ],
                        }))
                      }
                      className="text-xs font-bold text-rose-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Section
                    </button>
                  </div>
                  <div className="space-y-8">
                    {predictionData.detailedSections.map((section, idx) => (
                      <div
                        key={idx}
                        className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-gray-100 relative group"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPredictionData((prev) => ({
                              ...prev,
                              detailedSections: prev.detailedSections.filter(
                                (_, i) => i !== idx,
                              ),
                            }))
                          }
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              updatePredictionDetailedSection(
                                idx,
                                "title",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                            placeholder="e.g. Implementation Strategies"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Content
                          </label>
                          <RichTextEditor
                            valueHtml={section.content}
                            onChange={(json, html) =>
                              updatePredictionDetailedSection(
                                idx,
                                "content",
                                html,
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-8 space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 uppercase tracking-widest text-sm"
                    >
                      {isSubmitting ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      {isSubmitting ? "Publishing..." : "Publish Prediction"}
                    </button>

                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Author / Expert
                        </label>
                        <AuthorSelector
                          selectedAuthorId={formData.authorId}
                          onAuthorSelect={(a) =>
                            setFormData((prev) => ({ ...prev, authorId: a.id }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Read Time (min)
                        </label>
                        <input
                          type="number"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Published Date
                        </label>
                        <input
                          type="date"
                          name="publishDate"
                          value={formData.publishDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon size={14} /> Hero Background
                        </label>
                        <div
                          className="relative aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-rose-50 group transition-all"
                          onClick={() =>
                            document
                              .getElementById("hero-upload-prediction")
                              ?.click()
                          }
                        >
                          {heroPreview ? (
                            <>
                              <img
                                src={heroPreview}
                                alt="Hero"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="text-white" size={24} />
                              </div>
                            </>
                          ) : (
                            <div className="text-center">
                              <Upload
                                className="mx-auto text-gray-200 mb-2"
                                size={24}
                              />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Select Background
                              </span>
                            </div>
                          )}
                          <input
                            type="file"
                            id="hero-upload-prediction"
                            className="hidden"
                            accept="image/*"
                            onChange={handleHeroChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Category
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                        <label className="text-xs font-bold text-rose-800 flex items-center gap-2">
                          <Star
                            size={14}
                            className={
                              formData.featured
                                ? "text-rose-500 fill-rose-500"
                                : "text-rose-300"
                            }
                          />
                          Spotlight Hub Feature
                        </label>
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 accent-rose-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mx-auto text-gray-200 border border-gray-100">
              {(() => {
                const TabIcon = tabs.find((t) => t.id === activeTab)?.icon;
                return TabIcon ? <TabIcon size={40} /> : null;
              })()}
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab.replace("-", " ")} Creator
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We are currently architecting the specialized schema and engine
                for <strong>{activeTab}</strong> items. Use this placeholder
                form for high-level registration.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    name="title"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="Enter title..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Classification
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeTab.toUpperCase()}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold tracking-widest text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Reference Abstract
                </label>
                <textarea
                  rows={4}
                  value={formData.excerpt}
                  onChange={handleChange}
                  name="excerpt"
                  className="w-full p-4 bg-white border border-gray-200 rounded-lg text-xs transition-all focus:ring-1 focus:ring-black outline-none leading-relaxed"
                  placeholder="Enter a brief abstract..."
                />
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-100 disabled:bg-gray-400"
              >
                {isSubmitting ? "Registering..." : `Register ${activeTab}`}
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => !isCreatingCategory && setIsCategoryModalOpen(false)}
        title="Quick Category"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="text-xs font-bold text-gray-400 hover:text-black"
              disabled={isCreatingCategory}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={isCreatingCategory}
              className="px-6 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-200 transition-all flex items-center gap-2"
            >
              {isCreatingCategory ? (
                <Loader className="animate-spin" size={14} />
              ) : (
                <Plus size={14} />
              )}
              {isCreatingCategory ? "Creating..." : "Create Category"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Name
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => {
                const val = e.target.value;
                const slug = val
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
                setNewCategory((prev) => ({ ...prev, name: val, slug }));
              }}
              className="w-full px-0 py-1 bg-transparent border-b border-gray-100 focus:border-black text-sm font-bold outline-none transition-all placeholder:text-gray-200"
              placeholder="e.g. Technology & Innovation"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Slug
            </label>
            <input
              type="text"
              value={newCategory.slug}
              onChange={(e) =>
                setNewCategory((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-0 py-1 bg-transparent border-b border-gray-100 focus:border-black text-xs font-mono outline-none transition-all placeholder:text-gray-200"
              placeholder="e.g. tech-innovation"
            />
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default BlogCreate;
