import { MissingParamError } from '@src/presentation/errors'
import { badRequest } from '@src/presentation/helpers/http-helper'
import { LoginController } from './login-controller'
import { EmailValidator } from './login-protocols'

class EmailValidatorStub implements EmailValidator {
  isValid(_email: string): boolean {
    return true
  }
}

const emailValidatorStub = new EmailValidatorStub()
const makeSut = () => new LoginController(emailValidatorStub)

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

  it('Should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const invalidHttpRequest = {
      body: { ...httRequest.body, password: '' }
    }
    const HttpResponse = await sut.handle(invalidHttpRequest)
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should call EmailValidator with correct value', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })
})
