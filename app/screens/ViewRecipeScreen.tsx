import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Recipe } from '../models/Recipe';
import { getRecipeById, deleteRecipe } from '../storage/recipeStorage';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type ViewRecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ViewRecipe'
>;
type ViewRecipeScreenRouteProp = RouteProp<RootStackParamList, 'ViewRecipe'>;

interface ViewRecipeScreenProps {
  navigation: ViewRecipeScreenNavigationProp;
  route: ViewRecipeScreenRouteProp;
}

export const ViewRecipeScreen: React.FC<ViewRecipeScreenProps> = ({
  navigation,
  route,
}) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const data = await getRecipeById(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Failed to load recipe:', error);
      Alert.alert('Error', 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipe();
    }, [recipeId])
  );

  const handleEdit = () => {
    if (recipe) {
      navigation.navigate('EditRecipe', { recipeId: recipe.id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipeId);
              Alert.alert('Success', 'Recipe deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-lg text-gray-600 mb-4">Recipe not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4">
      <Text className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</Text>
      <Text className="text-sm text-gray-600 mb-6">
        Created: {new Date(recipe.createdAt).toLocaleDateString()}
      </Text>

      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-3">Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <View key={ingredient.id} className="bg-white p-3 rounded-lg mb-2">
            <Text className="text-base text-gray-800">
              {index + 1}. {ingredient.name} - {ingredient.qty} {ingredient.unit}
            </Text>
          </View>
        ))}
      </View>

      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-3">Steps</Text>
        {recipe.steps.map((step, index) => (
          <View key={index} className="flex-row bg-white p-3 rounded-lg mb-2">
            <Text className="text-base font-semibold text-gray-600 mr-2">{index + 1}.</Text>
            <Text className="flex-1 text-base text-gray-800">{step}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row gap-3 mt-4 mb-8">
        <Button
          title="Edit"
          onPress={handleEdit}
          variant="secondary"
          className="flex-1"
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          variant="danger"
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
};
