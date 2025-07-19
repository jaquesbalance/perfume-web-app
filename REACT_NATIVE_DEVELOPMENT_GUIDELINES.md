# React Native Development Guidelines
## Best Practices and Standards for Perfume App Development

This document outlines development standards, best practices, and guidelines for building the React Native Perfume App.

---

## Table of Contents

1. [Code Style and Structure](#code-style-and-structure)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [Component Best Practices](#component-best-practices)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Performance Optimization](#performance-optimization)
7. [Testing Standards](#testing-standards)
8. [Security Guidelines](#security-guidelines)
9. [Error Handling](#error-handling)
10. [Accessibility](#accessibility)

---

## Code Style and Structure

### 1. Project Structure
```
PerfumeApp/
├── app/                          # Expo Router pages
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                  # Main app tabs
│   │   ├── home.tsx
│   │   ├── discover.tsx
│   │   ├── collection.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   ├── perfume/                 # Perfume detail screens
│   │   └── [id].tsx
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry point
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── features/                # Feature-specific components
│   │   ├── PerfumeCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── index.ts
│   └── forms/                   # Form components
│       ├── LoginForm.tsx
│       └── CollectionForm.tsx
├── src/                         # Source code
│   ├── config/                  # Configuration files
│   │   ├── api.ts
│   │   ├── environment.ts
│   │   └── constants.ts
│   ├── services/                # API services
│   │   ├── apiService.ts
│   │   ├── authService.ts
│   │   └── storageService.ts
│   ├── stores/                  # State management
│   │   ├── authStore.ts
│   │   ├── perfumeStore.ts
│   │   └── index.ts
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── usePerfumes.ts
│   │   └── useCollection.ts
│   ├── utils/                   # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── types/                   # TypeScript types
│       ├── auth.ts
│       ├── perfume.ts
│       └── api.ts
├── assets/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── constants/                   # App constants
│   ├── Colors.ts
│   ├── Typography.ts
│   └── Spacing.ts
└── __tests__/                   # Test files
    ├── components/
    ├── services/
    └── utils/
```

### 2. File Naming Conventions
- **Components**: PascalCase (`PerfumeCard.tsx`)
- **Screens**: PascalCase (`PerfumeDetail.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: PascalCase (`Colors.ts`)
- **Types**: camelCase (`perfume.ts`)
- **Hooks**: camelCase starting with "use" (`useAuth.ts`)

### 3. Import Organization
```typescript
// External libraries (React, React Native, third-party)
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';

// Internal modules (services, stores, utils)
import { perfumesApi } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';
import { formatDate } from '../utils/formatters';

// Components (UI components, feature components)
import { Button, Card, Loading } from '../components/ui';
import { PerfumeCard } from '../components/features';

// Types and constants
import { Perfume } from '../types/perfume';
import { Colors, Spacing } from '../constants';

// Relative imports last
import styles from './styles';
```

### 4. Code Formatting
```json
// .eslintrc.js
module.exports = {
  extends: ['expo', '@react-native-community'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'prefer-const': 'error',
    'no-console': 'warn',
    'max-len': ['error', { code: 100 }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'trailing-comma': ['error', 'es5'],
  },
};

// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

---

## TypeScript Guidelines

### 1. Type Definitions
```typescript
// src/types/perfume.ts
export interface Perfume {
  id: string;
  name: string;
  brand: string;
  concentration: string;
  description?: string;
  image?: string;
  price?: number;
  rating?: number;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  name: string;
  category: NoteCategory;
  description?: string;
}

export enum NoteCategory {
  TOP = 'Top',
  MIDDLE = 'Middle',
  BASE = 'Base',
}

export interface PerfumeFilters {
  brand?: string[];
  category?: string[];
  priceRange?: [number, number];
  rating?: number;
  notes?: string[];
}

export interface PerfumeSearchParams {
  query?: string;
  filters?: PerfumeFilters;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'brand' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
```

### 2. Component Props
```typescript
// Always define props interfaces
interface PerfumeCardProps {
  perfume: Perfume;
  onPress: (perfume: Perfume) => void;
  onAddToCollection?: (perfumeId: string) => void;
  showAddButton?: boolean;
  style?: ViewStyle;
}

// Use React.FC with proper typing
const PerfumeCard: React.FC<PerfumeCardProps> = ({
  perfume,
  onPress,
  onAddToCollection,
  showAddButton = true,
  style,
}) => {
  // Component implementation
};
```

### 3. Hook Typing
```typescript
// src/hooks/usePerfumes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { perfumesApi } from '../services/apiService';
import { Perfume, PerfumeSearchParams } from '../types/perfume';

export const usePerfumes = (params: PerfumeSearchParams) => {
  return useQuery({
    queryKey: ['perfumes', params],
    queryFn: () => perfumesApi.search(params),
    enabled: !!params.query || Object.keys(params.filters || {}).length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddToCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { perfumeId: string; type: CollectionType }) =>
      collectionApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    },
  });
};
```

### 4. Utility Function Typing
```typescript
// src/utils/formatters.ts
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
```

---

## Component Best Practices

### 1. Component Structure
```typescript
// Good component structure
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';

interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 1. State declarations
  const [state, setState] = useState<StateType>(initialState);
  
  // 2. Custom hooks
  const { data, loading } = useCustomHook();
  
  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 4. Event handlers (use useCallback for performance)
  const handlePress = useCallback(() => {
    // Handler logic
  }, []);
  
  // 5. Render helpers
  const renderItem = (item: ItemType) => {
    return <ItemComponent item={item} />;
  };
  
  // 6. Early returns
  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent />;
  
  // 7. Main render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component</Text>
      {data?.map(renderItem)}
    </View>
  );
};

// 8. Styles at the bottom
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[900],
  },
});

export default Component;
```

### 2. Performance Optimization
```typescript
// Use React.memo for expensive components
const PerfumeCard = React.memo<PerfumeCardProps>(({ perfume, onPress }) => {
  // Component implementation
});

// Use useCallback for event handlers
const handlePress = useCallback(() => {
  onPress(perfume);
}, [perfume, onPress]);

// Use useMemo for expensive calculations
const sortedPerfumes = useMemo(() => {
  return perfumes.sort((a, b) => a.name.localeCompare(b.name));
}, [perfumes]);

// Use FlashList for large lists
import { FlashList } from '@shopify/flash-list';

const PerfumeList: React.FC = ({ data }) => (
  <FlashList
    data={data}
    renderItem={({ item }) => <PerfumeCard perfume={item} />}
    estimatedItemSize={120}
    keyExtractor={item => item.id}
  />
);
```

### 3. Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to crash reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
          <Button
            title="Try again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

---

## State Management

### 1. Zustand Store Pattern
```typescript
// src/stores/perfumeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Perfume, PerfumeFilters } from '../types/perfume';

interface PerfumeState {
  // State
  perfumes: Perfume[];
  favorites: string[];
  filters: PerfumeFilters;
  searchHistory: string[];
  
  // Actions
  setPerfumes: (perfumes: Perfume[]) => void;
  addToFavorites: (perfumeId: string) => void;
  removeFromFavorites: (perfumeId: string) => void;
  updateFilters: (filters: Partial<PerfumeFilters>) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const usePerfumeStore = create<PerfumeState>()(
  persist(
    (set, get) => ({
      perfumes: [],
      favorites: [],
      filters: {},
      searchHistory: [],
      
      setPerfumes: (perfumes) => set({ perfumes }),
      
      addToFavorites: (perfumeId) => set((state) => ({
        favorites: [...state.favorites, perfumeId],
      })),
      
      removeFromFavorites: (perfumeId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== perfumeId),
      })),
      
      updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),
      
      addToSearchHistory: (query) => set((state) => ({
        searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10),
      })),
      
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'perfume-store',
      partialize: (state) => ({ 
        favorites: state.favorites,
        searchHistory: state.searchHistory 
      }),
    }
  )
);
```

### 2. React Query Integration
```typescript
// src/hooks/usePerfumeQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { perfumesApi } from '../services/apiService';
import { usePerfumeStore } from '../stores/perfumeStore';

export const usePerfumeDetail = (id: string) => {
  return useQuery({
    queryKey: ['perfume', id],
    queryFn: () => perfumesApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { addToFavorites, removeFromFavorites, favorites } = usePerfumeStore();
  
  return useMutation({
    mutationFn: async (perfumeId: string) => {
      const isFavorite = favorites.includes(perfumeId);
      if (isFavorite) {
        removeFromFavorites(perfumeId);
      } else {
        addToFavorites(perfumeId);
      }
      return !isFavorite;
    },
    onSuccess: (isFavorite, perfumeId) => {
      queryClient.setQueryData(['perfume', perfumeId], (oldData: any) => ({
        ...oldData,
        isFavorite,
      }));
    },
  });
};
```

---

## API Integration

### 1. HTTP Client Setup
```typescript
// src/services/httpClient.ts
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await SecureStore.getItemAsync('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const authHeaders = await this.getAuthHeaders();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || 'Request failed',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error', { originalError: error });
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const httpClient = new HttpClient();
```

### 2. Error Handling
```typescript
// src/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { ApiError } from '../services/httpClient';

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown) => {
    console.error('Error occurred:', error);
    
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          // Handle unauthorized
          Alert.alert('Session Expired', 'Please log in again');
          break;
        case 403:
          Alert.alert('Access Denied', 'You don\'t have permission for this action');
          break;
        case 404:
          Alert.alert('Not Found', 'The requested resource was not found');
          break;
        case 500:
          Alert.alert('Server Error', 'Something went wrong on our end');
          break;
        default:
          Alert.alert('Error', error.message || 'An unexpected error occurred');
      }
    } else {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  }, []);

  return { handleError };
};
```

---

## Performance Optimization

### 1. Image Optimization
```typescript
// src/components/OptimizedImage.tsx
import React from 'react';
import { Image } from 'expo-image';
import { ViewStyle } from 'react-native';

interface OptimizedImageProps {
  source: string;
  style?: ViewStyle;
  placeholder?: string;
  contentFit?: 'cover' | 'contain' | 'fill';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  placeholder = 'https://via.placeholder.com/300x200',
  contentFit = 'cover',
}) => {
  return (
    <Image
      source={{ uri: source }}
      placeholder={{ uri: placeholder }}
      contentFit={contentFit}
      transition={200}
      style={style}
      cachePolicy="memory-disk"
    />
  );
};

export default OptimizedImage;
```

### 2. List Performance
```typescript
// src/components/PerfumeList.tsx
import React, { useMemo } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Perfume } from '../types/perfume';

interface PerfumeListProps {
  data: Perfume[];
  onEndReached?: () => void;
  onItemPress: (perfume: Perfume) => void;
}

const PerfumeList: React.FC<PerfumeListProps> = ({
  data,
  onEndReached,
  onItemPress,
}) => {
  const renderItem = useCallback(({ item }: { item: Perfume }) => (
    <PerfumeCard perfume={item} onPress={() => onItemPress(item)} />
  ), [onItemPress]);

  const keyExtractor = useCallback((item: Perfume) => item.id, []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={120}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
};
```

### 3. Bundle Optimization
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable tree shaking
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

// Asset optimization
config.resolver.assetExts.push('bin');

module.exports = config;
```

---

## Testing Standards

### 1. Unit Testing
```typescript
// __tests__/components/PerfumeCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PerfumeCard } from '../../components/features/PerfumeCard';

const mockPerfume = {
  id: '1',
  name: 'Test Perfume',
  brand: 'Test Brand',
  rating: 4.5,
};

describe('PerfumeCard', () => {
  it('renders perfume information correctly', () => {
    const { getByText } = render(
      <PerfumeCard perfume={mockPerfume} onPress={jest.fn()} />
    );
    
    expect(getByText('Test Perfume')).toBeTruthy();
    expect(getByText('Test Brand')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PerfumeCard perfume={mockPerfume} onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('perfume-card'));
    expect(onPress).toHaveBeenCalledWith(mockPerfume);
  });
});
```

### 2. Integration Testing
```typescript
// __tests__/integration/PerfumeSearch.test.tsx
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PerfumeSearch } from '../../components/features/PerfumeSearch';
import * as apiService from '../../services/apiService';

jest.mock('../../services/apiService');

describe('PerfumeSearch Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  it('searches for perfumes when query is entered', async () => {
    const mockResults = [{ id: '1', name: 'Test Perfume' }];
    (apiService.perfumesApi.search as jest.Mock).mockResolvedValue({
      data: mockResults,
    });

    const { getByPlaceholderText, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <PerfumeSearch />
      </QueryClientProvider>
    );

    const searchInput = getByPlaceholderText('Search perfumes...');
    fireEvent.changeText(searchInput, 'test');

    await waitFor(() => {
      expect(getByText('Test Perfume')).toBeTruthy();
    });
  });
});
```

---

## Security Guidelines

### 1. Secure Storage
```typescript
// src/services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  async setObject(key: string, value: object): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },

  async getObject<T>(key: string): Promise<T | null> {
    const item = await SecureStore.getItemAsync(key);
    return item ? JSON.parse(item) : null;
  },
};
```

### 2. Input Validation
```typescript
// src/utils/validators.ts
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain number' };
    }
    return { isValid: true };
  },

  sanitizeInput: (input: string): string => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  },
};
```

---

## Accessibility

### 1. Accessibility Implementation
```typescript
// src/components/AccessibleButton.tsx
import React from 'react';
import { Pressable, Text, AccessibilityRole } from 'react-native';

interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  title,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <Text>{title}</Text>
    </Pressable>
  );
};
```

### 2. Screen Reader Support
```typescript
// Add proper accessibility labels
<View accessible={true} accessibilityLabel="Perfume rating">
  <StarRating rating={perfume.rating} />
  <Text accessibilityLabel={`Rated ${perfume.rating} out of 5 stars`}>
    {perfume.rating}/5
  </Text>
</View>
```

---

This comprehensive development guide ensures consistent, maintainable, and high-quality code for the React Native Perfume App. Following these guidelines will result in a robust, performant, and accessible mobile application.

The documentation package is now complete with:
1. ✅ **Main Frontend Guide** - Technology stack, setup, and architecture
2. ✅ **Features Specification** - Detailed feature requirements and user flows  
3. ✅ **Component Library** - Complete UI component system with examples
4. ✅ **Development Guidelines** - Best practices and coding standards
5. ✅ **Deployment Guide** - Build and deployment processes for all platforms

These documents provide everything needed for another developer to successfully build a React Native frontend that integrates with your existing backend API.