# Whitepaper Access - Airtable Setup Guide

## Overview
This guide will help you set up an Airtable table to capture whitepaper access requests from your website.

## Step 1: Create a New Table in Airtable

1. Go to your Airtable base (the one with ID: `appOyDiwpGG2FfdAY`)
2. Create a new table called **"Whitepaper Access"** or **"Whitepaper Downloads"**

## Step 2: Create the Following Columns

Create these columns in your Airtable table with the **exact names** shown below:

| Column Name | Field Type | Description |
|-------------|------------|-------------|
| **Full Name** | Single line text | The user's full name |
| **Email** | Email | The user's email address |
| **Whitepaper Title** | Single line text | Title of the whitepaper accessed |
| **Whitepaper URL** | URL | Link to the whitepaper |
| **Access Date** | Date | Date when the whitepaper was accessed (YYYY-MM-DD) |
| **Access Timestamp** | Single line text | Full timestamp with time |
| **Status** | Single select | Status of the access (Options: "Accessed", "Followed Up", "Converted") |
| **Source** | Single line text | Where the request came from (e.g., "Website Article") |

### Optional Columns (Recommended)
You can add these additional columns for better tracking:

| Column Name | Field Type | Description |
|-------------|------------|-------------|
| **Follow Up Date** | Date | When to follow up with this lead |
| **Notes** | Long text | Any notes about this lead |
| **Lead Score** | Number | Score this lead (1-10) |
| **Contacted** | Checkbox | Whether you've contacted them |

## Step 3: Get Your Table ID

1. Open your new "Whitepaper Access" table in Airtable
2. Look at the URL in your browser. It will look like:
   ```
   https://airtable.com/appOyDiwpGG2FfdAY/tblXXXXXXXXXXXXXX/viwYYYYYYYYYYYYYY
   ```
3. Copy the part that starts with `tbl` (e.g., `tblXXXXXXXXXXXXXX`)
4. This is your **Table ID**

## Step 4: Update Your .env File

1. Open your `.env` file
2. Find the line that says:
   ```
   VITE_AIRTABLE_WHITEPAPER_TABLE_ID=YOUR_WHITEPAPER_TABLE_ID_HERE
   ```
3. Replace `YOUR_WHITEPAPER_TABLE_ID_HERE` with your actual Table ID:
   ```
   VITE_AIRTABLE_WHITEPAPER_TABLE_ID=tblXXXXXXXXXXXXXX
   ```
4. Save the file

## Step 5: Restart Your Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## Step 6: Test the Integration

1. Go to any article page on your website (e.g., `/dtmi/article/traditional-business-models-obsolete`)
2. Scroll down to the "Read the Full Whitepaper" section
3. Click the "Read Whitepaper" button
4. Fill in the form with test data
5. Submit the form
6. Check your Airtable table - you should see a new record!

## Example Airtable Record

After a user submits the form, you'll see a record like this:

| Full Name | Email | Whitepaper Title | Access Date | Status | Source |
|-----------|-------|------------------|-------------|--------|--------|
| John Doe | john@example.com | The Rise of Economy 4.0 | 2025-01-14 | Accessed | Website Article |

## Troubleshooting

### Error: "Missing Airtable configuration"
- Make sure you've added the `VITE_AIRTABLE_WHITEPAPER_TABLE_ID` to your `.env` file
- Restart your development server after updating `.env`

### Error: "Airtable API error: 422"
- Check that your column names match **exactly** (case-sensitive)
- Make sure the field types are correct

### Records not appearing in Airtable
- Verify your Table ID is correct
- Check the browser console for error messages
- Make sure your Airtable API key has write permissions

## Next Steps

### Set Up Automations (Optional)
You can create Airtable automations to:
1. Send a thank you email when someone accesses a whitepaper
2. Add them to your CRM or email marketing tool
3. Notify your sales team about new leads
4. Create follow-up tasks

### Create Views
Create different views in Airtable to organize your leads:
- **Recent Downloads** - Filter by Access Date (last 7 days)
- **High Priority** - Filter by Lead Score > 7
- **Need Follow Up** - Filter by Contacted = unchecked
- **By Whitepaper** - Group by Whitepaper Title

## Support

If you encounter any issues, check:
1. Browser console for error messages
2. Airtable API key permissions
3. Table ID is correct
4. Column names match exactly
