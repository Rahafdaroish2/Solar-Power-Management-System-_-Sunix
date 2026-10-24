import { sessionStorage } from './index';
let pending = Promise.resolve();
function enqueue(action) {
  pending = pending.catch(() => {}).then(action);
  return pending;
}
export const sessionPersistence = {
  get: async () => {
    await pending.catch(() => {});
    return sessionStorage.get('session');
  },
  set: (session) => enqueue(() => sessionStorage.set('session', session)),
  clear: () => enqueue(() => sessionStorage.remove('session')),
};
