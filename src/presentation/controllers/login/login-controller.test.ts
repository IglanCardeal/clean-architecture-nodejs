import { MissingParamError } from '@src/presentation/errors'
import { badRequest } from '@src/presentation/helpers/http-helper'
import { LoginController } from './login-controller'

const makeSut = () => new LoginController()

describe('Login Controller', () => {
  const httRequest = {
    body: {
      email: 'any@mail.com',
      password: 'any_pass'
    }
  }

  it('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const invalidHttpRequest = {
      body: { ...httRequest.body, email: '' }
    }
    const HttpResponse = await sut.handle(invalidHttpRequest)
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
