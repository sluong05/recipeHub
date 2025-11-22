import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Import Recipe</Text>
      <Text style={styles.subtitle}>
        This feature is under development (P1 priority)
      </Text>

      <View style={styles.typeSelector}>
        <Button
          title="Text"
          onPress={() => setImportType('text')}
          variant={importType === 'text' ? 'primary' : 'secondary'}
          style={styles.typeButton}
        />
        <Button
          title="JSON"
          onPress={() => setImportType('json')}
          variant={importType === 'json' ? 'primary' : 'secondary'}
          style={styles.typeButton}
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
        style={styles.textArea}
      />

      <View style={styles.actions}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Import"
          onPress={handleImport}
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
});
