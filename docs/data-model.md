# RecipeHub - Data Model Documentation

## Overview
RecipeHub uses a simple, document-based data model stored in AsyncStorage. All data is stored locally on the device with no backend dependencies in the current version.

---

## Core Data Types

### Recipe
The primary entity representing a single recipe.

```typescript
type Recipe = {
  id: string;           // Unique identifier (timestamp-based)
  title: string;        // Recipe name/title
  ingredients: Ingredient[];  // List of ingredients
  steps: string[];      // Ordered cooking instructions
  createdAt: number;    // Creation timestamp (Unix time)
};
```

#### Field Descriptions

**id**: `string`
- Unique identifier for the recipe
- Generated using `Date.now().toString()`
- Used for lookups, updates, and deletions
- Example: `"1699564800000"`

**title**: `string`
- Human-readable recipe name
- Required field (validated on save)
- Trimmed of whitespace
- No length restrictions
- Example: `"Chocolate Chip Cookies"`

**ingredients**: `Ingredient[]`
- Array of ingredient objects
- Minimum 1 ingredient required
- No maximum limit
- See Ingredient type below

**steps**: `string[]`
- Ordered array of cooking instructions
- Minimum 1 step required
- No maximum limit
- Each step is a free-form text string
- Example: `["Preheat oven to 350°F", "Mix dry ingredients", ...]`

**createdAt**: `number`
- Unix timestamp (milliseconds since epoch)
- Generated at recipe creation
- Never modified (even on edits)
- Used for sorting (newest first)
- Example: `1699564800000`

---

### Ingredient
A single ingredient with quantity information.

```typescript
type Ingredient = {
  id: string;      // Unique identifier within recipe
  name: string;    // Ingredient name
  qty: number;     // Quantity amount
  unit: string;    // Unit of measurement
};
```

#### Field Descriptions

**id**: `string`
- Unique identifier within the recipe's ingredient list
- Generated using `Date.now().toString()` or composite timestamp
- Example: `"1699564800001"`

**name**: `string`
- Name of the ingredient
- Required field (validated on save)
- Trimmed of whitespace
- Example: `"All-purpose flour"`

**qty**: `number`
- Numeric quantity amount
- Must be greater than 0
- Supports decimals (e.g., 1.5, 0.25)
- Example: `2.5`

**unit**: `string`
- Unit of measurement
- Required field (validated on save)
- Free-form text (no enum restrictions)
- Common values: `"cups"`, `"tsp"`, `"oz"`, `"grams"`, `"whole"`
- Example: `"cups"`

---

## Storage Schema

### AsyncStorage Key
- **Key**: `"recipes"`
- **Type**: String (JSON)
- **Format**: Serialized array of Recipe objects

### Storage Format
```json
[
  {
    "id": "1699564800000",
    "title": "Chocolate Chip Cookies",
    "ingredients": [
      {
        "id": "1699564800001",
        "name": "Flour",
        "qty": 2,
        "unit": "cups"
      },
      {
        "id": "1699564800002",
        "name": "Sugar",
        "qty": 1,
        "unit": "cup"
      }
    ],
    "steps": [
      "Preheat oven to 350°F",
      "Mix dry ingredients",
      "Add wet ingredients",
      "Bake for 12 minutes"
    ],
    "createdAt": 1699564800000
  }
]
```

### Storage Operations

#### Read All Recipes
```typescript
const data = await AsyncStorage.getItem('recipes');
const recipes: Recipe[] = data ? JSON.parse(data) : [];
```

#### Save New Recipe
```typescript
const recipes = await getAllRecipes();
const updatedRecipes = [...recipes, newRecipe];
await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
```

#### Update Recipe
```typescript
const recipes = await getAllRecipes();
const index = recipes.findIndex(r => r.id === recipe.id);
recipes[index] = updatedRecipe;
await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
```

#### Delete Recipe
```typescript
const recipes = await getAllRecipes();
const filtered = recipes.filter(r => r.id !== recipeId);
await AsyncStorage.setItem('recipes', JSON.stringify(filtered));
```

---

## Validation Rules

### Recipe Validation
- `title`: Must not be empty or whitespace-only
- `ingredients`: Must have at least one valid ingredient
- `steps`: Must have at least one non-empty step
- `id`: Must be unique (handled by timestamp generation)
- `createdAt`: Must be valid Unix timestamp

### Ingredient Validation
- `name`: Must not be empty or whitespace-only
- `qty`: Must be greater than 0
- `unit`: Must not be empty or whitespace-only
- `id`: Must be unique within recipe

### Validation Implementation
Validation occurs in screen components before save operations:
- `AddRecipeScreen.tsx:93` - validateRecipe()
- `EditRecipeScreen.tsx:128` - validateRecipe()

---

## Data Relationships

### Current Model (Flat)
```
Recipe
  ├── Ingredient[] (embedded)
  └── steps[] (embedded)
```

- No foreign keys or references
- All data embedded within Recipe object
- No normalization
- Simple, denormalized structure

### Future Enhancements (Not Implemented)

#### With Categories
```
Recipe
  ├── categoryId → Category
  ├── Ingredient[]
  └── steps[]

Category
  ├── id
  ├── name
  └── color
```

