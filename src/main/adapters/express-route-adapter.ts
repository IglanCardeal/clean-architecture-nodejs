import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@src/presentation/protocols'
import { Request, Response } from 'express'

export const routeAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      return res.status(httpResponse.statusCode).json({
        message: 'Internal Server Error'
      })
    }
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
