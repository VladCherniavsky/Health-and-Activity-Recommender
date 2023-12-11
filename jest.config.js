'use strict';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.[jt]s',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/constants.ts',
    '!<rootDir>/src/constants/**/*.[jt]s',
    '!**/mock/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', './*.config.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/*.test.[tj]s'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['<rootDir>'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
  },
  clearMocks: true,
};
