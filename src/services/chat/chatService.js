import { api } from '../../api/client';
import { createResourceService, segment } from '../resourceService';
import { validate, chatInputSchema } from '../../validation/schemas';
import { fileService } from '../files/fileService';
export const chatService = {
  ...createResourceService('/chats'),
  create: () => api('/chats', { method: 'POST' }),
  remove: (id) => api(`/chats/${segment(id)}`, { method: 'DELETE' }),
  pin: (id, pinned) =>
    api(`/chats/${segment(id)}`, {
      method: 'PATCH',
      body: { pinned: Boolean(pinned) },
    }),
  messages: (id, options) => api(`/chats/${segment(id)}/messages`, options),
  async send(id, input) {
    const { text, attachments } = validate(chatInputSchema, input);
    const uploads = await Promise.all(
      attachments.map((file) => fileService.upload(file)),
    );
    return api(`/chats/${segment(id)}/messages`, {
      method: 'POST',
      body: { text, attachmentIds: uploads.map((file) => file.id) },
    });
  },
  editAnswer: (id, messageId, text) =>
    api(`/chats/${segment(id)}/messages/${segment(messageId)}`, {
      method: 'PATCH',
      body: validate(chatInputSchema, { text }),
    }),
  continue: (id, optionId) =>
    api(`/chats/${segment(id)}/continue`, {
      method: 'POST',
      body: { optionId },
    }),
};
