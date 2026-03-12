import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { blogService, Blog, categoryService, Category, authorService, Author } from '../utils/supabase';
import { Toast, ToastType } from '../components/Toast';
import Modal from '../components/Modal';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Calendar,
  User as UserIcon,
  Star,
  Loader,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Filter,
  CheckSquare,
  Square,
  X,
  BookOpen,
  Newspaper,
  FileSearch,
  Book,
  Briefcase,
  Clock,
  ImageIcon,
  FileText
} from 'lucide-react';

const MediaList: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Selection & Modal state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState<Blog | null>(null);
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Blog[]>([]);
  const [loadingAuthorData, setLoadingAuthorData] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const loadData = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const [result, catsData] = await Promise.all([
        blogService.getBlogs({
          search: searchTerm,
          category: categoryFilter,
          type: typeFilter,
          limit: itemsPerPage,
          offset
        }),
        categoryService.getCategories()
      ]);

      setBlogs(result.data);
      setTotalItems(result.count);
      setCategories(catsData);
    } catch (err) {
      console.error('Failed to load media data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, categoryFilter, typeFilter]);

  useEffect(() => {
    loadData();
  }, [searchTerm, categoryFilter, typeFilter, currentPage]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === blogs.length && blogs.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blogs.map(b => b.id));
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (selectedIds.length > 0) {
        await blogService.deleteBlogs(selectedIds);
        setToast({ message: `${selectedIds.length} items removed`, type: 'success' });
      } else if (currentItem) {
        await blogService.deleteBlog(currentItem.id);
        setToast({ message: 'Item removed', type: 'success' });
      }
      setIsDeleteModalOpen(false);
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const openPreview = (blog: Blog) => {
    setCurrentItem(blog);
    setIsPreviewModalOpen(true);
  };

  const openAuthorInsight = async (author: any) => {
    if (!author?.id) return;
    setCurrentAuthor(author);
    setIsAuthorModalOpen(true);
    setLoadingAuthorData(true);
    try {
      const posts = await blogService.getBlogs({ authorId: author.id });
      setAuthorPosts(posts);
    } catch (err) {
      console.error('Failed to load author insight', err);
    } finally {
      setLoadingAuthorData(false);
    }
  };

  const getIconForType = (type?: string) => {
    switch (type) {
      case 'article': return <Newspaper size={12} />;
      case 'research': return <FileSearch size={12} />;
      case 'whitepaper': return <Book size={12} />;
      case 'case-study': return <Briefcase size={12} />;
      case 'expert-interview': return <UserIcon size={12} />;
      default: return <BookOpen size={12} />;
    }
  };

  return (
    <AppLayout title="Contribution Library">
      <div className="space-y-6">
        {/* Advanced Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search repository..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                className="px-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Formats</option>
                <option value="blog">Blogs</option>
                <option value="article">Articles</option>
                <option value="research">Research</option>
                <option value="whitepaper">Whitepapers</option>
                <option value="case-study">Case Studies</option>
                <option value="expert-interview">Expert Interviews</option>
              </select>

              <select
                className="px-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
            {selectedIds.length > 0 && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium text-xs rounded-xl hover:bg-red-100 transition-colors border border-red-100"
              >
                <Trash2 size={12} /> Delete ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => navigate('/admin-ui/media/new')}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium text-xs rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-100 whitespace-nowrap"
            >
              <Plus size={14} /> Add Content
            </button>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Premium Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 text-gray-400">
              <Loader className="animate-spin mb-4" size={32} />
              <p className="text-xs font-medium">Syncing Archives...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32 px-4">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-200" size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Vacuum State</h3>
              <p className="text-gray-400 text-xs mt-2 max-w-xs mx-auto">No contributions match your current trajectory. Try recalibrating your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                    <th className="p-5 w-10">
                      <button onClick={toggleSelectAll} className="text-gray-300 hover:text-black transition-colors">
                        {selectedIds.length === blogs.length && blogs.length > 0 ? <CheckSquare size={16} className="text-black" /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="p-5 text-xs font-medium text-gray-500 italic">Contribution Entity</th>
                    <th className="p-5 text-xs font-medium text-gray-500 italic hidden md:table-cell">Metadata</th>
                    <th className="p-5 text-xs font-medium text-gray-500 italic text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className={`group hover:bg-gray-50/30 transition-all ${selectedIds.includes(blog.id) ? 'bg-black/[0.02]' : ''}`}>
                      <td className="p-5">
                        <button onClick={() => toggleSelect(blog.id)} className="text-gray-200 group-hover:text-gray-400 transition-colors">
                          {selectedIds.includes(blog.id) ? <CheckSquare size={16} className="text-black" /> : <Square size={16} />}
                        </button>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-5">
                          <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 shadow-sm relative">
                            {blog.heroImage ? (
                              <img src={blog.heroImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-100">
                                <AlertCircle size={20} />
                              </div>
                            )}
                            <div className="absolute top-1 right-1">
                              <span className={`p-1 rounded-full shadow-sm border ${blog.featured ? 'bg-amber-500 border-amber-400' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
                                <Star size={6} className={blog.featured ? 'text-white fill-white' : 'text-gray-300'} />
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 py-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md border border-gray-200/50">
                                {getIconForType(blog.type)}
                                {blog.type || 'blog'}
                              </span>
                              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                {blog.category}
                              </span>
                            </div>
                            <h4
                              onClick={() => openPreview(blog)}
                              className="text-sm font-semibold text-gray-900 truncate group-hover:text-black group-hover:underline underline-offset-4 decoration-black/10 cursor-pointer"
                            >
                              {blog.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic font-medium leading-relaxed">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 hidden md:table-cell">
                        <div className="space-y-2">
                          <div
                            onClick={() => openAuthorInsight(blog.author)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer group/author transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full border border-gray-100 overflow-hidden shrink-0">
                              {blog.author?.avatar ? (
                                <img src={blog.author.avatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                  <UserIcon size={10} />
                                </div>
                              )}
                            </div>
                            <span className="group-hover/author:underline underline-offset-2">{blog.author?.name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                            <Calendar size={10} className="shrink-0" />
                            <span>{new Date(blog.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openPreview(blog)}
                            className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all"
                            title="Quick View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin-ui/media/${blog.id}`)}
                            className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all"
                            title="Refine Content"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentItem(blog);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Consign to Void"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/10">
                <p className="text-xs font-medium text-gray-500">
                  Showing {blogs.length} of {totalItems} entries
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-medium px-3 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                    Page {currentPage} of {Math.ceil(totalItems / itemsPerPage) || 1}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalItems / itemsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                    className="p-2 text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Contribution Preview"
        size="lg"
      >
        {currentItem && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100">
              {currentItem.heroImage ? (
                <img src={currentItem.heroImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <ImageIcon className="text-gray-200" size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/30">
                    {currentItem.category}
                  </span>
                  <span className="text-xs font-semibold text-white/60">
                    {new Date(currentItem.publishDate || "").toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-3xl font-bold leading-tight drop-shadow-md">{currentItem.title}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-gray-500 flex items-center gap-2">
                  <FileText size={12} /> Narrative Hook
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                  {currentItem.excerpt}
                </p>
              </div>
              <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-medium text-gray-500">Metadata Context</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Format</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 capitalize">
                      {getIconForType(currentItem.type)} {currentItem.type || 'Blog'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Read Capacity</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                      <Clock size={12} className="text-gray-400" /> {currentItem.readTime} MINS
                    </div>
                  </div>
                  {currentItem.type !== 'article' && (
                    <div className="space-y-1 col-span-2">
                      <span className="text-xs text-gray-500">Semantic tags</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Array.isArray(currentItem.tags) && currentItem.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-medium text-gray-500 bg-white border border-gray-100 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gray-100 p-0.5 bg-white shadow-sm">
                  {currentItem.author?.avatar ? (
                    <img src={currentItem.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                      <UserIcon size={18} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{currentItem.author?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currentItem.author?.title || 'Contributor'}</p>
                </div>
                {currentItem.type === 'article' && (
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                      <CheckCircle2 size={8} /> Layout Aligned
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={
                    currentItem.type === 'expert-interview'
                      ? `/expert-interviews/${currentItem.slug}`
                      : currentItem.type === 'article'
                        ? `/dtmi/article/${currentItem.slug}`
                        : `/blog/${currentItem.slug}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 bg-gray-50 text-gray-900 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  Preview Live <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => navigate(`/admin-ui/media/${currentItem.id}`)}
                  className="px-6 py-2 bg-gray-50 text-gray-900 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  Refine Item <Edit size={12} />
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100"
                  title="Consign to Void"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Author Insight Modal */}
      <Modal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        title="Author Perspective"
        size="lg"
      >
        {currentAuthor && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-3xl border border-gray-100 p-1 bg-white shadow-xl shadow-gray-100 shrink-0 transform -rotate-1">
                {currentAuthor.avatar ? (
                  <img src={currentAuthor.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-100">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              <div className="space-y-4 flex-1 pt-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentAuthor.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">{currentAuthor.title}</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed italic border-l-4 border-black/5 pl-5">
                  {currentAuthor.bio || 'This intellectual architect has chosen to remain mystical for now.'}
                </p>
              </div>
            </div>

            <div className="space-y-5 pt-4 border-t border-gray-50">
              <h3 className="text-xs font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500" /> Intellectual Contributions
              </h3>
              {loadingAuthorData ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse italic">
                  <Loader size={12} className="animate-spin" /> Retrieving publication history...
                </div>
              ) : authorPosts.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No publications documented under this identity yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {authorPosts.slice(0, 4).map(post => (
                    <div key={post.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group cursor-pointer hover:border-black/10 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-white border border-gray-100 rounded-md">{post.categoryName}</span>
                        <span className="text-xs text-gray-400">{new Date(post.publishDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:underline decoration-black/10">{post.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Consign to Void"
        footer={(
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="px-6 py-2 text-xs font-medium text-gray-400 hover:text-black transition-colors disabled:opacity-50"
            >
              Abort
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white text-xs font-medium rounded-xl hover:bg-red-700 shadow-xl shadow-red-100 border border-red-500 transition-all flex items-center justify-center gap-2 disabled:bg-red-400"
            >
              {isDeleting ? <Loader className="animate-spin" size={12} /> : null}
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        )}
      >
        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100 mb-6">
          <AlertCircle className="text-red-500 shrink-0" size={24} />
          <div>
            <p className="text-xs font-medium text-red-600">Existential Warning</p>
            <p className="text-xs text-red-600/70 font-medium">This contribution will be erased from the collective memory.</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed italic">
          {selectedIds.length > 1
            ? `Confirming the permanent erasure of ${selectedIds.length} entities from the repository?`
            : `Are you certain you wish to delete "${currentItem?.title}"? This protocol is non-restitutive.`
          }
        </p>
      </Modal>
    </AppLayout >
  );
};

export default MediaList;
