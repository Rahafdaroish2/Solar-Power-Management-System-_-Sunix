import { api } from '../../api/client';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import {
  otpSchema,
  sessionSchema,
  validate,
  verificationDetailsSchema,
} from '../../validation/schemas';

const MOCK_CODE = '482716';
const MOCK_DELAY_MS = 650;

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export function createVerificationService({
  client = api,
  useMock = env.useMockOtp,
  wait = sleep,
} = {}) {
  return {
    async request(input) {
      const details = validate(verificationDetailsSchema, input);

      if (useMock) {
        await wait(MOCK_DELAY_MS);
        return {
          verificationId: `mock-${Date.now()}`,
          retryAfterSeconds: 42,
          developmentCode: MOCK_CODE,
        };
      }

      const response = await client('/auth/verification/request', {
        method: 'POST',
        body: details,
        authenticated: false,
      });

      if (
        typeof response?.verificationId !== 'string' ||
        !response.verificationId
      ) {
        throw new AppError('Invalid verification response.', { code: 'API' });
      }

      return response;
    },

    async verify({ verificationId, code, name, phone }) {
      const verifiedCode = validate(otpSchema, code);

      if (!verificationId) {
        throw new AppError('The verification request has expired.', {
          code: 'VALIDATION',
        });
      }

      if (useMock) {
        await wait(MOCK_DELAY_MS);
        if (!verificationId.startsWith('mock-') || verifiedCode !== MOCK_CODE) {
          throw new AppError('The verification code is incorrect.', {
            code: 'VALIDATION',
          });
        }

        return {
          accessToken: `mock-session-${Date.now()}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          user: {
            id: `mock-${phone}`,
            name,
          },
        };
      }

      return validate(
        sessionSchema,
        await client('/auth/verification/verify', {
          method: 'POST',
          body: { verificationId, code: verifiedCode },
          authenticated: false,
        }),
      );
    },
  };
}

export const verificationService = createVerificationService();
