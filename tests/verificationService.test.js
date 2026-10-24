import { createVerificationService } from '../src/services/auth/verificationService';

jest.mock('../src/api/client', () => ({ api: jest.fn() }));

const details = { name: 'Sara Ahmad', phone: '912345678', method: 'whatsapp' };

describe('verificationService', () => {
  test('requests and verifies a code through the development adapter', async () => {
    const service = createVerificationService({
      useMock: true,
      wait: async () => {},
    });
    const request = await service.request(details);

    expect(request.verificationId).toMatch(/^mock-/);
    expect(request.developmentCode).toBe('482716');

    const session = await service.verify({
      ...details,
      verificationId: request.verificationId,
      code: request.developmentCode,
    });
    expect(session.accessToken).toMatch(/^mock-session-/);
    expect(session.user.name).toBe(details.name);
  });

  test('rejects an incorrect development code', async () => {
    const service = createVerificationService({
      useMock: true,
      wait: async () => {},
    });
    await expect(
      service.verify({ ...details, verificationId: 'mock-1', code: '111111' }),
    ).rejects.toMatchObject({ code: 'VALIDATION' });
  });

  test('uses the backend adapter when mock mode is disabled', async () => {
    const client = jest.fn().mockResolvedValue({
      verificationId: 'server-1',
      retryAfterSeconds: 60,
    });
    const service = createVerificationService({ client, useMock: false });

    await expect(service.request(details)).resolves.toMatchObject({
      verificationId: 'server-1',
    });
    expect(client).toHaveBeenCalledWith('/auth/verification/request', {
      method: 'POST',
      body: details,
      authenticated: false,
    });
  });
});
