import { Share2, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { NewsletterSubscription } from '../NewsletterSubscription';

interface BlogSidebarProps {
  blogTitle?: string;
  blogSlug?: string;
}

function getBlogHighlights(blogSlug?: string): string[] {
  switch (blogSlug) {
    case 'rise-of-compute-nationalism':
      return [
        'The New Power Source Isn\'t Oil — It\'s Compute',
        'Why Trump Is Making Datacenters a National Priority',
        'What Exactly Is "Compute Nationalism"?',
        'What This Means for the Rest of the World',
        'The Real Question We Should Be Asking'
      ];
    case 'china-ai-superstate':
      return [
        'China Doesn\'t Announce the Plan — It Already Builds It',
        'The World\'s Largest Compute Clusters—You\'ve Never Heard Of',
        'Will China Overtake the U.S.?',
        'China\'s Silent Compute Acceleration Strategy'
      ];
    case 'europe-ai-compute-challenge':
      return [
        'The EU\'s Compute Challenge',
        'The EU\'s Hope: Sovereign Compute Initiatives',
        'The Hard Truth About Europe\'s AI Future',
        'Ethics vs Infrastructure: The Real Dilemma'
      ];
    case 'global-south-ai-compute-divide':
      return [
        'The Harsh Reality: AI Is Becoming Compute-Gated',
        'But the Global South Has Unique Leverage',
        'The Real Danger: Dependence',
        'What Must Happen Now',
        'Final Reflection: Control Your Digital Destiny'
      ];
    case 'rise-of-half-attention-worker':
      return [
        'How Half-Attention Became the Norm',
        'The Cognitive Cost No One Sees',
        'When Work Suffers, So Do We',
        'The DCO Response: Reclaiming Full Attention',
        'Rebuilding Attention in a Fast-Paced World'
      ];
    case 'nations-weaponize-attention-before-missiles':
      return [
        'The Weaponized Narrative',
        'Influence Campaigns as State Strategy',
        'Misinformation Moves Faster Than Truth',
        'Enter AI: The New Propaganda Engine',
        'Cognitive Resilience as National Infrastructure'
      ];
    case 'architecture-of-addiction-interface-design':
      return [
        'The Economics of Attention',
        'How Platform Design Feed Addiction',
        'Designing for Attention, not Addiction',
        'Reclaiming Our Attention as Digital Citizens',
        'The Future of Social Media'
      ];
    case 'digital-life-feeds-emotion-starves-meaning':
      return [
        'Stimulation Is Not the Same as Satisfaction',
        'The Brain on Constant Input',
        'The Illusion of Connection',
        'Relearning How to Create Meaning in a Digital World',
        'Designing Digital Environments That Support Wellbeing'
      ];
    case 'end-of-multitasking-automation-cognitive-work':
      return [
        'Multitasking: A Coping Mechanism',
        'Enter AI and Digital Business Platforms',
        'Man-Machine Collaboration: Rebalancing Work',
        'The Future of Work: From Reactive to Reflective',
        'Digital Cognitive Organizations: Where This Leads'
      ];
    default:
      return [
        'Key insights and analysis',
        'Strategic implications',
        'Future outlook',
        'Actionable recommendations'
      ];
  }
}

export function BlogSidebar({ blogTitle, blogSlug }: BlogSidebarProps) {
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  const handleShare = (platform: string) => {
    const baseUrl = 'https://digitalqatalyst.com';
    const currentPath = blogSlug ? `/blog/${blogSlug}` : location.pathname;
    const fullUrl = `${baseUrl}${currentPath}`;
    const title = blogTitle || 'Check out this article from DigitalQatalyst';
    
    switch (platform) {
      case 'x':
        const twitterText = encodeURIComponent(`${title} ${fullUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank');
        break;
      case 'linkedin':
        const linkedinUrl = encodeURIComponent(fullUrl);
        const linkedinTitle = encodeURIComponent(title);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}&title=${linkedinTitle}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(fullUrl).then(() => {
          setCopyStatus('copied');
          setTimeout(() => setCopyStatus('idle'), 2000);
        }).catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = fullUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopyStatus('copied');
          setTimeout(() => setCopyStatus('idle'), 2000);
        });
        break;
      default:
        console.log(`Sharing on ${platform}`);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Share Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Share2 size={20} className="text-primary" />
          Share This Post
        </h3>
        <div className="space-y-3">
          <button onClick={() => handleShare('x')} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-900/5 rounded-lg transition-colors text-left group">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-gray-900">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Share on X
            </span>
          </button>
          <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors text-left group">
            <Linkedin size={20} className="text-blue-700" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
              Share on LinkedIn
            </span>
          </button>

          <button 
            onClick={() => handleShare('copy')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left group ${
              copyStatus === 'copied' 
                ? 'bg-green-50 hover:bg-green-100' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {copyStatus === 'copied' ? (
              <Check size={20} className="text-green-600" />
            ) : (
              <LinkIcon size={20} className="text-gray-600" />
            )}
            <span className={`text-sm font-medium transition-colors ${
              copyStatus === 'copied' 
                ? 'text-green-700' 
                : 'text-gray-700'
            }`}>
              {copyStatus === 'copied' ? 'Link copied successfully!' : 'Copy Link'}
            </span>
          </button>
        </div>
      </div>

      {/* Newsletter CTA */}
      <NewsletterSubscription 
        source={blogSlug ? `Blog - ${blogSlug}` : 'Blog'}
        title="Get More Insights"
        description="Subscribe to our newsletter for weekly digital transformation tips"
      />

      {/* Table of Contents */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">In This Post</h3>
        <ul className="space-y-2 list-disc list-inside">
          {getBlogHighlights(blogSlug).map((highlight, index) => (
            <li key={index} className="text-sm text-gray-700">
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}