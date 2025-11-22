import { Recipe, Ingredient } from '../models/Recipe';

export interface ParsedRecipe {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
}

export const parseRecipeText = (text: string): ParsedRecipe => {
  return {
    title: 'Imported Recipe',
    ingredients: [],
    steps: [],
  };
};

export const parseRecipeJSON = (json: string): Recipe => {
  try {
    const data = JSON.parse(json);

    if (!data.title || !Array.isArray(data.ingredients) || !Array.isArray(data.steps)) {
      throw new Error('Invalid recipe format');
    }

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: data.title,
      ingredients: data.ingredients.map((ing: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        name: ing.name || '',
        qty: parseFloat(ing.qty) || 0,
        unit: ing.unit || '',
      })),
      steps: data.steps,
      createdAt: Date.now(),
    };

    return recipe;
  } catch (error) {
    throw new Error('Failed to parse JSON recipe');
  }
};
