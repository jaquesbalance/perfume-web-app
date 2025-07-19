# React Native App - Feature Specifications
## Perfume Recommendation Mobile App

This document provides detailed specifications for all features and screens in the mobile app.

---

## App Structure & Navigation

### Main Navigation Flow
```
┌─ Authentication Flow
│  ├─ Welcome/Onboarding
│  ├─ Login
│  └─ Registration
│
├─ Main App (Tab Navigation)
│  ├─ Home (Recommendations)
│  ├─ Discover (Browse Perfumes)
│  ├─ Collection (My Perfumes)
│  └─ Profile (Settings)
│
└─ Modal/Stack Screens
   ├─ Perfume Details
   ├─ Add to Collection
   ├─ Search Results
   └─ Recommendation Results
```

---

## Feature Specifications

### 1. Authentication Screens

#### Welcome/Onboarding Screen
**Location**: `app/(auth)/welcome.tsx`

**Features**:
- App introduction with swipeable cards
- Brief explanation of app benefits
- "Get Started" and "I already have an account" buttons
- Elegant animations and transitions

**UI Components**:
```typescript
interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

// Example slides content
const onboardingSlides = [
  {
    title: "Discover Your Perfect Scent",
    description: "Get personalized perfume recommendations based on your preferences",
    image: require('../../assets/onboarding-1.png'),
  },
  {
    title: "Build Your Collection",
    description: "Keep track of perfumes you own, love, or want to try",
    image: require('../../assets/onboarding-2.png'),
  },
  {
    title: "Smart Recommendations",
    description: "Our AI learns your taste and suggests new fragrances you'll love",
    image: require('../../assets/onboarding-3.png'),
  },
];
```

#### Login Screen
**Location**: `app/(auth)/login.tsx`

**Form Fields**:
- Email (with validation)
- Password (with secure entry)
- "Remember Me" toggle
- "Forgot Password?" link
- Social login options (optional)

**API Integration**:
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authApi.login(email, password);
    await httpClient.setAuthToken(response.data.token);
    useAuthStore.getState().setUser(response.data.user);
    router.replace('/(tabs)/home');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

#### Registration Screen
**Location**: `app/(auth)/register.tsx`

**Form Fields**:
- Full Name
- Email
- Password (with strength indicator)
- Confirm Password
- Terms & Conditions agreement

**Validation Rules**:
- Email format validation
- Password minimum 8 characters
- Password confirmation match
- Required field validation

### 2. Main App - Tab Navigation

#### Home Screen (Recommendations)
**Location**: `app/(tabs)/home.tsx`

**Features**:
- Welcome message with user's name
- "Recommended for You" section
- Quick action buttons (Add to Collection, Get New Recommendations)
- Recently viewed perfumes
- Trending perfumes section

**API Calls**:
```typescript
// Get personalized recommendations
const { data: recommendations, isLoading } = useQuery({
  queryKey: ['recommendations', 'personalized'],
  queryFn: () => recommendationsApi.getPersonalized(10),
});

// Get user's recent activity
const { data: recentActivity } = useQuery({
  queryKey: ['collection', 'recent'],
  queryFn: () => collectionApi.getCollection(),
  select: (data) => data.data?.slice(0, 5), // Last 5 items
});
```

**UI Components**:
- Recommendation cards with swipe actions
- Loading skeletons
- Pull-to-refresh functionality
- Error states with retry options

#### Discover Screen (Browse Perfumes)
**Location**: `app/(tabs)/discover.tsx`

**Features**:
- Search bar with instant results
- Filter options (Brand, Category, Notes)
- Sort options (Popular, Newest, Price)
- Infinite scroll pagination
- Category browsing

**Search Implementation**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filters, setFilters] = useState({
  brand: [],
  category: [],
  notes: [],
});

