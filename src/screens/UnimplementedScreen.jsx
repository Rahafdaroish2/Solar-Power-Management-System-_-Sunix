import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
// Intentionally blank. Replace route bindings only after UI/UX is supplied.
export function UnimplementedScreen() {
  const t = useTheme();
  return <View style={{ flex: 1, backgroundColor: t.colors.white }} />;
}
