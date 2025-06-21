# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an English phrase practice React Native app built with Expo. The app helps users study English phrases by displaying Japanese text with toggle-able English translations. It features a swipeable card interface with gesture controls, text-to-speech functionality, and integration with a Notion API for phrase data and progress tracking.

## Key Commands

### Development
- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version

### Testing & Quality
- `npm test` - Run Jest tests with watch mode
- `npm run lint` - Run Expo linter for code quality

### Project Management
- `npm run reset-project` - Reset to blank project template

## Architecture

### Core Structure
- **Expo Router**: File-based routing with tabs layout
- **Main Screen**: `app/(tabs)/index.tsx` - HomeScreen with swipeable phrase cards
- **Card Component**: `components/PhraseCard.tsx` - Individual phrase display with TTS
- **Theming**: Light/dark theme support with `Colors.ts` and themed components

### Key Features
1. **Gesture-based Navigation**: Uses react-native-gesture-handler and react-native-reanimated for smooth card swiping
2. **Audio Playback**: expo-av integration for text-to-speech of English phrases
3. **External API Integration**: Fetches phrase data from Notion API and updates completion status
4. **Responsive Design**: Adapts to different screen sizes with dynamic card positioning

### State Management
- Local React state for phrase management, current index, and English visibility
- Phrase data fetched from `EXPO_PUBLIC_API_URL/api/notion/getData`
- Progress tracking via `EXPO_PUBLIC_API_URL/api/notion/updateData`

### Data Flow
1. HomeScreen fetches and shuffles phrases on mount
2. Three cards rendered (previous, current, next) with absolute positioning
3. Swipe gestures trigger card transitions and state updates
4. Archive functionality marks phrases as "Completed" in external API

### Environment Configuration
- Uses environment variables with `EXPO_PUBLIC_API_URL` prefix
- Environment files: `.env.local`, `.env.production`
- TypeScript with strict mode and path aliases (`@/*`)

### Component Architecture
- **Themed Components**: ThemedText, ThemedView for consistent styling
- **Custom Hooks**: useColorScheme, useThemeColor for theme management
- **Gesture Integration**: GestureHandlerRootView wraps main interface
- **Audio Management**: Proper cleanup of Audio.Sound instances to prevent memory leaks

## Development Notes

### Testing
- Jest with jest-expo preset
- Snapshot testing for components
- Test files located in `components/__tests__/`

### Platform Support
- iOS, Android, and Web via Expo
- Platform-specific styling for tab bars and shadows
- Responsive design considerations for different screen sizes

### Key Dependencies
- expo-router: File-based navigation
- react-native-gesture-handler: Swipe gestures
- react-native-reanimated: Smooth animations
- expo-av: Audio playback for TTS
- TypeScript: Type safety throughout

### Code Patterns
- Functional components with hooks
- TypeScript interfaces for data structures
- StyleSheet for component styling
- Error handling for API calls and audio playback
- Memory management for audio resources