// JavaScript runtime contracts; adapt these together with backend DTOs.
import { z } from 'zod';
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  text: z.string(),
  attachmentIds: z.array(z.string()).default([]),
  quickOptions: z
    .array(z.object({ id: z.string(), label: z.string() }))
    .default([]),
});
export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  packageId: z.string().nullable(),
  estimatedPrice: z.number().nonnegative().nullable(),
  currency: z.string(),
  inspection: z
    .object({ status: z.string(), scheduledAt: z.string().nullable() })
    .nullable(),
  stages: z.array(
    z.object({ id: z.string(), label: z.string(), status: z.string() }),
  ),
});
export const productCategories = Object.freeze([
  'solar-panels',
  'inverters',
  'batteries',
  'accessories',
]);
export const maintenanceStatuses = Object.freeze([
  'submitted',
  'reviewing',
  'scheduled',
  'in-progress',
  'completed',
  'cancelled',
]);
export const notificationTypes = Object.freeze([
  'project',
  'inspection',
  'maintenance',
  'system',
]);
