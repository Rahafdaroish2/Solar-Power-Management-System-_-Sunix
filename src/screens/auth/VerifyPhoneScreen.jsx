import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { AuthScaffold } from '../../components/auth/AuthScaffold';
import {
  DeliveryChip,
  PrimaryAuthButton,
} from '../../components/auth/AuthControls';
import { OtpCodeInput } from '../../components/auth/OtpCodeInput';
import { colors } from '../../theme/tokens';
import { otpSchema } from '../../validation/schemas';
import { verificationService } from '../../services/auth/verificationService';
import { sessionController } from '../../services/auth/sessionController';
import { normalizeError } from '../../utils/errors';

const RESEND_SECONDS = 42;

function formatPhone(phone = '') {
  const digits = phone.replace(/\D/g, '').slice(0, 9);
  if (digits.length !== 9) return '+963 9XX XXX XXX';
  return `+963 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function VerifyPhoneScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const compact = width < 360 || height < 720;
  const method = route.params?.method === 'sms' ? 'sms' : 'whatsapp';
  const phone = useMemo(
    () => formatPhone(route.params?.phone),
    [route.params?.phone],
  );
  const [code, setCode] = useState(route.params?.developmentCode || '');
  const [codeError, setCodeError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [verificationId, setVerificationId] = useState(
    route.params?.verificationId || '',
  );
  const [seconds, setSeconds] = useState(
    route.params?.retryAfterSeconds ?? RESEND_SECONDS,
  );
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const resend = async () => {
    if (seconds > 0 || resending) return;
    setCodeError('');
    setOperationError('');
    setResending(true);
    try {
      const request = await verificationService.request({
        name: route.params?.name,
        phone: route.params?.phone,
        method,
      });
      setVerificationId(request.verificationId);
      setCode(request.developmentCode || '');
      setSeconds(request.retryAfterSeconds ?? RESEND_SECONDS);
    } catch (error) {
      setOperationError(normalizeError(error).message);
    } finally {
      setResending(false);
    }
  };

  const verify = async () => {
    if (verifying) return;
    const result = otpSchema.safeParse(code);
    if (!result.success) {
      setCodeError(
        result.error.issues[0]?.message || 'Enter the complete code.',
      );
      return;
    }
    setCodeError('');
    setOperationError('');
    setVerifying(true);
    try {
      const session = await verificationService.verify({
        verificationId,
        code,
        name: route.params?.name,
        phone: route.params?.phone,
      });
      await sessionController.acceptSession(session);
    } catch (error) {
      setOperationError(normalizeError(error).message);
    } finally {
      setVerifying(false);
    }
  };

  const footer = (
    <View
      style={styles.legalRow}
      accessibilityLabel="Privacy Policy and Terms of Service"
    >
      <View style={styles.divider} />
      <Pressable
        accessibilityRole="link"
        onPress={() =>
          Alert.alert(
            'Privacy Policy',
            'Add the approved privacy policy URL to activate this link.',
          )
        }
      >
        <Text style={styles.legalText}>Privacy Policy</Text>
      </Pressable>
      <Text style={styles.legalDot}>·</Text>
      <Pressable
        accessibilityRole="link"
        onPress={() =>
          Alert.alert(
            'Terms of Service',
            'Add the approved terms URL to activate this link.',
          )
        }
      >
        <Text style={styles.legalText}>Terms of Service</Text>
      </Pressable>
      <View style={styles.divider} />
    </View>
  );

  return (
    <AuthScaffold compact={compact} footer={footer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit phone number"
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.editLink, pressed && styles.pressed]}
      >
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.editText}>Edit phone number</Text>
      </Pressable>

      <View style={[styles.heading, compact && styles.compactHeading]}>
        <Text style={[styles.title, compact && styles.compactTitle]}>
          {method === 'whatsapp'
            ? 'Check your WhatsApp'
            : 'Check your messages'}
        </Text>
        <Text style={styles.subtitle}>We sent a verification code to</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>

      <DeliveryChip method={method} />

      <View style={[styles.otpArea, compact && styles.compactOtpArea]}>
        <OtpCodeInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setCodeError('');
            setOperationError('');
          }}
        />
        {codeError ? (
          <Text accessibilityRole="alert" style={styles.codeError}>
            {codeError}
          </Text>
        ) : null}
        {operationError ? (
          <Text accessibilityRole="alert" style={styles.codeError}>
            {operationError}
          </Text>
        ) : null}
        {seconds > 0 ? (
          <Text style={styles.timer}>
            Resend code in 00:{String(seconds).padStart(2, '0')}
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            disabled={resending}
            onPress={resend}
            style={styles.resendButton}
          >
            <Text style={styles.resendText}>
              {resending ? 'Resending...' : "Didn't receive it? Resend Code"}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.verifyArea, compact && styles.compactVerifyArea]}>
        <PrimaryAuthButton
          label="Verify Code"
          loadingLabel="Verifying..."
          loading={verifying}
          onPress={verify}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.wrongNumber}
        >
          <Text style={styles.wrongNumberText}>Wrong number? </Text>
          <Text style={styles.wrongNumberLink}>Edit phone number</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  editLink: {
    minHeight: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 9,
    paddingHorizontal: 3,
  },
  backArrow: {
    color: '#2677C9',
    fontSize: 23,
    lineHeight: 26,
  },
  editText: {
    color: '#0072E8',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.65,
  },
  heading: {
    alignItems: 'center',
    marginTop: 9,
    marginBottom: 18,
  },
  compactHeading: {
    marginTop: 2,
    marginBottom: 14,
  },
  title: {
    color: colors.inkNavy,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.7,
    textAlign: 'center',
  },
  compactTitle: {
    fontSize: 25,
    lineHeight: 31,
  },
  subtitle: {
    color: '#517FB8',
    fontSize: 17,
    lineHeight: 23,
    marginTop: 6,
    textAlign: 'center',
  },
  phone: {
    color: colors.inkNavy,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpArea: {
    alignItems: 'center',
    gap: 28,
    marginTop: 30,
  },
  compactOtpArea: {
    gap: 20,
    marginTop: 23,
  },
  timer: {
    color: '#7197C2',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  codeError: {
    color: '#A82539',
    fontSize: 12,
    lineHeight: 17,
    marginTop: -18,
    textAlign: 'center',
  },
  resendButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  resendText: {
    color: '#006BE1',
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  verifyArea: {
    gap: 18,
    marginTop: 24,
  },
  compactVerifyArea: {
    gap: 14,
    marginTop: 16,
  },
  wrongNumber: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongNumberText: {
    color: '#527DB1',
    fontSize: 13,
  },
  wrongNumberLink: {
    color: '#006BE1',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  legalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 56,
  },
  divider: {
    flex: 1,
    maxWidth: 34,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8BB2D4',
    marginHorizontal: 9,
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
