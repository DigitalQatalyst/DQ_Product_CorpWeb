import { useEffect, useState, useRef } from 'react';

export function useStickyScroll() {
  const [isSticky, setIsSticky] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !contentRef.current) return;

      const content = contentRef.current;
      const contentHeight = content.offsetHeight;
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Calculate when sidebar should stop being sticky
      const contentBottom = content.offsetTop + contentHeight;
      const sidebarBottom = scrollTop + windowHeight;
      
      // If sidebar would go past content, make it scroll normally
      if (sidebarBottom > contentBottom - 100) { // 100px buffer
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isSticky, sidebarRef, contentRef };
}