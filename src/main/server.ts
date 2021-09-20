/* eslint-disable no-console */
import { mongoHelper } from '@src/infra/database/mongodb/helpers/mongo-helper'
import { ENV } from './config'
import { app } from './express/app'

const startServer = async () => {
  try {
    await mongoHelper.connect()

    app.listen(ENV.PORT, () => {
      console.log(`Server running on http://localhost:${ENV.PORT}`)
    })
  } catch (error) {
    console.error('[ERROR]: Something went wrong: ', error)
    process.exit(1)
  }
}

startServer()
