module.exports = {
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['**/?(*.)test.ts?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/jest/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/jest/fileMock.js',
    '@lib-shared/(.*)$': '<rootDir>/src/clustrum-lib/src/shared/$1',
    '@clustrum-lib/(.*)$': '<rootDir>/src/clustrum-lib/src/$1',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
