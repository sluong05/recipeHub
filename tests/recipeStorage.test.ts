import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAllRecipes,
  saveRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
} from '../app/storage/recipeStorage';
import { Recipe } from '../app/models/Recipe';

describe('Recipe Storage', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

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

  describe('getAllRecipes', () => {
    it('should return empty array when no recipes exist', async () => {
      const recipes = await getAllRecipes();
      expect(recipes).toEqual([]);
    });

    it('should return all stored recipes', async () => {
      await AsyncStorage.setItem('recipes', JSON.stringify([mockRecipe]));
      const recipes = await getAllRecipes();
      expect(recipes).toHaveLength(1);
      expect(recipes[0].title).toBe('Test Recipe');
    });

    it('should throw error on storage failure', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'));
      await expect(getAllRecipes()).rejects.toThrow('Failed to load recipes');
    });
  });

  describe('saveRecipe', () => {
    it('should save a new recipe', async () => {
      await saveRecipe(mockRecipe);
      const recipes = await getAllRecipes();
      expect(recipes).toHaveLength(1);
      expect(recipes[0].id).toBe('1');
    });

    it('should append recipe to existing recipes', async () => {
      await saveRecipe(mockRecipe);
      const newRecipe = { ...mockRecipe, id: '2', title: 'Second Recipe' };
      await saveRecipe(newRecipe);
      const recipes = await getAllRecipes();
      expect(recipes).toHaveLength(2);
    });

    it('should throw error on save failure', async () => {
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));
      await expect(saveRecipe(mockRecipe)).rejects.toThrow('Failed to save recipe');
    });
  });

  describe('updateRecipe', () => {
    it('should update an existing recipe', async () => {
      await saveRecipe(mockRecipe);
      const updatedRecipe = { ...mockRecipe, title: 'Updated Recipe' };
      await updateRecipe(updatedRecipe);
      const recipes = await getAllRecipes();
      expect(recipes[0].title).toBe('Updated Recipe');
    });

    it('should throw error when recipe not found', async () => {
      await expect(updateRecipe(mockRecipe)).rejects.toThrow('Failed to update recipe');
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe by id', async () => {
      await saveRecipe(mockRecipe);
      await deleteRecipe('1');
      const recipes = await getAllRecipes();
      expect(recipes).toHaveLength(0);
    });

    it('should not affect other recipes', async () => {
      await saveRecipe(mockRecipe);
      const newRecipe = { ...mockRecipe, id: '2', title: 'Second Recipe' };
      await saveRecipe(newRecipe);
      await deleteRecipe('1');
      const recipes = await getAllRecipes();
      expect(recipes).toHaveLength(1);
      expect(recipes[0].id).toBe('2');
    });
  });

  describe('getRecipeById', () => {
    it('should return recipe when found', async () => {
      await saveRecipe(mockRecipe);
      const recipe = await getRecipeById('1');
      expect(recipe).not.toBeNull();
      expect(recipe?.title).toBe('Test Recipe');
    });

    it('should return null when recipe not found', async () => {
      const recipe = await getRecipeById('999');
      expect(recipe).toBeNull();
    });
  });
});
