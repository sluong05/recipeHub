import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../storage/recipeStorage';
import { RecipeCard } from '../components/RecipeCard';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('ViewRecipe', { recipeId: recipe.id });
  };

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipe');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-800 mb-4">My Recipes</Text>
        <Button title="Add Recipe" onPress={handleAddRecipe} />
      </View>

      {recipes.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</Text>
          <Text className="text-sm text-gray-400 text-center">
            Tap "Add Recipe" to create your first recipe
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
          )}
          className="p-4"
        />
      )}
    </View>
  );
};
