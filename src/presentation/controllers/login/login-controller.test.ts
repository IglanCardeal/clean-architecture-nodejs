import {
  DbAuthenticationUseCaseResult,
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError,
  UpdateAccessTokenRepositoryError
} from '@src/data/usecases/authentication/db-authentication-result'
import { InvalidCredentialsError } from '@src/domain/errors'
import { MissingParamError, ServerError } from '@src/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@src/presentation/helpers/http'
import { failure, success } from '@src/shared'
import { LoginController } from './login-controller'
import { Validation, AuthenticationUseCase } from './login-controller-protocols'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): void | Error {
      return undefined
    }
  }
  return new ValidationStub()
}

class AuthenticationUseCaseStub
  implements AuthenticationUseCase<DbAuthenticationUseCaseResult>
{
  async auth({
    _email,
    _password
  }: any): Promise<DbAuthenticationUseCaseResult> {
    return success('auth_token')
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
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new InvalidCredentialsError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized(new InvalidCredentialsError()))
  })

  it('Should returns 500 if AuthenticationUseCase returns a LoadAccountByEmailRepositoryError', async () => {
    const sut = makeSut()
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new LoadAccountByEmailRepositoryError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      serverError(new LoadAccountByEmailRepositoryError())
    )
  })

  it('Should returns 500 if AuthenticationUseCase returns a UpdateAccessTokenRepositoryError', async () => {
    const sut = makeSut()
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new UpdateAccessTokenRepositoryError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      serverError(new UpdateAccessTokenRepositoryError())
    )
  })

  it('Should returns 500 if AuthenticationUseCase returns a HasherComparerError', async () => {
    const sut = makeSut()
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new HasherComparerError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new HasherComparerError()))
  })

  it('Should returns 500 if AuthenticationUseCase returns a TokenGeneratorError', async () => {
    const sut = makeSut()
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new TokenGeneratorError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new TokenGeneratorError()))
  })

  it('Should returns 200 if valid credentials are provided', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'auth_token' }))
  })
})
