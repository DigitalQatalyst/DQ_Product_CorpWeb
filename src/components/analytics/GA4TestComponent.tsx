// GA4 Test Component - For debugging and verification
import React from 'react';
import { trackEvent, trackPageView, trackConversion } from '../../utils/analytics';

export const GA4TestComponent: React.FC = () => {
  const testGA4 = () => {
    console.log('🧪 Testing GA4 Implementation...');
    
    // Test basic event tracking
    trackEvent('test_event', {
      event_category: 'Testing',
      event_label: 'GA4 Implementation Test',
      value: 1
    });
    
    // Test page view tracking
    trackPageView('/test-page', 'GA4 Test Page');
    
    // Test conversion tracking
    trackConversion('test_conversion', {
      conversion_type: 'test',
      source_page: 'ga4-test-component'
    });
    
    console.log('✅ GA4 test events sent');
    alert('GA4 test events sent! Check browser DevTools Network tab for gtag requests.');
  };

  const checkGA4Status = () => {
    const status = {
      gtag_available: !!window.gtag,
      dataLayer_available: !!window.dataLayer,
      measurement_id: import.meta.env.VITE_GA_MEASUREMENT_ID,
      dataLayer_length: window.dataLayer?.length || 0
    };
    
    console.log('📊 GA4 Status:', status);
    alert(`GA4 Status:\n${JSON.stringify(status, null, 2)}`);
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>GA4 Debug</div>
      <button 
        onClick={checkGA4Status}
        style={{
          marginRight: '8px',
          padding: '4px 8px',
          fontSize: '11px',
          background: '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Check Status
      </button>
      <button 
        onClick={testGA4}
        style={{
          padding: '4px 8px',
          fontSize: '11px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Events
      </button>
    </div>
  );
};