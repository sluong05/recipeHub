import { parseRecipeJSON, parseRecipeText } from '../app/utils/recipeParser';
import { Recipe } from '../app/models/Recipe';

describe('Recipe Parser', () => {
  describe('parseRecipeJSON', () => {
    it('should parse valid JSON recipe', () => {
      const json = JSON.stringify({
        title: 'Chocolate Cake',
        ingredients: [
          { name: 'Flour', qty: 2, unit: 'cups' },
          { name: 'Sugar', qty: 1, unit: 'cup' },
        ],
        steps: ['Mix ingredients', 'Bake at 350F'],
      });

      const recipe = parseRecipeJSON(json);

      expect(recipe.title).toBe('Chocolate Cake');
      expect(recipe.ingredients).toHaveLength(2);
      expect(recipe.ingredients[0].name).toBe('Flour');
      expect(recipe.steps).toHaveLength(2);
      expect(recipe.id).toBeDefined();
      expect(recipe.createdAt).toBeDefined();
    });

    it('should throw error for invalid JSON', () => {
      expect(() => parseRecipeJSON('invalid json')).toThrow('Failed to parse JSON recipe');
    });

    it('should throw error for missing required fields', () => {
      const json = JSON.stringify({
        title: 'Test Recipe',
      });

      expect(() => parseRecipeJSON(json)).toThrow('Failed to parse JSON recipe');
    });

    it('should handle ingredients with missing fields', () => {
      const json = JSON.stringify({
        title: 'Test Recipe',
        ingredients: [
          { name: 'Flour' },
        ],
        steps: ['Step 1'],
      });

      const recipe = parseRecipeJSON(json);
      expect(recipe.ingredients[0].qty).toBe(0);
      expect(recipe.ingredients[0].unit).toBe('');
    });
  });

  describe('parseRecipeText', () => {
    it('should return stub structure for text parsing', () => {
      const result = parseRecipeText('Some recipe text');

      expect(result.title).toBe('Imported Recipe');
      expect(result.ingredients).toEqual([]);
      expect(result.steps).toEqual([]);
    });

    it('should handle empty text', () => {
      const result = parseRecipeText('');

      expect(result.title).toBe('Imported Recipe');
      expect(result.ingredients).toEqual([]);
      expect(result.steps).toEqual([]);
    });
  });
});
