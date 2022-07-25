import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '@src/presentation/errors'
import {
  badRequest,
  serverError,
  unauthorized
} from '@src/presentation/helpers/http-helper'
import { LoginController } from './login-controller'
import { EmailValidator, AuthenticationUseCase } from './login-protocols'

class EmailValidatorStub implements EmailValidator {
  isValid(_email: string): boolean {
    return true
  }
}

class AuthenticationUseCaseStub implements AuthenticationUseCase<string> {
  async auth({ _email, _password }: any): Promise<string> {
    return 'auth_token'
  }
}

const authenticationUseCaseStub = new AuthenticationUseCaseStub()
const emailValidatorStub = new EmailValidatorStub()
const makeSut = () =>
  new LoginController(emailValidatorStub, authenticationUseCaseStub)

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

  it('Should return 400 if email is invalid', async () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const HttpResponse = await sut.handle(httRequest)
    expect(HttpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const HttpResponse = await sut.handle(httRequest)
    expect(HttpResponse).toEqual(serverError(new ServerError('')))
  })

  it('Should call AuthenticationUseCase with correct values', async () => {
    const sut = makeSut()
    const authSpy = jest.spyOn(authenticationUseCaseStub, 'auth')
    await sut.handle(httRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any@mail.com',
      password: 'any_pass'
    })
  })

  it('Should returns 401 if credentials are invalid', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationUseCaseStub, 'auth').mockResolvedValueOnce('')
    const httpResponse = await sut.handle(httRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should returns 500 if AuthenticationUseCase throws', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationUseCaseStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })
})
