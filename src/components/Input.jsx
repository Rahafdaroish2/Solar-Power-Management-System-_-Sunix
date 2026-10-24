import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
export function Input({ label, error, style, ...props }) {
  const t = useTheme();
  return (
    <View>
      <Text>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={props.accessibilityLabel || label}
        accessibilityHint={error || props.accessibilityHint}
        style={[
          {
            minHeight: t.controls.minHeight,
            borderWidth: 1,
            borderColor: t.colors.deepNavy,
            padding: t.spacing.sm,
            color: t.colors.deepNavy,
          },
          style,
        ]}
      />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}
