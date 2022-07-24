import { serverError } from '@src/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LogErrorRepository
} from '@src/presentation/protocols'
import { LogControllerDecorator } from './log'

class AnyControllerStub implements Controller {
  async handle(_httRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        message: 'ok'
      }
    }
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async log(_stack: string): Promise<void> {
    return undefined
  }
}

const logErrorRepositoryStub = new LogErrorRepositoryStub()
const anyControllerStub = new AnyControllerStub()
const makeSut = () =>
  new LogControllerDecorator(anyControllerStub, logErrorRepositoryStub)

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
    expect(anyControllerHandleSpy).toHaveBeenCalledWith({
      body: {
        name: 'Foo',
        email: 'foo@mail.com',
        password: '123foo',
        passwordConfirmation: '123foo'
      }
    })
  })

  it('Should return controller handle response with correct values', async () => {
    const sut = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({
      statusCode: 200,
      body: {
        message: 'ok'
      }
    })
  })

  it('Should call LogErrorRepository with the correct error if the controller returns a server error ', async () => {
    const anyServerErrorStub = new Error()
    anyServerErrorStub.stack = 'any_stack'
    jest
      .spyOn(anyControllerStub, 'handle')
      .mockResolvedValue(serverError(anyServerErrorStub))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const sut = makeSut()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
