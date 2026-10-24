import { api } from '../../api/client';
import { createResourceService, segment } from '../resourceService';
import { validate, maintenanceSchema } from '../../validation/schemas';
import { fileService } from '../files/fileService';
export const maintenanceService = {
  ...createResourceService('/maintenance'),
  async create(input) {
    const { attachments, ...request } = validate(maintenanceSchema, input);
    const uploads = await Promise.all(
      attachments.map((file) => fileService.upload(file)),
    );
    return api('/maintenance', {
      method: 'POST',
      body: { ...request, attachmentIds: uploads.map((file) => file.id) },
    });
  },
  history: (id, options) => api(`/maintenance/${segment(id)}/history`, options),
};
