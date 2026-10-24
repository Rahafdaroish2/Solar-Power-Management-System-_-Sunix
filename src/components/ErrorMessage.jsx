import React from 'react';
import { View, Text } from 'react-native';
import { normalizeError } from '../utils/errors';
import { SecondaryButton } from './Button';
export function ErrorMessage({ error, onRetry }) {
  if (!error) return null;
  return (
    <View accessibilityRole="alert">
      <Text>{normalizeError(error).message}</Text>
      {onRetry ? <SecondaryButton label="Retry" onPress={onRetry} /> : null}
    </View>
  );
}
