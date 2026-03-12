// Supabase Edge Function to send newsletter confirmation emails via Resend
// Deploy with: supabase functions deploy send-newsletter-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, source } = await req.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'hello@digitalqatalyst.com'

    if (!RESEND_API_KEY) {
      console.error('Resend API key not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 16px 0;
      font-size: 16px;
    }
    .benefits {
      background: #f9f9f9;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .benefits h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #333;
    }
    .benefit-item {
      padding: 12px 0;
      border-bottom: 1px solid #e5e5e5;
      font-size: 15px;
    }
    .benefit-item:last-child {
      border-bottom: none;
    }
    .checkmark {
      color: #667eea;
      font-weight: bold;
      margin-right: 10px;
      font-size: 18px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      margin: 24px 0;
      font-weight: 600;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 30px;
      background-color: #f9f9f9;
      color: #666;
      font-size: 13px;
      line-height: 1.5;
    }
    .footer p {
      margin: 8px 0;
    }
    @media only screen and (max-width: 600px) {
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
      }
      .benefits {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Digital Qatalyst! 🎉</h1>
    </div>
    
    <div class="content">
      <p>Hi there!</p>
      
      <p>Thank you for subscribing to the Digital Qatalyst newsletter!</p>
      
      <div class="benefits">
        <h3>You'll now receive:</h3>
        <div class="benefit-item">
          <span class="checkmark">✓</span>
          Weekly digital transformation insights
        </div>
        <div class="benefit-item">
          <span class="checkmark">✓</span>
          Industry trends and best practices
        </div>
        <div class="benefit-item">
          <span class="checkmark">✓</span>
          Exclusive content and resources
        </div>
        <div class="benefit-item">
          <span class="checkmark">✓</span>
          Updates on our latest solutions
        </div>
      </div>
      
      <p>We're excited to have you in our community!</p>
      
      <center>
        <a href="https://www.digitalqatalyst.com" class="button">Visit Our Website</a>
      </center>
      
      <p style="margin-top: 24px;">Best regards,<br><strong>The Digital Qatalyst Team</strong></p>
    </div>
    
    <div class="footer">
      <p>You're receiving this because you subscribed to our newsletter${source ? ` via ${source}` : ''}.</p>
      <p>If you didn't subscribe, please ignore this email or <a href="mailto:hello@digitalqatalyst.com" style="color: #667eea;">contact us</a>.</p>
      <p style="margin-top: 16px;">© ${new Date().getFullYear()} Digital Qatalyst. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Digital Qatalyst <${FROM_EMAIL}>`,
        to: [email],
        subject: 'Welcome to Digital Qatalyst Newsletter! 🎉',
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorText }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const result = await response.json()
    console.log('Email sent successfully:', result.id)

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
