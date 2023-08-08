import { LoadAccountByEmailRepository } from '@src/data/protocols/db'
import { AccountModel } from '@src/domain/models/account'
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
