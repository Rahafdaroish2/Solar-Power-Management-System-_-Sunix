// Adapter contract: getItem / setItem / removeItem, all asynchronous.
export function createStorage(adapter, prefix = 'sunix.v1.') {
  return {
    async get(key, fallback = null) {
      const value = await adapter.getItem(prefix + key);
      if (value == null) return fallback;
      try {
        return JSON.parse(value);
      } catch {
        await adapter.removeItem(prefix + key);
        return fallback;
      }
    },
    set: (key, value) => adapter.setItem(prefix + key, JSON.stringify(value)),
    remove: (key) => adapter.removeItem(prefix + key),
  };
}
