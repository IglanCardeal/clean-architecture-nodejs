import { Controller, HttpRequest, HttpResponse } from '@src/presentation/ports'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: HttpRequest = { body: req.body }
    const response: HttpResponse = await controller.handle(request)
    return res.status(response.statusCode).json(response.body)
  }
}
