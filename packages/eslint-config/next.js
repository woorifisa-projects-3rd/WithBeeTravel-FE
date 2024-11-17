const { resolve } = require('node:path');
const prettierConfig = require('../../.prettierrc.js');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    require.resolve('@vercel/style-guide/eslint/next'),
    'turbo',
  ],
  globals: {
    React: 'readonly',
    JSX: 'readonly',
    Image: 'readonly',
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ['only-warn'],
  rules: {
    'no-redeclare': 'off', // 'no-redeclare' 규칙 비활성화
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
};
