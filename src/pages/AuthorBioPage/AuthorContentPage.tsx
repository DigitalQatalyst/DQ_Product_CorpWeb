import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { Plus, FileText, Clock, CheckCircle, XCircle, Eye, Edit, Trash2, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@mantine/core';
type ContentStatus = 'draft' | 'review' | 'published' | 'rejected';
interface AuthorContent {
  id: number;
  title: string;
  category: string;
  status: ContentStatus;
  views: number;
  lastEdited: string;
  publishedDate?: string;
  thumbnail: string;
}
export function AuthorContentPage() {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | ContentStatus>('all');
  // Mock data - would come from API
  const authorType: 'core' | 'guest' = 'core'; // or 'guest'
  const contents: AuthorContent[] = [{
    id: 1,
    title: 'The Future of Digital Banking in Economy 4.0',
    category: 'Digital Economy 4.0',
    status: 'published',
    views: 1247,
    lastEdited: '2 days ago',
    publishedDate: 'Dec 18, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80'
  }, {
    id: 2,
    title: 'AI-Driven Decision Making: A Practical Guide',
    category: 'Artificial Intelligence',
    status: 'review',
    views: 0,
    lastEdited: '5 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80'
  }, {
    id: 3,
    title: 'Building Cognitive Organizations: Step by Step',
    category: 'Digital Economy 4.0',
    status: 'draft',
    views: 0,
    lastEdited: 'Yesterday',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80'
  }, {
    id: 4,
    title: 'Data Privacy in the Age of AI',
    category: 'Technology',
    status: 'published',
    views: 892,
    lastEdited: '1 week ago',
    publishedDate: 'Dec 10, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80'
  }, {
    id: 5,
    title: 'Customer Experience in Digital Transformation',
    category: 'Digital Economy 4.0',
    status: 'rejected',
    views: 0,
    lastEdited: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80'
  }];
  const getStatusConfig = (status: ContentStatus) => {
    const configs = {
      draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700',
        icon: FileText,
        iconColor: 'text-gray-600'
      },
      review: {
        label: 'In Review',
        color: 'bg-yellow-100 text-yellow-700',
        icon: Clock,
        iconColor: 'text-yellow-600'
      },
      published: {
        label: 'Published',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
        iconColor: 'text-red-600'
      }
    };
    return configs[status];
  };
  const filteredContents = activeTab === 'all' ? contents : contents.filter(c => c.status === activeTab);
  const stats = {
    total: contents.length,
    published: contents.filter(c => c.status === 'published').length,
    review: contents.filter(c => c.status === 'review').length,
    draft: contents.filter(c => c.status === 'draft').length,
    totalViews: contents.reduce((sum, c) => sum + c.views, 0)
  };
  const handleCreateNew = () => {
    // Redirect to CMS - this would be the actual CMS URL
    window.open('/cms/new-article', '_blank');
  };
  return <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Content
              </h1>
              <p className="text-gray-600">
                {authorType === 'core' ? 'Core Contributor' : 'Guest Author'} •
                Manage your published articles and drafts
              </p>
            </div>
            <Button leftSection={<Plus size={20} />} size="lg" onClick={handleCreateNew} styles={{
            root: {
              backgroundColor: '#FF6B4D',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#e55a3d'
              }
            }
          }}>
              Create New Article
            </Button>
          </div>

          {/* Author Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy/5 border border-brand-navy/20 rounded-lg">
            <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
            <span className="text-sm font-medium text-brand-navy">
              {authorType === 'core' ? 'DigitalQatalyst Core Contributor' : 'Guest Author'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">Total Articles</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-sm text-gray-600">Published</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.published}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-yellow-600" />
              <span className="text-sm text-gray-600">In Review</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.review}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">Drafts</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.draft}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-brand-teal" />
              <span className="text-sm text-gray-600">Total Views</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalViews.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-2 p-2 border-b border-gray-200 overflow-x-auto">
            <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'all' ? 'bg-brand-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              All ({contents.length})
            </button>
            <button onClick={() => setActiveTab('published')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'published' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Published ({stats.published})
            </button>
            <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'review' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              In Review ({stats.review})
            </button>
            <button onClick={() => setActiveTab('draft')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'draft' ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Drafts ({stats.draft})
            </button>
            <button onClick={() => setActiveTab('rejected')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'rejected' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Rejected ({contents.filter(c => c.status === 'rejected').length}
              )
            </button>
          </div>

          {/* Content List */}
          <div className="divide-y divide-gray-100">
            {filteredContents.length === 0 ? <div className="p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' ? "You haven't created any articles yet." : `You don't have any ${activeTab} articles.`}
                </p>
                <Button leftSection={<Plus size={18} />} onClick={handleCreateNew} styles={{
              root: {
                backgroundColor: '#FF6B4D',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#e55a3d'
                }
              }
            }}>
                  Create Your First Article
                </Button>
              </div> : filteredContents.map(content => {
            const statusConfig = getStatusConfig(content.status);
            const StatusIcon = statusConfig.icon;
            return <div key={content.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-6">
                      {/* Thumbnail */}
                      <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                              {content.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="font-medium text-brand-teal">
                                {content.category}
                              </span>
                              <span>•</span>
                              <span>Last edited {content.lastEdited}</span>
                              {content.publishedDate && <>
                                  <span>•</span>
                                  <span>Published {content.publishedDate}</span>
                                </>}
                            </div>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            {content.status === 'published' && <div className="flex items-center gap-2">
                                <Eye size={16} />
                                <span className="font-medium">
                                  {content.views.toLocaleString()} views
                                </span>
                              </div>}
                            {content.status === 'rejected' && <span className="text-red-600 font-medium">
                                Revision required - Check feedback
                              </span>}
                          </div>

                          <div className="flex items-center gap-2">
                            {content.status === 'published' && <button className="p-2 text-gray-600 hover:text-brand-teal hover:bg-gray-100 rounded-lg transition-colors">
                                <BarChart3 size={18} />
                              </button>}
                            <button className="p-2 text-gray-600 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            {content.status === 'draft' && <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 size={18} />
                              </button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>;
          })}
          </div>
        </div>
      </div>
    </DashboardLayout>;
}