import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Trash2,
  Eye,
  Upload,
  Plus,
  Trash,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Newspaper,
  FileSearch,
  Book,
  Briefcase,
  Mic,
  X,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Lightbulb,
  BarChart3,
  Zap,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import {
  blogService,
  Author,
  categoryService,
  Category,
  Blog,
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
export const BlogDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Partial<Blog>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [availableDomains, setAvailableDomains] = useState<
    (typeof DIGITAL_DOMAINS_BY_STREAM)[keyof typeof DIGITAL_DOMAINS_BY_STREAM]
  >([]);

  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

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

  // Expert Interview specific state
  const [interviewData, setInterviewData] = useState({
    introduction: "",
    insights: [""],
    sections: [{ question: "", answer: "" }],
    conclusion: "",
    location: "",
    interviewDate: "",
  });
  // Research Report specific state
  const [researchData, setResearchData] = useState({
    authors: [""],
    publicationDate: "",
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
    showColor: "#f97316",
    thumbnailUrl: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [blogData, catsData] = await Promise.all([
          blogService.getBlogById(id),
          categoryService.getCategories(),
        ]);
        setFormData(blogData);
        setCategories(catsData);
        setHeroPreview(blogData.heroImage || "");

        if (blogData.type === "expert-interview") {
          try {
            const parsed =
              typeof blogData.content === "string" &&
              blogData.content.startsWith("{")
                ? JSON.parse(blogData.content)
                : { introduction: blogData.content || "" };

            setInterviewData({
              introduction: parsed.introduction || "",
              insights:
                parsed.insights && parsed.insights.length > 0
                  ? parsed.insights
                  : [""],
              sections:
                parsed.sections && parsed.sections.length > 0
                  ? parsed.sections
                  : [{ question: "", answer: "" }],
              conclusion: parsed.conclusion || "",
              location: parsed.location || blogData.location || "",
              interviewDate:
                parsed.interviewDate ||
                (blogData.interviewDate
                  ? blogData.interviewDate.split("T")[0]
                  : ""),
            });
          } catch (e) {
            console.error("Failed to parse interview JSON", e);
          }
        } else if (blogData.type === "research" || blogData.type === "report") {
          try {
            const parsed =
              typeof blogData.content === "string" &&
              blogData.content.startsWith("{")
                ? JSON.parse(blogData.content)
                : {
                    abstract: blogData.excerpt,
                    introduction: blogData.content,
                  };

            setResearchData({
              authors:
                parsed.authors && parsed.authors.length > 0
                  ? parsed.authors
                  : [""],
              publicationDate:
                parsed.publicationDate ||
                (blogData.publishDate
                  ? blogData.publishDate.split("T")[0]
                  : ""),
              journalName: parsed.journalName || "",
              pages: parsed.pages || 0,
              citations: parsed.citations || 0,
              views: parsed.views || 0,
              abstract: parsed.abstract || blogData.excerpt || "",
              keywords:
                parsed.keywords ||
                (blogData.tags ? blogData.tags.join(", ") : ""),
              introduction: parsed.introduction || blogData.content || "",
              literatureReview: parsed.literatureReview || "",
              methodology: parsed.methodology || "",
              results: parsed.results || "",
              discussion: parsed.discussion || "",
              conclusion: parsed.conclusion || "",
              references: parsed.references || "",
              appendices: parsed.appendices || "",
            });
          } catch (e) {
            console.error("Failed to parse research JSON", e);
          }
        } else if (blogData.type === "podcast") {
          try {
            const parsed =
              typeof blogData.content === "string" &&
              blogData.content.startsWith("{")
                ? JSON.parse(blogData.content)
                : {};

            let episodes = parsed.episodes || [];
            if (
              episodes.length === 0 &&
              (parsed.audioUrl || parsed.showNotes || blogData.title)
            ) {
              episodes = [
                {
                  title: blogData.title || "",
                  episodeNumber: parsed.episodeNumber || 1,
                  duration: parsed.duration || "",
                  showNotes: parsed.showNotes || blogData.content || "",
                  audioUrl: parsed.audioUrl || "",
                  thumbnailUrl: parsed.thumbnailUrl || blogData.heroImage || "",
                  thumbnailPreview:
                    parsed.thumbnailUrl || blogData.heroImage || "",
                },
              ];
            }

            setPodcastData({
              showTitle: parsed.showTitle || "",
              episodes: episodes.map((ep: any) => ({
                ...ep,
                audioFile: null,
                thumbnailFile: null,
                thumbnailPreview: ep.thumbnailUrl || "",
              })),
              topicsCovered:
                parsed.topicsCovered && parsed.topicsCovered.length > 0
                  ? parsed.topicsCovered
                  : [""],
              spotifyUrl: parsed.spotifyUrl || "",
              downloadUrl: parsed.downloadUrl || "",
              isNew: parsed.isNew || false,
              showDescription: parsed.showDescription || "",
              showColor: parsed.showColor || "#f97316",
              thumbnailUrl: parsed.thumbnailUrl || "",
            });
            setThumbnailPreview(parsed.thumbnailUrl || "");
          } catch (e) {
            console.error("Failed to parse podcast JSON", e);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
        setToast({ message: "Failed to load blog post", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  useEffect(() => {
    if (formData.digital_stream) {
      const domains = getDomainsForStream(formData.digital_stream);
      setAvailableDomains(domains);
    } else {
      setAvailableDomains([]);
      if (formData.digital_domain) {
        setFormData((prev) => ({ ...prev, digital_domain: "" }));
      }
    }
  }, [formData.digital_stream, formData.digital_domain]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as any;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
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

  const handleInsightChange = (index: number, value: string) => {
    const newInsights = [...interviewData.insights];
    newInsights[index] = value;
    setInterviewData({ ...interviewData, insights: newInsights });
  };

  const removeInsight = (index: number) => {
    setInterviewData({
      ...interviewData,
      insights: interviewData.insights.filter((_, i) => i !== index),
    });
  };

  const handleSectionChange = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newSections = [...interviewData.sections];
    newSections[index][field] = value;
    setInterviewData({ ...interviewData, sections: newSections });
  };

  const addSection = () => {
    setInterviewData({
      ...interviewData,
      sections: [...interviewData.sections, { question: "", answer: "" }],
    });
  };

  const removeSection = (index: number) => {
    setInterviewData({
      ...interviewData,
      sections: interviewData.sections.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      let heroImageUrl = formData.heroImage || "";
      if (heroFile) {
        heroImageUrl = await blogService.uploadHeroImage(heroFile);
      }

      const selectedCategory = categories.find(
        (c) => c.id === formData.categoryId,
      );
      const isInterview = formData.type === "expert-interview";
      const isResearch =
        formData.type === "research" || formData.type === "report";
      const isPodcast = formData.type === "podcast";

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
      } else if (formData.type === "prediction-analysis") {
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

      await blogService.updateBlog(id, {
        ...formData,
        excerpt: finalExcerpt,
        heroImage: heroImageUrl,
        type: formData.type || "blog",
        content: finalContent,
        location: isInterview ? interviewData.location : formData.location,
        interviewDate: isInterview
          ? interviewData.interviewDate
          : formData.interviewDate,
        categoryName: selectedCategory?.name || formData.categoryName,
        tags:
          typeof formData.tags === "string"
            ? (formData.tags as string).split(",").map((s) => s.trim())
            : formData.tags,
      });

      setToast({
        message: `${(formData.type || "blog").charAt(0).toUpperCase() + (formData.type || "blog").slice(1)} updated successfully!`,
        type: "success",
      });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await blogService.deleteBlog(id);
      navigate("/admin-ui/media");
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Editing Post">
        <div className="flex flex-col justify-center items-center h-96 text-gray-400">
          <Loader className="animate-spin mb-4" size={32} />
          <p className="text-sm">Loading post details...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Refining ${formData.type || "Contribution"}`}>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin-ui/media")}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-all"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to library
          </button>

          <div className="flex items-center gap-3">
            <a
              href={
                formData.type === "expert-interview"
                  ? `/expert-interviews/${formData.slug}`
                  : formData.type === "article"
                    ? `/dtmi/article/${formData.slug}`
                    : formData.type === "podcast"
                      ? `/podcast/${formData.slug}`
                      : `/blog/${formData.slug}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
            >
              <Eye size={16} /> Preview live
            </a>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-all"
            >
              Delete
            </button>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

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
                className="w-full text-4xl font-black border-none focus:ring-0 placeholder-gray-200 p-0"
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

            {formData.type === "expert-interview" ? (
              <div className="space-y-10">
                {/* Expert Interview Form Fields */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Introduction Narrative
                  </label>
                  <RichTextEditor
                    valueHtml={interviewData.introduction}
                    onChange={(json, html) =>
                      setInterviewData({ ...interviewData, introduction: html })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2">
                    Key Strategic Insights
                  </label>
                  <div className="space-y-3">
                    {interviewData.insights.map((insight, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={insight}
                          onChange={(e) =>
                            handleInsightChange(idx, e.target.value)
                          }
                          placeholder="Enter a key takeaway..."
                          className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-cyan-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeInsight(idx)}
                          className="p-2 text-red-400 hover:text-red-500"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addInsight}
                      className="text-xs font-bold text-cyan-600 flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Add Insight
                    </button>
                  </div>
                </div>

                {/* Structured Dialogue Sections */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      Structured Dialogue
                    </h3>
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
                            onClick={() => removeSection(idx)}
                            className="p-2 text-gray-300 hover:text-red-500"
                          >
                            <Trash size={16} />
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
                              onChange={(e) =>
                                handleSectionChange(
                                  idx,
                                  "question",
                                  e.target.value,
                                )
                              }
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
                              onChange={(json, html) =>
                                handleSectionChange(idx, "answer", html)
                              }
                            />
                          </div>
                        </div>
                        <div className="px-8 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          <span>Q&A Block {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSection}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-cyan-300 hover:text-cyan-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Append New Dialogue Section
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2">
                    Conclusion & Future Outlook
                  </label>
                  <RichTextEditor
                    valueHtml={interviewData.conclusion}
                    onChange={(json, html) =>
                      setInterviewData({ ...interviewData, conclusion: html })
                    }
                  />
                </div>
              </div>
            ) : formData.type === "research" || formData.type === "report" ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Publication Details */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <FileSearch size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Research Metadata
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                        Journal & Publication Details
                      </p>
                    </div>
                  </div>

                  {/* Authors */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
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
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
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
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Abstract */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Abstract
                  </h3>
                  <RichTextEditor
                    valueHtml={researchData.abstract}
                    onChange={(json, html) =>
                      setResearchData({ ...researchData, abstract: html })
                    }
                  />
                </div>

                {/* Keywords */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Tag size={18} className="text-yellow-600" />
                    Keywords
                  </h3>
                  <input
                    type="text"
                    value={researchData.keywords}
                    onChange={(e) =>
                      setResearchData({
                        ...researchData,
                        keywords: e.target.value,
                      })
                    }
                    placeholder="Artificial Intelligence, Healthcare, etc."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>

                {/* Main Research Sections */}
                {[
                  {
                    id: "introduction",
                    label: "Introduction",
                    icon: BookOpen,
                    color: "text-green-600",
                  },
                  {
                    id: "literatureReview",
                    label: "Literature Review",
                    icon: Book,
                    color: "text-purple-600",
                  },
                  {
                    id: "methodology",
                    label: "Methodology",
                    icon: Briefcase,
                    color: "text-orange-600",
                  },
                  {
                    id: "results",
                    label: "Results",
                    icon: FileSearch,
                    color: "text-cyan-600",
                  },
                  {
                    id: "discussion",
                    label: "Discussion",
                    icon: Newspaper,
                    color: "text-primary-600",
                  },
                  {
                    id: "conclusion",
                    label: "Conclusion",
                    icon: CheckCircle2,
                    color: "text-emerald-600",
                  },
                  {
                    id: "references",
                    label: "References",
                    icon: FileText,
                    color: "text-gray-600",
                  },
                  {
                    id: "appendices",
                    label: "Appendices",
                    icon: Plus,
                    color: "text-slate-600",
                  },
                ].map((section) => (
                  <div
                    key={section.id}
                    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4"
                  >
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <section.icon size={18} className={section.color} />
                      {section.label}
                    </h3>
                    <RichTextEditor
                      valueHtml={(researchData as any)[section.id]}
                      onChange={(json, html) =>
                        setResearchData({ ...researchData, [section.id]: html })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : formData.type === "podcast" ? (
              <div className="space-y-10 animate-in fade-in duration-500">
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
                                      Replace/Upload Audio
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
            ) : formData.type === "article" ? (
              <div className="space-y-8 animate-in fade-in duration-500">
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
            ) : (
              <>
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
                    placeholder="Briefly describe what this post is about..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Content Editor
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
              </>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Publish & Meta */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 ${formData.type === "article" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-black hover:bg-gray-800"} text-white rounded-lg font-bold shadow-xl shadow-gray-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400`}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {isSubmitting ? "Saving changes..." : "Save Changes"}
              </button>
              <div className="space-y-6 pt-4 border-t border-gray-50">
                <div
                  className={`flex items-center justify-between p-3 ${formData.type === "article" ? "bg-indigo-50/50 border-indigo-100" : "bg-gray-50/50 border-gray-100"} rounded-lg border`}
                >
                  <label
                    className={`text-xs font-bold ${formData.type === "article" ? "text-indigo-900" : "text-gray-700"} flex items-center gap-2`}
                  >
                    <Star
                      size={14}
                      className={
                        formData.featured
                          ? formData.type === "article"
                            ? "text-indigo-500 fill-indigo-500"
                            : "text-yellow-500 fill-yellow-500"
                          : "text-gray-400"
                      }
                    />
                    Featured {formData.type || "post"}
                  </label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className={`w-4 h-4 ${formData.type === "article" ? "text-indigo-600 focus:ring-indigo-500 accent-indigo-600" : "text-black focus:ring-black accent-black"} rounded`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 ${formData.type === "article" ? "focus:ring-indigo-500" : "focus:ring-black"} outline-none transition-all`}
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
              ) : formData.type === 'article' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
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

                {formData.type === "article" && (
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
                )}

                {formData.type !== "article" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12} /> Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={
                        Array.isArray(formData.tags)
                          ? formData.tags.join(", ")
                          : formData.tags
                      }
                      onChange={handleChange}
                      placeholder="Enter tags separated by commas..."
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>
                )}

                {/* Marketplace Filters */}
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
                      value={formData.content_type || ""}
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
                      value={formData.digital_perspective || ""}
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

                  {/* Digital Stream */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Digital Stream
                    </label>
                    <select
                      name="digital_stream"
                      value={formData.digital_stream || ""}
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

                  {/* Digital Domain (conditional) */}
                  {formData.digital_stream && (
                    <div className="space-y-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        Digital Domain
                      </label>
                      <select
                        name="digital_domain"
                        value={formData.digital_domain || ""}
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
                      value={formData.digital_sector || ""}
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
                      value={formData.format || ""}
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
                      value={formData.popularity || ""}
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
                <ImageIcon size={14} />{" "}
                {formData.type === "article" ? "Hero Media" : "Hero Image"}
              </label>
              <div
                className={`relative aspect-video bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100/50 transition-all group ${formData.type === "article" ? "hover:bg-indigo-50" : ""}`}
                onClick={() => document.getElementById("hero-upload")?.click()}
              >
                {heroPreview ? (
                  <>
                    <img
                      src={heroPreview}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 ${formData.type === "article" ? "bg-indigo-900/40" : "bg-black/40"} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}
                    >
                      <Upload className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-200 mb-2" size={24} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Change Cover
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
                    value={formData.publishDate?.split("T")[0]}
                    onChange={handleChange}
                    className={`text-xs border-none focus:ring-0 font-bold bg-transparent p-0 cursor-pointer ${formData.type === "article" ? "text-indigo-600" : ""}`}
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
                      className={`w-10 text-xs border-none focus:ring-0 font-bold bg-transparent p-0 text-right ${formData.type === "article" ? "text-indigo-600" : ""}`}
                    />
                    <span className="text-[10px] text-gray-400 ml-1 font-bold underline">
                      MIN
                    </span>
                  </div>
                </div>

                {formData.type === "expert-interview" && (
                  <>
                    <div className="space-y-2 pt-2 border-t border-gray-50">
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
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Interview Date
                      </label>
                      <input
                        type="date"
                        value={interviewData.interviewDate}
                        onChange={(e) =>
                          setInterviewData({
                            ...interviewData,
                            interviewDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Confirm Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-bold text-black italic">
            "{formData.title}"
          </span>
          ? This action is permanent and cannot be undone. All associated data
          and images will be removed.
        </p>
      </Modal>
    </AppLayout>
  );
};

export default BlogDetail;
