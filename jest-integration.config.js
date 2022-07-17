const rootConfig = require('./jest.config');

const config = { ...rootConfig };

config.testMatch = ['<rootDir>/src/**/*.spec.ts'];
config.displayName = 'integration-tests';

module.exports = config;
