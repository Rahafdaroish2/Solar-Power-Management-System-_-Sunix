import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/tokens';

const CODE_LENGTH = 6;

export function OtpCodeInput({ value, onChange }) {
  const inputRef = useRef(null);
  const digits = Array.from(
    { length: CODE_LENGTH },
    (_, index) => value[index] || '',
  );
  const activeIndex = Math.min(value.length, CODE_LENGTH - 1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Enter the six digit verification code"
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(next) =>
          onChange(next.replace(/\D/g, '').slice(0, CODE_LENGTH))
        }
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={CODE_LENGTH}
        caretHidden
        style={styles.hiddenInput}
      />
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.box,
            index === activeIndex &&
              value.length < CODE_LENGTH &&
              styles.activeBox,
          ]}
        >
          <Text style={styles.digit}>{digit}</Text>
          {index === activeIndex && value.length < CODE_LENGTH && !digit ? (
            <View style={styles.caret} />
          ) : null}
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  box: {
    flex: 1,
    flexBasis: 0,
    maxWidth: 61,
    minWidth: 0,
    height: 68,
    borderWidth: 1,
    borderColor: '#B7D6EA',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBox: {
    borderWidth: 2,
    borderColor: '#006FFF',
  },
  digit: {
    color: colors.inkNavy,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  caret: {
    position: 'absolute',
    width: 1.5,
    height: 31,
    backgroundColor: '#006FFF',
  },
});
