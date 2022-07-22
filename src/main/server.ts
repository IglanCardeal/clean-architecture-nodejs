/* eslint-disable no-console */
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { ENV } from './config/env'

MongoHelper.connect(ENV.mongoUrl)
  .then(async () => {
    const { app } = await import('./config/app')
    app.listen(ENV.port, () => {
      console.log(`Server running on http://localhost:${ENV.port}`)
    })
  })
  .catch()
