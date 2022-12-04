import { ok, serverError } from '@src/presentation/helpers/http'
import {
  LogDataError,
  LogTransactionId,
  LogRepository
} from '@src/data/protocols/db'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  UUIDGenerator
} from '@src/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

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

class UUIDGeneratorStub implements UUIDGenerator {
  generate(): string {
    return 'unique_id'
  }
}

const logRepositoryStub = new LogRepositoryStub()
const anyControllerStub = new AnyControllerStub()
const uuidStub = new UUIDGeneratorStub()
const makeSut = () =>
  new LogControllerDecorator(anyControllerStub, logRepositoryStub, uuidStub)
const makeServerError = () => {
  const anyServerErrorStub = new Error()
  anyServerErrorStub.stack = 'any_stack'
  return serverError(anyServerErrorStub)
}

describe('Log Controller Decorator', () => {
  const httpRequest: HttpRequest = {
    body: {
      name: 'Foo',
      email: 'foo@mail.com',
      password: '123foo',
      passwordConfirmation: '123foo'
    }
  }

  it('Should call controller handle with correct values', async () => {
    const sut = makeSut()
    const anyControllerHandleSpy = jest.spyOn(anyControllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(anyControllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return controller handle response with correct values and the transaction id', async () => {
    const sut = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({ ...ok('ok'), transactionId: 'unique_id' })
  })

  it('Should call LogRepository with the correct request data and transaction id', async () => {
    const logInfoSpy = jest.spyOn(logRepositoryStub, 'logInfo')
    const sut = makeSut()
    await sut.handle(httpRequest)
    expect(logInfoSpy).toHaveBeenCalledWith({
      ...ok('ok'),
      transactionId: 'unique_id'
    })
  })

  it('Should call LogRepository with the correct error and transaction id if the controller returns a server error', async () => {
    jest.spyOn(anyControllerStub, 'handle').mockResolvedValue(makeServerError())
    const logErrorSpy = jest.spyOn(logRepositoryStub, 'logError')
    const sut = makeSut()
    await sut.handle(httpRequest)
    expect(logErrorSpy).toHaveBeenCalledWith({
      body: {
        email: 'foo@mail.com',
        name: 'Foo',
        password: '123foo',
        passwordConfirmation: '123foo'
      },
      stack: 'any_stack',
      transactionId: 'unique_id'
    })
  })
})
