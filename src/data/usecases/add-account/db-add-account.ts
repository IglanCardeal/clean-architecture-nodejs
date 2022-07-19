import { failure, success } from '@src/shared/either'
import {
  AddAccountUseCase,
  Hasher,
  AddAccountModel,
  AddAccountRepository
} from './db-add-account-protocols'
import {
  AddAccountRepositoryError,
  DbAddAccountResult,
  HasherError
} from './db-add-account-result'

export class DbAddAccountUseCase
  implements AddAccountUseCase<DbAddAccountResult>
{
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<DbAddAccountResult> {
    try {
      accountData.password = await this.hasher.hash(accountData.password)
    } catch (error) {
      return failure(new HasherError(error))
    }
    try {
      const accountCreated = await this.addAccountRepository.add(accountData)
      return success(accountCreated)
    } catch (error) {
      return failure(new AddAccountRepositoryError(error))
    }
  }
}
