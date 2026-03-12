import React, { useState, useEffect } from 'react';
import { Plus, User, Search, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authorService, Author } from '../utils/supabase';

interface AuthorSelectorProps {
  selectedAuthorId?: string;
  onAuthorSelect: (author: Author) => void;
  className?: string;
}

export const AuthorSelector: React.FC<AuthorSelectorProps> = ({
  selectedAuthorId,
  onAuthorSelect,
  className = '',
}) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAuthors = await authorService.getAuthors();
      setAuthors(fetchedAuthors);
    } catch (err: any) {
      console.error('Error loading authors:', err);
      setError(err.message || 'Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authors.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAuthor = authors.find(author => author.id === selectedAuthorId);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader size={20} className="animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading authors...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search authors..."
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <Link
          to="/admin-ui/authors/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-95"
          title="Create New Author"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New</span>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={loadAuthors} className="font-bold underline">Retry</button>
        </div>
      )}

      {/* Display */}
      {selectedAuthor ? (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4 group">
          <img
            src={selectedAuthor.avatar || '/default-avatar.png'}
            alt={selectedAuthor.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 truncate">{selectedAuthor.name}</h4>
            <p className="text-sm text-blue-600 font-medium truncate italic">{selectedAuthor.title}</p>
          </div>
          <button
            onClick={() => onAuthorSelect({ id: '' } as Author)}
            className="text-xs font-bold text-blue-600 p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Change author
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {filteredAuthors.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 italic">
              No authors found matching "{searchTerm}"
            </div>
          ) : (
            filteredAuthors.map((author) => (
              <button
                key={author.id}
                onClick={() => onAuthorSelect(author)}
                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-blue-200 hover:shadow-sm transition-all text-left group"
              >
                <img
                  src={author.avatar || '/default-avatar.png'}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{author.name}</h4>
                  <p className="text-xs text-gray-400 truncate tracking-tight uppercase font-semibold">{author.title}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorSelector;