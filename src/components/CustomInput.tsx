import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
}

const CustomInput = forwardRef<TextInput, CustomInputProps>(({ label, error, style, ...rest }, ref) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            color: colors.text,
          },
          error ? { borderColor: colors.danger, backgroundColor: colors.dangerLight } : null,
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error ? <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
});

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
