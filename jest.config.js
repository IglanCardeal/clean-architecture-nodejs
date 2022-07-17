const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = Object.freeze({
  rootDir: root,
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1'
  }
});
