import { api } from '../../api/client';
import { createResourceService, segment } from '../resourceService';
export const notificationService = {
  ...createResourceService('/notifications'),
  markRead: (id) =>
    api(`/notifications/${segment(id)}/read`, { method: 'PUT' }),
};
// A push adapter can implement register / unregister / subscribe later.
export function createPushService(adapter) {
  return {
    register: (...args) => adapter.register(...args),
    unregister: () => adapter.unregister(),
    subscribe: (listener) => adapter.subscribe(listener),
  };
}
