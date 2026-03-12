# DQ Color Usage Guide

## Color Hierarchy & Usage Strategy

### Primary Colors

#### 1. **Orange (#FF6B4D)** - Primary Brand Color
**Use for:**
- Primary CTAs (Get in Touch, Sign Up, Submit forms)
- Critical action buttons
- Key highlights requiring immediate attention
- Links and interactive elements on marketing pages
- Important notifications and alerts

**DO NOT use for:**
- Navigation active states
- Tab selections
- General UI selections
- Background fills for large areas

**Examples:**
```jsx
// ✅ Good - Primary CTA
<button className="bg-primary text-white hover:bg-primary-600">
  Get in Touch
</button>

// ✅ Good - Important action
<button className="bg-primary text-white">
  Save Changes
</button>

// ❌ Bad - Navigation active state
<button className="bg-primary text-white"> {/* Use navy instead */}
  Dashboard
</button>
```

---

#### 2. **Blue (#2E4580)** - Secondary Brand Color
**Use for:**
- Navigation active/selected states (sidebar, tabs) - Use `secondary-600`
- Text headings and important copy - Use `secondary-900`
- Professional, authoritative elements
- Selected states in forms and controls
- Dashboard navigation

**Examples:**
```jsx
// ✅ Good - Active navigation (lighter blue)
<button className="bg-secondary-600 text-white">
  My Dashboard
</button>

// ✅ Good - Selected tab (lighter blue)
<button className="bg-secondary-600 text-white">
  Personal Info
</button>

// ✅ Good - Heading (dark navy for text)
<h1 className="text-secondary-900">Welcome back</h1>
```

---

### Supporting Colors

#### 3. **Teal (#00D4C5)**
**Use for:**
- Success states and confirmations
- Positive metrics and growth indicators
- Secondary CTAs that are less critical
- Feature highlights

```jsx
// ✅ Success message
<div className="bg-teal-light text-teal-dark">
  Settings saved successfully!
</div>
```

---

#### 4. **Purple (#8B5CF6)**
**Use for:**
- Premium features
- Special content or badges
- User avatars and profile elements
- Accent elements for variety

```jsx
// ✅ Premium badge
<span className="bg-purple text-white">Premium</span>
```

---

### Neutral Colors

#### Gray Scale
**Use for:**
- Body text: `text-gray-700`, `text-gray-900`
- Borders: `border-gray-200`, `border-gray-300`
- Backgrounds: `bg-gray-50`, `bg-gray-100`
- Disabled states: `text-gray-400`, `bg-gray-200`
- Hover states: `hover:bg-gray-50`

---

## Component-Specific Guidelines

### Navigation & Tabs
- **Active state:** Medium blue (`bg-secondary-600 text-white`)
- **Hover state:** Light gray (`hover:bg-gray-50`)
- **Default state:** Gray text (`text-gray-700`)

### Buttons
- **Primary CTA:** Orange (`bg-primary text-white hover:bg-primary-600`)
- **Secondary:** Gray (`bg-gray-100 text-gray-700 hover:bg-gray-200`)
- **Destructive:** Red (`bg-red-600 text-white hover:bg-red-700`)
- **Success:** Teal (`bg-teal text-white hover:bg-teal-dark`)

### Form Controls
- **Selected/Active:** Medium blue (`bg-secondary-600`)
- **Focus ring:** Orange (`focus:ring-primary`)
- **Toggle ON:** Orange (`bg-primary`)
- **Toggle OFF:** Gray (`bg-gray-200`)

### Status Indicators
- **Success:** Green (`bg-green-100 text-green-700`)
- **Warning:** Yellow (`bg-yellow-100 text-yellow-700`)
- **Error:** Red (`bg-red-100 text-red-700`)
- **Info:** Blue (`bg-blue-100 text-blue-700`)

### Cards & Stats
Use variety for visual interest:
- Orange: `bg-orange-100 text-orange-600`
- Blue: `bg-blue-100 text-blue-600`
- Purple: `bg-purple-100 text-purple-600`
- Green: `bg-green-100 text-green-600`

---

## Color Shades Reference

### Primary Orange Shades
```
50:  #FFF4F2  - Very light backgrounds
100: #FFE8E4  - Light backgrounds
200: #FFD1C9  - Subtle highlights
300: #FFB5A8  - Borders, dividers
400: #FF8D7A  - Hover states
500: #FF6B4D  - Main brand color (DEFAULT)
600: #FF4D2B  - Active/pressed states
700: #E63D1A  - Dark accents
800: #C02F0F  - Very dark
900: #8A2109  - Darkest
```

### Secondary Navy Shades
```
50:  #F0F2F9  - Very light backgrounds
100: #E1E5F3  - Light backgrounds
200: #C3CBE7  - Subtle highlights
300: #9BA8D6  - Borders, dividers
400: #6B7DBF  - Muted elements
500: #4A5FA8  - Medium navy
600: #2E4580  - Darker navy
700: #1F2F5C  - Dark navy
800: #141F42  - Very dark navy
900: #030F35  - Main secondary color (DEFAULT)
```

---

## Quick Reference

| Element | Color | Class |
|---------|-------|-------|
| Primary CTA | Orange | `bg-primary text-white` |
| Active Navigation | Medium Blue | `bg-secondary-600 text-white` |
| Selected Tab | Medium Blue | `bg-secondary-600 text-white` |
| Hover State | Light Gray | `hover:bg-gray-50` |
| Success | Teal | `bg-teal text-white` |
| Error | Red | `bg-red-600 text-white` |
| Body Text | Dark Gray | `text-gray-700` |
| Headings | Dark Navy | `text-secondary-900` |

---

## Migration Checklist

When updating existing components:

- [ ] Replace `bg-primary` in navigation/tabs with `bg-secondary-600`
- [ ] Keep `bg-primary` only for CTAs and critical actions
- [ ] Use gray hover states (`hover:bg-gray-50`) for navigation
- [ ] Use appropriate status colors (green, red, yellow) for alerts
- [ ] Ensure sufficient contrast for accessibility (WCAG AA minimum)
- [ ] Test color combinations in both light and dark contexts

---

## Accessibility Notes

- Orange on white: ✅ WCAG AA compliant
- Navy on white: ✅ WCAG AAA compliant
- White on orange: ✅ WCAG AA compliant
- White on navy: ✅ WCAG AAA compliant
- Always test color combinations for sufficient contrast
- Don't rely on color alone to convey information
