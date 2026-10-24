const name = process.env.EXPO_PUBLIC_APP_ENV || 'development';
const apiUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
const isDevelopment =
  typeof __DEV__ === 'boolean' ? __DEV__ : name !== 'production';

export const env = Object.freeze({
  name,
  apiUrl,
  useMockOtp:
    isDevelopment &&
    (process.env.EXPO_PUBLIC_USE_MOCK_OTP === 'true' || !apiUrl),
});
