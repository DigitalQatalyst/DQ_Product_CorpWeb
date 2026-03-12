// Analytics Provider Component
import React, { useEffect } from 'react';
import { initGA } from '../../utils/analytics';
import { usePageTracking } from '../../hooks/useAnalytics';
import { PerformanceMonitor } from './PerformanceMonitor';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // Initialize GA4 on app load
  useEffect(() => {
    initGA();
  }, []);

  // Track page views automatically
  usePageTracking();

  return (
    <>
      {children}
      <PerformanceMonitor />
    </>
  );
};