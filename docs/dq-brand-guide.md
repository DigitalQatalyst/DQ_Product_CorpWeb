# DigitalQatalyst Brand Guide

## Brand Identity

**Company Name:** DigitalQatalyst  
**Short Name:** DQ  
**Tagline:** Catalyzing Digital Transformation

## Color Palette

### Primary Color (Coral/Orange-Red)
Main brand color used for CTAs, accents, and highlights.

- **primary-500** (Main): `#FF6B4D` 
- primary-50: `#FFF4F2` (Lightest)
- primary-100: `#FFE8E4`
- primary-200: `#FFD1C9`
- primary-300: `#FFB5A8`
- primary-400: `#FF8D7A`
- primary-600: `#FF4D2B`
- primary-700: `#E63D1A`
- primary-800: `#C02F0F`
- primary-900: `#8A2109` (Darkest)

### Secondary Color (Deep Navy Blue)
Used for surfaces, secondary buttons, and professional elements.

- **secondary-900** (Main): `#030F35`
- secondary-50: `#F0F2F9` (Lightest)
- secondary-100: `#E1E5F3`
- secondary-200: `#C3CBE7`
- secondary-300: `#9BA8D6`
- secondary-400: `#6B7DBF`
- secondary-500: `#4A5FA8`
- secondary-600: `#2E4580`
- secondary-700: `#1F2F5C`
- secondary-800: `#141F42`

### Accent Colors
Additional colors for variety and visual interest.

**Teal** (Fresh, Modern)
- teal: `#00D4C5`
- teal-dark: `#00A89C`
- teal-light: `#66E8DE`

**Purple** (Innovation, Premium)
- purple: `#8B5CF6`
- purple-dark: `#6D28D9`
- purple-light: `#A78BFA`

## Usage Guidelines

### Primary Color (#FF6B4D)
- ✅ Main CTA buttons
- ✅ Important links and highlights
- ✅ Active states
- ✅ Progress indicators
- ✅ Key icons and badges

### Secondary Color (#030F35)
- ✅ Headers and navigation
- ✅ Footer backgrounds
- ✅ Secondary buttons
- ✅ Text on light backgrounds
- ✅ Professional sections

### Teal & Purple
- ✅ Category differentiation
- ✅ Data visualization
- ✅ Feature highlights
- ✅ Decorative elements

## Typography

**Display Font:** Plus Jakarta Sans (sans-serif)  
Used for: Headlines, hero text, section titles

**Body Font:** DM Sans (sans-serif)  
Used for: Body text, UI elements, forms

## Tailwind Usage Examples

```jsx
// Primary button
<button className="bg-primary hover:bg-primary-600 text-white">
  Get Started
</button>

// Secondary button
<button className="bg-secondary hover:bg-secondary-800 text-white">
  Learn More
</button>

// Accent highlight
<span className="text-primary font-semibold">
  Digital Transformation
</span>

// Card with secondary background
<div className="bg-secondary-50 border-l-4 border-primary">
  Content here
</div>

// Gradient hero
<div className="bg-gradient-to-r from-secondary-900 to-secondary-700">
  Hero content
</div>
```

## Color Combinations

### High Contrast (Accessibility)
- White text on `secondary-900` (#030F35)
- White text on `primary-500` (#FF6B4D)
- `secondary-900` text on white

### Subtle Backgrounds
- `primary-50` for light primary sections
- `secondary-50` for light secondary sections
- `gray-50` for neutral sections

### Borders & Dividers
- `primary-200` for primary-themed borders
- `secondary-200` for secondary-themed borders
- `gray-200` for neutral dividers
