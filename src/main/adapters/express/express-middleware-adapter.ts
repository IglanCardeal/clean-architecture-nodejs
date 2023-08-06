import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@src/presentation/protocols'
import { NextFunction, Request, Response } from 'express'

export const middlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = <HttpRequest>{ headers: req.headers }
    const { statusCode, body }: HttpResponse = await middleware.handle(
      httpRequest
    )
    if (statusCode !== 200) {
      return res.status(statusCode).json(body)
    }
    req.accountId = body.accountId
    return next()
  }
}
