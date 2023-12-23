import { ACCOUNT_ROUTE_PREFIX } from '../routes'
import { loginPath } from './paths'
import { accountSchema, loginParamsSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'NodeJS API do curso de clean architecture.',
    version: '1.0.0'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'login'
    }
  ],
  paths: {
    [`/${ACCOUNT_ROUTE_PREFIX}/login`]: loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema
  }
}
