import {
  LogDataError,
  LogRepository,
  LogTransactionId
} from '@src/data/protocols/db'
import { ok } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@src/presentation/protocols'

class AnyControllerStub implements Controller {
  async handle(_httRequest: HttpRequest): Promise<HttpResponse> {
    return ok<string>('ok')
  }
}

class LogRepositoryStub implements LogRepository {
  async logError<T extends LogDataError>(_data: T): Promise<void> {
    return undefined
  }

  async logInfo<T extends LogTransactionId>(_data: T): Promise<void> {
    return undefined
  }
}

export const mockController = () => new AnyControllerStub()

export const mockLogRepository = () => new LogRepositoryStub()
