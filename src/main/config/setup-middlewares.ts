import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'

export default (app: Express): void => {
  bodyParser(app)
}
