import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { continueAsGuest } from '../../state/sessionStore';
import { colors } from '../../theme/tokens';

const logo = require('../../assets/images/sunix-logo.png');
const background = require('../../assets/images/welcome-background.png');

function ActionButton({
  label,
  onPress,
  variant = 'outline',
  showArrow = false,
}) {
  const content = (
    <View style={styles.buttonContent}>
      <View style={styles.arrowSpacer} />
      <Text
        style={[
          styles.buttonLabel,
          variant === 'guest' && styles.guestButtonLabel,
        ]}
      >
        {label}
      </Text>
      <View
        style={[styles.arrow, !showArrow && styles.arrowHidden]}
        accessibilityElementsHidden
      >
        <View style={styles.arrowLine} />
        <View style={styles.arrowHead} />
      </View>
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [
          styles.buttonShell,
          styles.primaryShadow,
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={['#FFE36E', '#FFD134', '#FFC514']}
          locations={[0, 0.58, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={[styles.button, styles.primaryButton]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonShell,
        styles.button,
        variant === 'guest' ? styles.guestButton : styles.outlineButton,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

export function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Image
              source={logo}
              resizeMode="contain"
              style={styles.logo}
              accessible
              accessibilityLabel="SUNIX"
            />

            <View style={styles.intro}>
              <Text style={styles.title}>Welcome to Sunix</Text>
              <Text style={styles.subtitle}>
                Your solar journey starts here.
              </Text>
            </View>

            <View style={styles.actions}>
              <ActionButton
                label="Create an Account"
                variant="primary"
                showArrow
                onPress={() => navigation.navigate('Register')}
              />
              <ActionButton
                label="Log In"
                onPress={() => navigation.navigate('Login')}
              />
              <ActionButton
                label="Continue as Guest"
                variant="guest"
                showArrow
                onPress={continueAsGuest}
              />
              <Text style={styles.helper}>
                {"Explore first. Sign in when you're ready."}
              </Text>
            </View>

            <View
              style={styles.legalRow}
              accessibilityLabel="Privacy Policy and Terms of Service"
            >
              <View style={styles.divider} />
              <Text style={styles.legalText}>Privacy Policy</Text>
              <Text style={styles.legalDot}>·</Text>
              <Text style={styles.legalText}>Terms of Service</Text>
              <View style={styles.divider} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.skyBlue,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 25,
    paddingTop: 45,
    paddingBottom: 112,
  },
  logo: {
    width: '78%',
    maxWidth: 292,
    aspectRatio: 3,
    alignSelf: 'center',
  },
  intro: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    color: colors.inkNavy,
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -1.1,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5182C1',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    marginTop: 3,
    textAlign: 'center',
  },
  actions: {
    marginTop: 30,
    gap: 13,
  },
  buttonShell: {
    width: '100%',
    borderRadius: 15,
  },
  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  primaryShadow: {
    shadowColor: '#D89D00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  outlineButton: {
    borderWidth: 1.6,
    borderColor: colors.actionBlue,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  guestButton: {
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.92)',
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  arrowSpacer: {
    width: 25,
  },
  buttonLabel: {
    flex: 1,
    color: colors.inkNavy,
    fontSize: 16.5,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  guestButtonLabel: {
    fontWeight: '500',
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
    backgroundColor: colors.actionBlue,
  },
  arrowHead: {
    position: 'absolute',
    right: 0,
    width: 8,
    height: 8,
    borderRightWidth: 1.7,
    borderTopWidth: 1.7,
    borderColor: colors.actionBlue,
    transform: [{ rotate: '45deg' }],
  },
  arrowHidden: {
    opacity: 0,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  helper: {
    color: '#4B7EBB',
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: -2,
    textAlign: 'center',
  },
  legalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 58,
    paddingHorizontal: 8,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    maxWidth: 32,
    backgroundColor: colors.linkBlue,
    marginHorizontal: 10,
  },
  legalText: {
    color: colors.linkBlue,
    fontSize: 10.5,
    lineHeight: 15,
  },
  legalDot: {
    color: colors.linkBlue,
    fontSize: 12,
    marginHorizontal: 7,
  },
});
