# DQ Website Forms - CRM Integration Specification

Complete field specifications for all 8 forms on the DigitalQatalyst website.

---

## 1. SERVICE REQUEST FORM
Route: /forms/service-request
Purpose: General service inquiries and requests

FIELDS:
- firstName (text, required) - Example: John
- lastName (text, required) - Example: Doe
- email (email, required) - Example: john@company.com
- phone (tel, required) - Example: +971 XX XXX XXXX
- company (text, required) - Example: Acme Corporation
- jobTitle (text, required) - Example: Chief Technology Officer
- industry (select, required) - Options: Technology, Healthcare, Finance, Retail, Manufacturing, Education, Government, Other
- companySize (select, required) - Options: 1-10, 11-50, 51-200, 201-1000, 1000+ employees
- serviceInterest (text, auto-filled from URL) - The service name being requested
- serviceSlug (text, auto-filled from URL) - Service identifier
- projectTimeline (select, required) - Options: Immediate (within 1 month), Short-term (1-3 months), Medium-term (3-6 months), Long-term (6+ months)
- budget (select, optional) - Options: Under $50,000, $50,000-$100,000, $100,000-$250,000, $250,000-$500,000, $500,000+
- requirements (textarea, required) - Project description and goals

LEAD PRIORITY: High (includes budget and timeline data)
SUGGESTED ROUTING: Sales Team
FOLLOW-UP SLA: 24-48 hours

---

## 2. PRODUCT DEMO REQUEST FORM
Route: /forms/product-demo/:productCode
Purpose: Request product demonstrations

FIELDS:
- name (text, required) - Example: John Doe
- email (email, required) - Example: john@company.com
- company (text, required) - Example: Acme Corporation
- productName (text, auto-filled) - Example: Digital Transformation Management Platform (DTMP)
- productCode (text, auto-filled) - Example: DTMP or PLANT40
- requestType (text, auto-filled) - Fixed value: "demo"

SUPPORTED PRODUCTS:
- DTMP: Digital Transformation Management Platform
- PLANT40: Plant 4.0

LEAD PRIORITY: High (qualified product interest)
SUGGESTED ROUTING: Product Specialists
FOLLOW-UP SLA: 24 hours

---

## 3. TOUR REQUEST FORM
Route: /forms/tour-request
Purpose: Schedule studio tours for Digital Working Studios (DWS) in Nairobi, Kenya

FIELDS:
- name (text, required) - Example: John Doe
- email (email, required) - Example: john@company.com
- company (text, optional) - Example: Acme Corporation
- phone (tel, optional) - Example: +254 XXX XXX XXX
- jobTitle (text, optional) - Example: Chief Technology Officer
- groupSize (select, required) - Options: Just me, 2-5 people, 6-10 people, 11-20 people, 20+ people
- preferredDate (date, required) - Example: 2024-12-25
- preferredTime (select, required) - Options: Morning (9:00 AM - 12:00 PM), Afternoon (1:00 PM - 4:00 PM), Evening (4:00 PM - 6:00 PM), Flexible
- message (textarea, optional) - Additional information or special requests

LEAD PRIORITY: Medium (physical engagement opportunity)
SUGGESTED ROUTING: Operations Team
FOLLOW-UP SLA: 24 hours

---

## 4. CONSULTATION REQUEST FORM
Route: /consultation
Purpose: Schedule free consultations

FIELDS:
- name (text, required) - Example: John Doe
- email (email, required) - Example: john@company.com
- company (text, optional) - Example: Acme Corporation
- phone (tel, optional) - Example: +971 XX XXX XXXX
- sector (select, optional) - Options: Experience 4.0, Agility 4.0, Farming 4.0, Plant 4.0, Infrastructure 4.0, Government 4.0, Hospitality 4.0, Retail 4.0, Service 4.0, Logistics 4.0, Wellness 4.0
- interest (select, optional) - Options: General Enquiries, Business Development, Products and Services, Events/Webinars/Press, Corporate Training, Request Demo
- message (textarea, required) - Organization details and needs

LEAD PRIORITY: High (direct engagement request)
SUGGESTED ROUTING: Business Development
FOLLOW-UP SLA: 24-48 hours

---

## 5. NEWSLETTER SUBSCRIPTION
Location: Multiple pages (sidebar, footer, article pages)
Purpose: Email newsletter subscriptions

