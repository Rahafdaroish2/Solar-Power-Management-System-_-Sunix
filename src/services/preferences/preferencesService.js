import { storage, userStorage } from '../../storage';
import { storageKeys } from '../../constants/storageKeys';
export const preferencesService = {
  getSettings: () => storage.get(storageKeys.settings, {}),
  saveSettings: (settings) => storage.set(storageKeys.settings, settings),
  forUser(userId) {
    if (!userId) throw new Error('A user ID is required for scoped storage');
    const scoped = userStorage(userId);
    return {
      getPreferences: () => scoped.get(storageKeys.preferences, {}),
      savePreferences: (value) => scoped.set(storageKeys.preferences, value),
      getSelectedProject: () => scoped.get(storageKeys.selectedProject),
      saveSelectedProject: (id) => scoped.set(storageKeys.selectedProject, id),
      getChatMetadata: () => scoped.get(storageKeys.chatMetadata, []),
      saveChatMetadata: (value) => scoped.set(storageKeys.chatMetadata, value),
    };
  },
};
