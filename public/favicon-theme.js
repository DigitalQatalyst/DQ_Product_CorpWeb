// Theme-aware favicon switcher
// Automatically switches between light and dark favicons based on system theme preference
(function() {
    // Configuration for favicon paths
    const FAVICON_CONFIG = {
        light: '/images/DQ Logo Dark.svg',  // Dark logo for light mode
        dark: '/images/DQ Logo White.svg'   // White logo for dark mode
    };

    /**
     * Updates the favicon based on current theme preference
     * Removes existing favicon links and adds new one to ensure proper update
     */
    function updateFavicon() {
        try {
            // Detect system theme preference
            const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Remove existing favicon links to force refresh
            const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
            existingFavicons.forEach(function(link) {
                link.remove();
            });
            
            // Create new favicon link element
            const faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            faviconLink.type = 'image/svg+xml';
            faviconLink.href = isDarkMode ? FAVICON_CONFIG.dark : FAVICON_CONFIG.light;
            
            // Insert at the beginning of head for priority
            document.head.insertBefore(faviconLink, document.head.firstChild);
            
            // Update theme-color meta tag if present
            const themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isDarkMode ? '#1a1a1a' : '#030F35');
            }
        } catch (error) {
            // Silent failure - don't break the page
            console.error('Failed to update favicon:', error);
        }
    }

    // Initialize favicon on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateFavicon);
    } else {
        updateFavicon();
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Modern browsers
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', updateFavicon);
        } 
        // Legacy browser support
        else if (darkModeQuery.addListener) {
            darkModeQuery.addListener(updateFavicon);
        }
    }
})();