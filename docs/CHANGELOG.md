# Changelog

All notable changes to RecipeHub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with React Native and Expo
- Core recipe storage functionality using AsyncStorage
- Recipe CRUD operations (Create, Read, Update, Delete)
- Basic navigation structure with React Navigation
- Home screen with recipe list
- Add recipe screen with dynamic ingredients and steps
- View recipe screen for detailed recipe display
- Edit recipe screen for modifying existing recipes
- Import recipe functionality (JSON format)
- Reusable UI components (Button, Input, RecipeCard)
- TypeScript types and models
- Unit tests for storage and parser utilities
- Project documentation (requirements, architecture, roadmap, data model)
- NativeWind (Tailwind CSS) for styling all components and screens
- Tailwind configuration files (tailwind.config.js, global.css)
- NativeWind TypeScript definitions (nativewind-env.d.ts)

### Changed
- Rebranded project name to RecipeHub
- Updated documentation with correct version numbers
- Migrated all components from React Native StyleSheet to NativeWind/Tailwind CSS
- Replaced `style` props with `className` props across all components and screens
- Updated architecture documentation to reflect NativeWind integration
- Updated Babel configuration to include NativeWind plugin

### Removed
- All StyleSheet.create() usage in favor of Tailwind utility classes
- Legacy inline styles in components

### Fixed
- Version numbers in markdown documentation files

## [0.1.0] - TBD
This is when the first release has been made, for now please add all changes as a bulleted item under the unreleased section

### Added
- Initial release of RecipeHub

---

## How to Use This Changelog

### For Developers
When making changes to the project, add entries under the `[Unreleased]` section in the appropriate category:
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed in upcoming releases
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security-related changes

### For Releases
When creating a new release:
1. Change `[Unreleased]` to `[version] - YYYY-MM-DD`
2. Create a new `[Unreleased]` section at the top
3. Update the version links at the bottom

### Format Guidelines
- Keep entries concise and user-focused
- Use present tense ("Add feature" not "Added feature")
- Reference issue/PR numbers when applicable
- Group similar changes together
- List breaking changes prominently
