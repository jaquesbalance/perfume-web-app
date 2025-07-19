# React Native Frontend Development Guide
## Perfume Recommendation App - Mobile Client

This guide provides everything needed to build a standalone React Native mobile app using Expo that consumes the existing backend API.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Setup](#project-setup)
3. [Backend API Integration](#backend-api-integration)
4. [Architecture Overview](#architecture-overview)
5. [Feature Requirements](#feature-requirements)
6. [Development Guidelines](#development-guidelines)
7. [Deployment Strategy](#deployment-strategy)

---

## Technology Stack

### Core Technologies
- **React Native** with TypeScript
- **Expo SDK 50+** (managed workflow)
- **Expo Router** for navigation
- **Zustand** for state management
- **React Query/TanStack Query** for server state
- **NativeWind** for styling (Tailwind CSS for React Native)

### Key Expo Packages
```json
{
  "expo": "~50.0.0",
  "expo-router": "~3.4.0",
  "expo-constants": "~15.4.0",
  "expo-status-bar": "~1.11.0",
  "expo-secure-store": "~12.8.0",
  "expo-image-picker": "~14.7.0",
  "expo-notifications": "~0.27.0",
  "expo-camera": "~14.0.0",
  "expo-font": "~11.10.0",
  "expo-splash-screen": "~0.26.0"
}
```

### Additional Dependencies
```json
{
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "react-native-svg": "^14.0.0",
  "react-native-reanimated": "~3.6.0",
  "react-native-gesture-handler": "~2.14.0",
  "nativewind": "^2.0.11",
  "tailwindcss": "^3.3.0"
}
```

---

## Project Setup

### 1. Initialize Expo Project
```bash
# Create new Expo project with TypeScript
npx create-expo-app PerfumeApp --template blank-typescript

# Navigate to project directory
cd PerfumeApp

# Install dependencies
npm install

# Install additional packages
npx expo install expo-router expo-secure-store expo-image-picker expo-notifications expo-camera expo-font expo-splash-screen
npm install @tanstack/react-query zustand react-native-svg nativewind tailwindcss
```

### 2. Configure Expo Router
Update `app.json`:
```json
{
  "expo": {
    "name": "Perfume Recommendation App",
    "slug": "perfume-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.perfumeapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.perfumeapp"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "scheme": "perfume-app",
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 3. Configure NativeWind
Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#fdf2f8',
          500: '#ec4899',
          600: '#db2777',
        }
      },
      fontFamily: {
        'inter': ['Inter'],
        'playfair': ['PlayfairDisplay'],
      }
    },
  },
  plugins: [],
}
```

---

## Backend API Integration

### API Configuration
Create `src/config/api.ts`:
```typescript
import { Platform } from 'react-native';

// Backend API configuration
export const API_CONFIG = {
  // Development URLs
  BASE_URL: Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000', // Android emulator
    web: 'http://localhost:3000',
  }),
  
  // Production URL (replace with your production backend)
  PRODUCTION_URL: 'https://your-production-api.com',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
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
      BY_NOTES: '/api/recommendations/by-notes',
    },
    COLLECTION: {
      LIST: '/api/users/collection',
      ADD: '/api/users/collection',
      UPDATE: (id: string) => `/api/users/collection/${id}`,
      DELETE: (id: string) => `/api/users/collection/${id}`,
    },
  },
  
  // Request configuration
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Get the appropriate base URL
export const getBaseUrl = () => {
  return __DEV__ ? API_CONFIG.BASE_URL : API_CONFIG.PRODUCTION_URL;
};
```

### HTTP Client Setup
Create `src/services/httpClient.ts`:
```typescript
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, getBaseUrl } from '../config/api';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = getBaseUrl();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Get stored JWT token
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch {
      return null;
    }
  }

  // Store JWT token
  async setAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  }

  // Remove JWT token
  async removeAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }

  // Build request headers
  private async buildHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = await this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.buildHeaders(options.headers as Record<string, string>);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        timeout: API_CONFIG.TIMEOUT,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
```

### API Service Layer
Create `src/services/apiService.ts`:
```typescript
import { httpClient } from './httpClient';
import { API_CONFIG } from '../config/api';

// Types (matching backend)
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  concentration: string;
  description?: string;
  notes?: Note[];
}

export interface Note {
  name: string;
  category: 'Top' | 'Middle' | 'Base';
}

export interface CollectionItem {
  id: string;
  perfumeId: string;
  collectionType: 'OWNS' | 'LOVES' | 'WANTS' | 'DISLIKES';
  rating?: number;
  notes?: string;
  dateAdded: string;
}

export interface EnhancedRecommendation {
  perfume: Perfume;
  score: number;
  reasons: RecommendationReason[];
  notes: Note[];
}

export interface RecommendationReason {
  type: string;
  score: number;
  description: string;
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    return httpClient.post<{ token: string; user: User }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );
  },

  register: async (email: string, password: string, name: string) => {
    return httpClient.post<{ token: string; user: User }>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      { email, password, name }
    );
  },

  getProfile: async () => {
    return httpClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  },

  refreshToken: async () => {
    return httpClient.post<{ token: string }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  },
};

// Perfumes API
export const perfumesApi = {
  getList: async (page: number = 1, limit: number = 20, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    
    return httpClient.get<{
      data: Perfume[];
      pagination: { total: number; page: number; limit: number; pages: number };
    }>(`${API_CONFIG.ENDPOINTS.PERFUMES.LIST}?${params}`);
  },

  getDetails: async (id: string) => {
    return httpClient.get<Perfume>(API_CONFIG.ENDPOINTS.PERFUMES.DETAILS(id));
  },

  search: async (query: string) => {
    return httpClient.get<Perfume[]>(`${API_CONFIG.ENDPOINTS.PERFUMES.SEARCH}?q=${query}`);
  },
};

// Recommendations API
export const recommendationsApi = {
  getPersonalized: async (limit: number = 10) => {
    return httpClient.post<EnhancedRecommendation[]>(
      API_CONFIG.ENDPOINTS.RECOMMENDATIONS.PERSONALIZED,
      { limit }
    );
  },

  getSimilar: async (perfumeId: string, limit: number = 10) => {
    return httpClient.post<EnhancedRecommendation[]>(
      API_CONFIG.ENDPOINTS.RECOMMENDATIONS.SIMILAR,
      { similarTo: perfumeId, limit }
    );
  },

  getByNotes: async (notes: string[], limit: number = 10) => {
    return httpClient.post<EnhancedRecommendation[]>(
      API_CONFIG.ENDPOINTS.RECOMMENDATIONS.BY_NOTES,
      { notes, limit }
    );
  },
};

// Collection API
export const collectionApi = {
  getCollection: async () => {
    return httpClient.get<CollectionItem[]>(API_CONFIG.ENDPOINTS.COLLECTION.LIST);
  },

  addToCollection: async (perfumeId: string, collectionType: CollectionItem['collectionType'], rating?: number, notes?: string) => {
    return httpClient.post<CollectionItem>(API_CONFIG.ENDPOINTS.COLLECTION.ADD, {
      perfumeId,
      collectionType,
      rating,
      notes,
    });
  },

  updateCollectionItem: async (id: string, updates: Partial<CollectionItem>) => {
    return httpClient.put<CollectionItem>(API_CONFIG.ENDPOINTS.COLLECTION.UPDATE(id), updates);
  },

  removeFromCollection: async (id: string) => {
    return httpClient.delete(API_CONFIG.ENDPOINTS.COLLECTION.DELETE(id));
  },
};
```

---

## Architecture Overview

### Project Structure
```
PerfumeApp/
├── app/                     # Expo Router pages
│   ├── (auth)/             # Authentication screens
│   ├── (tabs)/             # Main tab navigation
│   ├── perfume/            # Perfume detail screens
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Entry point
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── forms/              # Form components
│   └── features/           # Feature-specific components
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

### State Management with Zustand
Create `src/stores/authStore.ts`:
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../services/apiService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

### Navigation Setup
Create `app/_layout.tsx`:
```typescript
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/stores/authStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="perfume/[id]" 
          options={{ 
            title: 'Perfume Details',
            presentation: 'modal'
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
```

---

This is the first part of the comprehensive guide. Would you like me to continue with the remaining sections covering:

1. **Feature Requirements** - Detailed specifications for each screen
2. **Component Examples** - Sample implementations 
3. **Development Guidelines** - Best practices and patterns
4. **Platform-Specific Considerations** - iOS/Android differences
5. **Deployment Strategy** - App store deployment guides

Let me know if you want me to continue with the next sections!