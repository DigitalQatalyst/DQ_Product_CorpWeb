# Resend Email Setup Guide
## Newsletter Confirmation Emails

---

## Overview

This guide will walk you through setting up Resend to automatically send confirmation emails when users subscribe to your newsletter.

**Time Required:** 5-10 minutes  
**Cost:** Free (3,000 emails/month)  
**No Credit Card Required**

---

## Step 1: Create Resend Account

1. **Go to Resend**
   - Visit: https://resend.com
   - Click "Start Building" or "Sign Up"

2. **Sign Up**
   - Use your work email (e.g., your@digitalqatalyst.com)
   - Or sign up with GitHub (faster)
   - No credit card required!

3. **Verify Email**
   - Check your inbox for verification email
   - Click the verification link

---

## Step 2: Get Your API Key

1. **Access Dashboard**
   - After logging in, you'll see the Resend dashboard
   - Click on "API Keys" in the left sidebar

2. **Create API Key**
   - Click "Create API Key" button
   - Name it: "DQ Corporate Website"
   - Permission: "Sending access" (default)
   - Click "Create"

3. **Copy API Key**
   - You'll see your API key (starts with `re_`)
   - **IMPORTANT**: Copy it now - you won't see it again!
   - It looks like: `re_123abc456def789ghi`

---

## Step 3: Add Domain (Optional but Recommended)

### Option A: Use Resend's Domain (Quick Start)

For testing, you can use Resend's default domain:
- Emails will come from: `onboarding@resend.dev`
- Good for testing, but not professional
- Skip to Step 4 if using this option

### Option B: Use Your Own Domain (Recommended)

1. **Add Domain**
   - In Resend dashboard, click "Domains"
   - Click "Add Domain"
   - Enter: `digitalqatalyst.com`
   - Click "Add"

2. **Verify Domain**
   - Resend will show you DNS records to add
   - You need to add these to your domain registrar (GoDaddy, Namecheap, etc.)

3. **DNS Records to Add**
   
   Copy these records to your DNS provider:
   
   **SPF Record (TXT)**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   ```
   
   **DKIM Record (TXT)**
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [Resend will provide this - copy from dashboard]
   ```
   
   **DMARC Record (TXT)** (Optional but recommended)
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@digitalqatalyst.com
   ```

4. **Wait for Verification**
   - DNS changes can take 5 minutes to 48 hours
   - Usually happens within 15 minutes
   - Resend will automatically verify once DNS propagates

5. **Check Verification Status**
   - Go back to Resend dashboard → Domains
   - You'll see a green checkmark when verified
   - If not verified after 1 hour, click "Verify" button

---

## Step 4: Configure Your Application

1. **Open Your .env File**
   - In your project root, open `.env`
   - If it doesn't exist, create it

2. **Add Resend Configuration**
   
   Add these lines to your `.env` file:
   
   ```env
   # Resend Email Configuration
   VITE_RESEND_API_KEY=re_your_actual_api_key_here
   VITE_FROM_EMAIL=hello@digitalqatalyst.com
   ```

3. **Replace Values**
   - Replace `re_your_actual_api_key_here` with your actual API key from Step 2
   - Replace `hello@digitalqatalyst.com` with your preferred sender email
   
   **Example:**
   ```env
   VITE_RESEND_API_KEY=re_abc123def456ghi789
   VITE_FROM_EMAIL=newsletter@digitalqatalyst.com
   ```

4. **Choose Sender Email**
   
   Good options:
   - `hello@digitalqatalyst.com` (friendly)
   - `newsletter@digitalqatalyst.com` (specific)
   - `team@digitalqatalyst.com` (team-focused)
   - `noreply@digitalqatalyst.com` (if you don't want replies)

---

## Step 5: Restart Your Dev Server

The application needs to reload to pick up the new environment variables.

1. **Stop Current Server**
   - In your terminal, press `Ctrl+C`

2. **Start Server Again**
   ```bash
   npm run dev
   ```

3. **Verify Server Started**
   - You should see: `Local: http://localhost:3000/`

---

## Step 6: Test the Email

