/* eslint-disable @typescript-eslint/no-unused-vars */
import { ok, serverError } from '@src/shared/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@src/shared/ports'
import { LogErrorRepository } from '@src/shared/ports/log-repository'
import { LogControllerDecorator } from './log'

class GenericControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok({})
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return
  }
}

const makeFakeRequest = () => ({
  body: {}
})

const makeSut = () => {
  const genericControllerStub = new GenericControllerStub()
  const logErrorRepositoryStub = new LogErrorRepositoryStub()

  return {
    sut: new LogControllerDecorator(
      genericControllerStub,
      logErrorRepositoryStub
    ),
    genericControllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, genericControllerStub } = makeSut()
    const handleSpy = jest.spyOn(genericControllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('Should return controller handle response object', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({}))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, genericControllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'Fake Error Stack'
    const error = serverError(fakeError)

    jest
      .spyOn(genericControllerStub, 'handle')
      .mockImplementationOnce(async () => {
        return error
      })

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith('Fake Error Stack')
  })
})
