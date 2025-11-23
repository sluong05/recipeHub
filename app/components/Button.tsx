import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    danger: 'bg-red-500',
  };

  return (
    <TouchableOpacity
      className={`py-3 px-6 rounded-lg items-center justify-center ${variantClasses[variant]} ${className}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className="text-white text-base font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
