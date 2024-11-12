const { resolve } = require("node:path");
const prettierConfig = require("../prettier-config");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:prettier/recommended",
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
  ],
  globals: {
    React: "readonly",
    JSX: "readonly",
    Image: "readonly",
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn", "prettier"], // Prettier 플러그인 추가
  rules: {
    "prettier/prettier": [
      "warn",
      {
        ...prettierConfig,
      },
    ],
    "no-redeclare": "off", // 'no-redeclare' 규칙 비활성화
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
