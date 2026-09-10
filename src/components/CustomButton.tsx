import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '../theme/Colors';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export default function CustomButton({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: CustomButtonProps) {
  const getBackgroundColor = () => {
    if (disabled || loading) return Colors.border;
    switch (variant) {
      case 'secondary':
        return Colors.primaryLight;
      case 'danger':
        return Colors.danger;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return Colors.textMuted;
    switch (variant) {
      case 'secondary':
      case 'outline':
        return Colors.primary;
      case 'danger':
      case 'primary':
      default:
        return Colors.white;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineBorder,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? Colors.primary : Colors.white}
        />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
