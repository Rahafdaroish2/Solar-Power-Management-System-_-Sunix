import { api } from '../../api/client';
import { createResourceService } from '../resourceService';
export const productService = {
  ...createResourceService('/products'),
  categories: (options) => api('/products/categories', options),
};
