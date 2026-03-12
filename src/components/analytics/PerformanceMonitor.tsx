// Performance Monitoring Component (for development/admin use)
import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or for admin users
    const isDev = process.env.NODE_ENV === 'development';
    const isAdmin = localStorage.getItem('admin_mode') === 'true';
    
    if (isDev || isAdmin) {
      setIsVisible(true);
      measurePerformance();
    }
  }, []);

  const measurePerformance = () => {
    // Wait for page to fully load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics: PerformanceMetrics = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
        };

        // Get Web Vitals if available
        if ('PerformanceObserver' in window) {
          // First Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                metrics.firstContentfulPaint = entry.startTime;
              }
            });
          }).observe({ entryTypes: ['paint'] });

          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.largestContentfulPaint = lastEntry.startTime;
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Cumulative Layout Shift
          new PerformanceObserver((list) => {
            let clsValue = 0;
            list.getEntries().forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            metrics.cumulativeLayoutShift = clsValue;
          }).observe({ entryTypes: ['layout-shift'] });

          // First Input Delay
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              metrics.firstInputDelay = entry.processingStart - entry.startTime;
            });
          }).observe({ entryTypes: ['first-input'] });
        }

        setMetrics(metrics);
      }, 1000);
    });
  };

  const getScoreColor = (metric: string, value: number): string => {
    const thresholds: { [key: string]: { good: number; poor: number } } = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-gray-600';

    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-xs max-w-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Page Load:</span>
          <span className="font-mono">{metrics.pageLoadTime.toFixed(0)}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>DOM Ready:</span>
          <span className="font-mono">{metrics.domContentLoaded.toFixed(0)}ms</span>
        </div>
        
        {metrics.firstContentfulPaint > 0 && (
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={`font-mono ${getScoreColor('fcp', metrics.firstContentfulPaint)}`}>
              {metrics.firstContentfulPaint.toFixed(0)}ms
            </span>
          </div>
        )}
        
        {metrics.largestContentfulPaint > 0 && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={`font-mono ${getScoreColor('lcp', metrics.largestContentfulPaint)}`}>
              {metrics.largestContentfulPaint.toFixed(0)}ms
            </span>
          </div>
        )}
        
        {metrics.cumulativeLayoutShift > 0 && (
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={`font-mono ${getScoreColor('cls', metrics.cumulativeLayoutShift)}`}>
              {metrics.cumulativeLayoutShift.toFixed(3)}
            </span>
          </div>
        )}
        
        {metrics.firstInputDelay > 0 && (
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={`font-mono ${getScoreColor('fid', metrics.firstInputDelay)}`}>
              {metrics.firstInputDelay.toFixed(0)}ms
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Good:</span>
          <span className="text-green-600">●</span>
        </div>
        <div className="flex justify-between">
          <span>Needs Improvement:</span>
          <span className="text-yellow-600">●</span>
        </div>
        <div className="flex justify-between">
          <span>Poor:</span>
          <span className="text-red-600">●</span>
        </div>
      </div>
    </div>
  );
};