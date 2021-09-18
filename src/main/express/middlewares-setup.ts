import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'

export const middlewaresSetup = (app: Express) => {
  app.use(bodyParser)
}
