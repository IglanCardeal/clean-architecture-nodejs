/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, HttpRequest, HttpResponse } from '@src/shared/ports'
import { LogControllerDecorator } from './log'

class GenericControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {}
    }
  }
}

const makeSut = () => {
  const genericControllerStub = new GenericControllerStub()
  return {
    sut: new LogControllerDecorator(genericControllerStub),
    genericControllerStub
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
})