1. **Open Your Website**
   - Go to: http://localhost:3000

2. **Find Newsletter Subscription**
   - Scroll to the footer or sidebar
   - Look for "Subscribe to Newsletter" section

3. **Subscribe with Your Email**
   - Enter your personal email address
   - Click "Subscribe"

4. **Check Your Inbox**
   - Wait 5-10 seconds
   - Check your email inbox
   - **Also check spam folder!**
   - You should receive a welcome email

5. **Verify Email Content**
   - Subject: "Welcome to Digital Qatalyst Newsletter! 🎉"
   - From: Your configured sender email
   - Content: Welcome message with benefits

---

## Troubleshooting

### Email Not Received?

**1. Check Spam Folder**
- First-time emails often go to spam
- Mark as "Not Spam" to train your email provider

**2. Check Browser Console**
- Open browser DevTools (F12)
- Go to Console tab
- Look for errors or success messages
- Should see: "Newsletter confirmation email sent via Resend"

**3. Check Resend Dashboard**
- Go to Resend dashboard → Logs
- You'll see all sent emails
- Check if email was sent successfully
- If failed, you'll see the error reason

**4. Verify API Key**
- Make sure API key in `.env` is correct
- Should start with `re_`
- No extra spaces or quotes

**5. Verify Environment Variables**
- In browser console, type: `import.meta.env.VITE_RESEND_API_KEY`
- Should show your API key (or undefined if not loaded)
- If undefined, restart dev server

### Common Errors

**Error: "Resend API key not configured"**
- Solution: Add `VITE_RESEND_API_KEY` to `.env` file
- Restart dev server

**Error: "Invalid API key"**
- Solution: Check API key is correct in `.env`
- Make sure it starts with `re_`
- No extra spaces or line breaks

**Error: "Domain not verified"**
- Solution: Use `onboarding@resend.dev` for testing
- Or wait for domain verification to complete

**Error: "Rate limit exceeded"**
- Solution: You've hit the free tier limit (3,000/month)
- Wait until next month or upgrade plan

---

## Email Customization

### Change Email Content

Edit `src/services/emailService.ts`:

**Subject Line:**
```typescript
subject: 'Your Custom Subject Here',
```

**Email Body:**
Modify the `emailHtml` variable to change the email design and content.

### Add Your Logo

1. Upload logo to your website (e.g., `/public/logo.png`)
2. In `emailService.ts`, add to the header section:
```html
<img src="https://www.digitalqatalyst.com/logo.png" alt="DQ Logo" style="max-width: 150px; margin-bottom: 20px;">
```

### Change Colors

