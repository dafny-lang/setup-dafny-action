module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ["dist/**"],
  rules: {
  }
}
