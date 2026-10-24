import { api } from '../../api/client';
import { createResourceService, segment } from '../resourceService';
export const projectService = {
  ...createResourceService('/projects'),
  selectPackage: (id, packageId) =>
    api(`/projects/${segment(id)}/package`, {
      method: 'PUT',
      body: { packageId },
    }),
  estimate: (id, options) => api(`/projects/${segment(id)}/estimate`, options),
  inspection: (id, options) =>
    api(`/projects/${segment(id)}/inspection`, options),
  stages: (id, options) => api(`/projects/${segment(id)}/stages`, options),
};