FIELDS:
- email (email, required) - Example: john@company.com
- source (text, auto-filled) - Page/component name (Website, Blog, Article Page, etc.)
- ipAddress (text, optional) - Example: 192.168.1.1
- userAgent (text, auto-filled) - Browser information

VARIANTS:
- Default: Full card with animation (sidebar)
- Compact: Simplified version (footer, inline)

LEAD PRIORITY: Low (awareness stage)
SUGGESTED ROUTING: Marketing Automation
FOLLOW-UP: Automated welcome email

---

## 6. WHITEPAPER ACCESS MODAL
Location: Triggered from whitepaper CTAs
Purpose: Gated content access and download tracking

FIELDS:
- fullName (text, required) - Example: John Doe
- email (email, required) - Example: john@company.com
- whitepaperTitle (text, auto-filled) - Example: The Rise of Economy 4.0
- whitepaperUrl (text, auto-filled) - Document URL

BEHAVIOR: Opens whitepaper in new tab after submission

LEAD PRIORITY: Medium (education stage)
SUGGESTED ROUTING: Marketing Nurture Campaign
FOLLOW-UP: Automated follow-up sequence

---

## 7. WAITLIST MODAL
Location: Product pages
Purpose: Product launch waitlist signups

FIELDS:
- name (text, required) - Example: John Doe
- email (email, required) - Example: john@company.com
- companyName (text, required) - Example: Acme Corporation
- productName (text, auto-filled) - Example: Digital Transformation Management Platform
- productCode (text, auto-filled) - Example: DTMP
- requestType (text, auto-filled) - Fixed value: "waitlist"

LEAD PRIORITY: Medium (future opportunity)
SUGGESTED ROUTING: Product Launch List
FOLLOW-UP: Notification on product launch

---

## 8. ENQUIRY MODAL
Location: Various pages
Purpose: General enquiries
Note: This form uses a different API endpoint (not the main CRM system)

FIELDS:
- firstName (text, required, letters only) - Example: John
- lastName (text, required, letters only) - Example: Doe
- email (email, required) - Example: john@example.com
- phone (tel, required, 1-11 digits) - Example: +971xxxxxxx
- enquiryType (select, required) - Options: General Enquiry, Product Enquiry, Support
- message (textarea, required) - Enquiry details

CURRENT API: https://kfrealexpressserver.vercel.app/api/v1/enquiry/create-enquiry
METHOD: POST with Bearer token authentication

LEAD PRIORITY: Variable (depends on enquiry type)
SUGGESTED ROUTING: Support/Sales based on type
FOLLOW-UP SLA: 24 hours

---

## COMMON TRACKING METADATA

All forms should capture:
- timestamp (auto-generated on submission)
- source (page/form identifier)
- userAgent (browser information)
- ipAddress (where applicable)
- referrer (where applicable)

---

## EMAIL NOTIFICATIONS

All forms send email notifications to:
- Primary: info@digitalqatalyst.com
- CC: leads@digitalqatalyst.com

Email subjects follow pattern:
- Service Request: 🚀 New Service Request: {serviceName}
- Product Demo: 🎯 Product Demo Request - {productName}
- Tour Request: 🏢 Studio Tour Request - Digital Working Studios
- Consultation: 🚀 New Consultation Request - DigitalQatalyst

---

## LEAD SCORING SUMMARY

HIGH PRIORITY (immediate follow-up):
- Service Request (has budget/timeline)
- Product Demo (qualified interest)
- Consultation (direct engagement)

MEDIUM PRIORITY (nurture):
- Tour Request (physical engagement)
- Whitepaper (education stage)
- Waitlist (future opportunity)

LOW PRIORITY (automation):
- Newsletter (awareness stage)
- Enquiry (variable based on type)

---

## TECHNICAL REQUIREMENTS

VALIDATION:
- All required fields validated client-side
- Email format validation
- Phone number format validation where applicable
- Custom error messages per field

SUCCESS BEHAVIOR:
- Visual confirmation with checkmark icon
- Success message display
- Auto-redirect or form reset after 3-5 seconds
- Async email notifications

ERROR HANDLING:
- Network errors caught and displayed
- User-friendly error messages
- Retry capability maintained

---

Contact: info@digitalqatalyst.com
