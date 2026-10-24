import { api } from '../../api/client';
import {
  validate,
  loginSchema,
  registerSchema,
  sessionSchema,
} from '../../validation/schemas';
export const authService = {
  async login(input) {
    return validate(
      sessionSchema,
      await api('/auth/login', {
        method: 'POST',
        body: validate(loginSchema, input),
        authenticated: false,
      }),
    );
  },
  async register(input) {
    return validate(
      sessionSchema,
      await api('/auth/register', {
        method: 'POST',
        body: validate(registerSchema, input),
        authenticated: false,
      }),
    );
  },
  logout: () => api('/auth/logout', { method: 'POST' }),
};
