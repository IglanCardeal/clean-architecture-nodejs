import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    message: error.message
  }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})

// export const ok = <T>(data: T): HttpResponse => ({
//   statusCode: 200,
//   body: data
// })

export const created = <T>(data: T): HttpResponse => ({
  statusCode: 201,
  body: data
})
