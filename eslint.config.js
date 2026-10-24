const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
module.exports = defineConfig([
  expo,
  { ignores: ['dist/*', 'coverage/*', 'android/*', 'ios/*'] },
  {
    files: ['scripts/**/*.js', 'eslint.config.js', 'app.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
      },
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
      },
    },
  },
]);
