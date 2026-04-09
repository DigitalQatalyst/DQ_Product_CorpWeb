// Configure Airtable
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY as string;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string;
const AIRTABLE_SERVICE_TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID as string;
const AIRTABLE_CONSULTATION_TABLE_ID = import.meta.env.VITE_AIRTABLE_CONSULTATION_TABLE_ID as string;
const AIRTABLE_WAITLIST_TABLE_ID = import.meta.env.VITE_AIRTABLE_WAITLIST_TABLE_ID as string;
const AIRTABLE_NEWSLETTER_TABLE_ID = import.meta.env.VITE_AIRTABLE_NEWSLETTER_TABLE_ID as string;
const AIRTABLE_WHITEPAPER_TABLE_ID = import.meta.env.VITE_AIRTABLE_WHITEPAPER_TABLE_ID as string;

export interface ServiceRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  industry: string;
  companySize: string;
  serviceInterest: string;
  serviceSlug?: string; // Add service slug
  projectTimeline: string;
  budget: string;
  requirements: string;
}

export interface ConsultationRequestData {
  name: string;
  email: string;
  company: string;
  phone: string;
  sector: string;
  interest: string;
  message: string;
}

export interface WaitlistRequestData {
  name: string;
  email: string;
  companyName: string;
  productName: string;
  productCode: string;
  requestType?: 'waitlist' | 'demo'; // Add request type
}

export interface NewsletterSubscriptionData {
  email: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface WhitepaperAccessData {
  fullName: string;
  email: string;
  whitepaperTitle: string;
  whitepaperUrl: string;
}

// Add tour request table configuration
const AIRTABLE_TOUR_REQUEST_TABLE_ID = import.meta.env.VITE_AIRTABLE_TOUR_REQUEST_TABLE_ID as string;

export interface TourRequestData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  groupSize: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface AssessmentLeadData {
  name: string;
  company: string;
  email: string;
}

export const submitServiceRequest = async (data: ServiceRequestData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_SERVICE_TABLE_ID) {
      throw new Error('Missing Airtable configuration. Please check environment variables.');
    }

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SERVICE_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'First Name': data.firstName,
          'Last Name': data.lastName,
          'Email': data.email,
          'Phone': data.phone,
          'Company': data.company,
          'Job Title': data.jobTitle,
          'Industry': data.industry,
          'Company Size': data.companySize,
          'Service Interest': data.serviceInterest,
          'Service Slug': data.serviceSlug || '',
          'Project Timeline': data.projectTimeline,
          'Budget': data.budget,
          'Requirements': data.requirements,
          'Submission Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // Successfully submitted service request
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw new Error('Failed to submit service request');
  }
};

export const submitConsultationRequest = async (data: ConsultationRequestData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_CONSULTATION_TABLE_ID) {
      const missingVars = [];
      if (!AIRTABLE_API_KEY) missingVars.push('VITE_AIRTABLE_API_KEY');
      if (!AIRTABLE_BASE_ID) missingVars.push('VITE_AIRTABLE_BASE_ID');
      if (!AIRTABLE_CONSULTATION_TABLE_ID) missingVars.push('VITE_AIRTABLE_CONSULTATION_TABLE_ID');
      
      throw new Error(`Missing Airtable configuration: ${missingVars.join(', ')}. Please check your .env file.`);
    }

    // Validate data
    if (!data.name || !data.email) {
      throw new Error('Name and email are required fields.');
    }

    const requestPayload = {
      fields: {
        'Name': data.name,
        'Email': data.email,
        'Company': data.company || '',
        'Phone': data.phone || '',
        'Sector': data.sector || '',
        'Interest': data.interest || '',
        'Message': data.message,
        'Submission Date': new Date().toISOString().split('T')[0],
        'Form Source': 'Website Consultation Form',
      },
    };

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CONSULTATION_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Provide more specific error messages based on status code
      if (response.status === 401) {
        throw new Error('Airtable API authentication failed. Please check your API key.');
      } else if (response.status === 404) {
        throw new Error('Airtable base or table not found. Please check your base ID and table ID.');
      } else if (response.status === 422) {
        throw new Error('Invalid data format. Please check the field names and data types.');
      } else {
        throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
      }
    }

    const result = await response.json();
    // Successfully submitted consultation request
  } catch (error) {
    console.error('❌ [AirtableService] Error submitting consultation request to Airtable:', error);
    
    // Re-throw with more user-friendly message if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error instanceof Error ? error : new Error('Failed to submit consultation request');
  }
};

