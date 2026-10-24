import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';

export function ArrowIcon() {
  return (
    <View style={styles.arrow} accessibilityElementsHidden>
      <View style={styles.arrowLine} />
      <View style={styles.arrowHead} />
    </View>
  );
}

export function PrimaryAuthButton({
  label,
  loadingLabel = 'Loading...',
  onPress,
  disabled = false,
  loading = false,
}) {
  const unavailable = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryShell,
        pressed && styles.pressed,
        unavailable && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={['#FFE97D', '#FFD83F', '#FFC51D']}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.primaryGradient}
      >
        <View style={styles.buttonSpacer} />
        {loading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={colors.inkNavy} size="small" />
            <Text style={styles.primaryLabel}>{loadingLabel}</Text>
          </View>
        ) : (
          <Text style={styles.primaryLabel}>{label}</Text>
        )}
        {loading ? <View style={styles.buttonSpacer} /> : <ArrowIcon />}
      </LinearGradient>
    </Pressable>
  );
}

export function FormField({ label, icon, error, containerStyle, ...props }) {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={[styles.inputShell, error && styles.inputError]}>
        {icon ? (
          <View style={styles.inputIcon}>
            {typeof icon === 'string' ? (
              <Text style={styles.inputIconText}>{icon}</Text>
            ) : (
              icon
            )}
          </View>
        ) : null}
        <TextInput
          {...props}
          accessibilityLabel={props.accessibilityLabel || label}
          placeholderTextColor="#47668F"
          selectionColor={colors.actionBlue}
          style={styles.input}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function MethodIcon({ type }) {
  if (type === 'whatsapp') {
    return (
      <View style={[styles.methodIcon, styles.whatsappIcon]}>
        <Text style={styles.whatsappGlyph}>☎</Text>
      </View>
    );
  }
  return (
    <View style={[styles.methodIcon, styles.smsIcon]}>
      <Text style={styles.smsGlyph}>≡</Text>
    </View>
  );
}

export function UserIcon() {
  return (
    <View style={styles.userIcon} accessibilityElementsHidden>
      <View style={styles.userHead} />
      <View style={styles.userShoulders} />
    </View>
  );
}

export function MethodCard({ type, label, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.methodCard,
        selected && styles.methodCardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <MethodIcon type={type} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        style={styles.methodLabel}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function DeliveryChip({ method }) {
  const whatsapp = method === 'whatsapp';
  return (
    <View
      style={styles.deliveryChip}
      accessibilityLabel={`Sent via ${whatsapp ? 'WhatsApp' : 'SMS'}`}
    >
      <MethodIcon type={method} />
      <Text style={styles.deliveryText}>
        Sent via {whatsapp ? 'WhatsApp' : 'SMS'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryShell: {
    width: '100%',
    minWidth: 0,
    alignSelf: 'stretch',
    borderRadius: 16,
    shadowColor: '#C89300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 7,
  },
  primaryGradient: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  buttonSpacer: {
    width: 25,
  },
  primaryLabel: {
    flex: 1,
    color: colors.inkNavy,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  fieldContainer: {
    minWidth: 0,
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  arrow: {
    width: 25,
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  arrowLine: {
    width: 17,
    height: 1.7,
    borderRadius: 2,
    backgroundColor: colors.inkNavy,
  },
  arrowHead: {
    position: 'absolute',
    right: 0,
    width: 8,
    height: 8,
    borderTopWidth: 1.7,
    borderRightWidth: 1.7,
    borderColor: colors.inkNavy,
    transform: [{ rotate: '45deg' }],
  },
  fieldLabel: {
    color: colors.inkNavy,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 7,
  },
  inputShell: {
    width: '100%',
    minWidth: 0,
    height: 54,
    borderWidth: 1,
    borderColor: '#BED9EC',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.64)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: '#C9364A',
  },
  inputIcon: {
    width: 29,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  inputIconText: {
    color: '#5E8DBA',
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    color: colors.inkNavy,
    fontSize: 16,
    paddingVertical: 0,
  },
  errorText: {
    color: '#A82539',
    fontSize: 11,
    marginTop: 4,
  },
  methodCard: {
    minWidth: 0,
    minHeight: 78,
    flex: 1,
    borderWidth: 1,
    borderColor: '#BED9EC',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.57)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  methodCardSelected: {
    borderColor: colors.actionBlue,
  },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 1.6,
    borderColor: '#7EA6CB',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.actionBlue,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.actionBlue,
  },
  methodIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappIcon: {
    borderRadius: 17,
    backgroundColor: '#35C75A',
  },
  whatsappGlyph: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    transform: [{ rotate: '-20deg' }],
  },
  smsIcon: {
    borderWidth: 2,
    borderColor: '#0875E8',
    borderRadius: 9,
  },
  smsGlyph: {
    color: '#0875E8',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 21,
  },
  methodLabel: {
    flexShrink: 1,
    color: colors.inkNavy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  userIcon: {
    width: 22,
    height: 25,
    alignItems: 'center',
  },
  userHead: {
    width: 8,
    height: 8,
    borderWidth: 1.7,
    borderColor: '#5E8DBA',
    borderRadius: 4,
  },
  userShoulders: {
    position: 'absolute',
    bottom: 1,
    width: 17,
    height: 10,
    borderWidth: 1.7,
    borderColor: '#5E8DBA',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
  },
  deliveryChip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#B6DDF0',
    borderRadius: 24,
    backgroundColor: 'rgba(221,243,250,0.7)',
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 17,
  },
  deliveryText: {
    color: '#006DE4',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
});
