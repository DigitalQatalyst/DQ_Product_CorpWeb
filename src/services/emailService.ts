// Email service using Supabase Edge Function
// The Edge Function calls Resend API server-side to avoid CORS issues

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface NewsletterConfirmationData {
  email: string;
  source?: string;
}

export const sendNewsletterConfirmation = async (
  data: NewsletterConfirmationData
): Promise<void> => {
  try {
    console.log('🔵 Sending email via Supabase Edge Function:', { email: data.email, source: data.source });
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('⚠️ Supabase not configured, skipping confirmation email');
      return;
    }

    // Call Supabase Edge Function
    const functionUrl = `${SUPABASE_URL}/functions/v1/send-newsletter-email`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email: data.email,
        source: data.source || 'Website',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Edge Function error:', errorText);
      throw new Error(`Edge Function error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Newsletter confirmation email sent:', result.id);
  } catch (error) {
    console.error('❌ Error sending newsletter confirmation email:', error);
    // Don't throw error - we don't want to fail the subscription if email fails
  }
};