export const submitWaitlistRequest = async (data: WaitlistRequestData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_WAITLIST_TABLE_ID) {
      throw new Error('Missing Airtable configuration for waitlist form. Please check environment variables.');
    }

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_WAITLIST_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Name': data.name,
          'Email': data.email,
          'Company Name': data.companyName,
          'Product Name': data.productName,
          'Product Code': data.productCode,
          'Request Type': data.requestType || 'waitlist',
          'Submission Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          'Status': 'New',
          'Form Source': data.requestType === 'demo' ? 'Website Product Demo Request' : 'Website Product Waitlist',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // Successfully submitted waitlist request
  } catch (error) {
    console.error('Error submitting waitlist request to Airtable:', error);
    throw new Error('Failed to submit waitlist request');
  }
};

export const submitNewsletterSubscription = async (data: NewsletterSubscriptionData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_NEWSLETTER_TABLE_ID) {
      throw new Error('Missing Airtable configuration for newsletter subscription. Please check environment variables.');
    }

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_NEWSLETTER_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Email': data.email,
          'Subscription Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          'Status': 'Active',
          'Source': data.source || 'Website',
          'IP Address': data.ipAddress || '',
          'User Agent': data.userAgent || '',
          'Confirmed': true, // Auto-confirm for now, can be changed for double opt-in
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Send confirmation email (non-blocking)
    // Import dynamically to avoid circular dependencies
    import('./emailService').then(({ sendNewsletterConfirmation }) => {
      sendNewsletterConfirmation({
        email: data.email,
        source: data.source,
      }).catch(err => {
        console.error('Failed to send confirmation email:', err);
        // Don't fail the subscription if email fails
      });
    });
    
  } catch (error) {
    console.error('Error submitting newsletter subscription to Airtable:', error);
    throw new Error('Failed to submit newsletter subscription');
  }
};

export const submitTourRequest = async (data: TourRequestData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TOUR_REQUEST_TABLE_ID) {
      throw new Error('Missing Airtable configuration for tour request. Please check environment variables.');
    }

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TOUR_REQUEST_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Name': data.name,
          'Email': data.email,
          'Company': data.company || '',
          'Phone': data.phone || '',
          'Job Title': data.jobTitle || '',
          'Group Size': data.groupSize,
          'Preferred Date': data.preferredDate,
          'Preferred Time': data.preferredTime,
          'Message': data.message || '',
          'Submission Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          'Status': 'New',
          'Form Source': 'Website Tour Request',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // Successfully submitted tour request
  } catch (error) {
    console.error('Error submitting tour request to Airtable:', error);
    throw new Error('Failed to submit tour request');
  }
};

export const submitWhitepaperAccess = async (data: WhitepaperAccessData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_WHITEPAPER_TABLE_ID) {
      throw new Error('Missing Airtable configuration for whitepaper access. Please check environment variables.');
    }

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_WHITEPAPER_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Full Name': data.fullName,
          'Email': data.email,
          'Whitepaper Title': data.whitepaperTitle,
          'Whitepaper URL': data.whitepaperUrl,
          'Access Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          'Access Timestamp': new Date().toISOString(),
          'Status': 'Accessed',
          'Source': 'Website Article',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // Successfully submitted whitepaper access
  } catch (error) {
    console.error('Error submitting whitepaper access to Airtable:', error);
    throw new Error('Failed to submit whitepaper access');
  }
};

export const submitAssessmentLead = async (data: AssessmentLeadData): Promise<void> => {
  try {
    // Validate required environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_NEWSLETTER_TABLE_ID) {
      throw new Error('Missing Airtable configuration for assessment lead capture. Please check environment variables.');
    }

    // Try to get user's IP address
    let userIP = '';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        userIP = ipData.ip;
      }
    } catch (ipError) {
      // Could not fetch IP address
    }

    const payload = {
      fields: {
        'Email': data.email,
        'Subscription Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        'Status': 'Active',
        'Source': 'Digital Maturity Assessment',
        'Name': data.name,
        'Company': data.company,
        'IP Address': userIP,
        'User Agent': typeof navigator !== 'undefined' ? navigator.userAgent : '',
        'Confirmed': true,
      },
    };

    // Use fetch API instead of Airtable SDK to avoid import issues
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_NEWSLETTER_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error response:', errorText);
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // Successfully submitted assessment lead
  } catch (error) {
    console.error('Error submitting assessment lead to Airtable:', error);
    throw new Error('Failed to submit assessment lead');
  }
};

