import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthScaffold } from '../../components/auth/AuthScaffold';
import {
  FormField,
  PrimaryAuthButton,
} from '../../components/auth/AuthControls';
import { sessionController } from '../../services/auth/sessionController';
import { colors } from '../../theme/tokens';
import { normalizeError } from '../../utils/errors';
import { loginSchema } from '../../validation/schemas';

function validateLogin(email, password) {
  const result = loginSchema.safeParse({ email: email.trim(), password });
  if (result.success) return {};
  const fields = result.error.flatten().fieldErrors;
  return {
    email: fields.email?.[0] || 'Enter a valid email address.',
    password: fields.password?.[0],
  };
}

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSubmitError('Please complete the required fields.');
      return;
    }

    setSubmitError('');
    setSubmitting(true);
    try {
      await sessionController.login({ email: email.trim(), password });
    } catch (error) {
      setSubmitError(normalizeError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScaffold>
      <View style={styles.heading}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue with Sunix.</Text>
      </View>

      <View style={styles.form}>
        <FormField
          label="Email Address"
          icon="@"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({ ...current, email: undefined }));
            setSubmitError('');
          }}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          error={errors.email}
        />
        <FormField
          label="Password"
          icon="●"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined }));
            setSubmitError('');
          }}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          error={errors.password}
        />

        {submitError ? (
          <Text accessibilityRole="alert" style={styles.submitError}>
            {submitError}
          </Text>
        ) : null}
        <PrimaryAuthButton
          label="Log In"
          loadingLabel="Logging in..."
          loading={submitting}
          onPress={submit}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Register')}
          style={styles.switchAction}
        >
          <Text style={styles.switchText}>{"Don't have an account? "}</Text>
          <Text style={styles.switchLink}>Create an Account</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    color: colors.inkNavy,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.7,
    textAlign: 'center',
  },
  subtitle: {
    color: '#517FB8',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    gap: 20,
    marginTop: 36,
  },
  submitError: {
    color: '#A82539',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: -10,
    textAlign: 'center',
  },
  switchAction: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    color: '#527DB1',
    fontSize: 13,
  },
  switchLink: {
    color: colors.linkBlue,
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
