import { Express, NextFunction, Request, Response } from 'express'

export const contentTypeMiddleware = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.type('json')
    next()
  })
}