// Test function to verify Airtable connection specifically for consultation table
export const testConsultationConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("🧪 [AirtableService] Testing consultation table connection...");
    
    // First, test basic network connectivity
    console.log("🧪 [AirtableService] Testing basic network connectivity...");
    try {
      const networkTest = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        mode: 'cors'
      });
      console.log("🧪 [AirtableService] Network test result:", networkTest.ok);
    } catch (networkError) {
      console.error("🧪 [AirtableService] Network test failed:", networkError);
      return {
        success: false,
        message: `Network connectivity test failed: ${networkError instanceof Error ? networkError.message : 'Unknown network error'}`
      };
    }
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_CONSULTATION_TABLE_ID) {
      const missing = [];
      if (!AIRTABLE_API_KEY) missing.push('AIRTABLE_API_KEY');
      if (!AIRTABLE_BASE_ID) missing.push('AIRTABLE_BASE_ID');
      if (!AIRTABLE_CONSULTATION_TABLE_ID) missing.push('AIRTABLE_CONSULTATION_TABLE_ID');
      
      return {
        success: false,
        message: `Missing environment variables: ${missing.join(', ')}`
      };
    }

    console.log("🧪 [AirtableService] Environment variables OK, testing Airtable API...");
    console.log("🧪 [AirtableService] API Key format:", AIRTABLE_API_KEY.substring(0, 10) + "...");
    console.log("🧪 [AirtableService] Base ID:", AIRTABLE_BASE_ID);
    console.log("🧪 [AirtableService] Table ID:", AIRTABLE_CONSULTATION_TABLE_ID);

    // Test connection by fetching table schema (just 1 record to minimize API usage)
    const testUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CONSULTATION_TABLE_ID}?maxRecords=1`;
    console.log("🧪 [AirtableService] Test URL:", testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("🧪 [AirtableService] Response status:", response.status);
    console.log("🧪 [AirtableService] Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🧪 [AirtableService] Airtable API error:", errorText);
      return {
        success: false,
        message: `Airtable API error: ${response.status} - ${errorText}`
      };
    }

    const result = await response.json();
    console.log("✅ [AirtableService] Consultation table connection successful:", result);
    
    return {
      success: true,
      message: 'Airtable consultation table connection successful'
    };
  } catch (error) {
    console.error("❌ [AirtableService] Consultation table connection test failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection test failed'
    };
  }
};

// Test function to verify Airtable connection
export const testAirtableConnection = async (tableType: 'service' | 'consultation' | 'waitlist' | 'newsletter' | 'whitepaper' = 'service'): Promise<{ success: boolean; message: string }> => {
  try {
    let tableId: string;
    
    switch (tableType) {
      case 'service':
        tableId = AIRTABLE_SERVICE_TABLE_ID;
        break;
      case 'consultation':
        tableId = AIRTABLE_CONSULTATION_TABLE_ID;
        break;
      case 'waitlist':
        tableId = AIRTABLE_WAITLIST_TABLE_ID;
        break;
      case 'newsletter':
        tableId = AIRTABLE_NEWSLETTER_TABLE_ID;
        break;
      case 'whitepaper':
        tableId = AIRTABLE_WHITEPAPER_TABLE_ID;
        break;
      default:
        tableId = AIRTABLE_SERVICE_TABLE_ID;
    }
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !tableId) {
      return {
        success: false,
        message: `Missing Airtable configuration for ${tableType} table. Please check environment variables.`
      };
    }

    // Test connection by fetching table schema
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?maxRecords=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Airtable API error for ${tableType} table: ${response.status} - ${errorText}`
      };
    }

    return {
      success: true,
      message: `Connection successful! ${tableType} table is properly configured.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed for ${tableType} table: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};