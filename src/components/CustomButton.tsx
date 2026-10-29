import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

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
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled || loading) return colors.border;
    switch (variant) {
      case 'secondary':
        return colors.primaryLight;
      case 'danger':
        return colors.danger;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return colors.textMuted;
    switch (variant) {
      case 'secondary':
      case 'outline':
        return colors.primary;
      case 'danger':
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && [styles.outlineBorder, { borderColor: colors.primary }],
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
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
    width: '100%',
    marginVertical: 4,
  },
  outlineBorder: {
    borderWidth: 1.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
