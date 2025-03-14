/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@withbee/eslint-config/react-internal.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
