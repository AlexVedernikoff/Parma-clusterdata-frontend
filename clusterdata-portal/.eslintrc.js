module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  plugins: ['react', '@typescript-eslint'],
};
