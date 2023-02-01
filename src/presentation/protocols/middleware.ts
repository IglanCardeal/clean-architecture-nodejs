import { HttpRequest, HttpResponse } from './http'

export interface Middleware {
  handle(httRequest: HttpRequest): Promise<HttpResponse>
}
