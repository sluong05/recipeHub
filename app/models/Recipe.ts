export type Ingredient = {
  id: string;
  name: string;
  qty: number;
  unit: string;
};

export type Recipe = {
  id: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  createdAt: number;
};
