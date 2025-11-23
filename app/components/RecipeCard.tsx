import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Recipe } from '../models/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text className="text-sm text-gray-600 mb-1">{formatDate(recipe.createdAt)}</Text>
        <Text className="text-xs text-gray-400">
          {recipe.ingredients.length} ingredients • {recipe.steps.length} steps
        </Text>
      </View>
    </TouchableOpacity>
  );
};