#### With Tags
```
Recipe
  ├── tags[] → Tag[]
  ├── Ingredient[]
  └── steps[]

Tag
  ├── id
  └── name
```

---

## Indexes & Sorting

### Default Sort
Recipes sorted by `createdAt` descending (newest first)
```typescript
recipes.sort((a, b) => b.createdAt - a.createdAt)
```

### Lookup by ID
Linear search through array
```typescript
recipes.find(r => r.id === recipeId)
```

### Future Indexes (Not Implemented)
- Title search index
- Ingredient name index
- Tag index
- Category index

---

## Data Migration

### Version 1.0 Schema
Current schema (documented above)

### Future Migration Strategy
When schema changes are needed:
1. Version the schema (`schemaVersion` field)
2. Detect old version on app load
3. Run migration function
4. Update schema version
5. Save migrated data

Example migration:
```typescript
// Adding category field
const migrateV1toV2 = (recipes: Recipe[]): RecipeV2[] => {
  return recipes.map(recipe => ({
    ...recipe,
    categoryId: 'uncategorized',
    schemaVersion: 2
  }));
};
```

---

## Import/Export Formats

### JSON Export Format
Same as storage format - direct serialization of Recipe objects.

```json
{
  "id": "1699564800000",
  "title": "Recipe Name",
  "ingredients": [...],
  "steps": [...],
  "createdAt": 1699564800000
}
```

### JSON Import Format
Flexible format accepting:
```json
{
  "title": "Recipe Name",
  "ingredients": [
    {"name": "Flour", "qty": 2, "unit": "cups"}
  ],
  "steps": ["Step 1", "Step 2"]
}
```

Import generates new `id`, `createdAt`, and ingredient `id` fields.

### Text Import Format (P1 - Not Implemented)
Will parse free-form recipe text:
```
Recipe Name

Ingredients:
- 2 cups flour
- 1 cup sugar

Instructions:
1. Mix ingredients
2. Bake at 350F
```

---

## Constraints & Limitations

### AsyncStorage Limits
- **Max Size**: ~6-10MB (varies by platform)
- **Performance**: Linear degradation with size
- **Mitigation**: Will migrate to SQLite if needed

### Current Limits
- **No hard limit** on recipes (constrained by AsyncStorage)
- **No hard limit** on ingredients per recipe
- **No hard limit** on steps per recipe
- Estimated capacity: ~5000-10000 recipes before performance issues

### Data Types Not Supported
- Binary data (photos) - Future enhancement
- Relationships between recipes
- User accounts
- Cloud sync

---

## Security Considerations

### Data Privacy
- All data stored locally on device
- No network transmission
- No third-party access
- Device encryption applies (iOS/Android)

### Input Sanitization
- Title, ingredient names, steps are plain text
- No HTML or script execution risk
- JSON parsing wrapped in try-catch
- No SQL injection risk (no SQL database)

---

## Performance Characteristics

### Read Performance
- **All Recipes**: O(1) - single AsyncStorage read + JSON parse
- **Single Recipe**: O(n) - linear search through array
- **Typical Time**: <50ms for 100 recipes

### Write Performance
- **Save/Update/Delete**: O(n) - read all, modify, write all
- **Typical Time**: <100ms for 100 recipes

### Memory Usage
- All recipes loaded into memory
- Typical size: ~1KB per recipe
- 1000 recipes ≈ 1MB memory

### Optimization Opportunities (Future)
- SQLite for indexed queries
- Pagination for large lists
- Virtual scrolling (already using FlatList)
- Lazy loading recipe details

---

## Testing Data

### Mock Recipe
```typescript
const mockRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  ingredients: [
    { id: '1', name: 'Flour', qty: 2, unit: 'cups' },
    { id: '2', name: 'Sugar', qty: 1, unit: 'cup' },
  ],
  steps: ['Mix ingredients', 'Bake at 350F'],
  createdAt: Date.now(),
};
```

Test data available in:
- `tests/recipeStorage.test.ts:14`
- `tests/recipeParser.test.ts:6`

---

## API Reference

### Storage Functions

All functions defined in `app/storage/recipeStorage.ts`

```typescript
// Get all recipes
getAllRecipes(): Promise<Recipe[]>

// Save new recipe
saveRecipe(recipe: Recipe): Promise<void>

// Update existing recipe
updateRecipe(recipe: Recipe): Promise<void>

// Delete recipe by ID
deleteRecipe(id: string): Promise<void>

// Get single recipe by ID
getRecipeById(id: string): Promise<Recipe | null>
```

### Parser Functions

All functions defined in `app/utils/recipeParser.ts`

```typescript
// Parse JSON recipe format
parseRecipeJSON(json: string): Recipe

// Parse text recipe (stub)
parseRecipeText(text: string): ParsedRecipe
```

---

## Change Log

### v1.0.0 (Current)
- Initial data model
- Recipe and Ingredient types
- AsyncStorage persistence
- CRUD operations

### Future Versions
- v1.1.0: Add search/filter metadata
- v1.2.0: Add photo references
- v2.0.0: Add categories and tags
- v3.0.0: Add user and sync metadata
