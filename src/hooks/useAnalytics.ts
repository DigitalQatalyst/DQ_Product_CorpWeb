// React Hook for Analytics Tracking
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackBlogEvent, trackEngagement } from '../utils/analytics';

// Hook for tracking page views
export const usePageTracking = () => {
  const location = useLocation();
  const prevLocation = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Only track if location actually changed
    if (prevLocation.current !== currentPath) {
      trackPageView(currentPath);
      prevLocation.current = currentPath;
    }
  }, [location]);
};

// Hook for tracking blog engagement
export const useBlogTracking = (blogData: {
  id: string;
  title: string;
  category: string;
  author: string;
}) => {
  const startTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);
  const hasTrackedView = useRef<boolean>(false);

  useEffect(() => {
    // Track blog view
    if (!hasTrackedView.current) {
      trackBlogEvent('blog_view', {
        blog_id: blogData.id,
        blog_title: blogData.title,
        blog_category: blogData.category,
        blog_author: blogData.author,
      });
      hasTrackedView.current = true;
    }

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll.current) {
        maxScroll.current = scrollPercent;
        
        // Track milestone scroll depths
        if (scrollPercent >= 25 && scrollPercent < 50) {
          trackBlogEvent('blog_scroll_25', {
            blog_id: blogData.id,
            scroll_depth: 25,
          });
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          trackBlogEvent('blog_scroll_50', {
            blog_id: blogData.id,
            scroll_depth: 50,
          });
        } else if (scrollPercent >= 75 && scrollPercent < 90) {
          trackBlogEvent('blog_scroll_75', {
            blog_id: blogData.id,
            scroll_depth: 75,
          });
        } else if (scrollPercent >= 90) {
          trackBlogEvent('blog_scroll_complete', {
            blog_id: blogData.id,
            scroll_depth: 90,
          });
        }
      }
    };

    // Track time on page when user leaves
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime.current;
      trackBlogEvent('blog_time_spent', {
        blog_id: blogData.id,
        engagement_time: Math.round(timeSpent / 1000), // Convert to seconds
        scroll_depth: maxScroll.current,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track engagement when component unmounts
      const timeSpent = Date.now() - startTime.current;
      if (timeSpent > 5000) { // Only track if user spent more than 5 seconds
        trackBlogEvent('blog_engagement', {
          blog_id: blogData.id,
          engagement_time: Math.round(timeSpent / 1000),
          scroll_depth: maxScroll.current,
        });
      }
    };
  }, [blogData]);

  return {
    trackBlogShare: (platform: string) => {
      trackBlogEvent('blog_share', {
        blog_id: blogData.id,
        blog_title: blogData.title,
      });
    },
    trackBlogComment: () => {
      trackBlogEvent('blog_comment', {
        blog_id: blogData.id,
      });
    },
    trackRelatedClick: (relatedBlogId: string) => {
      trackBlogEvent('blog_related_click', {
        blog_id: blogData.id,
        related_blog_id: relatedBlogId,
      });
    },
  };
};

// Hook for tracking form interactions
export const useFormTracking = (formName: string) => {
  const trackFormStart = () => {
    trackEngagement('form_start', {
      page_title: `${formName} Form`,
    });
  };

  const trackFormSubmit = (success: boolean) => {
    trackEngagement(success ? 'form_submit_success' : 'form_submit_error', {
      page_title: `${formName} Form`,
    });
  };

  const trackFieldFocus = (fieldName: string) => {
    trackEngagement('form_field_focus', {
      page_title: `${formName} Form - ${fieldName}`,
    });
  };

  return {
    trackFormStart,
    trackFormSubmit,
    trackFieldFocus,
  };
};