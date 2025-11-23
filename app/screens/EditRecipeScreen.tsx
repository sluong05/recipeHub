import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Recipe, Ingredient } from '../models/Recipe';
import { getRecipeById, updateRecipe } from '../storage/recipeStorage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type EditRecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditRecipe'
>;
type EditRecipeScreenRouteProp = RouteProp<RootStackParamList, 'EditRecipe'>;

interface EditRecipeScreenProps {
  navigation: EditRecipeScreenNavigationProp;
  route: EditRecipeScreenRouteProp;
}

export const EditRecipeScreen: React.FC<EditRecipeScreenProps> = ({
  navigation,
  route,
}) => {
  const { recipeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState(0);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const recipe = await getRecipeById(recipeId);
      if (recipe) {
        setTitle(recipe.title);
        setIngredients(recipe.ingredients);
        setSteps(recipe.steps);
        setCreatedAt(recipe.createdAt);
      } else {
        Alert.alert('Error', 'Recipe not found', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipe', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipe();
    }, [recipeId])
  );

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', qty: 0, unit: '' },
    ]);
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string | number
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const validateRecipe = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a recipe title');
      return false;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.qty > 0 && ing.unit.trim()
    );
    if (validIngredients.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one complete ingredient'
      );
      return false;
    }

    const validSteps = steps.filter((step) => step.trim());
    if (validSteps.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one step');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateRecipe()) {
      return;
    }

    try {
      setSaving(true);

      const validIngredients = ingredients.filter(
        (ing) => ing.name.trim() && ing.qty > 0 && ing.unit.trim()
      );
      const validSteps = steps.filter((step) => step.trim());

      const recipe: Recipe = {
        id: recipeId,
        title: title.trim(),
        ingredients: validIngredients,
        steps: validSteps,
        createdAt,
      };

      await updateRecipe(recipe);
      Alert.alert('Success', 'Recipe updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4">
      <Input
        label="Recipe Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter recipe title"
      />

      <Text className="text-xl font-bold text-gray-800 mt-6 mb-4">Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <View key={ingredient.id} className="flex-row items-start mb-3">
          <Text className="text-base font-semibold text-gray-600 mt-3 mr-2">{index + 1}.</Text>
          <View className="flex-1 flex-row gap-2">
            <Input
              value={ingredient.name}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, 'name', value)
              }
              placeholder="Name"
              className="flex-[2]"
            />
            <Input
              value={ingredient.qty.toString()}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, 'qty', parseFloat(value) || 0)
              }
              placeholder="Qty"
              keyboardType="decimal-pad"
              className="flex-1"
            />
            <Input
              value={ingredient.unit}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, 'unit', value)
              }
              placeholder="Unit"
              className="flex-1"
            />
          </View>
          {ingredients.length > 1 && (
            <Button
              title="Remove"
              onPress={() => removeIngredient(ingredient.id)}
              variant="danger"
              className="ml-2 mt-2 py-2 px-3"
            />
          )}
        </View>
      ))}
      <Button title="Add Ingredient" onPress={addIngredient} variant="secondary" />

      <Text className="text-xl font-bold text-gray-800 mt-6 mb-4">Steps</Text>
      {steps.map((step, index) => (
        <View key={index} className="flex-row items-start mb-3">
          <Text className="text-base font-semibold text-gray-600 mt-3 mr-2">{index + 1}.</Text>
          <View className="flex-1">
            <Input
              value={step}
              onChangeText={(value) => updateStep(index, value)}
              placeholder={`Step ${index + 1}`}
              multiline
            />
          </View>
          {steps.length > 1 && (
            <Button
              title="Remove"
              onPress={() => removeStep(index)}
              variant="danger"
              className="ml-2 mt-2 py-2 px-3"
            />
          )}
        </View>
      ))}
      <Button title="Add Step" onPress={addStep} variant="secondary" />

      <View className="flex-row gap-3 mt-8 mb-8">
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
          className="flex-1"
        />
        <Button
          title={saving ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
};
