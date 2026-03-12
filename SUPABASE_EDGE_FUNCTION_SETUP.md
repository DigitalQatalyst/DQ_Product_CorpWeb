# Supabase Edge Function Setup for Newsletter Emails

## Overview
Deploy a Supabase Edge Function to send newsletter confirmation emails via Resend API. This solves the CORS issue by running the email sending logic on the server instead of the browser.

---

## Prerequisites

1. Supabase project (you already have this)
2. Supabase CLI installed
3. Resend API key

---

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Or with Homebrew (macOS):
```bash
brew install supabase/tap/supabase
```

---

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

---

## Step 3: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

To find your project ref:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Look at the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

---

## Step 4: Set Environment Variables

Set the Resend API key as a secret in Supabase:

```bash
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
supabase secrets set FROM_EMAIL=hello@digitalqatalyst.com
```

---

## Step 5: Deploy the Edge Function

```bash
supabase functions deploy send-newsletter-email
```

This will deploy the function from `supabase/functions/send-newsletter-email/index.ts`.

---

## Step 6: Test the Function

### Test from Command Line

```bash
supabase functions invoke send-newsletter-email \
  --data '{"email":"your-email@example.com","source":"Test"}'
```

### Test from Browser Console

Open your website and run:

```javascript
fetch('https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-newsletter-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    source: 'Test'
  })
}).then(r => r.json()).then(console.log)
```

---

## Step 7: Verify It Works

1. Go to your website
2. Subscribe to the newsletter
3. Check browser console for:
   - 🔵 "Sending email via Supabase Edge Function"
   - ✅ "Newsletter confirmation email sent"
4. Check your email inbox
5. Check Resend dashboard for sent email

---

## Troubleshooting

### Function Not Found Error

**Error:** `Function not found: send-newsletter-email`

**Solution:**
```bash
# List deployed functions
supabase functions list

# If not listed, deploy again
supabase functions deploy send-newsletter-email
```

### Secrets Not Set

**Error:** `Resend API key not configured`

**Solution:**
```bash
# Check secrets
supabase secrets list

# Set secrets again
supabase secrets set RESEND_API_KEY=re_your_key
supabase secrets set FROM_EMAIL=hello@digitalqatalyst.com
```

### CORS Error

**Error:** `Access to fetch... has been blocked by CORS policy`

**Solution:** The `cors.ts` file should handle this. Make sure it's in place:
- File: `supabase/functions/_shared/cors.ts`
- Contains proper CORS headers

### Email Not Sending

**Check Supabase Logs:**
```bash
supabase functions logs send-newsletter-email
```

**Check Resend Dashboard:**
- Go to https://resend.com/emails
- Look for failed sends
- Check error messages

---

## File Structure

```
your-project/
├── supabase/
│   └── functions/
│       ├── _shared/
│       │   └── cors.ts          # CORS headers
│       └── send-newsletter-email/
│           └── index.ts         # Edge function code
├── src/
│   └── services/
│       ├── airtableService.ts   # Calls email service
│       └── emailService.ts      # Calls Edge function
└── .env                         # Contains Supabase URL & keys
```

---

## Environment Variables Needed

### In Supabase (Secrets)
```bash
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=hello@digitalqatalyst.com
```

### In Your .env File
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RESEND_API_KEY=re_your_api_key  # Not used anymore, but keep for reference
VITE_FROM_EMAIL=hello@digitalqatalyst.com
```

---

## How It Works

1. **User subscribes** → Frontend calls `submitNewsletterSubscription()`
2. **Save to Airtable** → Record created in Airtable
3. **Call Edge Function** → `emailService.ts` calls Supabase Edge Function
4. **Edge Function** → Calls Resend API (server-side, no CORS)
5. **Email sent** → User receives confirmation email

---

## Cost

- **Supabase Edge Functions:** Free tier includes 500,000 invocations/month
- **Resend:** Free tier includes 3,000 emails/month
- **Total:** FREE for your current volume

---

## Monitoring

### View Function Logs
```bash
supabase functions logs send-newsletter-email --tail
```

### View in Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Edge Functions"
4. Click on "send-newsletter-email"
5. View logs and metrics

---

## Updating the Function

After making changes to the function code:

```bash
supabase functions deploy send-newsletter-email
```

Changes take effect immediately.

---

## Quick Reference

### Deploy Function
```bash
supabase functions deploy send-newsletter-email
```

### View Logs
```bash
supabase functions logs send-newsletter-email
```

### Test Function
```bash
supabase functions invoke send-newsletter-email \
  --data '{"email":"test@example.com","source":"Test"}'
```

### Set Secrets
```bash
supabase secrets set RESEND_API_KEY=re_your_key
```

### List Functions
```bash
supabase functions list
```

---

## Next Steps

1. Install Supabase CLI
2. Login and link project
3. Set secrets (Resend API key)
4. Deploy function
5. Test it
6. Done!

The newsletter subscription will now send confirmation emails automatically!
