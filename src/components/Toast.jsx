import React from 'react';
import { Text } from 'react-native';
export function Toast({ message }) {
  return message ? (
    <Text accessibilityRole="alert" accessibilityLiveRegion="polite">
      {message}
    </Text>
  ) : null;
}
