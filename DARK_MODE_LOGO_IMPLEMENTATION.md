# Dark Mode Logo Implementation

## Overview
Implemented adaptive logo support that automatically switches between light and dark versions based on the user's theme preference.

## Changes Made

### 1. Tailwind Configuration
- **File**: `tailwind.config.js`
- **Change**: Added `darkMode: 'class'` to enable class-based dark mode
- This allows components to use `dark:` prefix for dark mode styles

### 2. Dark Mode Hook
- **File**: `src/hooks/useDarkMode.ts`
- **Purpose**: Centralized dark mode state management
- **Features**:
  - Detects system theme preference
  - Persists user preference in localStorage
  - Applies `dark` class to HTML element
  - Provides `toggleDarkMode` function for theme switching
  - Listens for system theme changes

### 3. Adaptive Favicon
- **Files**: 
  - Uses `/images/DQ Logo White.svg` for dark mode
  - Uses `/images/DQ Logo Dark.svg` for light mode
  - `public/favicon-theme.js` - Script that switches favicons
- **Features**:
  - Uses the same logo files as the header navigation
  - Automatically switches favicon based on theme
  - Syncs with localStorage dark mode preference
  - Falls back to system preference
  - Updates in real-time when theme changes

### 4. Logo Assets
The application now uses two logo variants:
- **Light Mode**: `/images/DQ Logo Dark.svg` (dark logo on light background)
- **Dark Mode**: `/images/DQ Logo White.svg` (white logo on dark background)

### 5. Updated Components

#### Main Header (`src/components/Header/Header.tsx`)
- Imports `useDarkMode` hook
- Dynamically switches logo based on `isDarkMode` state
- Removed hardcoded filter that inverted the logo

#### DTMI Header (`src/pages/dtmi/components/Header.tsx`)
- Imports `useDarkMode` hook
- Dynamically switches logo based on theme
- Removed hardcoded filter

#### MyDQ Page (`src/pages/MyDQPage.tsx`)
- Imports `useDarkMode` hook
- Adaptive logo in header
- Removed hardcoded filter

## How It Works

1. **Initial Load**: 
   - The hook checks localStorage for saved preference, falls back to system preference
   - The favicon script runs immediately and sets the appropriate favicon
2. **Theme Application**: The `dark` class is added/removed from `<html>` element
3. **Logo Selection**: Components use conditional rendering to show appropriate logo
4. **Favicon Switching**: The favicon-theme.js script monitors theme changes and updates the browser tab icon
5. **Persistence**: User preference is saved to localStorage
6. **System Sync**: Automatically updates when system theme changes (if no user preference set)
7. **Real-time Updates**: Favicon updates every 500ms to catch localStorage changes

## Usage

To use dark mode in other components:

```tsx
import { useDarkMode } from '../hooks/useDarkMode';

function MyComponent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div>
      <img 
        src={isDarkMode ? "/images/logo-white.svg" : "/images/logo-dark.svg"} 
        alt="Logo" 
      />
      <button onClick={toggleDarkMode}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## Future Enhancements

1. Add a theme toggle button in the UI (Settings page or header)
2. Extend dark mode styles to all components using Tailwind's `dark:` classes
3. Add smooth transitions between theme changes
4. Support for additional themes (e.g., high contrast, custom brand themes)

## Testing

To test the implementation:
1. Open browser DevTools
2. Toggle system theme preference
3. Verify logo changes automatically
4. Check localStorage for `darkMode` key
5. Refresh page and verify preference persists

## Browser Support

- Modern browsers with `matchMedia` support
- localStorage support required for persistence
- Falls back gracefully to light mode if features unavailable
