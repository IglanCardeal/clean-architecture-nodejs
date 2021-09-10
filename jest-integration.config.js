// faz o match para teste de integração com a extensão *.spec.ts
const rootConfig = require('./jest.config')
rootConfig.testMatch = ['<rootDir>/src/**/*.spec.ts']

module.exports = rootConfig
