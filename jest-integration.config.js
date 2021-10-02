// faz o match para teste de integração com a extensão *.spec.ts
const rootConfig = require('./jest.config')
rootConfig.testMatch = [
  '<rootDir>/src/main/**/*.spec.ts',
  '<rootDir>/src/infra/**/*.spec.ts'
]
rootConfig.displayName = 'integration-tests'

module.exports = rootConfig
