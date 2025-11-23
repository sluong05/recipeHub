# RecipeHub - Architecture Document

## Technology Stack

### Core Technologies
- **React Native** `0.81.5`: Cross-platform mobile framework
- **Expo** `~54.0.0`: Development platform and tooling
- **TypeScript** `~5.9.2`: Type-safe development
- **React** `19.1.0`: UI library
- **React Navigation** `6.1.9`: Navigation management
- **NativeWind**: Tailwind CSS for React Native

### Key Dependencies
- `@react-navigation/native` `6.1.9` - Navigation framework
- `@react-navigation/stack` `6.3.20` - Stack navigator
- `@react-native-async-storage/async-storage` `2.2.0` - Local storage
- `react-native-gesture-handler` `~2.28.0` - Touch gesture handling
- `react-native-screens` `~4.16.0` - Native screen optimization
- `react-native-safe-area-context` `~5.6.0` - Safe area handling
- `expo-status-bar` `~3.0.8` - Status bar component
- `nativewind` - Tailwind CSS utility-first styling
- `tailwindcss` `3.3.2` - CSS framework for NativeWind

### Development Tools
- **Jest** `29.7.0`: Testing framework
- **React Native Testing Library** `12.3.2`: Component testing
- **TypeScript** `~5.9.2`: Static type checking
- **Babel** `^7.20.0`: JavaScript transpilation
- **Babel Preset Expo** `~54.0.0`: Expo Babel configuration

## Project Structure

```
recipeStorage/
├── app/                          # Application code
│   ├── components/               # Reusable UI components
│   │   ├── Button.tsx           # Custom button component
│   │   ├── Input.tsx            # Text input component
│   │   └── RecipeCard.tsx       # Recipe list item
│   ├── screens/                 # Screen components
│   │   ├── HomeScreen.tsx       # Recipe list screen
│   │   ├── AddRecipeScreen.tsx  # Add recipe form
│   │   ├── ViewRecipeScreen.tsx # Recipe detail view
│   │   ├── EditRecipeScreen.tsx # Edit recipe form
│   │   └── ImportRecipeScreen.tsx # Import functionality (P1)
│   ├── navigation/              # Navigation configuration
│   │   └── AppNavigator.tsx     # Main navigator setup
│   ├── storage/                 # Data persistence
│   │   └── recipeStorage.ts     # AsyncStorage CRUD operations
│   ├── models/                  # TypeScript types
│   │   └── Recipe.ts            # Recipe and Ingredient types
│   └── utils/                   # Utility functions
│       └── recipeParser.ts      # Recipe parsing utilities
├── docs/                        # Documentation
│   ├── requirements.md
│   ├── architecture.md
│   ├── roadmap.md
│   └── data-model.md
├── tests/                       # Test files
│   ├── setup.ts                 # Test configuration
│   ├── recipeStorage.test.ts    # Storage tests
│   └── recipeParser.test.ts     # Parser tests
├── App.tsx                      # Root component
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── babel.config.js              # Babel config
├── tailwind.config.js           # Tailwind CSS configuration
├── global.css                   # Tailwind CSS directives
└── nativewind-env.d.ts          # NativeWind TypeScript definitions
```

## Architecture Patterns

### 1. Component Architecture
- **Functional Components**: All components use React hooks
- **Separation of Concerns**: UI, business logic, and data separated
- **Reusability**: Shared components in `/components`
- **Props Typing**: Strong TypeScript typing for all props
- **Styling**: NativeWind (Tailwind CSS) utility classes via `className` prop

### 2. Navigation Pattern
- **Stack Navigation**: Used for hierarchical screen flow
- **Type-Safe Routes**: TypeScript param lists for navigation
- **Focus Effects**: Reload data when screens come into focus

### 3. Data Flow
```
User Input → Screen Component → Storage Layer → AsyncStorage
                ↓                      ↓
            UI Update  ←──────  Data Retrieved
```

### 4. State Management
- **Local State**: React useState for component state
- **No Global State**: Simple app doesn't require Redux/MobX
- **Persistent State**: AsyncStorage for data persistence

### 5. Styling Architecture
- **NativeWind**: Tailwind CSS utility-first styling for React Native
- **Utility Classes**: All styling done via `className` prop
- **Responsive Design**: Tailwind's responsive utilities
- **No StyleSheet**: Replaced React Native StyleSheet with Tailwind classes
- **Consistency**: Unified styling approach across all components and screens
- **Color Palette**:
  - Primary: `bg-blue-500` (buttons)
  - Secondary: `bg-gray-500` (secondary actions)
  - Danger: `bg-red-500` (delete/remove actions)
  - Backgrounds: `bg-gray-100` (screens), `bg-white` (cards/inputs)
  - Text: `text-gray-800` (primary), `text-gray-600` (secondary), `text-gray-400` (tertiary)

