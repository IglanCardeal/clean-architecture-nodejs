import { InvalidAccountTokenOrRoleError } from '@src/domain/errors'
import { DbLoadAccountByTokenUsecase } from './db-load-account-by-token'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'
import {
  DecrypterError,
  LoadAccountByTokenRepositoryError
} from './db-load-account-by-token-result'
import { mockAccount, mockProps } from '@src/shared/helpers/mocks'

class DecrypterStub implements Decrypter {
  async decrypt(_value: string): Promise<string> {
    return 'account_id'
  }
}

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
  async loadByToken(
    _accountId: string,
    _role?: string
  ): Promise<AccountModel | undefined> {
    return mockAccount()
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

describe('DbLoadAccountByToken Usecase', () => {
  const { decrypterStub, sut, loadAccountByTokenRepositoryStub } = makeSut()
  const props = mockProps()

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
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'user')
  })

  it('Should return a LoadAccountByTokenRepositoryError when LoadAccountByTokenRepository throws', async () => {
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValueOnce(new Error())
    const result = await sut.load(props)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new LoadAccountByTokenRepositoryError())
  })

  it('Should return an InvalidAccountTokenOrRoleError when no account found', async () => {
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockResolvedValueOnce(undefined)
    const result = await sut.load(props)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new InvalidAccountTokenOrRoleError())
  })

  it('Should return an account on success', async () => {
    const result = await sut.load(props)
    const account = result.isSuccess() && result.data
    expect(account).toEqual(mockAccount())
  })
})
