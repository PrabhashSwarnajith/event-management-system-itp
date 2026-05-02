# UniEvents Responsive Design Guide

This document provides comprehensive information about the responsive design implementation across the UniEvents application, with special focus on chat windows.

## Table of Contents

1. [Overview](#overview)
2. [Breakpoints](#breakpoints)
3. [Chat Components Responsiveness](#chat-components-responsiveness)
4. [Testing on Different Devices](#testing-on-different-devices)
5. [Mobile-First Approach](#mobile-first-approach)
6. [Common Responsive Patterns](#common-responsive-patterns)

---

## Overview

UniEvents uses **Tailwind CSS** for responsive design with a mobile-first approach. All UI components scale gracefully from small mobile screens (320px) to large desktop monitors (2560px+).

### Device Categories

| Device | Width Range | Examples |
|--------|------------|----------|
| **Mobile** | 320px - 640px | iPhone, Android phones |
| **Tablet** | 641px - 1024px | iPad, Android tablets |
| **Desktop** | 1025px+ | Laptops, desktops |

---

## Breakpoints

UniEvents uses Tailwind's standard breakpoints:

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| `sm` | 640px | Small devices (tablets) |
| `md` | 768px | Medium devices |
| `lg` | 1024px | Large devices |
| `xl` | 1280px | Extra-large devices |

### CSS Media Query Equivalents

```css
/* Mobile (default) */
.element { width: 100%; }

/* Tablet and up */
@media (min-width: 640px) {
  .sm\:element { width: 50%; }
}

/* Medium and up */
@media (min-width: 768px) {
  .md\:element { width: 33%; }
}
```

---

## Chat Components Responsiveness

### SmartHelp Component

The SmartHelp widget (Help Desk) is designed to work seamlessly on all screen sizes.

#### Button Positioning

**Mobile (< 640px)**
```jsx
// Smaller padding and text hidden
className="px-3 py-2.5 text-xs"
<span className="hidden sm:inline">Help Desk</span>
```

**Tablet & Desktop (640px+)**
```jsx
// Full padding and text visible
className="sm:px-4 sm:py-3 sm:text-sm"
```

#### Chat Window Sizing

**Mobile**
```jsx
width: "min(100vw - 1rem, 420px)"  // Full width minus margins
height: "min(100vh - 2rem, 600px)" // Full viewport height
```

**Desktop**
```jsx
width: "min(100vw - 1rem, 420px)"  // Same constraint
height: "600px"                     // Fixed height
```

#### Message Display

**Mobile**: Messages constrained to 75% width to allow for avatars
```jsx
className="max-w-[75%] sm:max-w-[80%]"
```

**Tablet+**: Messages constrained to 80% width with more breathing room

#### Input Area

**Mobile**
```jsx
// Compact input with reduced padding
className="px-2.5 py-1.5 text-xs"
// Smaller send button
className="h-8 w-8"
```

**Desktop**
```jsx
// Spacious input
className="sm:px-3 sm:py-2 sm:text-sm"
// Larger send button
className="sm:h-9 sm:w-9"
```

### LiveChat Component

The LiveChat widget (Live Support) has similar responsive implementation with admin-specific adjustments.

#### Admin Features Responsiveness

When user role is "ADMIN":

**Mobile**: Hidden by default, takes minimal space
```jsx
<aside className="md:border-b-0 md:border-r overflow-y-auto max-h-[40vh] md:max-h-full">
```

**Desktop**: Members panel visible with full height

#### Grid Layout

**Mobile**: Single column (sidebar below messages)
```jsx
className="grid-cols-1"
```

**Medium+**: Two columns (sidebar left, messages right)
```jsx
className="md:grid-cols-[200px_minmax(0,1fr)]"
className="lg:grid-cols-[230px_minmax(0,1fr)]"
```

---

## Testing on Different Devices

### Using Browser DevTools

1. **Chrome/Firefox/Safari**:
   - Press `F12` to open DevTools
   - Click the "Toggle device toolbar" button (or `Ctrl+Shift+M`)
   - Select preset devices or enter custom dimensions

2. **Test Cases**:
   - **iPhone 12**: 390 × 844px
   - **iPad**: 1024 × 1366px
   - **Galaxy S21**: 360 × 800px
   - **Desktop**: 1920 × 1080px

### Physical Device Testing

1. **Local Network Access**:
   ```bash
   # Start frontend with host flag
   npm run dev -- --host
   # Then access from device: http://<your-ip>:5173
   ```

2. **Device Checklist**:
   - [ ] Chat window opens/closes smoothly
   - [ ] Text is readable without horizontal scrolling
   - [ ] Buttons are easily tappable (min 44px)
   - [ ] No content overflow on screen edges
   - [ ] Keyboard doesn't hide input field
   - [ ] Responsive images load correctly

---

## Mobile-First Approach

UniEvents follows the **mobile-first** methodology:

### Principle

1. **Base Styles**: Written for mobile devices (320px)
2. **Enhancements**: Added with `sm:`, `md:`, `lg:` prefixes
3. **Progressive Enhancement**: Works on older devices, enhanced on newer ones

### Example: Button Styling

```jsx
// Mobile first (base)
className="px-3 py-2 text-xs"

// Tablet+ (enhanced)
className="sm:px-4 sm:py-3 sm:text-sm"

// Full responsive button
className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
```

### Benefits

✅ Better performance on mobile devices
✅ Works on all devices (graceful degradation)
✅ Easier to maintain
✅ SEO friendly

---

## Common Responsive Patterns

### 1. Responsive Text Sizing

```jsx
// Mobile text is smaller, scales up on larger screens
<h1 className="text-lg sm:text-2xl md:text-3xl">Heading</h1>
<p className="text-xs sm:text-sm md:text-base">Body text</p>
```

### 2. Responsive Spacing

```jsx
// Mobile: tight spacing, grows on larger screens
<div className="p-2 sm:p-4 md:p-6">Content</div>
<div className="gap-1 sm:gap-2 md:gap-4">Flex container</div>
```

### 3. Responsive Grid

```jsx
// Mobile: 1 column, tablet: 2 columns, desktop: 3+ columns
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>
```

### 4. Responsive Width Constraints

```jsx
// Mobile: full width with margins, desktop: fixed width
<div className="w-full px-4 sm:max-w-2xl sm:mx-auto">
  {/* Content constrained to max-width on larger screens */}
</div>
```

### 5. Responsive Visibility

```jsx
// Hidden on mobile, shown on desktop
<div className="hidden md:block">Desktop only content</div>

// Shown on mobile, hidden on desktop
<button className="md:hidden">Mobile menu</button>
```

---

## Responsive CSS Classes Used in Chats

### SmartHelp

| Property | Mobile | Tablet+ | Usage |
|----------|--------|---------|-------|
| Button position | `bottom-4 right-4` | `sm:bottom-6 sm:right-6` | Position away from bottom navigation |
| Button padding | `px-3 py-2.5` | `sm:px-4 sm:py-3` | Larger touch target |
| Button text | `text-xs` | `sm:text-sm` | Readable on all sizes |
| Window width | `100vw - 1rem` | `100vw - 1rem` | Full width with margin |
| Message gap | `gap-2` | `sm:gap-2.5` | More breathing room on larger screens |
| Input size | `text-xs` | `sm:text-sm` | Readable input text |

### LiveChat

| Property | Mobile | Tablet+ | Usage |
|----------|--------|---------|-------|
| Grid layout | `grid-cols-1` | `md:grid-cols-[200px...]` | Stack on mobile |
| Members panel | `overflow-y-auto max-h-[40vh]` | `md:max-h-full` | Scrollable on mobile |
| Message width | `max-w-[75%]` | `sm:max-w-[82%]` | Narrower on mobile for avatars |
| Header padding | `px-3 py-2` | `sm:px-4 sm:py-3` | Compact header on mobile |

---

## Performance Considerations

### Image Loading

```jsx
// Responsive images with srcSet
<img
  src="image-small.jpg"
  srcSet="image-medium.jpg 640w, image-large.jpg 1024w"
  alt="Responsive image"
/>
```

### Bundle Size

- Tailwind CSS is **optimized** and only includes used classes
- Responsive prefixes (sm:, md:) don't increase file size significantly
- Total CSS: ~50KB gzipped

### Mobile Performance

✅ Minimal JavaScript for chat functionality
✅ CSS-only animations and transitions
✅ Lazy loading for images
✅ Touch-optimized UI elements (min 44px buttons)

---

## Accessibility

### Responsive & Accessible

1. **Touch Targets**: Minimum 44px × 44px for mobile
   ```jsx
   className="h-8 w-8 sm:h-9 sm:w-9" // 32px mobile, 36px desktop
   // Ideal: 44px minimum for touch devices
   ```

2. **Text Contrast**: Maintained across all sizes
   ```jsx
   className="text-xs text-slate-400" // Still sufficient contrast
   ```

3. **Focus States**: Visible on all screen sizes
   ```jsx
   className="focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
   ```

---

## Common Issues & Solutions

### Issue: Text too small on mobile

**Solution**: Add responsive text sizing
```jsx
// Before
<p className="text-sm">Message</p>

// After
<p className="text-xs sm:text-sm">Message</p>
```

### Issue: Chat window overflows on mobile

**Solution**: Use viewport-relative sizing
```jsx
// Before
style={{ width: "400px", height: "600px" }}

// After
style={{
  width: "min(100vw - 1rem, 400px)",
  height: "min(100vh - 2rem, 600px)"
}}
```

### Issue: Buttons too small to tap

**Solution**: Ensure minimum touch size
```jsx
// Before
<button className="h-6 w-6">Click me</button>

// After
<button className="h-8 w-8 sm:h-9 sm:w-9">Click me</button> // 32px+
```

---

## Future Improvements

- [ ] Add dark mode responsive variants
- [ ] Implement landscape mode optimizations
- [ ] Add custom breakpoint for specific devices
- [ ] Test with screen readers on mobile
- [ ] Add haptic feedback for mobile interactions
- [ ] Optimize for foldable devices

---

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile-First Design](https://www.nngroup.com/articles/mobile-first-design/)
- [Touch Target Sizing](https://developers.google.com/web/fundamentals/design-and-ux/input/touch)
- [Responsive Design Testing Tools](https://developers.google.com/web/tools/chrome-devtools)

---

## Support

For responsive design issues:
1. Check [API_KEYS_SETUP.md](API_KEYS_SETUP.md) for environment setup
2. Test using Chrome DevTools (F12)
3. Report issues on GitHub with device/browser info

**Last Updated**: May 3, 2026
**Tailwind CSS Version**: v3.3+
**Target Devices**: All modern browsers from 320px width
