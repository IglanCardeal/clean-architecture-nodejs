import { HttpRequest, HttpResponse } from "./http"

export interface Controller {
  handle: (httRequest: HttpRequest) => HttpResponse
}