import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@src/data/protocols/db'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountParams } from '@src/domain/usecases/account'
import { mockAccount } from '@src/shared/helpers/mocks'

export const makeLoadAccountByEmailRepositoryStub = (
  returnData = false
): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(_email: string): Promise<AccountModel | undefined> {
      return returnData ? mockAccount() : undefined
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_account: AddAccountParams): Promise<AccountModel> {
      return mockAccount()
    }
  }
  return new AddAccountRepositoryStub()
}

export const makeUpdateAccessTokenRepositoryStub =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(
        _accountId: string,
        _acessToken: string
      ): Promise<void> {
        return undefined
      }
    }
    return new UpdateAccessTokenRepositoryStub()
  }

export const makeLoadAccountByTokenRepositoryStub =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(
        _accountId: string,
        _role?: string
      ): Promise<AccountModel | undefined> {
        return mockAccount()
      }
    }
    return new LoadAccountByTokenRepositoryStub()
  }
