import React, { useState } from 'react';
import { View, ScrollView, Text, Alert, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { parseRecipeJSON, parseRecipeText } from '../utils/recipeParser';
import { saveRecipe } from '../storage/recipeStorage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type ImportRecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface ImportRecipeScreenProps {
  navigation: ImportRecipeScreenNavigationProp;
}

export const ImportRecipeScreen: React.FC<ImportRecipeScreenProps> = ({
  navigation,
}) => {
  const [text, setText] = useState('');
  const [importType, setImportType] = useState<'text' | 'json'>('text');

  const handleImportJSON = async () => {
    try {
      const recipe = parseRecipeJSON(text);
      await saveRecipe(recipe);
      Alert.alert('Success', 'Recipe imported successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to import JSON recipe');
    }
  };

  const handleImportText = async () => {
    try {
      const parsed = parseRecipeText(text);
      Alert.alert('Note', 'Text parsing is not yet implemented. This is a placeholder for P1 functionality.');
    } catch (error) {
      Alert.alert('Error', 'Failed to parse recipe text');
    }
  };

  const handleImport = () => {
    if (!text.trim()) {
      Alert.alert('Validation Error', 'Please enter recipe data to import');
      return;
    }

    if (importType === 'json') {
      handleImportJSON();
    } else {
      handleImportText();
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-2">Import Recipe</Text>
      <Text className="text-sm text-gray-600 mb-6">
        This feature is under development (P1 priority)
      </Text>

      <View className="flex-row gap-3 mb-6">
        <Button
          title="Text"
          onPress={() => setImportType('text')}
          variant={importType === 'text' ? 'primary' : 'secondary'}
          className="flex-1"
        />
        <Button
          title="JSON"
          onPress={() => setImportType('json')}
          variant={importType === 'json' ? 'primary' : 'secondary'}
          className="flex-1"
        />
      </View>

      <Input
        label={importType === 'json' ? 'Paste JSON' : 'Paste Recipe Text'}
        value={text}
        onChangeText={setText}
        placeholder={
          importType === 'json'
            ? '{"title": "...", "ingredients": [...], "steps": [...]}'
            : 'Paste recipe text here...'
        }
        multiline
        className="min-h-[200px]"
      />

      <View className="flex-row gap-3 mt-6">
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
          className="flex-1"
        />
        <Button
          title="Import"
          onPress={handleImport}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
};
