interface Author {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  slug: string;
}

interface ArticleAuthorCardProps {
  author: Author;
}

export function ArticleAuthorCard({ author }: ArticleAuthorCardProps) {
  const handleAvatarClick = () => {
    // Navigate to author bio page
    window.open(`/authors/${author.slug}`, '_blank');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 my-8 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100 cursor-pointer hover:ring-primary/30 transition-all"
          onClick={handleAvatarClick}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg mb-1">{author.name}</h3>
          <p className="text-secondary-600 font-medium text-base mb-3">{author.title}</p>
          <p className="text-gray-600 text-base leading-relaxed mb-4">{author.bio}</p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Connect:</span>
            <button 
              onClick={() => window.open('https://www.linkedin.com/in/stephaneniango', '_blank')}
              className="w-8 h-8 bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 rounded-lg flex items-center justify-center transition-all group"
            >
              <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </button>
            <button 
              onClick={() => window.open('https://x.com/drstephane_', '_blank')}
              className="w-8 h-8 bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 rounded-lg flex items-center justify-center transition-all group"
            >
              <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
