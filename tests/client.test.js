import { createClient } from '../src/api/createClient';
test('does not send bearer tokens on public auth requests', async () => {
  const fetcher = jest
    .fn()
    .mockResolvedValue({ ok: true, text: async () => '{}' });
  await createClient({
    baseUrl: 'https://example.test',
    getToken: () => 'private',
    fetcher,
  })('/auth/login', { authenticated: false });
  expect(fetcher.mock.calls[0][1].headers.Authorization).toBeUndefined();
});
test('unauthorized responses expire the matching session', async () => {
  const onUnauthorized = jest.fn();
  const request = createClient({
    baseUrl: 'https://example.test',
    getToken: () => 'token',
    onUnauthorized,
    fetcher: async () => ({ ok: false, status: 401, text: async () => '{}' }),
  });
  await expect(request('/me')).rejects.toMatchObject({
    code: 'AUTHENTICATION',
  });
  expect(onUnauthorized).toHaveBeenCalledWith('token');
});
test('missing backend fails explicitly', async () => {
  await expect(createClient({ baseUrl: '' })('/me')).rejects.toMatchObject({
    code: 'CONFIGURATION',
  });
});
