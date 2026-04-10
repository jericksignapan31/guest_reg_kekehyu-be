# Responsive Design Documentation - Kekehyu Hotel Guest Registration

## Overview
This application implements a **mobile-first responsive design** using CSS media queries and CSS variables. All components adapt seamlessly across mobile phones, tablets, and desktop displays.

---

## 📐 Breakpoint Strategy

### Mobile-First Approach
We start with base styles for mobile (480px and below), then progressively enhance for larger screens.

```
Base (480px and below)
  ↓
Tablet (481px - 767px)
  ↓
Desktop (768px - 1023px)
  ↓
Large Desktop (1024px - 1439px)
  ↓
Extra Large (1440px+)
```

---

## 📏 Breakpoints Reference

| Breakpoint | Width | Device Type | Use Case |
|-----------|-------|-------------|----------|
| 480px (max) | 320-480px | Mobile Portrait | iPhone SE, small phones |
| 481-768px | 481-768px | Tablet Portrait | iPad Mini, small tablets |
| 768px+ | 768px+ | Tablet/Desktop | iPad, tablets, small laptops |
| 1024px+ | 1024px+ | Desktop | Laptops, monitors |
| 1440px+ | 1440px+ | Extra Large | Large monitors, TVs |

---

## 🎨 CSS Variables System

### Colors
```scss
--primary-color: #667eea;          // Main brand color
--primary-dark: #5568d3;           // Darker variant
--accent-color: #f093fb;           // Accent/secondary
--success-color: #4caf50;          // Success messages
--error-color: #f44336;            // Error messages
--warning-color: #ff9800;          // Warning messages
--info-color: #2196f3;             // Info messages
--light-bg: #f5f5f5;               // Light background
--dark-bg: #121212;                // Dark background (dark mode)
--text-primary: #333333;           // Primary text
--text-secondary: #666666;         // Secondary text
```

### Spacing
```scss
--spacing-xs: 0.25rem;     // 4px
--spacing-sm: 0.5rem;      // 8px
--spacing-md: 1rem;        // 16px
--spacing-lg: 1.5rem;      // 24px
--spacing-xl: 2rem;        // 32px
--spacing-2xl: 3rem;       // 48px
```

**Responsive Spacing** (adjusts per breakpoint):
- Mobile: Smaller gaps (8px, 12px)
- Tablet: Medium gaps (16px, 24px)
- Desktop: Larger gaps (24px, 32px)

### Animations
```scss
--transition-fast: 150ms ease-out;     // Quick interactions
--transition-normal: 300ms ease-out;   // Standard animations
--transition-slow: 500ms ease-out;     // Slow transitions
```

---

## 📱 Mobile (480px and Below)

### Font Sizes
```scss
html { font-size: 14px; }     // Smaller base font
h1 { font-size: 1.8rem; }     // 28.8px
h2 { font-size: 1.5rem; }     // 21px
p { font-size: 0.9rem; }      // 12.6px
```

### Spacing
- Padding: 8px - 12px (reduced)
- Margins: 8px - 16px (compact)
- Gaps: 8px (tight layout)

### Layout
```scss
// Single column layout
.card {
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
}

// Stacking elements
.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

### Touch Optimization
```scss
// Larger touch targets
button { 
  min-height: 44px;  // iOS standard
  min-width: 44px;
}

// Prevent iOS zoom on input focus
input, button, select {
  font-size: 16px !important;
}
```

---

## 📱 Tablet (481px - 768px)

### Font Sizes
```scss
html { font-size: 15px; }
h1 { font-size: 1.6rem; }     // 24px
p { font-size: 0.95rem; }     // 14.25px
```

### Layout
```scss
// Two-column grid
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
```

### Spacing
- Padding: 12px - 16px
- Margins: 16px - 24px

---

## 💻 Desktop (768px+)

### Font Sizes
```scss
html { font-size: 16px; }     // Standard size
h1 { font-size: 2rem; }       // 32px
p { font-size: 1rem; }        // 16px
```

### Layout
```scss
// Three-column grid
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

// Sidebar layout
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}
```

### Spacing
- Padding: 16px - 24px
- Margins: 24px - 32px

---

## 🖥️ Large Desktop (1024px+)

### Font Sizes
```scss
html { font-size: 18px; }
h1 { font-size: 2.5rem; }
```

### Layout
```scss
// Four-column grid for dashboards
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

// Wider container
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

---

## 📐 Extra Large (1440px+)

### Optimization
```scss
// Maximum content width
.container {
  max-width: 1400px;
  margin: 0 auto;
}

// Generous spacing
--spacing-lg: 2rem;
--spacing-xl: 2.5rem;
--spacing-2xl: 3rem;
```

---

## 🌙 Dark Mode Implementation

**Activation**: User's OS-level dark mode preference

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #7c8fea;
    --dark-bg: #121212;
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
    --light-bg: #1e1e1e;
  }

  body {
    background-color: var(--dark-bg);
    color: var(--text-primary);
  }

  // Alert colors adjust for dark mode
  .alert-warning {
    background-color: rgba(255, 152, 0, 0.1);
    color: #ffb74d;
  }
}
```

### Supported Devices
- Windows: Settings > Personalization > Colors > Dark
- macOS: System Preferences > General > Dark
- iOS: Settings > Display & Brightness > Dark
- Android: Settings > Display > Dark Theme

---

## ♿ Accessibility Features

### Reduced Motion
```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**When Active**:
- Animations removed for users sensitive to motion
- Transitions become instant
- Smooth behavior disabled

