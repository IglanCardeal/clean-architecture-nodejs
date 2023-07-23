import { middlewareAdapter } from '@src/main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@src/main/factories/controllers/middlewares/auth/auth-middleware-factory'

export const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
