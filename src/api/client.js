import { env } from '../config/env';
import { createClient } from './createClient';
import { useSessionStore } from '../state/sessionStore';
import { sessionPersistence } from '../storage/sessionPersistence';
import { queryClient } from './queryClient';
export const api = createClient({
  baseUrl: env.apiUrl,
  getToken: () => useSessionStore.getState().session?.accessToken,
  onUnauthorized: async (token) => {
    if (token !== useSessionStore.getState().session?.accessToken) return;
    useSessionStore.setState({ status: 'guest', session: null });
    queryClient.clear();
    await sessionPersistence.clear();
  },
});
