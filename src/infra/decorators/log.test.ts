/* eslint-disable @typescript-eslint/no-unused-vars */
import { serverError } from '@src/shared/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@src/shared/ports'
import { LogErrorRepository } from '@src/shared/ports/log-repository'
import { LogControllerDecorator } from './log'

class GenericControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {}
    }
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return
  }
}

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
    const httpRequest = {
      body: {}
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return controller handle response object', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {}
    })
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
    const httpRequest = {
      body: {}
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('Fake Error Stack')
  })
})
