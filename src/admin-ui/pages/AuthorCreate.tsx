import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, Briefcase, FileText, Loader, Image as ImageIcon, ArrowLeft, Camera } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { authorService, Author } from '../utils/supabase';
import { Toast, ToastType } from '../components/Toast';

export const AuthorCreate: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Author>>({
    name: '',
    title: '',
    bio: '',
    avatar: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      setToast({ message: 'Name is required', type: 'error' });
      return false;
    }
    if (!formData.title?.trim()) {
      setToast({ message: 'Title is required', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let avatarUrl = formData.avatar || '';

      if (avatarFile) {
        avatarUrl = await authorService.uploadAvatar(avatarFile);
      }

      await authorService.createAuthor({
        ...formData,
        avatar: avatarUrl,
      });

      setToast({ message: 'Author profile created', type: 'success' });
      setTimeout(() => navigate('/admin-ui/authors'), 1200);
    } catch (error: any) {
      console.error('Error creating author:', error);
      setToast({ message: error.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="New Author">
      <div className="max-w-3xl mx-auto space-y-10 pb-20">
        <button
          onClick={() => navigate('/admin-ui/authors')}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to authors
        </button>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="e.g. Elena Vance"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="e.g. Lead Technologist"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Biography</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs leading-relaxed focus:ring-1 focus:ring-black outline-none transition-all"
                    placeholder="Share a short story about this author's expertise..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <Loader className="animate-spin" size={16} /> : <User size={16} />}
                  {isSubmitting ? 'Creating profile...' : 'Create Author Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar / Photo */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Profile Photo</label>
              <div className="relative group">
                <div className="w-full aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <User size={48} className="text-gray-200" />
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 p-2.5 bg-white border border-gray-200 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all active:scale-95"
                >
                  <Camera size={16} />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 italic text-center">Recommended: 400x400px</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AuthorCreate;