import { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'

export const corsMiddleware = (app: Express) => {
  app.use(cors({ origin: '*' }))
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('access-control-allow-methods', '*')
    res.setHeader('access-control-allow-headers', '*')
    next()
  })
}
