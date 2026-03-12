import { useNavigate } from 'react-router-dom';
interface AuthorCardProps {
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
    linkedIn?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
}
export function AuthorCard({
  author
}: AuthorCardProps) {
  const navigate = useNavigate();
  
  // Debug logging to see what author data is received
  console.log('🎯 AuthorCard received data:', {
    name: author.name,
    role: author.role,
    bio: author.bio,
    avatar: author.avatar,
    linkedIn: author.linkedIn,
    twitter: author.twitter,
    website: author.website,
    email: author.email
  });
  
  const handleAvatarClick = () => {
    // Create a slug from the author name - handle special characters properly
    let authorSlug = author.name.toLowerCase()
      .replace(/é/g, 'e')  // Handle accented characters
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '');  // Remove other special characters
    
    // Handle specific author name mappings
    if (author.name === 'Kaylynn Océanne') {
      authorSlug = 'kaylynn-oceanne';
    } else if (author.name === 'Dr. Stéphane Niango') {
      authorSlug = 'dr-stephane-niango';
    }
    
    navigate(`/authors/${authorSlug}`);
  };

  const handleLinkedInClick = () => {
    // Use the provided LinkedIn URL or fallback to hardcoded ones
    let linkedInUrl = author.linkedIn || '';
    
    // Fallback for specific authors if no LinkedIn URL provided
    if (!linkedInUrl) {
      if (author.name === 'Kaylynn Océanne') {
        linkedInUrl = 'https://linkedin.com/in/kaylynn-niango';
      } else if (author.name === 'Dr. Stéphane Niango') {
        linkedInUrl = 'https://linkedin.com/in/stephaneniango';
      }
    }
    
    if (linkedInUrl) {
      window.open(linkedInUrl, '_blank');
    }
  };
  
  return <div className="mt-12 pt-12 border-t border-gray-200">
      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <button onClick={handleAvatarClick} className="group">
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 cursor-pointer" 
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {author.name}
              </h3>
              <p className="text-primary font-medium">{author.role}</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{author.bio}</p>

            {/* Social Links */}
            <div className="flex gap-3">
              <button 
                onClick={handleLinkedInClick}
                className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 hover:border-[#0077B5] rounded-lg transition-all group"
                title={author.linkedIn ? `Connect on LinkedIn: ${author.linkedIn}` : 'LinkedIn profile not available'}
              >
                {/* LinkedIn "in" logo */}
                <div className="flex items-center justify-center w-6 h-6 bg-[#0077B5] rounded text-white font-bold text-sm">
                  in
                </div>
                <span className="text-gray-700 group-hover:text-[#0077B5] font-medium transition-colors">
                  {author.linkedIn ? 'Connect' : 'LinkedIn'}
                </span>
              </button>
              
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 self-center">
                  LinkedIn: {author.linkedIn || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
}