In the `<style>` section of `emailService.ts`, modify:
```css
.header {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

---

## Production Deployment

### Before Going Live

1. **Verify Domain**
   - Make sure your domain is verified in Resend
   - Don't use `onboarding@resend.dev` in production

2. **Update Environment Variables**
   - Add Resend API key to production environment
   - Use production domain email address

3. **Test in Staging**
   - Test with multiple email providers (Gmail, Outlook, etc.)
   - Check spam folder placement
   - Verify all links work

4. **Monitor Deliverability**
   - Check Resend dashboard regularly
   - Monitor bounce rates
   - Watch for spam complaints

### Environment Variables for Production

**Vercel:**
```bash
vercel env add VITE_RESEND_API_KEY
vercel env add VITE_FROM_EMAIL
```

**Netlify:**
- Go to Site Settings → Environment Variables
- Add `VITE_RESEND_API_KEY` and `VITE_FROM_EMAIL`

**Other Platforms:**
- Add environment variables through your hosting platform's dashboard

---

## Monitoring & Analytics

### Resend Dashboard

**View Sent Emails:**
1. Go to Resend dashboard
2. Click "Logs" in sidebar
3. See all sent emails with status

**Email Status:**
- ✅ Delivered: Email successfully delivered
- ⏳ Queued: Email is being sent
- ❌ Failed: Email failed to send (see error)
- 📧 Opened: Recipient opened email (if tracking enabled)

**Metrics to Track:**
- Total emails sent
- Delivery rate
- Bounce rate
- Open rate (if enabled)

### Enable Email Tracking (Optional)

To track opens and clicks, add to the API call in `emailService.ts`:

```typescript
body: JSON.stringify({
  // ... existing fields
  tags: [
    { name: 'category', value: 'newsletter' },
    { name: 'source', value: data.source || 'website' }
  ],
  headers: {
    'X-Entity-Ref-ID': `newsletter-${Date.now()}`
  }
}),
```

---

## Scaling & Pricing

### Free Tier
- 3,000 emails/month
- All features included
- No credit card required
- Perfect for getting started

### When to Upgrade

Upgrade to Pro ($20/month) when:
- You exceed 3,000 emails/month
- You need 50,000 emails/month
- You want dedicated support

### Cost Comparison

| Subscribers | Emails/Month | Resend Cost |
|-------------|--------------|-------------|
| 100 | 400 | Free |
| 500 | 2,000 | Free |
| 1,000 | 4,000 | $20/month |
| 5,000 | 20,000 | $20/month |
| 10,000 | 40,000 | $20/month |

---

## Best Practices

### Email Deliverability

1. **Use Your Own Domain**
   - Don't use `onboarding@resend.dev` in production
   - Verify your domain properly

2. **Warm Up Your Domain**
   - Start with small volumes
   - Gradually increase sending volume
   - Don't send 1,000 emails on day 1

3. **Monitor Bounce Rates**
   - Keep bounce rate below 5%
   - Remove invalid emails from your list
   - Use double opt-in if needed

4. **Avoid Spam Triggers**
   - Don't use ALL CAPS in subject
   - Avoid spam words (FREE, URGENT, etc.)
   - Include unsubscribe link
   - Add physical address

### Email Content

1. **Keep It Short**
   - Welcome emails should be scannable
   - Use bullet points
   - Clear call-to-action

2. **Mobile-Friendly**
   - 50%+ of emails are read on mobile
   - Use responsive design
   - Test on different devices

3. **Set Expectations**
   - Tell them what they'll receive
   - Tell them how often
   - Make it easy to unsubscribe

---

## Security

### Protect Your API Key

1. **Never Commit to Git**
   - `.env` is in `.gitignore`
   - Never commit API keys to repository

2. **Use Environment Variables**
   - Always use `VITE_RESEND_API_KEY`
   - Never hardcode in source code

3. **Rotate Keys Regularly**
   - Change API key every 6 months
   - Immediately if compromised

4. **Limit Key Permissions**
   - Use "Sending access" only
   - Don't use "Full access" unless needed

---

## Support

### Resend Support

**Documentation:**
- https://resend.com/docs

**Community:**
- Discord: https://resend.com/discord
- GitHub: https://github.com/resendlabs/resend-node

**Email Support:**
- support@resend.com
- Response time: Usually within 24 hours

### Need Help?

**Common Issues:**
1. Check this guide's Troubleshooting section
2. Check Resend dashboard logs
3. Check browser console for errors
4. Verify environment variables are set

---

## Quick Reference

### Environment Variables
```env
VITE_RESEND_API_KEY=re_your_api_key
VITE_FROM_EMAIL=hello@digitalqatalyst.com
```

### Test Email
1. Go to http://localhost:3000
2. Subscribe to newsletter
3. Check inbox (and spam)

### Check Logs
- Resend Dashboard → Logs
- Browser Console (F12)

### Files Modified
- `src/services/emailService.ts` (email service)
- `src/services/airtableService.ts` (calls email service)
- `.env` (configuration)

---

## Checklist

Before going live:

- [ ] Resend account created
- [ ] API key generated and copied
- [ ] Domain added and verified (or using test domain)
- [ ] Environment variables added to `.env`
- [ ] Dev server restarted
- [ ] Test email sent and received
- [ ] Email looks good on mobile
- [ ] Links in email work
- [ ] Spam folder checked
- [ ] Production environment variables configured
- [ ] Monitoring set up in Resend dashboard

---

**Setup Time:** 5-10 minutes  
**Monthly Cost:** Free (up to 3,000 emails)  
**Maintenance:** None (automatic)

