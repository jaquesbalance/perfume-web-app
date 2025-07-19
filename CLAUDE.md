# CLAUDE.md - React Native Perfume App Development Guide

## Project Overview
This React Native mobile app provides a super intuitive perfume recommendation system with collection management. Built with Expo using modern React Native patterns and TypeScript.

## Technology Stack
- **React Native** with TypeScript
- **Expo SDK 50+** (managed workflow)
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **React Query/TanStack Query** for server state
- **NativeWind** for styling (Tailwind CSS)

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Project Structure
```
PerfumeApp/
├── app/                     # Expo Router pages
│   ├── (auth)/             # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/             # Main tab navigation
│   │   ├── home.tsx        # Recommendations
│   │   ├── discover.tsx    # Browse perfumes
│   │   ├── collection.tsx  # My collection
│   │   ├── profile.tsx     # User profile
│   │   └── _layout.tsx
│   ├── perfume/            # Perfume detail screens
│   │   └── [id].tsx
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Entry point
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   ├── features/           # Feature-specific components
│   └── forms/              # Form components
├── src/
│   ├── config/             # App configuration
│   ├── services/           # API and external services
│   ├── stores/             # Zustand stores
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── assets/                 # Static assets
└── constants/              # App constants
```

## Core Features

### Authentication
- Email/password registration and login
- Secure token storage using Expo SecureStore
- Auto-login with stored credentials
- Form validation and error handling

### Home Screen (Recommendations)
- Personalized perfume recommendations
- "Recommended for You" section
- Recent activity display
- Quick action buttons
- Pull-to-refresh functionality

### Discover Screen
- Search with instant results
- Advanced filtering (brand, category, notes)
- Sort options (popular, newest, price)
- Infinite scroll pagination
- Category browsing

### Collection Management
- Four collection types: Owned, Loved, Want to Try, Disliked
- Personal ratings and notes
- Collection statistics
- Bulk actions (move, delete)
- Export functionality

### Perfume Details
- Comprehensive perfume information
- Notes breakdown (Top, Middle, Base)
- High-resolution images
- Similar perfumes section
- Add to collection modal

### Profile & Settings
- User profile management
- App preferences
- Collection statistics
- Help & support

## Backend API Integration

### Configuration
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
    web: 'http://localhost:3000',
  }),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
    },
    PERFUMES: {
      LIST: '/api/perfumes',
      DETAILS: (id: string) => `/api/perfumes/${id}`,
      SEARCH: '/api/perfumes/search',
    },
    RECOMMENDATIONS: {
      PERSONALIZED: '/api/recommendations/personalized',
      SIMILAR: '/api/recommendations/similar',
    },
    COLLECTION: {
      LIST: '/api/users/collection',
      ADD: '/api/users/collection',
      UPDATE: (id: string) => `/api/users/collection/${id}`,
      DELETE: (id: string) => `/api/users/collection/${id}`,
    },
  },
};
```

### HTTP Client
- Centralized API communication
- Automatic JWT token handling
- Request/response interceptors
- Error handling with proper user feedback

## State Management

### Zustand Stores
```typescript
// Authentication store
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);

// Collection store
const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      items: [],
      favorites: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
    }),
    { name: 'collection-storage' }
  )
);
```

### React Query Integration
- Server state management
- Automatic caching and background updates
- Optimistic updates for better UX
- Error handling and retry logic

## UI/UX Guidelines

### Design System
- Consistent color palette (primary blues, secondary pinks)
- Typography scale using Inter and Playfair Display
- Standardized spacing using 8px grid
- Rounded corners (8px for buttons, 12px for cards)

### Components
- Reusable UI components with TypeScript props
- Accessible design with proper labels
- Loading states and error boundaries
- Responsive design for different screen sizes

### Animations
- Smooth transitions between screens
- Loading indicators
- Swipe gestures for cards
- Pull-to-refresh animations

## Development Guidelines

### Code Style
- ESLint and Prettier configuration
- TypeScript strict mode
- Consistent import organization
- Component structure patterns

### Performance
- React.memo for expensive components
- useCallback for event handlers
- useMemo for expensive calculations
- FlashList for large lists
- Optimized images with Expo Image

### Testing
- Unit tests for components
- Integration tests for API calls
- E2E tests for critical user flows
- Accessibility testing

## Key Commands

### Development
```bash
# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Clear cache
npx expo start --clear

# Check for updates
npx expo install --fix
```

### Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Run type checking
npm run type-check
```

### Building
```bash
# Build development version
eas build --profile development --platform ios
eas build --profile development --platform android

# Build production version
eas build --profile production --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

## Environment Setup

### Required Dependencies
```json
{
  "expo": "~50.0.0",
  "expo-router": "~3.4.0",
  "expo-secure-store": "~12.8.0",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "nativewind": "^2.0.11"
}
```

### Configuration Files
- `app.json` - Expo configuration
- `tailwind.config.js` - NativeWind styling
- `tsconfig.json` - TypeScript configuration
- `eas.json` - EAS Build configuration

## Security Considerations
- Secure token storage with Expo SecureStore
- Input validation and sanitization
- API request authentication
- Proper error handling without exposing sensitive data

## Performance Optimizations
- Image optimization and caching
- List virtualization with FlashList
- Bundle optimization
- Code splitting for lazy loading
- Proper memory management

## Deployment Strategy
- Development builds for testing
- EAS Build for production
- App Store Connect for iOS
- Google Play Console for Android
- Web deployment with Vercel/Netlify

## Troubleshooting

### Common Issues
```bash
# Metro cache issues
npx expo start --clear

# EAS build issues
eas build --clear-cache

# Platform-specific builds
npx expo run:ios
npx expo run:android
```

### Platform Differences
- iOS: Haptic feedback, SF Symbols
- Android: Material Design, hardware back button
- Web: Mouse interactions, responsive design

## Additional Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)

## App Store Requirements
- App icons (1024x1024 PNG)
- Splash screens (various sizes)
- App Store screenshots
- App descriptions and metadata
- Privacy policy and terms of service
- App review guidelines compliance

This CLAUDE.md provides everything needed to understand, develop, and deploy the React Native perfume recommendation app successfully.