# React Native Component Library
## Reusable UI Components for Perfume App

This document provides a comprehensive component library with examples and usage guidelines.

---

## Design System Foundation

### Color Palette
```typescript
// constants/Colors.ts
export const Colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Primary blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Secondary pink
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};
```

### Typography
```typescript
// constants/Typography.ts
export const Typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    heading: 'PlayfairDisplay-Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing
```typescript
// constants/Spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};
```

---

## Core UI Components

### 1. Button Component
```typescript
// components/ui/Button.tsx
import React from 'react';
import { 
  Pressable, 
  Text, 
  ActivityIndicator, 
  PressableProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingHorizontal: size === 'small' ? Spacing.sm : size === 'large' ? Spacing.lg : Spacing.md,
      paddingVertical: size === 'small' ? Spacing.xs : size === 'large' ? Spacing.md : Spacing.sm,
    };

    if (fullWidth) {
      baseStyles.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? Colors.neutral[300] : Colors.primary[500],
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? Colors.neutral[300] : Colors.secondary[500],
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? Colors.neutral[300] : Colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontFamily: Typography.fontFamily.semibold,
      fontSize: size === 'small' ? Typography.fontSize.sm : size === 'large' ? Typography.fontSize.lg : Typography.fontSize.base,
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseStyles,
          color: disabled ? Colors.neutral[500] : '#ffffff',
        };
      case 'outline':
        return {
          ...baseStyles,
          color: disabled ? Colors.neutral[500] : Colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyles,
          color: disabled ? Colors.neutral[500] : Colors.primary[500],
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyles(),
        pressed && { opacity: 0.8 },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary[500] : '#ffffff'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <React.Fragment>
              {icon}
              <Text style={{ width: Spacing.xs }} />
            </React.Fragment>
          )}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <React.Fragment>
              <Text style={{ width: Spacing.xs }} />
              {icon}
            </React.Fragment>
          )}
        </>
      )}
    </Pressable>
  );
};

// Usage Examples:
/*
<Button title="Login" variant="primary" />
<Button title="Cancel" variant="outline" />
<Button title="Loading..." loading />
<Button title="Add to Collection" icon={<PlusIcon />} />
*/
```

### 2. Input Component
```typescript
// components/ui/Input.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TextInputProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles: ViewStyle = {
    marginBottom: Spacing.md,
  };

  const labelStyles: TextStyle = {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.neutral[700],
    marginBottom: Spacing.xs,
  };

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error ? Colors.error : isFocused ? Colors.primary[500] : Colors.neutral[300],
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral[50],
  };

  const textInputStyles: TextStyle = {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[900],
  };

  const errorStyles: TextStyle = {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  };

  const hintStyles: TextStyle = {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={{ color: Colors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={{ marginRight: Spacing.sm }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[textInputStyles, inputStyle]}
          placeholderTextColor={Colors.neutral[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <View style={{ marginLeft: Spacing.sm }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && <Text style={errorStyles}>{error}</Text>}
      {hint && !error && <Text style={hintStyles}>{hint}</Text>}
    </View>
  );
};

// Usage Examples:
/*
<Input 
  label="Email" 
  placeholder="Enter your email" 
  required 
  leftIcon={<EmailIcon />}
/>
<Input 
  label="Password" 
  placeholder="Enter password" 
  secureTextEntry 
  error="Password is required"
/>
*/
```

### 3. Card Component
```typescript
// components/ui/Card.tsx
import React from 'react';
import { View, ViewStyle, Pressable, PressableProps } from 'react-native';
import { Colors, Spacing } from '../../constants';

interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  style,
  pressable = false,
  ...props
}) => {
  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 12,
      backgroundColor: Colors.neutral[50],
    };

    // Padding
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyles.padding = Spacing.sm;
        break;
      case 'medium':
        baseStyles.padding = Spacing.md;
        break;
      case 'large':
        baseStyles.padding = Spacing.lg;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          shadowColor: Colors.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: Colors.neutral[200],
        };
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: Colors.neutral[100],
        };
      default:
        return baseStyles;
    }
  };

  if (pressable) {
    return (
      <Pressable
        style={({ pressed }) => [
          getCardStyles(),
          pressed && { opacity: 0.9 },
          style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[getCardStyles(), style]}>
      {children}
    </View>
  );
};

// Usage Examples:
/*
<Card variant="elevated">
  <Text>Card content</Text>
</Card>

<Card variant="outlined" pressable onPress={() => console.log('Pressed')}>
  <Text>Pressable card</Text>
</Card>
*/
```

### 4. Star Rating Component
```typescript
// components/ui/StarRating.tsx
import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../constants';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  style?: ViewStyle;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
  style,
}) => {
  const handleStarPress = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  const stars = [];

  for (let i = 0; i < maxRating; i++) {
    const isFilled = i < rating;
    const isHalfFilled = i === Math.floor(rating) && rating % 1 !== 0;

    stars.push(
      <Pressable
        key={i}
        onPress={() => handleStarPress(i)}
        disabled={!interactive}
        style={{ marginRight: i < maxRating - 1 ? 2 : 0 }}
      >
        <Ionicons
          name={isFilled ? 'star' : isHalfFilled ? 'star-half' : 'star-outline'}
          size={size}
          color={isFilled || isHalfFilled ? Colors.warning : Colors.neutral[300]}
        />
      </Pressable>
    );
  }

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {stars}
    </View>
  );
};

