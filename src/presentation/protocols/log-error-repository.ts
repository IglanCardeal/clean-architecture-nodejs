import { HttpRequest, HttpResponse } from './http'

export interface LogDataRequest extends HttpRequest {
  transactionId: string
}

export interface LogDataResponse extends HttpResponse {
  transactionId: string
}

export interface LogDataError extends LogDataRequest {
  stack: string
}

export interface LogRepository {
  logError(data: LogDataError): Promise<void>
  logInfo(data: LogDataRequest | LogDataResponse): Promise<void>
}
