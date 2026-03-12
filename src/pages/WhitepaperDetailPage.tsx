import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Share,
  Bookmark,
  Calendar,
  Clock,
  FileText,
  Users,
  Eye,
} from 'lucide-react'

const WhitepaperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect whitepaper-1 to the scroll experience page
    if (id === 'whitepaper-1') {
      navigate('/whitepaper/digital-economy-4-0', { replace: true })
      return
    }
  }, [id, navigate])

  const [whitepaper, setWhitepaper] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock whitepaper data - replace with your actual data
  const mockWhitepaper = {
    id: 'whitepaper-1',
    title: 'The Future of Digital Transformation: A Comprehensive Guide',
    subtitle: 'Strategic Insights for Modern Enterprises',
    description: 'This comprehensive whitepaper explores the evolving landscape of digital transformation, providing actionable insights and strategic frameworks for organizations looking to thrive in the digital economy.',
    heroImage: '/images/prediction-hero.jpg',
    publishDate: 'January 15, 2026',
    readTime: '25 min read',
    downloadCount: 2847,
    fileSize: '4.2 MB',
    author: {
      name: 'Dr. Stéphane Niango',
      title: 'Expert in Digital Cognitive Organizations',
      avatar: '/images/Stephane_Avatar.png',
      company: 'DigitalQatalyst'
    },
    abstract: 'In an era where digital transformation has become a business imperative, organizations must navigate complex technological landscapes while maintaining operational excellence. This whitepaper presents a comprehensive framework for understanding and implementing successful digital transformation strategies.',
    keyInsights: [
      'Strategic approaches to digital transformation planning',
      'Technology adoption frameworks for enterprise environments',
      'Change management strategies for digital initiatives',
      'ROI measurement and success metrics',
      'Future trends and emerging technologies'
    ],
    tableOfContents: [
      { section: 'Executive Summary', page: 3 },
      { section: 'Introduction to Digital Transformation', page: 5 },
      { section: 'Strategic Framework', page: 12 },
      { section: 'Implementation Roadmap', page: 18 },
      { section: 'Case Studies', page: 24 },
      { section: 'Future Outlook', page: 30 },
      { section: 'Conclusion', page: 35 }
    ],
    tags: ['Digital Transformation', 'Strategy', 'Technology', 'Enterprise', 'Innovation']
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setWhitepaper(mockWhitepaper)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading whitepaper...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!whitepaper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Whitepaper Not Found</h1>
          <button
            onClick={() => navigate('/marketplace/knowledge-hub')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-orange-500 mr-2" />
              <span className="font-medium text-gray-900">Whitepaper</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative mb-8">
              <img
                src={whitepaper.heroImage}
                alt={whitepaper.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                <button
                  onClick={handleDownload}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Title and Metadata */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{whitepaper.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{whitepaper.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{whitepaper.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{whitepaper.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{whitepaper.downloadCount} downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{whitepaper.fileSize}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Share
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>

            {/* Abstract */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Abstract</h2>
              <p className="text-gray-700 leading-relaxed">{whitepaper.abstract}</p>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Insights</h2>
              <ul className="space-y-3">
                {whitepaper.keyInsights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Table of Contents */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <div className="space-y-2">
                {whitepaper.tableOfContents.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{item.section}</span>
                    <span className="text-gray-500 text-sm">Page {item.page}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
              <div className="flex items-start">
                <img
                  src={whitepaper.author.avatar}
                  alt={whitepaper.author.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{whitepaper.author.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{whitepaper.author.title}</p>
                  <p className="text-sm text-gray-500">{whitepaper.author.company}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {whitepaper.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Stats */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Downloads</span>
                  </div>
                  <span className="font-medium text-gray-900">{whitepaper.downloadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Views</span>
                  </div>
                  <span className="font-medium text-gray-900">5,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">File Size</span>
                  </div>
                  <span className="font-medium text-gray-900">{whitepaper.fileSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhitepaperDetailPage