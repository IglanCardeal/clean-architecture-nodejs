import { Express } from 'express'
import { jsonParser } from '../middlewares/body-parser/json-parser'
import { contentTypeMiddleware } from '../middlewares/content-type'
import { corsMiddleware } from '../middlewares/cors'

export default (app: Express): void => {
  jsonParser(app)
  corsMiddleware(app)
  contentTypeMiddleware(app)
}
