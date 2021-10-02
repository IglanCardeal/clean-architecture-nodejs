import { Controller, HttpRequest, HttpResponse } from '@src/shared/ports'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: HttpRequest = { body: req.body }
    const response: HttpResponse = await controller.handle(request)

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({
        error: response.body.message
      })
    }

    return res.status(response.statusCode).json(response.body)
  }
}
