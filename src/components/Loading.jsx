import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
export function Loading({ fullScreen = false, label = 'Loading', style }) {
  const t = useTheme();
  return (
    <View
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
      style={[
        {
          padding: t.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fullScreen && { flex: 1 },
        style,
      ]}
    >
      <ActivityIndicator color={t.colors.deepNavy} />
    </View>
  );
}
export const ChatLoading = (props) => (
  <Loading {...props} label="Waiting for reply" />
);
export function Skeleton({ width = '100%', height = 20, style }) {
  const t = useTheme();
  return (
    <View
      accessibilityLabel="Loading content"
      accessibilityState={{ busy: true }}
      style={[{ width, height, backgroundColor: t.colors.skyBlue }, style]}
    />
  );
}
