import { Express } from 'express'
import {
  contentTypeMiddleware,
  jsonParser,
  corsMiddleware,
  noCache
} from '../middlewares'

export default (app: Express): void => {
  noCache(app)
  jsonParser(app)
  corsMiddleware(app)
  contentTypeMiddleware(app)
}
