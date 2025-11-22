import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input
        label="Recipe Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter recipe title"
      />

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <View key={ingredient.id} style={styles.ingredientContainer}>
          <Text style={styles.itemNumber}>{index + 1}.</Text>
          <View style={styles.ingredientInputs}>
            <Input
              value={ingredient.name}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, 'name', value)
              }
              placeholder="Name"
              style={styles.ingredientName}
            />
            <Input
              value={ingredient.qty.toString()}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, 'qty', parseFloat(value) || 0)
              }
              placeholder="Qty"
              keyboardType="decimal-pad"
              style={styles.ingredientQty}
            />
            <Input
              value={ingredient.unit}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, 'unit', value)
              }
              placeholder="Unit"
              style={styles.ingredientUnit}
            />
          </View>
          {ingredients.length > 1 && (
            <Button
              title="Remove"
              onPress={() => removeIngredient(ingredient.id)}
              variant="danger"
              style={styles.removeButton}
            />
          )}
        </View>
      ))}
      <Button title="Add Ingredient" onPress={addIngredient} variant="secondary" />

      <Text style={styles.sectionTitle}>Steps</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <Text style={styles.itemNumber}>{index + 1}.</Text>
          <View style={styles.stepInput}>
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
              style={styles.removeButton}
            />
          )}
        </View>
      ))}
      <Button title="Add Step" onPress={addStep} variant="secondary" />

      <View style={styles.actions}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title={saving ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginRight: 8,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  ingredientName: {
    flex: 2,
  },
  ingredientQty: {
    flex: 1,
  },
  ingredientUnit: {
    flex: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 8,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
});
