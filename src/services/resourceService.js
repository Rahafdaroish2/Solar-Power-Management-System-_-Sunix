import { api } from '../api/client';
export const segment = (value) => encodeURIComponent(String(value));
export function queryString(filters = {}) {
  const pairs = Object.entries(filters).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  return pairs.length
    ? `?${pairs.map(([key, value]) => `${segment(key)}=${segment(value)}`).join('&')}`
    : '';
}
export const createResourceService = (path) => ({
  list: (filters, options) => api(`${path}${queryString(filters)}`, options),
  get: (id, options) => api(`${path}/${segment(id)}`, options),
});
