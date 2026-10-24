import {
  maintenanceSchema,
  chatInputSchema,
  otpSchema,
  verificationDetailsSchema,
} from '../src/validation/schemas';
test('maintenance requires the correct system relation', () => {
  expect(
    maintenanceSchema.safeParse({
      type: 'sunix',
      description: 'Panel is not working',
    }).success,
  ).toBe(false);
  expect(
    maintenanceSchema.safeParse({
      type: 'external',
      description: 'Panel is not working',
      system: { location: 'Riyadh', description: 'Roof system' },
    }).success,
  ).toBe(true);
});
test('empty chat messages are rejected', () => {
  expect(chatInputSchema.safeParse({ text: '   ' }).success).toBe(false);
});
test('mobile verification details require a Syrian mobile number and supported channel', () => {
  expect(
    verificationDetailsSchema.safeParse({
      name: 'Sara Ahmad',
      phone: '912345678',
      method: 'whatsapp',
    }).success,
  ).toBe(true);
  expect(
    verificationDetailsSchema.safeParse({
      name: 'S',
      phone: '123',
      method: 'email',
    }).success,
  ).toBe(false);
});
test('OTP is exactly six digits', () => {
  expect(otpSchema.safeParse('482716').success).toBe(true);
  expect(otpSchema.safeParse('48271').success).toBe(false);
});
