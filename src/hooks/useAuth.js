import { useMutation } from '@tanstack/react-query';
import { sessionController } from '../services/auth/sessionController';
import { useSessionStore } from '../state/sessionStore';
export function useAuth() {
  const status = useSessionStore((s) => s.status);
  const user = useSessionStore((s) => s.session?.user);
  const login = useMutation({ mutationFn: sessionController.login });
  const register = useMutation({ mutationFn: sessionController.register });
  const logout = useMutation({ mutationFn: sessionController.logout });
  return { status, user, login, register, logout };
}