// Usage Examples:
/*
<StarRating rating={4.5} />
<StarRating rating={3} interactive onChange={(rating) => console.log(rating)} />
*/
```

### 5. Loading Component
```typescript
// components/ui/Loading.tsx
import React from 'react';
import { View, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = Colors.primary[500],
  text,
  style,
  textStyle,
}) => {
  const containerStyles: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  };

  const defaultTextStyles: TextStyle = {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
    textAlign: 'center',
  };

  return (
    <View style={[containerStyles, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={[defaultTextStyles, textStyle]}>{text}</Text>}
    </View>
  );
};

// Usage Examples:
/*
<Loading />
<Loading text="Loading perfumes..." />
<Loading size="small" color={Colors.secondary[500]} />
*/
```

---

## Feature-Specific Components

### 1. Perfume Card Component
```typescript
// components/features/PerfumeCard.tsx
import React from 'react';
import { View, Text, Image, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { StarRating } from '../ui/StarRating';
import { Colors, Typography, Spacing } from '../../constants';

interface PerfumeCardProps {
  perfume: {
    id: string;
    name: string;
    brand: string;
    image?: string;
    rating?: number;
    price?: number;
    notes?: string[];
  };
  onPress: () => void;
  onAddToCollection?: () => void;
  style?: ViewStyle;
}

export const PerfumeCard: React.FC<PerfumeCardProps> = ({
  perfume,
  onPress,
  onAddToCollection,
  style,
}) => {
  const cardStyles: ViewStyle = {
    marginBottom: Spacing.md,
  };

  const imageStyles: ViewStyle = {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.neutral[100],
    marginBottom: Spacing.sm,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  };

  const titleStyles: TextStyle = {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    flex: 1,
    marginRight: Spacing.sm,
  };

  const brandStyles: TextStyle = {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[600],
    marginBottom: Spacing.xs,
  };

  const priceStyles: TextStyle = {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[600],
  };

  const notesStyles: TextStyle = {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  };

  return (
    <Card style={[cardStyles, style]} pressable onPress={onPress}>
      <Image
        source={{ uri: perfume.image || 'https://via.placeholder.com/300x200' }}
        style={imageStyles}
        resizeMode="cover"
      />
      
      <View style={headerStyles}>
        <View style={{ flex: 1 }}>
          <Text style={titleStyles} numberOfLines={2}>
            {perfume.name}
          </Text>
          <Text style={brandStyles}>{perfume.brand}</Text>
          
          {perfume.rating && (
            <StarRating rating={perfume.rating} size={16} />
          )}
        </View>
        
        {onAddToCollection && (
          <Pressable
            onPress={onAddToCollection}
            style={{
              padding: Spacing.xs,
              backgroundColor: Colors.primary[500],
              borderRadius: 20,
            }}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
          </Pressable>
        )}
      </View>
      
      {perfume.price && (
        <Text style={priceStyles}>${perfume.price}</Text>
      )}
      
      {perfume.notes && perfume.notes.length > 0 && (
        <Text style={notesStyles} numberOfLines={1}>
          {perfume.notes.join(', ')}
        </Text>
      )}
    </Card>
  );
};
```

### 2. Collection Badge Component
```typescript
// components/features/CollectionBadge.tsx
import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface CollectionBadgeProps {
  type: 'OWNS' | 'LOVES' | 'WANTS' | 'DISLIKES';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const CollectionBadge: React.FC<CollectionBadgeProps> = ({
  type,
  size = 'medium',
  style,
}) => {
  const getConfig = () => {
    switch (type) {
      case 'OWNS':
        return {
          label: 'Owned',
          backgroundColor: Colors.success,
          icon: '💝',
        };
      case 'LOVES':
        return {
          label: 'Loved',
          backgroundColor: Colors.error,
          icon: '❤️',
        };
      case 'WANTS':
        return {
          label: 'Want',
          backgroundColor: Colors.warning,
          icon: '🎯',
        };
      case 'DISLIKES':
        return {
          label: 'Disliked',
          backgroundColor: Colors.neutral[500],
          icon: '👎',
        };
      default:
        return {
          label: 'Unknown',
          backgroundColor: Colors.neutral[400],
          icon: '❓',
        };
    }
  };

  const config = getConfig();

  const badgeStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: size === 'small' ? Spacing.xs : Spacing.sm,
    paddingVertical: size === 'small' ? 2 : 4,
    borderRadius: 12,
    backgroundColor: config.backgroundColor,
  };

  const textStyles: TextStyle = {
    fontSize: size === 'small' ? Typography.fontSize.xs : Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#ffffff',
    marginLeft: 4,
  };

  return (
    <View style={[badgeStyles, style]}>
      <Text style={{ fontSize: size === 'small' ? 10 : 12 }}>
        {config.icon}
      </Text>
      <Text style={textStyles}>{config.label}</Text>
    </View>
  );
};
```

### 3. Notes Visualization Component
```typescript
// components/features/NotesVisualization.tsx
import React from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface Note {
  name: string;
  category: 'Top' | 'Middle' | 'Base';
}

interface NotesVisualizationProps {
  notes: Note[];
  style?: ViewStyle;
}

export const NotesVisualization: React.FC<NotesVisualizationProps> = ({
  notes,
  style,
}) => {
  const groupedNotes = {
    Top: notes.filter(note => note.category === 'Top'),
    Middle: notes.filter(note => note.category === 'Middle'),
    Base: notes.filter(note => note.category === 'Base'),
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Top':
        return Colors.warning;
      case 'Middle':
        return Colors.primary[500];
      case 'Base':
        return Colors.secondary[500];
      default:
        return Colors.neutral[400];
    }
  };

  const containerStyles: ViewStyle = {
    paddingVertical: Spacing.md,
  };

  const categoryStyles: ViewStyle = {
    marginBottom: Spacing.lg,
  };

  const categoryHeaderStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  };

  const categoryTitleStyles: TextStyle = {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.neutral[900],
    marginLeft: Spacing.sm,
  };

  const notesContainerStyles: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  };

  const noteTagStyles: ViewStyle = {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.neutral[100],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  };

  const noteTextStyles: TextStyle = {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[700],
  };

  return (
    <View style={[containerStyles, style]}>
      {Object.entries(groupedNotes).map(([category, categoryNotes]) => (
        categoryNotes.length > 0 && (
          <View key={category} style={categoryStyles}>
            <View style={categoryHeaderStyles}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: getCategoryColor(category),
                }}
              />
              <Text style={categoryTitleStyles}>
                {category} Notes
              </Text>
            </View>
            
            <View style={notesContainerStyles}>
              {categoryNotes.map((note, index) => (
                <View key={index} style={noteTagStyles}>
                  <Text style={noteTextStyles}>{note.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      ))}
    </View>
  );
};
```

### 4. Search Bar Component
```typescript
// components/features/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search perfumes...',
  onSearch,
  onClear,
  style,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    onClear?.();
  };

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: isFocused ? Colors.primary[500] : Colors.neutral[200],
  };

  const inputStyles: TextStyle = {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.neutral[900],
    marginLeft: Spacing.sm,
  };

  return (
    <View style={[containerStyles, style]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={isFocused ? Colors.primary[500] : Colors.neutral[400]} 
      />
      
      <TextInput
        style={inputStyles}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral[400]}
        value={query}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(query)}
      />
      
      {query.length > 0 && (
        <Pressable onPress={handleClear} style={{ padding: 4 }}>
          <Ionicons name="close" size={20} color={Colors.neutral[400]} />
        </Pressable>
      )}
    </View>
  );
};
```

---

## Usage Guidelines

### 1. Component Composition
```typescript
// Example: Perfume Detail Screen
const PerfumeDetailScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Card variant="elevated" padding="large">
        <Image source={{ uri: perfume.image }} style={styles.image} />
        <Text style={styles.title}>{perfume.name}</Text>
        <Text style={styles.brand}>{perfume.brand}</Text>
        <StarRating rating={perfume.rating} />
        <NotesVisualization notes={perfume.notes} />
        <Button 
          title="Add to Collection" 
          variant="primary" 
          fullWidth 
          onPress={handleAddToCollection}
        />
      </Card>
    </ScrollView>
  );
};
```

### 2. Theme Consistency
- Always use colors from the Colors constant
- Use consistent spacing from Spacing constant
- Follow typography scales from Typography constant
- Maintain consistent border radius (8px for small, 12px for cards)

### 3. Accessibility
- Add proper accessibility labels
- Ensure minimum touch target size (44px)
- Use semantic colors for different states
- Support screen readers with proper role attributes

### 4. Performance Tips
- Use React.memo for components that don't change frequently
- Implement proper key props for lists
- Use FlatList/FlashList for large datasets
- Optimize image loading with placeholder states

---

This component library provides a solid foundation for building the React Native app. Next, I'll create the development guidelines and deployment documentation. Would you like me to continue with those sections?