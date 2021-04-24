// jest.config.js
module.exports = {
  verbose: false,
  notify: false,
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['dist'],
  testMatch: ['**/__tests__/**/*.test.(ts|js)', '**/tests/**/*.test.(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/tests/test.config.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['dist'],
};