const { data: searchResults, isLoading } = useQuery({
  queryKey: ['perfumes', 'search', searchQuery, filters],
  queryFn: () => perfumesApi.search(searchQuery),
  enabled: searchQuery.length > 2,
});
```

**Filter Modal**:
- Brand selection (multi-select)
- Category checkboxes
- Note tags (with search)
- Price range slider
- Clear all / Apply buttons

#### Collection Screen (My Perfumes)
**Location**: `app/(tabs)/collection.tsx`

**Features**:
- Tabbed interface: "Owned", "Loved", "Want to Try", "Disliked"
- Collection statistics (total items, favorite brands)
- Sort options (Date Added, Rating, Alphabetical)
- Bulk actions (delete, move between collections)
- Export collection feature

**Collection Item Card**:
```typescript
interface CollectionItemProps {
  item: CollectionItem;
  onEdit: (item: CollectionItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newType: CollectionType) => void;
}

const CollectionItemCard: React.FC<CollectionItemProps> = ({
  item,
  onEdit,
  onDelete,
  onMove,
}) => {
  return (
    <Pressable className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: item.perfume.image }} 
          className="w-16 h-16 rounded-lg mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-lg">{item.perfume.name}</Text>
          <Text className="text-gray-600">{item.perfume.brand}</Text>
          <Text className="text-sm text-gray-500">
            Added {formatDate(item.dateAdded)}
          </Text>
        </View>
        <View className="items-end">
          <StarRating rating={item.rating} size={16} />
          <CollectionBadge type={item.collectionType} />
        </View>
      </View>
    </Pressable>
  );
};
```

#### Profile Screen
**Location**: `app/(tabs)/profile.tsx`

**Features**:
- User profile information
- Account settings
- App preferences (notifications, theme)
- Collection statistics
- Recommendation history
- Logout functionality

**Settings Options**:
- Edit profile
- Change password
- Notification preferences
- Privacy settings
- Help & Support
- About the app

### 3. Modal/Detail Screens

#### Perfume Detail Screen
**Location**: `app/perfume/[id].tsx`

**Features**:
- High-resolution perfume image
- Comprehensive perfume information
- Notes breakdown (Top, Middle, Base)
- Similar perfumes section
- User reviews and ratings
- Add to collection action

**Screen Layout**:
```typescript
const PerfumeDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: perfume, isLoading } = useQuery({
    queryKey: ['perfume', id],
    queryFn: () => perfumesApi.getDetails(id),
  });

  const { data: similarPerfumes } = useQuery({
    queryKey: ['recommendations', 'similar', id],
    queryFn: () => recommendationsApi.getSimilar(id, 5),
  });

  return (
    <ScrollView className="flex-1 bg-white">
      <PerfumeImageCarousel images={perfume?.images} />
      <View className="p-4">
        <PerfumeHeader perfume={perfume} />
        <NotesSection notes={perfume?.notes} />
        <DescriptionSection description={perfume?.description} />
        <SimilarPerfumesSection perfumes={similarPerfumes} />
        <AddToCollectionButton perfumeId={id} />
      </View>
    </ScrollView>
  );
};
```

**Components**:
- Image carousel with zoom functionality
- Notes visualization (circular or linear)
- Rating stars with user rating capability
- Collection action buttons
- Similar perfumes horizontal scroll

#### Add to Collection Modal
**Location**: `components/modals/AddToCollectionModal.tsx`

**Features**:
- Collection type selection (Owned, Loved, Want to Try, Disliked)
- Rating input (1-5 stars)
- Personal notes text area
- Purchase information (optional)
- Quick add buttons for common actions

**Modal Implementation**:
```typescript
interface AddToCollectionModalProps {
  perfumeId: string;
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  perfumeId,
  isVisible,
  onClose,
  onSuccess,
}) => {
  const [collectionType, setCollectionType] = useState<CollectionType>('OWNS');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  const addToCollectionMutation = useMutation({
    mutationFn: (data: AddToCollectionData) => collectionApi.addToCollection(data),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white p-6">
        <CollectionTypeSelector 
          value={collectionType} 
          onChange={setCollectionType} 
        />
        <StarRatingInput 
          value={rating} 
          onChange={setRating} 
        />
        <TextInput
          placeholder="Add your notes..."
          multiline
          value={notes}
          onChangeText={setNotes}
          className="border border-gray-300 rounded-lg p-3 mt-4"
        />
        <View className="flex-row justify-between mt-6">
          <Button title="Cancel" onPress={onClose} variant="secondary" />
          <Button 
            title="Add to Collection" 
            onPress={() => addToCollectionMutation.mutate({
              perfumeId,
              collectionType,
              rating,
              notes,
            })}
            variant="primary"
          />
        </View>
      </View>
    </Modal>
  );
};
```

---

## User Interaction Patterns

### 1. Swipe Gestures
- **Recommendation Cards**: Swipe right to like, left to dislike
- **Collection Items**: Swipe left to reveal actions (edit, delete, move)
- **Image Galleries**: Swipe to navigate between images

### 2. Pull-to-Refresh
- All list screens support pull-to-refresh
- Visual feedback with loading spinner
- Automatic retry on network errors

### 3. Infinite Scroll
- Perfume lists automatically load more content
- Loading indicators at the bottom
- Smooth scrolling performance

### 4. Search Interaction
- Instant search with debounced queries
- Search history suggestions
- Recent searches persistence

---

## Platform-Specific Features

### iOS Specific
- **Haptic Feedback**: On button presses and swipe actions
- **SF Symbols**: Use system icons where appropriate
- **Safe Area Handling**: Proper insets for notched devices
- **iOS Design Guidelines**: Follow Apple HIG

### Android Specific
- **Material Design**: Follow Material Design 3 guidelines
- **Hardware Back Button**: Handle navigation properly
- **Status Bar**: Proper status bar styling
- **Android Notifications**: Rich notification support

### Cross-Platform
- **Responsive Design**: Adapt to different screen sizes
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: Screen reader support and proper labels
- **Performance**: Optimized for 60fps animations

---

## Data Persistence

### Local Storage Strategy
```typescript
// Secure storage for sensitive data
import * as SecureStore from 'expo-secure-store';

// Regular storage for app preferences
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache management
const CACHE_KEYS = {
  PERFUMES: 'perfumes_cache',
  RECOMMENDATIONS: 'recommendations_cache',
  USER_PREFERENCES: 'user_preferences',
};

// Offline data handling
const offlineStorage = {
  cachePerfumes: async (perfumes: Perfume[]) => {
    await AsyncStorage.setItem(CACHE_KEYS.PERFUMES, JSON.stringify(perfumes));
  },
  
  getCachedPerfumes: async (): Promise<Perfume[]> => {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PERFUMES);
    return cached ? JSON.parse(cached) : [];
  },
};
```

### Offline Functionality
- Cache recently viewed perfumes
- Store user collection locally
- Queue actions for when connection returns
- Graceful offline state handling

---

## Performance Optimizations

### 1. Image Optimization
```typescript
// Use Expo Image for better performance
import { Image } from 'expo-image';

