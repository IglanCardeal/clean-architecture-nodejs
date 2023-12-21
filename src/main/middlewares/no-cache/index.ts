import { NextFunction, Request, Response } from 'express'

export const noCache = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    'cache-control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  res.setHeader('expires', '0')
  res.setHeader('ssurrogate-control', 'no-store')
  next()
}
