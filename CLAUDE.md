# CLAUDE.md - React TypeScript Perfume Web App Development Guide

## Project Overview
This modern React TypeScript web application provides an intuitive perfume discovery and recommendation system. Built with Vite for fast development and Tailwind CSS for beautiful styling.

## Technology Stack
- **React 18** with TypeScript
- **Vite** for fast bundling and development
- **Tailwind CSS** for modern styling
- **React Query/TanStack Query** for server state management
- **Lucide React** for clean icons

## Quick Start
```bash
# Navigate to project directory
cd perfume-web-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure
```
perfume-web-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SearchInput.tsx  # Search input with icon
│   │   ├── PerfumeCard.tsx  # Perfume grid card
│   │   ├── PerfumeDetail.tsx # Detailed perfume view
│   │   ├── FragranceNotes.tsx # Notes visualization
│   │   └── RecommendationCard.tsx # Recommendation cards
│   ├── types/
│   │   └── perfume.ts       # TypeScript type definitions
│   ├── lib/
│   │   ├── api.ts          # API functions and HTTP client
│   │   └── recommendation-engine.ts # Recommendation logic
│   ├── App.tsx             # Main application component
│   ├── index.css           # Tailwind CSS and global styles
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Core Features

### Search & Discovery
- **Instant search** with debounced API calls
- **Grid layout** with responsive design
- **Image loading** with fallback placeholders
- **Search result count** and status messages

### Perfume Details
- **High-resolution images** with error handling
- **Comprehensive information** (name, brand, year, description)
- **Fragrance notes breakdown** (top, heart, base)
- **Clean typography** with Playfair Display for headings

### Intelligent Recommendations
- **Smart algorithm** analyzing fragrance similarity
- **Explanation system** showing why perfumes are recommended
- **Confidence scoring** based on note matching
- **Multiple recommendation types**:
  - Similar notes
  - Same brand
  - Complementary profiles
  - Popular choices

### UI/UX Features
- **Responsive design** (mobile-first approach)
- **Loading states** with animated spinners
- **Error handling** with user-friendly messages
- **Smooth transitions** and hover effects
- **Accessible design** with proper ARIA labels

## Backend API Integration

### API Configuration
```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:3000';

export const perfumeApi = {
  getAllPerfumes,    // GET /api/perfumes
  searchPerfumes,    // GET /api/perfumes?query=...
  getPerfumeById,    // GET /api/perfumes/:id
  getSimilarPerfumes, // GET /api/recommendations/similar
};
```

### Data Types
```typescript
interface Perfume {
  id: string;
  name: string;
  brand: string;
  title: string;
  description: string;
  year?: string | number;
  imgId?: string;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
}
```

## Styling System

### Tailwind CSS Setup
- **Custom color palette** with primary/accent colors
- **Component classes** for cards, buttons, etc.
- **Typography** with Inter and Playfair Display fonts
- **Responsive utilities** for all screen sizes

### Design Tokens
```css
:root {
  --primary: #0ea5e9;      /* Blue */
  --accent: #ec4899;       /* Pink */
  --gray-50: #f9fafb;      /* Background */
  --border: #e5e7eb;       /* Borders */
}
```

## State Management

### React Query
- **Server state caching** with 5-minute stale time
- **Background refetching** for fresh data
- **Error handling** with retry logic
- **Loading states** for better UX

### Local State
- **Search query** with controlled input
- **Selected perfume** for detail view
- **Navigation state** for back/forward

## Performance Optimizations

### Image Handling
- **Progressive loading** with placeholders
- **Error fallbacks** for missing images
- **Optimized URLs** from CDN

### Bundle Optimization
- **Vite bundling** with tree shaking
- **Lazy loading** of recommendation data
- **Code splitting** at route level

## Development Guidelines

### Code Style
- **TypeScript strict mode** enabled
- **ESLint + Prettier** configuration
- **Consistent imports** organization
- **Component naming** conventions

### Component Structure
```typescript
interface ComponentProps {
  // Props with clear types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
}
```

### Error Boundaries
- **Global error handling** in App component
- **Graceful degradation** for API failures
- **User-friendly error messages**

## Key Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npx tsc --noEmit

# Format code
npx prettier --write src/
```

### Deployment
```bash
# Build optimized bundle
npm run build

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Browser Support
- **Modern browsers** (ES2020+)
- **Chrome, Firefox, Safari, Edge**
- **Mobile responsive** design
- **Progressive enhancement**

## Security Considerations
- **Input sanitization** for search queries
- **XSS protection** with React's built-in escaping
- **CORS handling** for API requests
- **Content Security Policy** headers

## Testing Strategy
- **Component testing** with React Testing Library
- **API integration tests**
- **E2E testing** with Playwright
- **Accessibility testing** with axe-core

## Deployment Options
- **Vercel** - Recommended for React apps
- **Netlify** - Good for static sites
- **AWS S3 + CloudFront** - Enterprise option
- **Docker** - Containerized deployment

## Additional Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Query Documentation](https://tanstack.com/query/latest)

## Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Perfume Discovery
```

This React TypeScript web application provides a modern, performant, and maintainable solution for perfume discovery with intelligent recommendations.