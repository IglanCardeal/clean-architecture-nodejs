import { ok, serverError } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LogErrorRepository
} from '@src/presentation/protocols'
import { LogControllerDecorator } from './log'

class AnyControllerStub implements Controller {
  async handle(_httRequest: HttpRequest): Promise<HttpResponse> {
    return ok<string>('ok')
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async logError(_stack: string): Promise<void> {
    return undefined
  }
}

const logErrorRepositoryStub = new LogErrorRepositoryStub()
const anyControllerStub = new AnyControllerStub()
const makeSut = () =>
  new LogControllerDecorator(anyControllerStub, logErrorRepositoryStub)
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

  it('Should return controller handle response with correct values', async () => {
    const sut = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(ok('ok'))
  })

  it('Should call LogErrorRepository with the correct error if the controller returns a server error ', async () => {
    jest.spyOn(anyControllerStub, 'handle').mockResolvedValue(makeServerError())
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const sut = makeSut()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
