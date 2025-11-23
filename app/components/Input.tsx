import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-semibold text-gray-800 mb-2">{label}</Text>}
      <TextInput
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg py-3 px-4 text-base bg-white ${className}`}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
};
