import { InvalidAccountTokenOrRoleError } from '@src/domain/errors'
import { DbLoadAccountByTokenUsecase } from './db-load-account-by-token'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
  LoadAccountByTokenUseCaseProps
} from './db-load-account-by-token-protocols'
import {
  DecrypterError,
  LoadAccountByTokenRepositoryError
} from './db-load-account-by-token-result'

class DecrypterStub implements Decrypter {
  async decrypt(_value: string): Promise<string> {
    return 'account_id'
  }
}

const makeFakeAccount = () => ({
  id: 'any_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})
class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
  async loadByToken(
    _accountId: string,
    _role?: string
  ): Promise<AccountModel | undefined> {
    return makeFakeAccount()
  }
}

const makeSut = () => {
  const decrypterStub = new DecrypterStub()
  const loadAccountByTokenRepositoryStub =
    new LoadAccountByTokenRepositoryStub()
  return {
    sut: new DbLoadAccountByTokenUsecase(
      decrypterStub,
      loadAccountByTokenRepositoryStub
    ),
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}
const makeFakeProps = (): LoadAccountByTokenUseCaseProps => ({
  accessToken: 'any_token',
  role: 'user'
})

describe('DbLoadAccountByToken Usecase', () => {
  const { decrypterStub, sut, loadAccountByTokenRepositoryStub } = makeSut()
  const props = makeFakeProps()

  it('Should call Decrypter with correct values', async () => {
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(props)
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return a DecrypterError when Decrypter throws', async () => {
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const result = await sut.load(props)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new DecrypterError())
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    )
    await sut.load(props)
    expect(loadByTokenSpy).toHaveBeenCalledWith('account_id', 'user')
  })

  it('Should return a LoadAccountByTokenRepositoryError when LoadAccountByTokenRepository throws', async () => {
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValueOnce(new Error())
    const result = await sut.load(props)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new LoadAccountByTokenRepositoryError())
  })

  it('Should return a InvalidAccountTokenOrRoleError when no account found', async () => {
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockResolvedValueOnce(undefined)
    const result = await sut.load(props)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new InvalidAccountTokenOrRoleError())
  })
})
