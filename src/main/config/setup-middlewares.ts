import { Express } from 'express'
import { jsonParser } from '../middlewares/body-parser/json-parser'

export default (app: Express): void => {
  jsonParser(app)
}
