// Dependency-free checks runnable before npm install. Does not validate native UI.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const moduleUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
async function main() {
  const errors = moduleUrl(read('src/utils/errors.js'));
  const { createClient } = await import(
    moduleUrl(
      read('src/api/createClient.js').replace(
        "'../utils/errors'",
        JSON.stringify(errors),
      ),
    )
  );
  const { createStorage } = await import(
    moduleUrl(read('src/storage/createStorage.js'))
  );
  const map = new Map();
  const adapter = {
    getItem: async (k) => map.get(k),
    setItem: async (k, v) => map.set(k, v),
    removeItem: async (k) => map.delete(k),
  };
  const storage = createStorage(adapter, 'a.');
  await storage.set('key', { id: 1 });
  assert.deepEqual(await storage.get('key'), { id: 1 });
  assert.equal(await createStorage(adapter, 'b.').get('key'), null);
  map.set('a.key', '{bad');
  assert.equal(await storage.get('key'), null);
  assert.equal(map.has('a.key'), false);
  await assert.rejects(createClient({ baseUrl: '' })('/me'), {
    code: 'CONFIGURATION',
  });
  let expired = null;
  await assert.rejects(
    createClient({
      baseUrl: 'https://example.test',
      getToken: () => 'secret',
      onUnauthorized: (token) => {
        expired = token;
      },
      fetcher: async () => ({ ok: false, status: 401, text: async () => '{}' }),
    })('/me'),
    { code: 'AUTHENTICATION' },
  );
  assert.equal(expired, 'secret');
  let headers;
  await createClient({
    baseUrl: 'https://example.test',
    getToken: () => 'secret',
    fetcher: async (_, options) => {
      headers = options.headers;
      return { ok: true, text: async () => '{}' };
    },
  })('/auth/login', { authenticated: false });
  assert.equal(headers.Authorization, undefined);
  await assert.rejects(
    createClient({
      baseUrl: 'https://example.test',
      fetcher: async () => {
        throw new Error('offline');
      },
    })('/me'),
    { code: 'NETWORK' },
  );
  const files = fs.readdirSync(root, { recursive: true }).filter((file) => {
    const topLevel = file.split(path.sep)[0];
    return ![
      '.git',
      '.expo',
      'node_modules',
      'dist',
      'build',
      'coverage',
    ].includes(topLevel);
  });
  assert.equal(
    files.some((file) => /\.tsx?$/.test(file)),
    false,
    'Project must remain JavaScript-only',
  );
  const pkg = JSON.parse(read('package.json'));
  for (const file of files.filter((file) => /\.(js|jsx)$/.test(file))) {
    const content = read(file);
    if (file.endsWith('.js')) {
      const result = spawnSync(
        process.execPath,
        ['--check', '--input-type=module'],
        { input: content, encoding: 'utf8' },
      );
      assert.equal(result.status, 0, `${file}: ${result.stderr}`);
    }
    for (const match of content.matchAll(
      /(?:from\s+|require\()['"]([^'"]+)['"]/g,
    )) {
      const specifier = match[1];
      if (specifier.startsWith('.')) {
        const base = path.resolve(root, path.dirname(file), specifier);
        assert.ok(
          ['', '.js', '.jsx', '/index.js', '/index.jsx'].some((suffix) =>
            fs.existsSync(base + suffix),
          ),
          `${file}: unresolved ${specifier}`,
        );
      } else if (!specifier.startsWith('node:')) {
        const name = specifier.startsWith('@')
          ? specifier.split('/').slice(0, 2).join('/')
          : specifier.split('/')[0];
        assert.ok(
          pkg.dependencies[name] || pkg.devDependencies[name],
          `${file}: undeclared ${name}`,
        );
      }
    }
  }
  console.log(
    'PASS: storage isolation, corrupt storage recovery, API configuration/auth/network behavior, JS-only source and import/dependency audit.',
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
