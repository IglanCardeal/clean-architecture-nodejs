// faz o match para teste de integração com a extensão *.spec.ts
const rootConfig = require('./jest.config')
rootConfig.testMatch = ['<rootDir>/src/**/*.spec.ts']
rootConfig.displayName = 'integration-tests'

module.exports = rootConfig