## Component Descriptions

### Screens

#### HomeScreen
- **Purpose**: Display list of all recipes
- **Features**:
  - FlatList rendering
  - Pull-to-refresh on focus
  - Empty state handling
  - Navigation to detail/add screens
- **Location**: `app/screens/HomeScreen.tsx:1`

#### AddRecipeScreen
- **Purpose**: Create new recipes
- **Features**:
  - Dynamic ingredient list
  - Dynamic step list
  - Form validation
  - Add/remove ingredients and steps
- **Location**: `app/screens/AddRecipeScreen.tsx:1`

#### ViewRecipeScreen
- **Purpose**: Display recipe details
- **Features**:
  - Read-only recipe view
  - Edit and delete actions
  - Formatted ingredient display
- **Location**: `app/screens/ViewRecipeScreen.tsx:1`

#### EditRecipeScreen
- **Purpose**: Modify existing recipes
- **Features**:
  - Pre-populated form
  - Same functionality as AddRecipeScreen
  - Update existing recipe
- **Location**: `app/screens/EditRecipeScreen.tsx:1`

#### ImportRecipeScreen (P1)
- **Purpose**: Import recipes from external sources
- **Features**:
  - JSON import (functional)
  - Text parsing (stub)
  - Type selection
- **Location**: `app/screens/ImportRecipeScreen.tsx:1`

### Components

#### Button
- **Purpose**: Reusable styled button
- **Variants**: primary, secondary, danger
- **Location**: `app/components/Button.tsx:1`

#### Input
- **Purpose**: Text input with label and error
- **Features**: Validation error display
- **Location**: `app/components/Input.tsx:1`

#### RecipeCard
- **Purpose**: Recipe list item
- **Features**: Touch handling, formatted display
- **Location**: `app/components/RecipeCard.tsx:1`

### Storage Layer

#### recipeStorage.ts
- **Purpose**: All AsyncStorage operations
- **Functions**:
  - `getAllRecipes()`: Fetch all recipes
  - `saveRecipe(recipe)`: Add new recipe
  - `updateRecipe(recipe)`: Update existing recipe
  - `deleteRecipe(id)`: Remove recipe
  - `getRecipeById(id)`: Fetch single recipe
- **Location**: `app/storage/recipeStorage.ts:1`

### Utilities

#### recipeParser.ts
- **Purpose**: Parse external recipe data
- **Functions**:
  - `parseRecipeJSON(json)`: Parse JSON format (P0)
  - `parseRecipeText(text)`: Parse text format (P1 stub)
- **Location**: `app/utils/recipeParser.ts:1`

## Data Storage

### AsyncStorage Schema
- **Key**: `"recipes"`
- **Value**: JSON string of Recipe array
- **Format**: `[{Recipe}, {Recipe}, ...]`

### Data Operations
- **Read**: Parse JSON from AsyncStorage
- **Write**: Stringify and save to AsyncStorage
- **Error Handling**: Try-catch with user-friendly errors

## Testing Strategy

### Unit Tests
- **Storage Layer**: All CRUD operations tested
- **Parser**: JSON parsing and validation tested
- **Coverage**: Core business logic

### Test Files
- `tests/recipeStorage.test.ts`: Storage tests
- `tests/recipeParser.test.ts`: Parser tests
- `tests/setup.ts`: Test environment configuration

### Mocking
- AsyncStorage mocked for testing
- No actual device storage used in tests

## Error Handling

### User-Facing Errors
- Alert dialogs for all errors
- Descriptive error messages
- Graceful degradation

### Developer Errors
- Console logging for debugging
- TypeScript compile-time checks
- Runtime error boundaries (future)

## Performance Considerations

### Optimizations
- FlatList for efficient rendering
- useFocusEffect for smart data loading
- Minimal re-renders with proper state management

### Scalability
- Handles 1000+ recipes
- Efficient JSON parsing
- No memory leaks

## Security Considerations

### Data Privacy
- All data stored locally
- No network requests
- No analytics or tracking

### Input Validation
- Title required
- Ingredients validated
- Steps validated
- Prevent empty saves

## Future Architecture Improvements

### Potential Enhancements
1. **State Management**: Redux or MobX for complex state
2. **Database**: SQLite for better query performance
3. **Image Storage**: Recipe photos with local file system
4. **Cloud Sync**: Firebase or custom backend
5. **Offline-First**: Service workers for web version
6. **Error Boundaries**: React error boundary components
7. **Performance Monitoring**: Sentry or similar
8. **Code Splitting**: Lazy load screens
