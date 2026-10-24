import { api } from '../../api/client';
import { validate, profileSchema } from '../../validation/schemas';
export const profileService = {
  get: (options) => api('/me', options),
  update: (input) =>
    api('/me', { method: 'PATCH', body: validate(profileSchema, input) }),
};
