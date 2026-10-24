import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { chatService } from '../services/chat/chatService';
import { useResourceList, useResourceMutation } from './useResources';
import { useSessionStore } from '../state/sessionStore';
export function useChat(chatId) {
  const [draft, setDraft] = useState('');
  const userId = useSessionStore((s) => s.session?.user.id);
  const chats = useResourceList('chats', chatService);
  const messages = useQuery({
    queryKey: ['chats', userId, chatId, 'messages'],
    enabled: Boolean(chatId && userId),
    queryFn: ({ signal }) => chatService.messages(chatId, { signal }),
  });
  const send = useResourceMutation('chats', (input) =>
    chatService.send(chatId, input),
  );
  const create = useResourceMutation('chats', chatService.create);
  const remove = useResourceMutation('chats', chatService.remove);
  const pin = useResourceMutation('chats', ({ id, pinned }) =>
    chatService.pin(id, pinned),
  );
  const edit = useResourceMutation('chats', ({ messageId, text }) =>
    chatService.editAnswer(chatId, messageId, text),
  );
  const next = useResourceMutation('chats', (optionId) =>
    chatService.continue(chatId, optionId),
  );
  return {
    draft,
    setDraft,
    chats,
    messages,
    send,
    create,
    remove,
    pin,
    edit,
    next,
  };
}
