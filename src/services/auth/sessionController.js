import { useSessionStore } from '../../state/sessionStore';
import { sessionPersistence } from '../../storage/sessionPersistence';
import { queryClient } from '../../api/queryClient';
import { authService } from './authService';
import { sessionSchema } from '../../validation/schemas';
import { normalizeError } from '../../utils/errors';
let operation = 0;
async function authenticate(method, input) {
  const current = ++operation;
  const session = await authService[method](input);
  if (current !== operation) return;
  await sessionPersistence.set(session);
  if (current !== operation) return;
  queryClient.clear();
  useSessionStore.setState({ session, status: 'authenticated', error: null });
}

async function acceptSession(session) {
  const current = ++operation;
  const verifiedSession = sessionSchema.parse(session);
  await sessionPersistence.set(verifiedSession);
  if (current !== operation) return;
  queryClient.clear();
  useSessionStore.setState({
    session: verifiedSession,
    status: 'authenticated',
    error: null,
  });
}
export const sessionController = {
  async restore() {
    const current = ++operation;
    try {
      const parsed = sessionSchema.safeParse(await sessionPersistence.get());
      const session =
        parsed.success && parsed.data.expiresAt > Date.now()
          ? parsed.data
          : null;
      if (current !== operation) return;
      if (!session) await sessionPersistence.clear();
      if (current === operation)
        useSessionStore.setState({
          session,
          status: session ? 'authenticated' : 'guest',
          error: null,
        });
    } catch (error) {
      if (current === operation)
        useSessionStore.setState({
          session: null,
          status: 'guest',
          error: normalizeError(error),
        });
    }
  },
  login: (input) => authenticate('login', input),
  register: (input) => authenticate('register', input),
  acceptSession,
  async expire() {
    ++operation;
    useSessionStore.setState({ session: null, status: 'guest', error: null });
    queryClient.clear();
    try {
      await sessionPersistence.clear();
    } catch (error) {
      useSessionStore.setState({ error: normalizeError(error) });
    }
  },
  async logout() {
    ++operation;
    const remote = authService.logout().catch(() => null);
    useSessionStore.setState({ session: null, status: 'guest', error: null });
    queryClient.clear();
    await sessionPersistence.clear();
    await remote;
  },
};
