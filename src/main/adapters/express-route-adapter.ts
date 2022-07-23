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
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
