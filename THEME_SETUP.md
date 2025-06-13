# Theme System Documentation

## Overview
This app now supports automatic system theme detection with manual override options. The theme system will:

1. **Default to System Theme**: Automatically detects and follows your operating system's theme preference
2. **Manual Override**: Users can manually switch between Light, Dark, and System themes
3. **Persistent Choice**: User's theme preference is saved and remembered across sessions

## Features

### System Theme Detection
- Automatically detects if your system is in light or dark mode
- Updates the app theme in real-time when you change your system theme
- Works on macOS, Windows, and Linux

### Manual Theme Control
- **Light Theme**: Forces the app to use light mode regardless of system setting
- **Dark Theme**: Forces the app to use dark mode regardless of system setting  
- **System Theme**: Follows your operating system's theme preference (default)

### Visual Indicators
- **Theme Status Badge**: Shows current active theme in top-left corner
- **Theme Toggle Button**: Dropdown menu in top-right corner to change themes

## How It Works

### Components Added
1. **ThemeProvider** (`src/components/theme-provider.tsx`): Wraps the app with theme context
2. **ThemeToggle** (`src/components/theme-toggle.tsx`): Dropdown button to switch themes
3. **ThemeStatus** (`src/components/theme-status.tsx`): Badge showing current theme status
4. **useThemeInfo** (`src/hooks/use-theme-info.ts`): Custom hook for theme information

### Configuration
- Uses `next-themes` library for theme management
- Tailwind CSS configured with proper dark mode classes
- CSS custom properties for consistent theming across components

### Implementation Details
- Theme preference stored in localStorage
- No flash of wrong theme on page load
- Smooth transitions between themes
- Proper TypeScript support

## Usage for Developers

### Using the Theme in Components
```tsx
import { useTheme } from "next-themes"

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div className="bg-background text-foreground">
      Current theme: {resolvedTheme}
    </div>
  )
}
```

### Using Theme-Aware Colors
```tsx
// Use semantic color classes that adapt to theme
<div className="bg-card text-card-foreground border border-border">
  <p className="text-muted-foreground">Secondary text</p>
  <button className="bg-primary text-primary-foreground">Primary button</button>
</div>
```

### Checking Theme State
```tsx
import { useThemeInfo } from "../hooks/use-theme-info"

function MyComponent() {
  const { isLightMode, isDarkMode, isSystemTheme } = useThemeInfo()
  
  if (isSystemTheme) {
    return <span>Following system theme ({isLightMode ? 'light' : 'dark'})</span>
  }
  
  return <span>Manual theme: {isLightMode ? 'Light' : 'Dark'}</span>
}
```

## Testing

### Test System Theme Detection
1. Change your operating system's theme (System Preferences > Appearance on macOS)
2. Refresh the app - it should automatically match your system theme
3. Toggle between light/dark in system settings to see real-time updates

### Test Manual Override
1. Click the theme toggle button (top-right corner)
2. Select "Light" - app should switch to light mode regardless of system
3. Select "Dark" - app should switch to dark mode regardless of system  
4. Select "System" - app should follow your system theme again

### Test Persistence
1. Change to a specific theme (Light or Dark)
2. Refresh the page
3. Theme should remain the same as your last selection

## Browser Support
- All modern browsers that support CSS custom properties
- `prefers-color-scheme` media query for system theme detection
- localStorage for theme persistence 