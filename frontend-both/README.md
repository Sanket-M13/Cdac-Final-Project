# EV Charger Finder

A modern, responsive React landing page for an EV charging station finder application. Built with React, Bootstrap, and Leaflet maps.

## Features

- 🎨 **Modern Dark UI** - Cyber-minimal design with neon accents
- 🗺️ **Interactive Map** - Real-time charging station locations with clustering
- 📱 **Fully Responsive** - Mobile-first design approach
- ♿ **Accessible** - WCAG AA compliant with proper ARIA labels
- ⚡ **Performance Optimized** - Lazy loading and code splitting
- 🔐 **Authentication Ready** - Google OAuth integration placeholder

## Tech Stack

- **React 19** - Latest React with functional components and hooks
- **React Bootstrap** - Layout primitives and accessible components
- **React Leaflet** - Interactive maps with OpenStreetMap
- **React Router** - Client-side routing
- **React Icons** - Feather icons for consistent UI
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ev-charger-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Hero.jsx        # Landing hero section
│   ├── InteractiveMap.jsx # Map with filters
│   ├── MapView.jsx     # Leaflet map implementation
│   ├── HowItWorks.jsx  # 3-step process
│   ├── FeaturedStations.jsx # Station cards
│   ├── CTAStrip.jsx    # Sticky call-to-action
│   └── Footer.jsx      # Site footer
├── pages/              # Page components
│   ├── Landing.jsx     # Main landing page
│   └── Auth.jsx        # Authentication page
├── styles/             # Global styles
│   └── theme.css       # Design system tokens
├── App.jsx             # Main app component
└── main.jsx           # Entry point
```

## Design System

### Color Tokens
```css
--bg-900: #0a0a0a;      /* Primary background */
--bg-800: #111111;      /* Secondary background */
--fg: #ffffff;          /* Primary text */
--muted: #cfcfcf;       /* Secondary text */
--accent: #ad21ff;      /* Brand accent */
--accent-strong: #b838ff; /* Accent hover */
--card-bg: rgba(255,255,255,0.03); /* Card background */
```

### Spacing Scale
- `--space-xs: 4px`
- `--space-sm: 8px`
- `--space-md: 16px`
- `--space-lg: 24px`
- `--space-xl: 32px`
- `--space-xxl: 48px`

## Accessibility Checklist

- ✅ **Keyboard Navigation** - All interactive elements are keyboard accessible
- ✅ **Focus Indicators** - Visible focus outlines on all focusable elements
- ✅ **Color Contrast** - WCAG AA compliant contrast ratios
- ✅ **Alt Text** - All images have descriptive alt attributes
- ✅ **Semantic HTML** - Proper heading hierarchy and landmarks
- ✅ **ARIA Labels** - Screen reader friendly labels and descriptions
- ✅ **Reduced Motion** - Respects prefers-reduced-motion setting

## Performance Checklist

- ✅ **Code Splitting** - Map component is lazy loaded
- ✅ **Image Optimization** - Responsive images with proper sizing
- ✅ **Font Loading** - Preconnect to font CDN
- ✅ **Bundle Size** - Minimal dependencies and tree shaking
- ✅ **Caching** - Proper cache headers for static assets

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_API_BASE_URL=http://localhost:3001/api
```

## Analytics Integration

To add analytics, include your tracking code in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Testing

Run the test suite:
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Lighthouse Scores Target

- **Performance**: ≥ 80
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90