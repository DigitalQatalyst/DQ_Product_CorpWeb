# Form Placeholder Best Practices

## Overview
Placeholders should guide users on **what format** to enter, not just **what to enter**. They should be clear, helpful, and demonstrate the expected structure.

## Best Practices by Field Type

### 1. **Names (Personal/Company)**
❌ **Bad:** `"James"` or `"testcomp"`  
✅ **Good:** `"e.g., John Smith"` or `"e.g., Tech Solutions LLC"`

**Why:** Shows the expected format (full name vs. single name, company legal name format)

### 2. **Phone Numbers**
❌ **Bad:** `"012345678"`  
✅ **Good:** `"+971 50 123 4567"` or `"050-123-4567"` (match your locale format)

**Why:** Shows the exact format expected (country code, spacing, dashes)

### 3. **Email Addresses**
✅ **Current:** `"jimmy@gmail.com"` - This is good!  
✅ **Better:** `"name@company.com"` (more professional example)

### 4. **Company/Registration Numbers**
❌ **Bad:** `"COO2"` or `"1234567890"`  
✅ **Good:** `"e.g., CR-12345-2023"` or `"Format: XXXXX-XXXX"`

**Why:** Shows the expected structure (prefixes, dashes, year)

### 5. **Funding/Reference Numbers**
❌ **Bad:** `"FR12345678"`  
✅ **Good:** `"e.g., FR-2024-001234"` or `"Format: FR-YYYY-XXXXXX"`

**Why:** Shows the pattern (prefix-year-sequence)

### 6. **Currency/Amount Fields**
❌ **Bad:** `"50000"`  
✅ **Good:** `"50,000.00 AED"` or `"Enter amount in AED (e.g., 50,000.00)"`

**Why:** Shows currency, decimal format, and thousand separators

### 7. **Dates**
❌ **Bad:** `"2024-01-15"` (for text inputs)  
✅ **Good:** Use `type: "date"` instead of text, or `"DD/MM/YYYY"` if text

**Why:** Date pickers are better, but if text, show format clearly

### 8. **Optional Fields**
❌ **Bad:** `"no advice"`  
✅ **Good:** `"Leave blank if not applicable"` or `"Optional: e.g., Additional notes"`

**Why:** Makes it clear the field is optional and what to enter if needed

### 9. **Text Areas**
❌ **Bad:** `"test details"`  
✅ **Good:** `"Provide a brief description (2-3 sentences)"` or `"Describe the issue in detail..."`

**Why:** Sets expectations on length and content

### 10. **File Uploads**
✅ **Good:** Use `accept` attribute and `helperText` instead of placeholder
```typescript
{
  id: "TradeLicence",
  label: "Valid Trade License",
  type: "file",
  required: true,
  accept: ".pdf,.doc,.docx",
  helperText: "Accepted formats: PDF, DOC, DOCX (Max 5MB)"
}
```

## Format Patterns by Field Type

### Phone Numbers (UAE Format)
- **Placeholder:** `"+971 50 123 4567"`
- **Pattern:** `^\+971\s?\d{2}\s?\d{3}\s?\d{4}$`
- **Helper Text:** "Include country code +971"

### Company Numbers (UAE)
- **Placeholder:** `"e.g., CR-12345-2023"`
- **Pattern:** `^CR-\d{5}-\d{4}$`
- **Helper Text:** "Format: CR-XXXXX-YYYY"

### Funding Numbers
- **Placeholder:** `"e.g., FR-2024-001234"`
- **Pattern:** `^FR-\d{4}-\d{6}$`
- **Helper Text:** "Format: FR-YYYY-XXXXXX"

### Currency (AED)
- **Placeholder:** `"50,000.00"`
- **Helper Text:** "Enter amount in AED (no currency symbol needed)"

## Implementation Recommendations

### Combine Placeholder + HelperText
```typescript
{
  id: "mobileNumber",
  label: "Mobile Number",
  type: "tel",
  required: true,
  placeholder: "+971 50 123 4567",
  helperText: "Include country code (+971) and 9-digit mobile number",
  validation: {
    pattern: "^\\+971\\s?\\d{2}\\s?\\d{3}\\s?\\d{4}$",
    message: "Invalid UAE mobile number format"
  }
}
```

### Use Realistic Examples
- ✅ `"e.g., John Smith"` (not `"James"`)
- ✅ `"e.g., Tech Solutions LLC"` (not `"testcomp"`)
- ✅ `"e.g., john.smith@company.ae"` (not `"jimmy@gmail.com"`)

### Show Expected Structure
- ✅ `"Format: FR-YYYY-XXXXXX"` for funding numbers
- ✅ `"e.g., CR-12345-2023"` for company numbers
- ✅ `"+971 50 123 4567"` for phone numbers

### For Optional Fields
- ✅ `"Optional: Leave blank if not applicable"`
- ✅ `"Optional: e.g., Additional notes or comments"`

### For Complex Fields
Use `helperText` for additional guidance:
```typescript
{
  id: "projectName",
  label: "Project Name",
  type: "text",
  placeholder: "e.g., Green Energy Solar Initiative",
  helperText: "Enter the official project name as it appears in your business plan"
}
```

## Regional Considerations (UAE)

### Phone Numbers
- Format: `+971 XX XXX XXXX`
- Examples: `+971 50 123 4567`, `+971 55 987 6543`
- Pattern: `^\+971\s?\d{2}\s?\d{3}\s?\d{4}$`

### Company Numbers
- Format: `CR-XXXXX-YYYY` (Commercial Registration)
- Or: `License-Number/Year`
- Helper text: "Enter your UAE commercial registration number"

### Currency
- Always specify AED
- Use comma separators: `50,000.00`
- Helper text: "Amount in UAE Dirhams (AED)"

## Examples: Before vs. After

### Example 1: Mobile Number
**Before:**
```typescript
placeholder: "012345678"
```

**After:**
```typescript
placeholder: "+971 50 123 4567",
helperText: "Include country code (+971) followed by your 9-digit mobile number"
```

### Example 2: Company Number
**Before:**
```typescript
placeholder: "COO2"
```

**After:**
```typescript
placeholder: "e.g., CR-12345-2023",
helperText: "Format: CR-XXXXX-YYYY (Commercial Registration Number)"
```

### Example 3: Funding Number
**Before:**
```typescript
placeholder: "FR12345678"
```

**After:**
```typescript
placeholder: "e.g., FR-2024-001234",
helperText: "Format: FR-YYYY-XXXXXX (Funding Request Number)"
```

### Example 4: Amount
**Before:**
```typescript
placeholder: "50000"
```

**After:**
```typescript
placeholder: "50,000.00",
helperText: "Enter amount in AED (UAE Dirhams)"
```

### Example 5: Optional Text Field
**Before:**
```typescript
placeholder: "no advice"
```

**After:**
```typescript
placeholder: "Optional: Additional advice or comments",
helperText: "Leave blank if not applicable"
```

## Quick Reference Checklist

- [ ] Show format/pattern (not just examples)
- [ ] Include units/currency where applicable
- [ ] Use realistic examples (not test data)
- [ ] Add helperText for complex fields
- [ ] Match locale-specific formats (UAE phone numbers, etc.)
- [ ] Make optional fields clear
- [ ] Use format hints for structured data (IDs, numbers)
- [ ] Consider date pickers instead of text inputs for dates
- [ ] Use file type restrictions and helper text for uploads

