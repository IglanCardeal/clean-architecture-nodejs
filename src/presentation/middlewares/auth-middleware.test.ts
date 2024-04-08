import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '@src/presentation/errors'
import { HttpRequest } from './auth-middleware-protocols'
import { failure } from '@src/shared'
import { LoadAccountByTokenRepositoryError } from '@src/data/usecases/account/load-account-by-token/db-load-account-by-token-result'
import { mockLoadAccountByTokenUseCase } from '@src/shared/helpers/stubs/usecase/account'

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeSut = (role?: string) => {
  const loadAccountByTokenUseCaseStub = mockLoadAccountByTokenUseCase()
  return {
    sut: new AuthMiddleware(loadAccountByTokenUseCaseStub, role),
    loadAccountByTokenUseCaseStub
  }
}

describe('Auth Middleware', () => {
  const { sut, loadAccountByTokenUseCaseStub } = makeSut('any_role')
  const httpRequest = mockRequest()

  it('should return 403 if no x-access-token is provided', async () => {
    const result = await sut.handle({})
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByTokenUseCase with correct access token', async () => {
    const loadSpy = jest.spyOn(loadAccountByTokenUseCaseStub, 'load')
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith({
      accessToken: 'any_token',
      role: 'any_role'
    })
  })

  it('should return 403 if LoadAccountByTokenUseCase returns AccessDeniedError', async () => {
    jest
      .spyOn(loadAccountByTokenUseCaseStub, 'load')
      .mockResolvedValueOnce(failure(new AccessDeniedError()))
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadAccountByTokenUseCase returns an AccountModel', async () => {
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(ok({ accountId: 'any_id' }))
  })

  it('should return 500 if LoadAccountByTokenUseCase returns a LoadAccountByTokenRepositoryError', async () => {
    jest
      .spyOn(loadAccountByTokenUseCaseStub, 'load')
      .mockResolvedValueOnce(failure(new LoadAccountByTokenRepositoryError()))
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(serverError(new LoadAccountByTokenRepositoryError()))
  })

  it('should return 500 if LoadAccountByTokenUseCase throws', async () => {
    jest
      .spyOn(loadAccountByTokenUseCaseStub, 'load')
      .mockRejectedValueOnce(new Error())
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(serverError(new Error()))
  })
})
