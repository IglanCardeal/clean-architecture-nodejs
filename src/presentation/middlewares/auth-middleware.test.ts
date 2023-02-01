import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '@src/presentation/errors'
import {
  AccountModel,
  HttpRequest,
  LoadAccountByTokenUseCase,
  LoadAccountByTokenUseCaseProps
} from './auth-middleware-protocols'

class LoadAccountByTokenUseCaseStub
  implements LoadAccountByTokenUseCase<AccountModel | AccessDeniedError>
{
  async load({
    accessToken: _accessToken,
    role: _role
  }: LoadAccountByTokenUseCaseProps): Promise<
    AccountModel | AccessDeniedError
  > {
    return makeFakeAccountModel()
  }
}

const makeFakeAccountModel = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_pass',
  accessToken: 'valid_access_token'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeSut = () => {
  const loadAccountByTokenUseCaseStub = new LoadAccountByTokenUseCaseStub()
  return {
    sut: new AuthMiddleware(loadAccountByTokenUseCaseStub),
    loadAccountByTokenUseCaseStub
  }
}

describe('Auth Middleware', () => {
  const { sut, loadAccountByTokenUseCaseStub } = makeSut()
  const httpRequest = makeFakeRequest()

  it('should return 403 if no x-access-token is provided', async () => {
    const result = await sut.handle({ headers: {} })
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByTokenUseCase with correct access token', async () => {
    const loadSpy = jest.spyOn(loadAccountByTokenUseCaseStub, 'load')
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith({
      accessToken: 'any_token'
    })
  })

  it('should return 403 if LoadAccountByTokenUseCase returns AccessDeniedError', async () => {
    jest
      .spyOn(loadAccountByTokenUseCaseStub, 'load')
      .mockResolvedValueOnce(new AccessDeniedError())
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })
})
