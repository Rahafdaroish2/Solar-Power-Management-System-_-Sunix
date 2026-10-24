import { AppError } from '../utils/errors';
export function createClient({
  baseUrl,
  getToken = () => null,
  onUnauthorized = () => {},
  fetcher = fetch,
  timeoutMs = 20000,
}) {
  return async function request(
    path,
    { method = 'GET', body, signal, authenticated = true } = {},
  ) {
    if (!baseUrl)
      throw new AppError(
        'Configure EXPO_PUBLIC_API_URL to connect a backend.',
        { code: 'CONFIGURATION' },
      );
    if (!/^https?:\/\//.test(baseUrl))
      throw new AppError('Invalid API URL.', { code: 'CONFIGURATION' });
    const token = authenticated ? getToken() : null;
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (signal?.aborted) cancel();
    signal?.addEventListener('abort', cancel);
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      const multipart =
        typeof FormData !== 'undefined' && body instanceof FormData;
      const response = await fetcher(`${baseUrl}${path}`, {
        method,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(body && !multipart ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body:
          body == null ? undefined : multipart ? body : JSON.stringify(body),
      });
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
      if (!response.ok) {
        if (response.status === 401 && authenticated)
          await onUnauthorized(token);
        throw new AppError('The request could not be completed.', {
          status: response.status,
          code:
            response.status === 401
              ? 'AUTHENTICATION'
              : response.status === 422
                ? 'VALIDATION'
                : 'API',
          details: data?.errors,
        });
      }
      if (text && data === null)
        throw new AppError('Invalid server response.', { code: 'API' });
      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        timedOut
          ? 'Request timed out.'
          : controller.signal.aborted
            ? 'Request cancelled.'
            : 'Unable to connect. Check your connection.',
        {
          code: timedOut
            ? 'TIMEOUT'
            : controller.signal.aborted
              ? 'CANCELLED'
              : 'NETWORK',
          cause: error,
        },
      );
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', cancel);
    }
  };
}
