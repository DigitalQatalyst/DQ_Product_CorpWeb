import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { categoryService, Category, blogService, Blog } from '../utils/supabase';
import {
    Plus,
    Search,
    Hash,
    Trash2,
    Edit,
    Loader,
    AlertCircle,
    Tag,
    CheckCircle2,
    X,
    BookOpen
} from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';
import Modal from '../components/Modal';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
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
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [categoryPosts, setCategoryPosts] = useState<Blog[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setToast({ message: 'Failed to load categories', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredCategories.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const openUpsertModal = (category: Category | null = null) => {
        if (category) {
            setCurrentCategory(category);
        } else {
            setCurrentCategory({ name: '', slug: '', description: '' });
        }
        setIsUpsertModalOpen(true);
    };

    const openDetailsModal = async (category: Category) => {
        setCurrentCategory(category);
        setIsDetailsModalOpen(true);
        setLoadingPosts(true);
        try {
            const posts = await blogService.getBlogs({ category: category.name });
            setCategoryPosts(posts);
        } catch (error) {
            console.error('Error fetching category posts:', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleUpsertSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory?.name || !currentCategory?.slug) {
            setToast({ message: 'Name and Slug are required', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            if (currentCategory.id) {
                await categoryService.updateCategory(currentCategory.id, currentCategory);
                setToast({ message: 'Category updated', type: 'success' });
            } else {
                await categoryService.createCategory(currentCategory);
                setToast({ message: 'Category created', type: 'success' });
            }
            setIsUpsertModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            setToast({ message: error.message, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedIds.length > 0) {
                // Since we don't have a bulk delete for categories yet, we do it sequentially
                // Better to add it to service if possible.
                for (const id of selectedIds) {
                    await categoryService.deleteCategory(id);
                }
                setToast({ message: `${selectedIds.length} categories removed`, type: 'success' });
            } else if (currentCategory?.id) {
                await categoryService.deleteCategory(currentCategory.id);
                setToast({ message: 'Category removed', type: 'success' });
            }
            setIsDeleteModalOpen(false);
            setSelectedIds([]);
            fetchCategories();
        } catch (error: any) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout title="Categories">
            <div className="space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80 lg:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter categories..."
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
                            <Plus size={16} /> New Category
                        </button>
                    </div>
                </div>

                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 text-gray-400">
                        <Loader className="animate-spin mb-4" size={32} />
                        <p className="text-sm">Mapping taxonomies...</p>
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
                                                checked={selectedIds.length === filteredCategories.length && filteredCategories.length > 0}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500">Category Name</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 hidden md:table-cell">Slug</th>
                                        <th className="px-6 py-4 text-xs font-medium text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-gray-400 text-sm">No categories found.</td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((cat) => (
                                            <tr key={cat.id} className="group hover:bg-gray-50/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(cat.id)}
                                                        onChange={() => handleSelectOne(cat.id)}
                                                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openDetailsModal(cat)}>
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                                            <Tag size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900 group-hover:underline underline-offset-4 decoration-black/10">{cat.name}</p>
                                                            {cat.description && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{cat.description}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">/{cat.slug}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => openUpsertModal(cat)}
                                                            className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100"
                                                            title="Edit Category"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setCurrentCategory(cat);
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
                                Showing {filteredCategories.length} categories
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title="Category Insight"
                size="lg"
            >
                {currentCategory && (
                    <div className="space-y-8 pb-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-black border border-gray-100 shadow-sm">
                                    <Tag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h2>
                                    <p className="text-xs font-mono text-gray-500 mt-1">/{currentCategory.slug}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                                {currentCategory.description || 'No description provided for this category.'}
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-medium text-gray-900 flex items-center gap-2">
                                <BookOpen size={12} className="text-indigo-500" /> Associated Publications
                            </h3>

                            {loadingPosts ? (
                                <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
                                    <Loader size={12} className="animate-spin" /> Retrieving associates...
                                </div>
                            ) : categoryPosts.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">No publications documented under this taxonomy yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {categoryPosts.slice(0, 4).map(post => (
                                        <div key={post.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-black/10 transition-colors">
                                            <p className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:underline">{post.title}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500">{post.author?.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(post.publishDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
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
                title={currentCategory?.id ? 'Refine Taxonomy' : 'New Taxonomy'}
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
                            {isSubmitting ? <Loader className="animate-spin" size={14} /> : (currentCategory?.id ? <CheckCircle2 size={14} /> : <Plus size={14} />)}
                            {isSubmitting ? 'Syncing...' : (currentCategory?.id ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                )}
            >
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Name</label>
                            <input
                                type="text"
                                value={currentCategory?.name || ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                    setCurrentCategory(prev => ({ ...prev, name: val, slug }));
                                }}
                                className="w-full px-0 py-1 bg-transparent border-b border-gray-100 focus:border-black text-sm font-semibold outline-none transition-all placeholder:text-gray-200"
                                placeholder="e.g. Technology & Innovation"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Slug</label>
                            <div className="flex items-center border-b border-gray-100 focus-within:border-black transition-all">
                                <span className="text-xs text-gray-300 mr-1">/</span>
                                <input
                                    type="text"
                                    value={currentCategory?.slug || ''}
                                    onChange={e => setCurrentCategory(prev => ({ ...prev, slug: e.target.value }))}
                                    className="w-full px-0 py-1 bg-transparent text-xs font-mono outline-none transition-all placeholder:text-gray-200"
                                    placeholder="tech-innovation"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500">Description</label>
                        <textarea
                            value={currentCategory?.description || ''}
                            onChange={e => setCurrentCategory(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs leading-relaxed focus:ring-1 focus:ring-gray-200 outline-none transition-all"
                            placeholder="Describe what this category encompasses..."
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
                            Remove Taxon
                        </button>
                    </>
                )}
            >
                <div className="flex items-center gap-3 text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertCircle size={20} />
                    <p className="text-xs font-medium">Warning: Structural Change</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed italic">
                    {selectedIds.length > 1
                        ? `Are you certain you wish to dissolve ${selectedIds.length} categories? Any linked publications will become uncategorized.`
                        : `Are you sure you want to delete the "${currentCategory?.name}" classification? This action cannot be reversed.`
                    }
                </p>
            </Modal>
        </AppLayout>
    );
};

export default CategoryManagement;