### High Contrast
```scss
@media (prefers-contrast: more) {
  :root {
    --primary-color: #4a2c8e;     // Darker for more contrast
    --text-primary: #000000;
    --text-secondary: #333333;
  }
}
```

---

## 🖨️ Print Styles

```scss
@media print {
  button, [role="button"] {
    display: none;              // Hide buttons
  }

  .card {
    page-break-inside: avoid;   // Keep cards together
    border: 1px solid #ccc;
  }

  body {
    background: white;
    color: black;
    font-size: 12pt;
  }
}
```

---

## 📱 Landscape Mode

Special handling for mobile devices in landscape:

```scss
@media (max-height: 500px) and (orientation: landscape) {
  html { font-size: 13px; }     // Smaller font
  
  .card { padding: 0.5rem; }   // Reduced padding
  
  [role="navigation"] {
    max-height: 40px;           // Compact header
  }
}
```

---

## 🔍 High DPI / Retina Displays

Optimization for 2x pixel density screens:

```scss
@media (min-device-pixel-ratio: 2) {
  // Use higher resolution images
  .logo {
    image-set(
      url(logo.png) 1x,
      url(logo@2x.png) 2x
    );
  }

  // Adjust borders for crisp appearance
  .border {
    border-width: 1px;
  }
}
```

---

## 🔐 Safe Area Insets

Support for notched devices (iPhone X, newer):

```scss
body {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

**Affected Devices**:
- iPhone 12, 13, 14, 15 (with notch)
- Some Android phones with notches
- Foldable devices

---

## 🎯 Component Responsive Strategy

### Navigation
```scss
// Mobile: Hamburger menu
@media (max-width: 768px) {
  nav { display: none; }           // Hidden by default
  .hamburger { display: block; }   // Show menu button
}

// Desktop: Full navigation
@media (min-width: 769px) {
  nav { display: flex; }
  .hamburger { display: none; }
}
```

### Cards Grid
```scss
// Mobile: 1 column
@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

// Tablet: 2 columns
@media (481px) and (max-width: 1023px) {
  .card-grid {
    grid-template-columns: 1fr 1fr;
  }
}

// Desktop: 3 columns
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### Forms
```scss
// Mobile: Stack inputs
@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
  }
}

// Desktop: Side-by-side
@media (min-width: 768px) {
  .form-row {
    flex-direction: row;
  }
}
```

---

## 🧪 Testing Checkpoints

### Mobile (iPhone 12 - 390px)
- [ ] Navigation stacks vertically
- [ ] Text is readable (14-16px)
- [ ] Touch targets are 44px+ minimum
- [ ] No horizontal scroll

### Tablet (iPad - 768px)
- [ ] Two-column layout works
- [ ] Images scale appropriately
- [ ] Spacing is balanced
- [ ] No excessive white space

### Desktop (1024px)
- [ ] Multi-column grids active
- [ ] Maximum comfortable width
- [ ] All content visible
- [ ] No crowded elements

### Large (1440px+)
- [ ] Container width capped
- [ ] Generous spacing
- [ ] Professional layout
- [ ] Content not stretched

### Landscape (Max Height 500px)
- [ ] Header compact
- [ ] Content still accessible
- [ ] No content cut off
- [ ] Scroll works smoothly

### Dark Mode
- [ ] Text readable (#e0e0e0 on dark)
- [ ] Colors adjusted
- [ ] No white backgrounds
- [ ] Icons visible

---

## 🚀 Performance Tips

1. **Load appropriate images**:
   ```html
   <img srcset="small.jpg 480px, large.jpg 1024px" src="large.jpg" />
   ```

2. **Use CSS variables for theming**:
   - Easier maintenance
   - Smaller file size
   - Dynamic theme switching

3. **Mobile-first CSS**:
   - Smaller base CSS
   - Add features progressively
   - Better performance

4. **Minimize media query breakpoints**:
   - 4-5 breakpoints optimal
   - Reduces CSS file size
   - Easier to maintain

---

## 📚 Useful Tools

- [Responsively App](https://responsively.app/) - Test multiple viewports
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Mobile emulation
- [Can I Use](https://caniuse.com/) - Browser support checking
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit

---

## 🔧 SCSS Mixins (Useful for Future Enhancement)

```scss
// Media query mixin for DRY code
@mixin mobile-only {
  @media (max-width: 480px) {
    @content;
  }
}

@mixin tablet-up {
  @media (min-width: 481px) {
    @content;
  }
}

// Usage:
.card {
  padding: 1rem;
  
  @include mobile-only {
    padding: 0.5rem;
  }
  
  @include tablet-up {
    padding: 1.5rem;
  }
}
```

---

## ✅ Responsive Design Checklist

- ✅ Mobile-first approach (base for 480px)
- ✅ Font size optimization (14px → 18px scaling)
- ✅ Flexible grid layouts (1 → 2 → 3 columns)
- ✅ Safe area support (notched devices)
- ✅ Touch target sizing (44px minimum)
- ✅ Dark mode support
- ✅ Reduced motion support
- ✅ High DPI optimization
- ✅ Print styles
- ✅ Landscape orientation
- ✅ No horizontal scroll
- ✅ Images scale properly

---

**Last Updated**: April 10, 2026
**Angular Version**: 21.2.0
**Responsive Status**: Production Ready
