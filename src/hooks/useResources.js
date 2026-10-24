import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '../state/sessionStore';
import { projectService } from '../services/projects/projectService';
import { productService } from '../services/products/productService';
import { maintenanceService } from '../services/maintenance/maintenanceService';
import { notificationService } from '../services/notifications/notificationService';
export function useResourceList(key, service, filters = {}) {
  const userId = useSessionStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: [key, userId, filters],
    enabled: Boolean(userId),
    queryFn: ({ signal }) => service.list(filters, { signal }),
  });
}
export const useProjects = (filters) =>
  useResourceList('projects', projectService, filters);
export const useProducts = (filters) =>
  useResourceList('products', productService, filters);
export const useMaintenance = (filters) =>
  useResourceList('maintenance', maintenanceService, filters);
export const useNotifications = (filters) =>
  useResourceList('notifications', notificationService, filters);
export function useResourceMutation(key, mutationFn) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => client.invalidateQueries({ queryKey: [key] }),
  });
}
