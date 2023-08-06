export type HttpRequest<B = any, H = any> = {
  body?: B
  headers?: H
}

export type HttpResponse<B = any> = {
  body: B
  statusCode: number
}
