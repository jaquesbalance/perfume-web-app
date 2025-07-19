# React Native Deployment Guide
## Build and Deploy Perfume App to iOS, Android, and Web

This guide covers the complete deployment process for the React Native Perfume App using Expo.

---

## Prerequisites

### Development Environment
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- EAS CLI installed globally: `npm install -g eas-cli`
- Git configured for version control

### Apple Developer Account (iOS)
- Active Apple Developer Program membership ($99/year)
- Xcode installed on macOS (for local builds)
- iOS device for testing

### Google Play Console (Android)
- Google Play Developer account ($25 one-time fee)
- Android device for testing

---

## Project Configuration

### 1. Configure app.json/app.config.js
```javascript
// app.config.js
export default {
  expo: {
    name: "Perfume Recommendation App",
    slug: "perfume-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.perfumeapp",
      buildNumber: "1",
      icon: "./assets/icon-ios.png",
      infoPlist: {
        NSCameraUsageDescription: "This app uses camera to take photos of perfumes",
        NSPhotoLibraryUsageDescription: "This app accesses photo library to select perfume images",
        NSUserNotificationsUsageDescription: "This app sends notifications about new recommendations"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.perfumeapp",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff",
          sounds: ["./assets/notification.wav"]
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you select perfume images",
          cameraPermission: "The app accesses your camera to let you take photos of perfumes"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "YOUR_PROJECT_ID"
      }
    }
  }
};
```

### 2. Configure EAS Build
```json
// eas.json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Environment Configuration
```typescript
// src/config/environment.ts
import Constants from 'expo-constants';

const ENV = {
  development: {
    API_URL: 'http://localhost:3000',
    API_KEY: 'dev-api-key',
  },
  staging: {
    API_URL: 'https://staging-api.yourapp.com',
    API_KEY: 'staging-api-key',
  },
  production: {
    API_URL: 'https://api.yourapp.com',
    API_KEY: 'production-api-key',
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.development;
  } else if (Constants.expoConfig?.extra?.environment === 'staging') {
    return ENV.staging;
  } else {
    return ENV.production;
  }
};

export default getEnvVars();
```

---

## Asset Requirements

### App Icons
- **iOS**: 1024x1024 PNG (no transparency)
- **Android**: 1024x1024 PNG (adaptive icon)
- **Web**: 512x512 PNG (favicon)

### Splash Screen
- **Image**: 1242x2436 PNG (3x resolution)
- **Background**: Solid color matching brand

### Store Assets
- **App Screenshots**: 
  - iOS: 6.7" (1290x2796) and 5.5" (1242x2208)
  - Android: Various sizes for different devices
- **App Preview Video**: 30 seconds max
- **Feature Graphic**: 1024x500 PNG (Google Play)

---

## Development Build

### 1. Create Development Build
```bash
# Login to Expo
npx expo login

# Initialize EAS
eas init

# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Install on device
eas build --profile development --platform ios --local
eas build --profile development --platform android --local
```

### 2. Run Development Server
```bash
# Start Metro bundler
npx expo start --dev-client

# For specific platforms
npx expo start --ios
npx expo start --android
npx expo start --web
```

---

## Testing Strategy

### 1. Unit Testing
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### 2. E2E Testing with Detox
```bash
# Install Detox
npm install --save-dev detox

# Configure Detox
npx detox init

# Run E2E tests
npx detox test
```

### 3. Manual Testing Checklist
- [ ] App launches successfully
- [ ] Login/Registration flow works
- [ ] API calls handle errors gracefully
- [ ] Navigation works on all screens
- [ ] Search functionality works
- [ ] Collection management works
- [ ] Recommendations display correctly
- [ ] Offline functionality works
- [ ] Push notifications work
- [ ] App handles background/foreground transitions

---

## Production Build

### 1. Pre-build Checklist
- [ ] Update version numbers in app.json
- [ ] Test on real devices
- [ ] Verify all API endpoints work
- [ ] Check app performance
- [ ] Validate store assets
- [ ] Review app permissions
- [ ] Test offline functionality
- [ ] Verify push notifications

### 2. Build for Production
```bash
# Build for iOS
eas build --profile production --platform ios

# Build for Android
eas build --profile production --platform android

# Build for both platforms
eas build --profile production --platform all
```

### 3. Local Building (Optional)
```bash
# Build locally for iOS (requires macOS)
eas build --profile production --platform ios --local

# Build locally for Android
eas build --profile production --platform android --local
```

---

## App Store Deployment

### iOS App Store

#### 1. Prepare App Store Connect
- Create app record in App Store Connect
- Configure app information, pricing, and availability
- Upload app metadata and screenshots
- Set up App Store review information

#### 2. Submit to App Store
```bash
# Submit iOS build
eas submit --platform ios

# Or submit manually via App Store Connect
# Download .ipa file and upload via Xcode or App Store Connect
```

#### 3. App Store Metadata
```
App Name: Perfume Recommendation App
Subtitle: Discover Your Perfect Scent
Description: 
Discover your perfect fragrance with our AI-powered perfume recommendation app. Get personalized suggestions based on your preferences, build your collection, and explore new scents.

