import { create } from 'zustand';
export const useSessionStore = create(() => ({
  status: 'restoring',
  session: null,
  error: null,
}));
export const continueAsGuest = () =>
  useSessionStore.setState({
    status: 'guestAccess',
    session: null,
    error: null,
  });
