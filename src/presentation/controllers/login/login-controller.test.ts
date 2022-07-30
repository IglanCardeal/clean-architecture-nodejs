import { MissingParamError, ServerError } from '@src/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@src/presentation/helpers/http'
import { LoginController } from './login-controller'
import { Validation, AuthenticationUseCase } from './login-protocols'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): void | Error {
      return undefined
    }
  }
  return new ValidationStub()
}

class AuthenticationUseCaseStub implements AuthenticationUseCase<string> {
  async auth({ _email, _password }: any): Promise<string> {
    return 'auth_token'
  }
}

const authenticationUseCaseStub = new AuthenticationUseCaseStub()
const validationStub = makeValidation()
const makeSut = () =>
  new LoginController(validationStub, authenticationUseCaseStub)

describe('Login Controller', () => {
  const httpRequest = {
    body: {
      email: 'any@mail.com',
      password: 'any_pass'
    }
  }

  it('Should call Validation with correct values', async () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const sut = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should return 500 if Validation throws', async () => {
    const sut = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('Should call AuthenticationUseCase with correct values', async () => {
    const sut = makeSut()
    const authSpy = jest.spyOn(authenticationUseCaseStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any@mail.com',
      password: 'any_pass'
    })
  })

  it('Should returns 401 if credentials are invalid', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationUseCaseStub, 'auth').mockResolvedValueOnce('')
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should returns 500 if AuthenticationUseCase throws', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationUseCaseStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('Should returns 200 if valid credentials are provided', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'auth_token' }))
  })
})
