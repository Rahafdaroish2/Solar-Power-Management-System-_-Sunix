import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';

const logo = require('../../assets/images/sunix-logo.png');
export function AuthScaffold({ children, compact = false, footer, scrollRef }) {
  const { width, height } = useWindowDimensions();
  const useCompactLayout = compact || width < 360 || height < 720;

  return (
    <LinearGradient
      colors={['#E7F8FF', '#F8FCFF', '#FFFCEF']}
      locations={[0, 0.58, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
          style={styles.safeArea}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            bounces={false}
            keyboardDismissMode={
              Platform.OS === 'ios' ? 'interactive' : 'on-drag'
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              useCompactLayout && styles.compactScrollContent,
            ]}
          >
            <View
              style={[
                styles.content,
                useCompactLayout && styles.compactContent,
              ]}
            >
              <Image
                source={logo}
                resizeMode="contain"
                style={[styles.logo, useCompactLayout && styles.compactLogo]}
                accessible
                accessibilityLabel="SUNIX"
              />
              {children}
              {footer}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
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
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 44,
  },
  compactScrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    minWidth: 0,
    alignSelf: 'center',
    paddingTop: 30,
  },
  compactContent: {
    paddingTop: 18,
  },
  logo: {
    width: '67%',
    maxWidth: 258,
    aspectRatio: 3,
    alignSelf: 'center',
  },
  compactLogo: {
    width: '59%',
    maxWidth: 220,
  },
});
