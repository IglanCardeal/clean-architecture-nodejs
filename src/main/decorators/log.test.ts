import {
  Controller,
  HttpRequest,
  HttpResponse
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

const anyControllerStub = new AnyControllerStub()
const makeSut = () => new LogControllerDecorator(anyControllerStub)

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
})
