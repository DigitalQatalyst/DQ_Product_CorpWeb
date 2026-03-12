import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  HomeIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  Building2,
  Calendar,
  Share2,
  Loader,
} from "lucide-react";
import { getJobPostingById } from "../services/jobPostingService";
import type { JobPosting } from "../services/jobPostingService";

type JobListing = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills?: {
    core: string[];
    behavioral: string[];
  };
  openPositions?: number;
  postedDate: string;
};

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setError("Invalid job ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getJobPostingById(Number(jobId));

      if (result.error || !result.data) {
        setError(result.error || "Job not found");
        setLoading(false);
        setTimeout(() => {
          navigate("/jobs");
        }, 2000);
        return;
      }

      // Transform JobPosting to JobListing format
      const jobData: JobListing = {
        id: result.data.id,
        title: result.data.title,
        department: result.data.department,
        location: result.data.location,
        type: result.data.type,
        level: result.data.level,
        description: result.data.description,
        requirements: result.data.requirements || [],
        responsibilities: result.data.responsibilities || [],
        skills: result.data.skills,
        openPositions: result.data.open_positions,
        postedDate: result.data.posted_date || result.data.created_at,
      };

      setJob(jobData);
      setLoading(false);
    };

    fetchJob();
  }, [jobId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job || error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Job Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The position you're looking for doesn't exist or has been filled.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Back to Job Listings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleApply = () => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at DigitalQatalyst`,
        text: job.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex mb-2" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <a href="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <a href="/careers" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      Careers
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <a href="/jobs" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      Job Listings
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">{job.title}</span>
                  </div>
                </li>
              </ol>
            </nav>
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to Job Listings
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="lg:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-secondary leading-tight">
                    {job.title}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Open
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-base text-gray-600 font-medium">
                    {job.department} • {job.location} • {job.type}
                    {job.openPositions && ` • ${job.openPositions} ${job.openPositions === 1 ? 'Position' : 'Positions'} Available`}
                  </p>
                </div>

                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleApply}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>

              <div className="lg:w-1/3 w-full">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Department</p>
                        <p className="font-medium text-gray-900">{job.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="font-medium text-gray-900">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Clock size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Employment Type</p>
                        <p className="font-medium text-gray-900">{job.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                        <p className="font-medium text-gray-900">{job.level}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Calendar size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Posted Date</p>
                        <p className="font-medium text-gray-900">{new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            {/* Responsibilities Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Responsibilities</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <ul className="space-y-4">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon size={24} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Skills & Competencies Section */}
            {job.skills && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Required Skills & Competencies</h2>
                
                {/* Core Skills */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Core Skills</h3>
                  <ul className="space-y-4">
                    {job.skills.core.map((skill, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-relaxed">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Behavioral & Professional Competencies */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Behavioral & Professional Competencies</h3>
                  <ul className="space-y-4">
                    {job.skills.behavioral.map((skill, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon size={24} className="text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-relaxed">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Requirements Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Qualifications & Experience</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <ul className="space-y-4">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* About DQ Section */}
            <section className="mb-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About DigitalQatalyst</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  DigitalQatalyst (DQ) is a leading digital transformation consultancy dedicated to helping organizations 
                  navigate and thrive in the digital economy. We specialize in guiding businesses through their transformation 
                  journey, from strategy to execution, using our proven 6xD Framework and innovative solutions.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our mission is to empower organizations to become Digital Cognitive Organizations (DCO) by integrating 
                  human intelligence with machine intelligence. We believe in the power of digital workers—the synergy 
                  between people and AI—to drive innovation and create lasting impact.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Join our team of transformation experts, technologists, and innovators who are shaping the future of 
                  digital business. At DQ, you'll work on cutting-edge projects, collaborate with industry leaders, and 
                  contribute to meaningful change across diverse sectors.
                </p>
              </div>
            </section>

            {/* Why Join DQ Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Join DigitalQatalyst?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation Culture</h3>
                  <p className="text-gray-700">
                    Work with cutting-edge technologies and methodologies in digital transformation, AI, and cognitive computing.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Opportunities</h3>
                  <p className="text-gray-700">
                    Continuous learning through our Digital Transformation Management Academy (DTMA) and hands-on project experience.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Impactful Work</h3>
                  <p className="text-gray-700">
                    Contribute to transformative projects that help organizations across industries achieve their digital goals.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Environment</h3>
                  <p className="text-gray-700">
                    Join a diverse team of experts who value collaboration, knowledge sharing, and collective success.
                  </p>
                </div>
              </div>
            </section>

            {/* Apply CTA */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Join our team and help shape the future of digital transformation. We're looking for passionate 
                individuals who are ready to drive change and innovation.
              </p>
              <button
                onClick={handleApply}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md text-lg"
              >
                Apply for this Position
              </button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
