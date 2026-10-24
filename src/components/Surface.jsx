import React from 'react';
import { View, Text, Image, Modal as NativeModal } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
export function Card({ children, style, ...props }) {
  const t = useTheme();
  return (
    <View
      {...props}
      style={[
        { padding: t.spacing.md, backgroundColor: t.colors.white },
        style,
      ]}
    >
      {children}
    </View>
  );
}
// Glass styling is intentionally deferred until the supplied design.
export const GlassCard = Card;
export function Header({ title, children }) {
  return (
    <View>
      <Text accessibilityRole="header">{title}</Text>
      {children}
    </View>
  );
}
export function Avatar({ source, label, size = 48 }) {
  return source ? (
    <Image
      source={source}
      accessibilityLabel={label}
      accessible
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  ) : (
    <Text accessibilityLabel={label}>{label?.slice(0, 1)}</Text>
  );
}
export function Badge({ children }) {
  return <Text>{children}</Text>;
}
export function EmptyState({ title, children }) {
  return (
    <View>
      <Text accessibilityRole="header">{title}</Text>
      {children}
    </View>
  );
}
export function Modal({ visible, onClose, children, ...props }) {
  return (
    <NativeModal {...props} visible={visible} onRequestClose={onClose}>
      <View accessibilityViewIsModal>{children}</View>
    </NativeModal>
  );
}
