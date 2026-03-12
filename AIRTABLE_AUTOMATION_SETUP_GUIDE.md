# Airtable Automation Setup Guide
## Newsletter Subscription Confirmation Emails

---

## Step-by-Step Setup

### Step 1: Open Your Airtable Base

1. Go to [airtable.com](https://airtable.com) and log in
2. Open your DQ Corporate Website base
3. Navigate to your Newsletter Subscriptions table

---

### Step 2: Access Automations

1. Look at the top of your Airtable base
2. Click on **"Automations"** (it's in the top menu bar, next to "Interfaces")
3. Click the **"Create automation"** button (blue button on the right)

---

### Step 3: Name Your Automation

1. At the top, you'll see "Untitled automation"
2. Click on it and rename it to: **"Newsletter Welcome Email"**
3. This helps you identify it later

---

### Step 4: Set Up the Trigger

#### 4.1 Choose Trigger Type
1. In the left panel, you'll see "Choose a trigger"
2. Click on **"When record created"**
3. This means the automation runs whenever a new subscriber is added

#### 4.2 Configure Trigger Settings
1. **Table**: Select your Newsletter Subscriptions table (the one where emails are stored)
2. **View**: Leave as "All records" or select a specific view if you have one
3. Click **"Done"** or the checkmark

---

### Step 5: Add Email Action

#### 5.1 Add Action
1. Below the trigger, click **"+ Add action"**
2. In the search box, type "email"
3. Select **"Send email"**

#### 5.2 Configure Email Settings

**To (Recipient):**
1. Click in the "To" field
2. You'll see a list of fields from your trigger
3. Select **"Email"** (this pulls the subscriber's email from the new record)

**From (Sender):**
1. Click in the "From" field
2. Enter your email: `newsletter@digitalqatalyst.com`
   - Or use: `hello@digitalqatalyst.com`
   - Or use: `team@digitalqatalyst.com`
3. Note: This email must be verified in Airtable (Airtable will send you a verification email)

**Reply to (Optional but Recommended):**
1. Click "Add reply to"
2. Enter: `hello@digitalqatalyst.com`
3. This is where replies will go

**Subject:**
```
Welcome to Digital Qatalyst Newsletter! 🎉
```

**Message:**
Copy and paste this template:

```
Hi there!

Thank you for subscribing to the Digital Qatalyst newsletter!

You're now part of our community and will receive:

✓ Weekly digital transformation insights
✓ Industry trends and best practices  
✓ Exclusive content and resources
✓ Updates on our latest solutions and services

We're excited to have you on board!

In the meantime, feel free to explore:
🌐 Our website: https://www.digitalqatalyst.com
📚 Knowledge Hub: https://www.digitalqatalyst.com/knowledge-hub
💼 Our Services: https://www.digitalqatalyst.com/services

Have questions? Just reply to this email - we'd love to hear from you!

Best regards,
The Digital Qatalyst Team

---
You're receiving this because you subscribed to our newsletter.
If you didn't subscribe or want to unsubscribe, please contact us at hello@digitalqatalyst.com
```

---

### Step 6: Test the Automation

#### 6.1 Turn On the Automation
1. In the top right corner, toggle the switch to **"ON"** (it will turn blue)
2. Airtable will ask you to confirm - click **"Turn on automation"**

#### 6.2 Create a Test Record
1. Go back to your Newsletter Subscriptions table
2. Click **"+ Add record"** or the "+" button
3. Enter your personal email in the Email field
4. Fill in other required fields:
   - Subscription Date: Today's date
   - Status: Active
   - Source: Test
5. Press Enter or click outside to save

#### 6.3 Check Your Email
1. Wait 10-30 seconds
2. Check your email inbox (and spam folder!)
3. You should receive the welcome email

---

### Step 7: Verify Email Address (If Needed)

If Airtable asks you to verify your "From" email:

1. Check the inbox of the email you used in the "From" field
2. Look for an email from Airtable
3. Click the verification link
4. Go back to your automation and try again

---

### Step 8: Monitor Automation Runs

#### View Automation History
1. Click on your automation name
2. Click the **"Runs"** tab at the top
3. You'll see:
   - When it ran
   - Whether it succeeded or failed
   - Which record triggered it

#### Check for Errors
- Green checkmark = Success
- Red X = Failed (click to see why)

---

## Customization Options

### Add Your Logo (Upgrade Required)
To add HTML formatting with your logo, you'll need:
1. Airtable Pro plan or higher
2. Use "Send email (advanced)" action instead
3. Add HTML email template

### Personalize the Email
You can add dynamic fields from your table:

**Example with Name field:**
```
Hi {Name}!

Thank you for subscribing...
```

To add dynamic fields:
1. Click in the message box where you want the field
2. Click the "+" button that appears
3. Select the field from your table (e.g., Name, Company, etc.)

### Add Conditions
You can add conditions to only send emails in certain cases:

1. After the trigger, click **"+ Add condition"**
2. Set rules like:
   - Only if Status = "Active"
   - Only if Source = "Website"
3. The email will only send if conditions are met

---

## Troubleshooting

### Email Not Received?

**Check 1: Spam Folder**
- Airtable emails sometimes go to spam initially
- Mark as "Not Spam" to train your email provider

**Check 2: Automation is ON**
- Go to Automations
- Make sure the toggle is blue/ON

**Check 3: Email Address is Correct**
- Check the record in your table
- Make sure Email field has valid email

**Check 4: Automation Runs**
- Click on automation → Runs tab
- Check if it ran and if there were errors

**Check 5: From Email Verified**
- Airtable requires verification of sender email
- Check for verification email from Airtable

### Automation Not Triggering?

**Check 1: Trigger Configuration**
- Make sure trigger is set to correct table
- Make sure it's "When record created" not "When record updated"

**Check 2: Test with Manual Record**
- Create a record manually in Airtable
- Don't rely on website form initially

**Check 3: Automation Limits**
- Free plan: 100 runs/month
- Check if you've hit the limit

---

## Email Template Variations

### Short Version
```
Hi!

Thanks for subscribing to Digital Qatalyst newsletter!

You'll receive weekly insights on digital transformation, industry trends, and exclusive resources.

Welcome aboard!

The DQ Team
```

### Professional Version
```
Dear Subscriber,

Thank you for joining the Digital Qatalyst newsletter community.

As a subscriber, you will receive:
• Weekly digital transformation insights
• Industry analysis and trends
• Exclusive whitepapers and resources
• Updates on our solutions and services

We look forward to supporting your digital transformation journey.

Best regards,
Digital Qatalyst Team

Digital Qatalyst
[Your Address]
hello@digitalqatalyst.com
www.digitalqatalyst.com
```

### Friendly Version
```
Hey there! 👋

Welcome to the DQ family!

You just joined hundreds of digital transformation enthusiasts who get our weekly newsletter packed with:

🚀 Actionable insights
📊 Industry trends
💡 Expert tips
🎁 Exclusive resources

Your first newsletter drops next week. Can't wait to share it with you!

Questions? Hit reply anytime.

Cheers,
The DQ Team

P.S. Follow us on LinkedIn for daily tips!
```

---

## Best Practices

### 1. Send Immediately
- Keep automation simple: trigger → email
- Don't add delays for welcome emails
- Subscribers expect instant confirmation

### 2. Keep It Short
- Welcome emails should be scannable
- Use bullet points
- Include 1-2 clear calls-to-action

### 3. Set Expectations
- Tell them what they'll receive
- Tell them how often
- Tell them how to unsubscribe

### 4. Make It Personal
- Use their name if you collect it
- Reference where they signed up
- Make it conversational

### 5. Test Regularly
- Subscribe yourself monthly
- Check deliverability
- Update content as needed

---

## Next Steps After Setup

### 1. Test with Real Email
- Use your personal email
- Check formatting on mobile
- Verify all links work

### 2. Update Website
- No code changes needed!
- Automation works with existing setup
- Just make sure Airtable integration is working

### 3. Monitor Performance
- Check automation runs weekly
- Track open rates (if using email service)
- Adjust content based on feedback

### 4. Consider Upgrades Later
- If you exceed 100 subscribers/month
- If you want HTML templates
- If you need better analytics

---

## Quick Reference

**Automation Name:** Newsletter Welcome Email

**Trigger:** When record created

**Table:** Newsletter Subscriptions

**Action:** Send email

**To:** {Email} field from trigger

**From:** newsletter@digitalqatalyst.com

**Subject:** Welcome to Digital Qatalyst Newsletter! 🎉

**Status:** ON (blue toggle)

---

## Support

**Airtable Help:**
- Help Center: https://support.airtable.com
- Community: https://community.airtable.com

**Need Help?**
- Check automation "Runs" tab for errors
- Review this guide
- Test with manual record creation

---

## Checklist

Before going live, verify:

- [ ] Automation is created and named
- [ ] Trigger is set to "When record created"
- [ ] Correct table selected
- [ ] Email action configured
- [ ] "To" field uses {Email} from trigger
- [ ] "From" email is verified
- [ ] Subject line is set
- [ ] Message is written and formatted
- [ ] Automation toggle is ON
- [ ] Test email sent and received
- [ ] Links in email work
- [ ] Email looks good on mobile
- [ ] Spam folder checked

---

**Setup Time:** 5-10 minutes
**Cost:** Free (up to 100 runs/month)
**Maintenance:** None (runs automatically)

