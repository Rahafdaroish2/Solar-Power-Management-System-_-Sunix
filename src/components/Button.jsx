import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
export function Button({
  children,
  label,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  ...props
}) {
  const t = useTheme();
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={[
        {
          minHeight: t.controls.minHeight,
          padding: t.spacing.sm,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            variant === 'primary' ? t.colors.solarYellow : t.colors.skyBlue,
          opacity: disabled ? t.opacity.disabled : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={t.colors.deepNavy} />
      ) : (
        children || <Text style={{ color: t.colors.deepNavy }}>{label}</Text>
      )}
    </Pressable>
  );
}
export const PrimaryButton = (props) => <Button {...props} variant="primary" />;
export const SecondaryButton = (props) => (
  <Button {...props} variant="secondary" />
);
