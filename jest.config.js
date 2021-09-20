const { resolve } = require('path')
const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/main/'
  ],
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1'
  }
}
