import { z } from 'zod';
import { AppError } from '../utils/errors';
const id = z.string().trim().min(1);
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2),
  password: z.string().min(8),
});
export const profileSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7).optional(),
});
export const verificationDetailsSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  phone: z.string().regex(/^9\d{8}$/, 'Enter a valid 9-digit mobile number.'),
  method: z.enum(['whatsapp', 'sms']),
});
export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, 'Enter the complete 6-digit code.');
export const attachmentSchema = z.object({
  uri: id,
  name: id,
  mimeType: id,
  size: z
    .number()
    .positive()
    .max(20 * 1024 * 1024),
});
export const chatInputSchema = z
  .object({
    text: z.string().trim().max(10000).default(''),
    attachments: z.array(attachmentSchema).max(5).default([]),
  })
  .refine(
    (v) => v.text.length > 0 || v.attachments.length > 0,
    'Add a message or attachment.',
  );
const maintenanceBase = {
  description: z.string().trim().min(10),
  attachments: z.array(attachmentSchema).max(5).default([]),
};
export const maintenanceSchema = z.discriminatedUnion('type', [
  z.object({ ...maintenanceBase, type: z.literal('sunix'), projectId: id }),
  z.object({
    ...maintenanceBase,
    type: z.literal('external'),
    system: z.object({ location: id, description: id }),
  }),
]);
export const sessionSchema = z.object({
  accessToken: id,
  expiresAt: z.number().positive(),
  user: z.object({
    id,
    name: z.string().optional(),
    email: z.email().optional(),
  }),
});
export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new AppError('Please check the entered values.', {
      code: 'VALIDATION',
      details: result.error.flatten(),
    });
  return result.data;
}
