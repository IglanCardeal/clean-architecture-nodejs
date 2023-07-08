import {
  DbAuthenticationUseCaseResult,
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError,
  UpdateAccessTokenRepositoryError,
  UserAccessToken
} from '@src/data/usecases/account/authentication/db-authentication-usecase-result'
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
    return success(new UserAccessToken('auth_token'))
  }
}

const makeSut = () => {
  const authenticationUseCaseStub = new AuthenticationUseCaseStub()
  const validationStub = makeValidation()
  return {
    sut: new LoginController(validationStub, authenticationUseCaseStub),
    validationStub,
    authenticationUseCaseStub
  }
}
const makeFakeRequest = () => ({
  body: {
    email: 'any@mail.com',
    password: 'any_pass'
  }
})

describe('Login Controller', () => {
  const httpRequest = makeFakeRequest()
  const { sut, authenticationUseCaseStub, validationStub } = makeSut()

  it('Should call Validation with correct values', async () => {
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should return 500 if Validation throws', async () => {
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('Should call AuthenticationUseCase with correct values', async () => {
    const authSpy = jest.spyOn(authenticationUseCaseStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any@mail.com',
      password: 'any_pass'
    })
  })

  it('Should returns 401 if credentials are invalid', async () => {
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new InvalidCredentialsError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized(new InvalidCredentialsError()))
  })

  it('Should returns 500 if AuthenticationUseCase returns a LoadAccountByEmailRepositoryError', async () => {
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new LoadAccountByEmailRepositoryError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      serverError(new LoadAccountByEmailRepositoryError())
    )
  })

  it('Should returns 500 if AuthenticationUseCase returns a UpdateAccessTokenRepositoryError', async () => {
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new UpdateAccessTokenRepositoryError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      serverError(new UpdateAccessTokenRepositoryError())
    )
  })

  it('Should returns 500 if AuthenticationUseCase returns a HasherComparerError', async () => {
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new HasherComparerError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new HasherComparerError()))
  })

  it('Should returns 500 if AuthenticationUseCase returns a TokenGeneratorError', async () => {
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new TokenGeneratorError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new TokenGeneratorError()))
  })

  it('Should returns 200 if valid credentials are provided', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'auth_token' }))
  })
})
