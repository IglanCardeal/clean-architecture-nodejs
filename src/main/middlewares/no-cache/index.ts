import { Express, NextFunction, Request, Response } from 'express'

export const noCache = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'cache-control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    res.setHeader('expires', '0')
    res.setHeader('ssurrogate-control', 'no-store')
    next()
  })
}
