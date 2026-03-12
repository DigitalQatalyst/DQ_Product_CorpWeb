# Resend Quick Start - 5 Minutes

## What You Need
- [ ] Resend account (free, no credit card)
- [ ] API key from Resend
- [ ] 5 minutes

---

## Step-by-Step

### 1. Create Resend Account (2 minutes)
1. Go to https://resend.com
2. Click "Start Building"
3. Sign up with email or GitHub
4. Verify your email

### 2. Get API Key (1 minute)
1. In Resend dashboard, click "API Keys"
2. Click "Create API Key"
3. Name it: "DQ Corporate Website"
4. Click "Create"
5. **Copy the API key** (starts with `re_`)

### 3. Add to .env File (1 minute)
1. Open `.env` file in your project
2. Add these lines:
```env
VITE_RESEND_API_KEY=re_paste_your_key_here
VITE_FROM_EMAIL=hello@digitalqatalyst.com
```
3. Save the file

### 4. Restart Dev Server (30 seconds)
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### 5. Test It (30 seconds)
1. Go to http://localhost:3000
2. Subscribe to newsletter with your email
3. Check your inbox (and spam folder!)
4. You should receive a welcome email

---

## That's It!

✅ Emails will now be sent automatically when someone subscribes  
✅ Free for 3,000 emails/month  
✅ No code changes needed  

---

## Troubleshooting

**Email not received?**
- Check spam folder
- Check browser console (F12) for errors
- Check Resend dashboard → Logs
- Make sure you restarted dev server

**Still not working?**
- See full guide: `RESEND_EMAIL_SETUP_GUIDE.md`

---

## Next Steps

**For Production:**
1. Add your domain in Resend dashboard
2. Verify domain with DNS records
3. Update `VITE_FROM_EMAIL` to use your domain
4. Add environment variables to production hosting

**See full guide for details:** `RESEND_EMAIL_SETUP_GUIDE.md`
