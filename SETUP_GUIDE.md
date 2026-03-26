# AmolFirstAIApp - React Native Setup Guide

## Project Overview
This is a React Native project built with JavaScript (not TypeScript) using React Native CLI (not Expo). The project follows a scalable and production-ready architecture.

## Tech Stack
- React Native 0.84.1
- Redux Toolkit for state management
- React Navigation for navigation
- Axios for API calls
- JavaScript (ES6+)

## Project Structure
```
src/
├── components/     # Reusable UI components
├── screens/       # Screen components
├── navigation/    # Navigation configuration
├── services/      # API services and network calls
├── store/         # Redux store and slices
├── hooks/         # Custom React hooks
└── utils/         # Utility functions and constants
```

## Setup Commands Used

### 1. Create React Native Project
```bash
npx @react-native-community/cli@latest init AmolFirstAIApp
```

### 2. Create Folder Structure
```bash
mkdir src
mkdir src\components
mkdir src\screens
mkdir src\navigation
mkdir src\services
mkdir src\store
mkdir src\hooks
mkdir src\utils
```

### 3. Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux axios react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack
```

## Running the App

### Prerequisites
- Node.js >= 22.11.0
- Android Studio with Android SDK
- Android emulator or physical device

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (if on macOS)
```bash
npm run ios
```

## Features Implemented

### 1. Authentication System
- Login screen with form validation
- Redux-based authentication state management
- Mock authentication API

### 2. Navigation
- Stack navigator setup
- Conditional navigation based on auth state
- Clean navigation structure

### 3. State Management
- Redux Toolkit configuration
- Auth slice with login/logout actions
- Custom Redux hooks

### 4. API Services
- Axios configuration with interceptors
- Mock authentication API
- Example user profile API integration

### 5. Screens
- **LoginScreen**: Authentication interface with form validation
- **HomeScreen**: Dashboard with user info and API data display

### 6. Utilities
- Constants for colors, sizes, spacing
- Helper functions for validation, formatting
- Production-ready utility functions

## Key Files

### Core Files
- `App.js` - Main app entry point with Redux provider
- `src/store/index.js` - Redux store configuration
- `src/navigation/AppNavigator.js` - Navigation setup

### Screens
- `src/screens/LoginScreen.js` - Login interface
- `src/screens/HomeScreen.js` - Home dashboard

### Services
- `src/services/api.js` - API configuration and services

### Redux
- `src/store/slices/authSlice.js` - Authentication state management

### Utilities
- `src/utils/constants.js` - App constants
- `src/utils/helpers.js` - Helper functions

## Development Notes

### Authentication Flow
1. User enters credentials on LoginScreen
2. Redux dispatches login action
3. Mock API validates credentials
4. On success, user is redirected to HomeScreen
5. Logout action clears auth state and returns to LoginScreen

### API Integration
- Uses JSONPlaceholder for mock API calls
- Axios interceptors for request/response logging
- Error handling with user-friendly messages

### State Management
- Redux Toolkit for predictable state updates
- Async actions for API calls
- Loading states and error handling

## Next Steps for Production

1. **Environment Configuration**
   - Add environment variables for API endpoints
   - Configure different environments (dev, staging, prod)

2. **Security**
   - Implement secure storage for tokens
   - Add request/response encryption
   - Implement proper authentication with JWT

3. **Testing**
   - Add unit tests for Redux slices
   - Add component tests for screens
   - Add integration tests for API services

4. **Performance**
   - Implement code splitting
   - Add lazy loading for screens
   - Optimize bundle size

5. **UI/UX**
   - Add loading indicators
   - Implement proper error boundaries
   - Add accessibility features

## Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build issues**: Clean build with `cd android && ./gradlew clean`
3. **Navigation issues**: Ensure all dependencies are properly installed

### Debug Commands
```bash
# Check React Native CLI version
npx react-native --version

# Check installed packages
npm list

# Start with reset cache
npx react-native start --reset-cache

# Android specific debugging
npx react-native run-android --verbose
```

## Architecture Benefits

1. **Scalability**: Clean folder structure allows easy expansion
2. **Maintainability**: Separated concerns and modular code
3. **Testability**: Redux and services are easily testable
4. **Performance**: Optimized navigation and state management
5. **Developer Experience**: Clear structure and comprehensive tooling
