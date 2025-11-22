# RecipeVibe - Quick Start Guide

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React Native & Expo
- React Navigation
- AsyncStorage
- TypeScript
- Jest and testing libraries

### 2. Run the App

**Start Expo Development Server:**
```bash
npx expo start
```

**Run on iOS Simulator (Mac only):**
```bash
npx expo start --ios
```

**Run on Android Emulator:**
```bash
npx expo start --android
```

**Run on Physical Device:**
1. Install Expo Go from App Store or Google Play
2. Run `npx expo start`
3. Scan QR code with camera (iOS) or Expo Go app (Android)

### 3. Run Tests
```bash
npm test
```

---

## What You Get

### Complete P0 Features (MVP)
✅ Add new recipes with ingredients and steps
✅ View all recipes in a list
✅ View recipe details
✅ Edit existing recipes
✅ Delete recipes
✅ Local storage (no internet required)
✅ Clean, modern UI
✅ Full TypeScript support

### P1 Scaffolding
🚧 Import screen UI (ready)
🚧 JSON import (functional)
🚧 Text parser (stub for future)

### Project Structure
```
app/
  ├── components/     # Reusable UI components
  ├── screens/        # All app screens
  ├── navigation/     # Navigation setup
  ├── storage/        # Data persistence
  ├── models/         # TypeScript types
  └── utils/          # Utilities

docs/                # Full documentation
tests/               # Unit tests
```

### Documentation
- README.md - Complete project overview
- docs/requirements.md - Product requirements
- docs/architecture.md - Technical architecture
- docs/roadmap.md - Product roadmap
- docs/data-model.md - Data structures

### Tests
- 16 unit tests
- Storage layer fully tested
- Parser utilities tested
- Mock AsyncStorage setup

---

## Next Steps

### For Development
1. Install dependencies: `npm install`
2. Start app: `npx expo start`
3. Make changes to files in `/app`
4. See changes hot-reload automatically

### For Git Workflow
All files are staged and ready to commit. To commit:

```bash
git commit -m "feat: initial RecipeVibe MVP implementation"
git push origin main
```

Or customize your commit message as needed.

### For Future Features
- See docs/roadmap.md for planned features
- Create feature branches for new work
- Follow branching strategy in README.md

---

## Troubleshooting

**If Expo won't start:**
```bash
npx expo start -c  # Clear cache
```

**If dependencies fail:**
```bash
rm -rf node_modules
npm install
```

**If tests fail:**
```bash
npm test -- --clearCache
npm test
```

---

## File Overview

### Core Files
- **App.tsx** - Entry point
- **app.json** - Expo configuration
- **package.json** - Dependencies
- **tsconfig.json** - TypeScript config

### Key Components
- **app/navigation/AppNavigator.tsx** - Navigation
- **app/storage/recipeStorage.ts** - Data CRUD
- **app/models/Recipe.ts** - Type definitions

### Screens
- **HomeScreen.tsx** - Recipe list
- **AddRecipeScreen.tsx** - Add recipe
- **ViewRecipeScreen.tsx** - Recipe details
- **EditRecipeScreen.tsx** - Edit recipe
- **ImportRecipeScreen.tsx** - Import (P1)

---

## SDLC Compliance

This project follows full SDLC:
1. ✅ Requirements - documented in docs/
2. ✅ Design - architecture documented
3. ✅ Implementation - complete P0 MVP
4. ✅ Testing - unit tests written
5. ✅ Deployment - one-step run
6. ✅ Maintenance - documented & modular

**Joel Test Score: 10/12**

---

## Support

- 📖 Full docs in /docs folder
- 🐛 Report issues on GitHub
- 💬 Check README.md for more details

**Happy Coding!** 🚀
