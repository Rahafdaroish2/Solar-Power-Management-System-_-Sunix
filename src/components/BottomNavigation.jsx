import React from 'react';
import { View } from 'react-native';
import { Button } from './Button';
export function BottomNavigation({ items, selectedKey, onSelect }) {
  return (
    <View>
      {items.map((item) => (
        <Button
          key={item.key}
          label={item.label}
          accessibilityHint={selectedKey === item.key ? 'Selected' : undefined}
          onPress={() => onSelect(item.key)}
        />
      ))}
    </View>
  );
}
