import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import ResearchHeroSection from '../components/research/ResearchHeroSection';
import ResearchTableOfContents from '../components/research/ResearchTableOfContents';
import ResearchReportContent from '../components/research/ResearchReportContent';
import { blogService } from '../admin-ui/utils/supabase';
import { Loader2 } from 'lucide-react';

const ResearchReportDetailPage: React.FC = () => {
    // The param is named 'slug' in AppRouter, but it could be a UUID
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [researchData, setResearchData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            if (!slug) return;
            setLoading(true);
            setError(null);

            try {
                let data;

                // Try fetching by slug first
                try {
                    data = await blogService.getBlogBySlug(slug);
                } catch (e) {
                    // If slug fails, it might be a UUID. Try fetching by ID.
                    try {
                        data = await blogService.getBlogById(slug);
                    } catch (idErr) {
                        throw e; // Throw original error if both fail
                    }
                }

                if (!data) {
                    throw new Error("Report not found");
                }

                // Check if it's actually a research report or generic report
                const type = (data.type || '').toLowerCase();
                const isResearch = type.includes('research') || type.includes('report') || data.category?.toLowerCase().includes('report');

                if (!isResearch) {
                    // If it's not a research report, redirect to standard blog page
                    navigate(`/blog/${slug}`);
                    return;
                }

                setReport(data);

                // Parse the JSON content
                try {
                    const parsed = JSON.parse(data.content);
                    setResearchData(parsed);
                } catch (e) {
                    console.error("Failed to parse research data JSON:", e);
                    // Fallback if content is not JSON (regular blog content)
                    setResearchData({
                        abstract: data.excerpt,
                        introduction: data.content
                    });
                }
            } catch (err: any) {
                console.error("Error fetching report:", err);
                setError(err.message || "Failed to load report");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <h2 className="text-3xl font-bold mb-4 text-foreground">Report Not Found</h2>
                    <p className="text-muted-foreground mb-8">
                        We couldn't find the research report you're looking for. It may have been moved or deleted.
                    </p>
                    <button
                        onClick={() => navigate('/blog')}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                        Return to Insights Hub
                    </button>
                </div>
            </div>
        );
    }

    // Determine available sections for TOC
    const activeSections = researchData ? Object.keys(researchData).filter(key =>
        researchData[key] &&
        typeof researchData[key] === 'string' &&
        researchData[key].trim().length > 0 &&
        !['authors', 'journalName', 'pages', 'citations', 'views', 'publicationDate'].includes(key)
    ) : [];

    // Mapping keys to TOC IDs if they differ
    const idMapping: Record<string, string> = {
        'literatureReview': 'literature-review'
    };
    const finalActiveSections = activeSections.map(key => idMapping[key] || key.toLowerCase());

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background text-foreground">
                {/* Dynamic Hero Section */}
                <ResearchHeroSection
                    title={report.title}
                    description={report.excerpt}
                    authors={researchData?.authors || [report.author?.name].filter(Boolean)}
                    date={report.publishDate ? new Date(report.publishDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently Published'}
                    journalName={researchData?.journalName}
                    pages={parseInt(researchData?.pages) || 0}
                    readTime={report.readTime}
                    citations={parseInt(researchData?.citations) || 0}
                    views={parseInt(researchData?.views) || 0}
                    heroImage={report.heroImage}
                />

                {/* Main Content */}
                <main className="px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
                            {/* Sidebar - Table of Contents */}
                            <aside className="hidden lg:block">
                                <ResearchTableOfContents activeSections={finalActiveSections} />
                            </aside>

                            {/* Report Content */}
                            <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                                <ResearchReportContent
                                    abstract={researchData?.abstract}
                                    keywords={researchData?.keywords}
                                    introduction={researchData?.introduction}
                                    literatureReview={researchData?.literatureReview}
                                    methodology={researchData?.methodology}
                                    results={researchData?.results}
                                    discussion={researchData?.discussion}
                                    conclusion={researchData?.conclusion}
                                    references={researchData?.references}
                                    appendices={researchData?.appendices}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default ResearchReportDetailPage;
