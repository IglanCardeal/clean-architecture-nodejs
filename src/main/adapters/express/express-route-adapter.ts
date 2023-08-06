import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@src/presentation/protocols'
import { Request, Response } from 'express'

export const routeAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest = <HttpRequest>{
      body: {
        ...req.body,
        ...req.params
      },
      accountId: req.accountId
    }
    const { statusCode, body }: HttpResponse = await controller.handle(
      httpRequest
    )

    if (statusCode === 500) {
      return res.status(statusCode).json({
        message: 'Internal Server Error'
      })
    }

    return res.status(statusCode).json(body)
  }
}
