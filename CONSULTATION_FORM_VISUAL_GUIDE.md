# Consultation Form - Visual Guide

## Before & After

### Before (No Close Button)
```
┌─────────────────────────────────────────┐
│  Schedule a free consultation!          │
│                                          │
│  [Name Input]        [Email Input]      │
│  [Company]           [Phone]            │
│  [Sector]            [Interest]         │
│  [Message Textarea]                     │
│                                          │
│  [Submit Request Button]                │
└─────────────────────────────────────────┘
```

### After (With Close Button)
```
┌─────────────────────────────────────────┐
│  Schedule a free consultation!      [X] │ ← Close Button
│                                          │
│  [Name Input]        [Email Input]      │
│  [Company]           [Phone]            │
│  [Sector]            [Interest]         │
│  [Message Textarea]                     │
│                                          │
│  [Submit Request Button]                │
└─────────────────────────────────────────┘
```

## Close Button States

### Default State
```
┌────┐
│ X  │  Gray icon, subtle
└────┘
```

### Hover State
```
┌────┐
│ X  │  Darker icon, light gray background
└────┘
```

### Focus State (Keyboard)
```
┌────┐
│ X  │  Focus ring visible
└────┘
```

## User Interaction Flow

### Scenario 1: Empty Form
```
User clicks [X]
    ↓
Form closes immediately
    ↓
No confirmation needed
```

### Scenario 2: Form with Data
```
User clicks [X]
    ↓
Confirmation dialog appears:
"You have unsaved changes. 
 Are you sure you want to close the form?"
    ↓
User clicks "OK"
    ↓
Form resets and closes
```

### Scenario 3: After Successful Submission
```
Form shows success message
    ↓
User clicks [X]
    ↓
Form closes immediately
    ↓
No confirmation needed
```

## Implementation Examples

### Example 1: Modal Popup

```tsx
function MyPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Get Consultation
      </button>

      {showModal && (
        <div className="modal-backdrop">
          <ConsultationFormCard
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </>
  );
}
```

**Visual:**
```
┌─────────────────────────────────────────┐
│ ████████████ Modal Backdrop ████████████│
│ ████                                ████│
│ ████  ┌──────────────────────┐    ████│
│ ████  │ Consultation Form [X]│    ████│
│ ████  │                      │    ████│
│ ████  │ [Form Fields]        │    ████│
│ ████  │                      │    ████│
│ ████  │ [Submit Button]      │    ████│
│ ████  └──────────────────────┘    ████│
│ ████████████████████████████████████████│
└─────────────────────────────────────────┘
```

### Example 2: Slide-in Sidebar

```tsx
function MyPage() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <button onClick={() => setShowSidebar(true)}>
        Contact Us
      </button>

      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <ConsultationFormCard
          onClose={() => setShowSidebar(false)}
        />
      </div>
    </>
  );
}
```

**Visual:**
```
┌─────────────────────────────────────────┐
│ Main Page Content                       │
│                                          │
│                    ┌────────────────────┤
│                    │ Form Title     [X] │
│                    │                    │
│                    │ [Form Fields]      │
│                    │                    │
│                    │ [Submit]           │
│                    └────────────────────┤
│                                          │
└─────────────────────────────────────────┘
```

### Example 3: Embedded (No Close Button)

```tsx
function ServicePage() {
  return (
    <div>
      <h1>Our Services</h1>
      <p>Service description...</p>
      
      <ConsultationFormCard
        showCloseButton={false}
        defaultSector="experience-4.0"
      />
    </div>
  );
}
```

**Visual:**
```
┌─────────────────────────────────────────┐
│ Our Services                             │
│                                          │
│ Service description and details...       │
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ Schedule a free consultation!        ││
│ │                                      ││
│ │ [Form Fields]                        ││
│ │                                      ││
│ │ [Submit Request]                     ││
│ └──────────────────────────────────────┘│
│                                          │
└─────────────────────────────────────────┘
```

## Accessibility Features

### Keyboard Navigation
```
Tab → Focus on close button
Enter/Space → Trigger close action
Escape → (Future: Close form)
```

### Screen Reader Announcement
```
"Close form button"
```

### Focus Indicator
```
┌────────┐
│  [X]   │ ← Visible focus ring
└────────┘
```

## Responsive Design

### Desktop (>768px)
```
┌─────────────────────────────────────────┐
│  Title                              [X] │
│                                          │
│  [Name]          [Email]                │
│  [Company]       [Phone]                │
│  [Sector]        [Interest]             │
│  [Message]                               │
│  [Submit]                                │
└─────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│  Title           [X] │
│                      │
│  [Name]              │
│  [Email]             │
│  [Company]           │
│  [Phone]             │
│  [Sector]            │
│  [Interest]          │
│  [Message]           │
│  [Submit]            │
└──────────────────────┘
```

## Color Scheme

### Close Button Colors

**Default:**
- Icon: `#9CA3AF` (gray-400)
- Background: Transparent

**Hover:**
- Icon: `#4B5563` (gray-600)
- Background: `#F3F4F6` (gray-100)

**Focus:**
- Ring: `#D1D5DB` (gray-300)

## Animation

### Close Button Hover
```
Duration: 200ms
Easing: ease-in-out
Properties: color, background-color
```

### Modal Entry (if used in modal)
```
Duration: 300ms
Easing: ease-out
Transform: scale(0.95) → scale(1)
Opacity: 0 → 1
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | Latest  | ✅ Full |
| Firefox | Latest  | ✅ Full |
| Safari  | Latest  | ✅ Full |
| Edge    | Latest  | ✅ Full |
| Mobile  | Latest  | ✅ Full |

## Touch Targets

### Close Button Size
```
Minimum: 44x44px (WCAG AAA)
Actual: 44x44px (including padding)
```

### Touch Area
```
┌──────────┐
│          │
│    X     │  44px × 44px
│          │
└──────────┘
```

## Common Use Cases

### ✅ Use Close Button When:
- Form is in a modal/popup
- Form is in a sidebar
- Form is fullscreen
- User needs a way to dismiss

### ⚠️ Consider Hiding When:
- Form is embedded in page
- User can navigate away normally
- Form is the main page content

### ❌ Don't Use When:
- Form submission is critical
- No alternative navigation exists
- Would confuse users

## Tips for Developers

1. **Always provide onClose handler** when showing close button
2. **Test with keyboard** to ensure accessibility
3. **Consider mobile users** - ensure touch target is large enough
4. **Add confirmation** for forms with important data
5. **Reset form state** when closing

## Tips for Designers

1. **Keep it subtle** - don't distract from form
2. **Make it discoverable** - visible but not prominent
3. **Provide feedback** - hover and focus states
4. **Consider context** - modal vs embedded
5. **Test on mobile** - ensure it's easy to tap

---

**Last Updated:** 2026-02-20  
**Component:** ConsultationFormCard  
**Feature:** Close Button Enhancement
