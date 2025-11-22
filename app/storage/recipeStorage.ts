import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../models/Recipe';

const STORAGE_KEY = 'recipes';

export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as Recipe[];
  } catch (error) {
    console.error('Error loading recipes:', error);
    throw new Error('Failed to load recipes');
  }
};

export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    const updatedRecipes = [...recipes, recipe];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
};

export const updateRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    const index = recipes.findIndex((r) => r.id === recipe.id);

    if (index === -1) {
      throw new Error('Recipe not found');
    }

    recipes[index] = recipe;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw new Error('Failed to update recipe');
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    const filteredRecipes = recipes.filter((r) => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecipes));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const recipes = await getAllRecipes();
    return recipes.find((r) => r.id === id) || null;
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    throw new Error('Failed to get recipe');
  }
};
