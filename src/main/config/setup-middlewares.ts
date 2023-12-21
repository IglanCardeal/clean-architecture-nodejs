import { Express } from 'express'
import {
  contentTypeMiddleware,
  jsonParser,
  corsMiddleware
} from '../middlewares'

export default (app: Express): void => {
  jsonParser(app)
  corsMiddleware(app)
  contentTypeMiddleware(app)
}
