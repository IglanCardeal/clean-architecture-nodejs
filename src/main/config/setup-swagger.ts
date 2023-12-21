import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from '@src/main/docs'

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig))
}