const PerfumeImage: React.FC<{ source: string }> = ({ source }) => (
  <Image
    source={{ uri: source }}
    placeholder={require('../../assets/placeholder.png')}
    contentFit="cover"
    transition={200}
    style={{ width: 100, height: 100 }}
  />
);
```

### 2. List Performance
```typescript
// Use FlashList for better performance
import { FlashList } from '@shopify/flash-list';

const PerfumeList: React.FC<{ data: Perfume[] }> = ({ data }) => (
  <FlashList
    data={data}
    renderItem={({ item }) => <PerfumeCard perfume={item} />}
    estimatedItemSize={120}
    keyExtractor={(item) => item.id}
    onEndReached={loadMore}
    onEndReachedThreshold={0.5}
  />
);
```

### 3. State Management
- Use React Query for server state
- Implement proper loading states
- Cache API responses appropriately
- Optimistic updates for better UX

---

## Error Handling

### Network Error Handling
```typescript
const NetworkErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  return hasError ? (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-xl font-semibold mb-4">Connection Error</Text>
      <Text className="text-gray-600 text-center mb-6">
        Please check your internet connection and try again.
      </Text>
      <Button title="Retry" onPress={() => setHasError(false)} />
    </View>
  ) : (
    children
  );
};
```

### Form Validation
- Real-time validation feedback
- Error message display
- Field-specific error states
- Accessible error announcements

---

This covers the comprehensive feature specifications. Next, I'll create the component library and development guidelines. Would you like me to continue with those sections?