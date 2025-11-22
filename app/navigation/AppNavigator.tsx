import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddRecipeScreen } from '../screens/AddRecipeScreen';
import { ViewRecipeScreen } from '../screens/ViewRecipeScreen';
import { EditRecipeScreen } from '../screens/EditRecipeScreen';

export type RootStackParamList = {
  Home: undefined;
  AddRecipe: undefined;
  ViewRecipe: { recipeId: string };
  EditRecipe: { recipeId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'RecipeHub' }}
        />
        <Stack.Screen
          name="AddRecipe"
          component={AddRecipeScreen}
          options={{ title: 'Add Recipe' }}
        />
        <Stack.Screen
          name="ViewRecipe"
          component={ViewRecipeScreen}
          options={{ title: 'Recipe Details' }}
        />
        <Stack.Screen
          name="EditRecipe"
          component={EditRecipeScreen}
          options={{ title: 'Edit Recipe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
