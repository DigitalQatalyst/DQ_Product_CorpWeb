import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { authorService, blogService, Author, Blog } from '../utils/supabase';
import {
  Plus,
  Search,
  User as UserIcon,
  Trash2,
  Edit,
  Loader,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Camera,
  CheckCircle2,
  X
} from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';
import Modal from '../components/Modal';

const AuthorManagement: React.FC = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Data for modals
  const [currentAuthor, setCurrentAuthor] = useState<Partial<Author> | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Blog[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await authorService.getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setToast({ message: 'Failed to load authors', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredAuthors.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openUpsertModal = (author: Author | null = null) => {
    if (author) {
      setCurrentAuthor(author);
      setAvatarPreview(author.avatar || '');
    } else {
      setCurrentAuthor({ name: '', title: '', bio: '' });
      setAvatarPreview('');
    }
    setAvatarFile(null);
    setIsUpsertModalOpen(true);
  };

  const openDetailsModal = async (author: Author) => {
    setCurrentAuthor(author);
    setIsDetailsModalOpen(true);
    setLoadingPosts(true);
    try {
      const posts = await blogService.getBlogs({ authorId: author.id });
      setAuthorPosts(posts);
    } catch (error) {
      console.error('Error fetching author posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleUpsertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAuthor?.name || !currentAuthor?.title) {
      setToast({ message: 'Name and Title are required', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      let avatarUrl = currentAuthor.avatar || '';
      if (avatarFile) {
        avatarUrl = await authorService.uploadAvatar(avatarFile);
      }

      if (currentAuthor.id) {
        await authorService.updateAuthor(currentAuthor.id, { ...currentAuthor, avatar: avatarUrl });
        setToast({ message: 'Author updated', type: 'success' });
      } else {
        await authorService.createAuthor({ ...currentAuthor, avatar: avatarUrl });
        setToast({ message: 'Author created', type: 'success' });
      }
      setIsUpsertModalOpen(false);
      fetchAuthors();
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedIds.length > 0) {
        await authorService.deleteAuthors(selectedIds);
        setToast({ message: `${selectedIds.length} authors removed`, type: 'success' });
      } else if (currentAuthor?.id) {
        await authorService.deleteAuthor(currentAuthor.id);
        setToast({ message: 'Author removed', type: 'success' });
      }
      setIsDeleteModalOpen(false);
      setSelectedIds([]);
      fetchAuthors();
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const filteredAuthors = authors.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="Authors">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter by name or title..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium text-xs rounded-lg hover:bg-red-100 transition-colors border border-red-100"
              >
                <Trash2 size={14} /> Delete Selected ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => openUpsertModal()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white font-medium text-xs rounded-lg hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={16} /> Add Author
            </button>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-400">
            <Loader className="animate-spin mb-4" size={32} />
            <p className="text-sm">Fetching team data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredAuthors.length && filteredAuthors.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                      />
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">Profile</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 hidden md:table-cell">Biography</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAuthors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-gray-400 text-sm">No authors found matching your criteria.</td>
                    </tr>
                  ) : (
                    filteredAuthors.map((author) => (
                      <tr key={author.id} className="group hover:bg-gray-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(author.id)}
                            onChange={() => handleSelectOne(author.id)}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 cursor-pointer" onClick={() => openDetailsModal(author)}>
                            <div className="w-10 h-10 rounded-full border border-gray-100 p-0.5 shrink-0">
                              {author.avatar ? (
                                <img src={author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                  <UserIcon size={18} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 group-hover:underline underline-offset-4 decoration-black/10">{author.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{author.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="text-xs text-gray-500 line-clamp-1 italic max-w-sm">"{author.bio || '...'}"</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openUpsertModal(author)}
                              className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100"
                              title="Edit Profile"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentAuthor(author);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing {filteredAuthors.length} authors
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Author Insight"
        size="lg"
      >
        {currentAuthor && (
          <div className="space-y-8 pb-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 rounded-2xl border border-gray-100 p-1 shrink-0 bg-white shadow-sm">
                {currentAuthor.avatar ? (
                  <img src={currentAuthor.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gray-50 flex items-center justify-center text-gray-200">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentAuthor.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">{currentAuthor.title}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                  {currentAuthor.bio || 'No biography available.'}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500" /> Published Contributions
              </h3>

              {loadingPosts ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
                  <Loader size={12} className="animate-spin" /> Fetching publications...
                </div>
              ) : authorPosts.length === 0 ? (
                <p className="text-xs text-gray-400 italic">This author has not published any items yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {authorPosts.slice(0, 4).map(post => (
                    <div key={post.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-black/10 transition-colors">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:underline">{post.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{post.categoryName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {authorPosts.length > 4 && (
                    <button className="col-span-full text-center py-2 text-xs font-medium text-gray-500 hover:text-black">
                      View all {authorPosts.length} posts
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Upsert Modal (Create/Edit) */}
      <Modal
        isOpen={isUpsertModalOpen}
        onClose={() => !isSubmitting && setIsUpsertModalOpen(false)}
        title={currentAuthor?.id ? 'Refine Profile' : 'New Identity'}
        footer={(
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setIsUpsertModalOpen(false)}
              className="text-xs font-medium text-gray-400 hover:text-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleUpsertSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-200 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <Loader className="animate-spin" size={14} /> : (currentAuthor?.id ? <CheckCircle2 size={14} /> : <Plus size={14} />)}
              {isSubmitting ? 'Syncing...' : (currentAuthor?.id ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        )}
      >
        <form className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group w-20 h-20 shrink-0">
              <div className="w-full h-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={24} className="text-gray-300" />
                )}
              </div>
              <input
                type="file"
                id="modal-avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="modal-avatar-upload"
                className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-gray-200 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all"
              >
                <Camera size={12} />
              </label>
            </div>
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Full Name</label>
                <input
                  type="text"
                  value={currentAuthor?.name || ''}
                  onChange={e => setCurrentAuthor(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-0 py-1 bg-transparent border-b border-gray-100 focus:border-black text-sm font-semibold outline-none transition-all placeholder:text-gray-200"
                  placeholder="e.g. Elena Vance"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Professional Title</label>
                <input
                  type="text"
                  value={currentAuthor?.title || ''}
                  onChange={e => setCurrentAuthor(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-0 py-1 bg-transparent border-b border-gray-100 focus:border-black text-xs font-medium outline-none transition-all placeholder:text-gray-200"
                  placeholder="e.g. Lead Technologist"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Biography</label>
            <textarea
              value={currentAuthor?.bio || ''}
              onChange={e => setCurrentAuthor(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs leading-relaxed focus:ring-1 focus:ring-gray-200 outline-none transition-all"
              placeholder="Share a short story about this author's expertise..."
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={(
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 shadow-lg shadow-red-100"
            >
              Remove Forever
            </button>
          </>
        )}
      >
        <div className="flex items-center gap-3 text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle size={20} />
          <p className="text-xs font-medium">Warning: This action is irreversible</p>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {selectedIds.length > 1
            ? `Are you sure you want to delete ${selectedIds.length} authors? Any content assigned to them will lose its attribution.`
            : `Are you sure you want to delete the profile for "${currentAuthor?.name}"? This will remove all biographical data.`
          }
        </p>
      </Modal>
    </AppLayout>
  );
};

export default AuthorManagement;