Key Features:
• Personalized perfume recommendations
• Collection management (owned, loved, wishlist)
• Detailed fragrance information and notes
• Smart search and filtering
• Offline functionality
• Beautiful, intuitive interface

Keywords: perfume, fragrance, scent, recommendation, beauty, cosmetics
Category: Lifestyle
Age Rating: 4+ (suitable for all ages)
```

### Android Google Play Store

#### 1. Prepare Google Play Console
- Create app in Google Play Console
- Configure store listing
- Set up app signing
- Configure release management

#### 2. Submit to Google Play
```bash
# Submit Android build
eas submit --platform android

# Or upload manually via Google Play Console
# Download .aab file and upload via Google Play Console
```

#### 3. Google Play Store Metadata
```
Title: Perfume Recommendation App
Short Description: Discover your perfect fragrance with AI-powered recommendations
Full Description:
Discover your perfect fragrance with our intelligent perfume recommendation app. Whether you're a fragrance novice or a seasoned collector, our app helps you find scents you'll love.

FEATURES:
🎯 Personalized Recommendations - Get suggestions based on your preferences and collection
📚 Collection Management - Keep track of perfumes you own, love, or want to try
🔍 Smart Search - Find perfumes by notes, brand, or characteristics
📱 Offline Access - Browse your collection even without internet
🎨 Beautiful Interface - Elegant design focused on user experience

Perfect for:
• Fragrance enthusiasts and collectors
• People discovering new scents
• Gift shoppers looking for perfume ideas
• Anyone wanting to organize their fragrance collection

Start your fragrance journey today!

Category: Beauty
Content Rating: Everyone
```

---

## Web Deployment

### 1. Build for Web
```bash
# Build web version
npx expo export --platform web

# Build with custom output directory
npx expo export --platform web --output-dir dist
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Configure vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Deploy to Netlify
```bash
# Build command: npm run build:web
# Publish directory: dist

# Configure _redirects file
/* /index.html 200

# Configure netlify.toml
[build]
  command = "npm run build:web"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Over-the-Air (OTA) Updates

### 1. Configure EAS Update
```bash
# Install EAS Update
npx expo install expo-updates

# Configure updates in app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### 2. Publish Updates
```bash
# Publish update to development
eas update --branch development --message "Bug fixes and improvements"

# Publish update to production
eas update --branch production --message "New features and improvements"

# Publish update to specific channel
eas update --branch production --channel production --message "Production release"
```

### 3. Update Strategy
- **Development**: Push updates frequently for testing
- **Staging**: Push updates for QA testing
- **Production**: Push updates for critical fixes only
- **Version Control**: Use semantic versioning for updates

---

## Monitoring and Analytics

### 1. Crash Reporting
```bash
# Install Sentry
npm install @sentry/react-native

# Configure Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});
```

### 2. Analytics
```bash
# Install Firebase Analytics
npm install @react-native-firebase/app @react-native-firebase/analytics

# Configure Firebase
import analytics from '@react-native-firebase/analytics';

// Track screen views
analytics().logScreenView({
  screen_name: 'PerfumeDetail',
  screen_class: 'PerfumeDetailScreen',
});
```

### 3. Performance Monitoring
```bash
# Install Flipper (development)
npm install --save-dev react-native-flipper

# Monitor app performance
- Memory usage
- Network requests
- Database queries
- Render performance
```

---

## Security Considerations

### 1. API Security
- Use HTTPS for all API communications
- Implement proper authentication tokens
- Store sensitive data in secure storage
- Validate all user inputs

### 2. Code Obfuscation
```javascript
// Configure Metro for production
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierConfig = {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  };
}

module.exports = config;
```

### 3. App Security
- Implement certificate pinning
- Use secure HTTP headers
- Validate SSL certificates
- Implement proper session management

---

## Maintenance and Updates

### 1. Regular Updates
- **Monthly**: Security patches and bug fixes
- **Quarterly**: New features and improvements
- **Annually**: Major version updates

### 2. App Store Optimization (ASO)
- Monitor app store rankings
- Update keywords and descriptions
- Respond to user reviews
- Analyze download metrics

### 3. User Feedback
- Implement in-app feedback system
- Monitor app store reviews
- Track user analytics
- Conduct user surveys

---

## Troubleshooting Common Issues

### Build Issues
```bash
# Clear cache
npx expo install --fix
npm start -- --reset-cache

# Clear EAS cache
eas build --clear-cache

# Reset Metro cache
npx expo start --clear
```

### Platform-Specific Issues
```bash
# iOS simulator issues
npx expo run:ios --simulator

# Android emulator issues
npx expo run:android --device

# Web build issues
npx expo export --platform web --clear
```

### Deployment Issues
- Check bundle identifier/package name
- Verify certificates and provisioning profiles
- Validate app permissions
- Test on different devices/OS versions

---

This comprehensive deployment guide covers everything needed to successfully build, test, and deploy the React Native Perfume App to all major platforms. The guide includes practical examples, security considerations, and maintenance strategies for long-term success.

Next, I can create additional documentation for specific areas like testing strategies, performance optimization, or advanced features if needed.