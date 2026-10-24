import { createStorage } from '../src/storage/createStorage';
test('storage isolates prefixes and recovers malformed JSON', async () => {
  const values = new Map();
  const adapter = {
    getItem: async (key) => values.get(key),
    setItem: async (key, value) => values.set(key, value),
    removeItem: async (key) => values.delete(key),
  };
  const a = createStorage(adapter, 'a.');
  const b = createStorage(adapter, 'b.');
  await a.set('project', 'one');
  expect(await b.get('project')).toBeNull();
  values.set('a.project', 'broken');
  expect(await a.get('project')).toBeNull();
  expect(values.has('a.project')).toBe(false);
});
