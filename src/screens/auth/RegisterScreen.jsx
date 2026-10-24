import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { AuthScaffold } from '../../components/auth/AuthScaffold';
import {
  FormField,
  MethodCard,
  PrimaryAuthButton,
  UserIcon,
} from '../../components/auth/AuthControls';
import { colors } from '../../theme/tokens';
import { verificationService } from '../../services/auth/verificationService';
import { normalizeError } from '../../utils/errors';
import { verificationDetailsSchema } from '../../validation/schemas';

function validateDetails(name, phone, method) {
  const result = verificationDetailsSchema.safeParse({
    name,
    phone: phone.replace(/\D/g, ''),
    method,
  });
  if (result.success) return {};
  const fields = result.error.flatten().fieldErrors;
  return { name: fields.name?.[0], phone: fields.phone?.[0] };
}

export function RegisterScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const stackMethods = width < 350;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('whatsapp');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    const nextErrors = validateDetails(name, phone, method);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmitError('Please complete the required fields.');
      return;
    }

    const details = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      method,
    };

    setSubmitError('');
    setSubmitting(true);
    try {
      const request = await verificationService.request(details);
      navigation.navigate('VerifyPhone', {
        ...details,
        verificationId: request.verificationId,
        retryAfterSeconds: request.retryAfterSeconds,
        developmentCode: request.developmentCode,
      });
    } catch (error) {
      setSubmitError(normalizeError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScaffold>
      <View style={styles.heading}>
        <Text style={styles.title}>Get started with Sunix</Text>
        <Text style={styles.subtitle}>One code. A brighter start.</Text>
      </View>

      <View style={styles.form}>
        <FormField
          label="Full Name"
          icon={<UserIcon />}
          value={name}
          onChangeText={(value) => {
            setName(value);
            setErrors((current) => ({ ...current, name: undefined }));
            setSubmitError('');
          }}
          placeholder="Sara Ahmad"
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          error={errors.name}
        />

        <View>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <View
              style={styles.countryField}
              accessibilityLabel="Syria country code plus nine six three"
            >
              <Text style={styles.flag}>🇸🇾</Text>
              <Text style={styles.countryText}>SY +963</Text>
              <Text style={styles.chevron}>⌄</Text>
            </View>
            <FormField
              containerStyle={styles.phoneInput}
              icon="☎"
              value={phone}
              onChangeText={(value) => {
                setPhone(value.replace(/\D/g, '').slice(0, 9));
                setErrors((current) => ({ ...current, phone: undefined }));
                setSubmitError('');
              }}
              placeholder="9XX XXX XXX"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              accessibilityLabel="Phone number"
              error={errors.phone}
            />
          </View>
        </View>

        <View>
          <Text style={styles.methodTitle}>Send my verification code via</Text>
          <View
            style={[styles.methods, stackMethods && styles.methodsStacked]}
            accessibilityRole="radiogroup"
          >
            <MethodCard
              type="whatsapp"
              label="WhatsApp"
              selected={method === 'whatsapp'}
              onPress={() => {
                setMethod('whatsapp');
                setSubmitError('');
              }}
            />
            <MethodCard
              type="sms"
              label="SMS / Text Message"
              selected={method === 'sms'}
              onPress={() => {
                setMethod('sms');
                setSubmitError('');
              }}
            />
          </View>
        </View>

        {submitError ? (
          <Text accessibilityRole="alert" style={styles.submitError}>
            {submitError}
          </Text>
        ) : null}
        <PrimaryAuthButton
          label="Send Verification Code"
          loadingLabel="Sending..."
          loading={submitting}
          onPress={submit}
        />
        <Text style={styles.helper}>
          {"We'll send a 6-digit code to verify your number."}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}
          style={styles.switchAction}
        >
          <Text style={styles.switchText}>Already have an account? </Text>
          <Text style={styles.switchLink}>Log In</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    marginTop: 19,
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
    fontSize: 18,
    lineHeight: 25,
    marginTop: 3,
    textAlign: 'center',
  },
  form: {
    gap: 20,
    marginTop: 27,
  },
  label: {
    color: colors.inkNavy,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 7,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  countryField: {
    flexBasis: '35%',
    flexShrink: 1,
    minWidth: 0,
    height: 54,
    borderWidth: 1,
    borderColor: '#BED9EC',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.64)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flag: {
    fontSize: 20,
    marginRight: 7,
  },
  countryText: {
    flex: 1,
    color: colors.inkNavy,
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    color: colors.inkNavy,
    fontSize: 20,
    marginTop: -5,
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
  },
  methodTitle: {
    color: colors.inkNavy,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  methods: {
    flexDirection: 'row',
    gap: 10,
  },
  methodsStacked: {
    flexDirection: 'column',
  },
  submitError: {
    color: '#A82539',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: -10,
    textAlign: 'center',
  },
  helper: {
    color: '#6089B9',
    fontSize: 12,
    lineHeight: 18,
    marginTop: -8,
    textAlign: 'center',
  },
  switchAction: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
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
