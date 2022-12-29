import { failure, success, Either } from '@src/shared/either'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-usecase-protocols'
import {
  AddAccountUseCase,
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-usecase-protocols'
import {
  AddAccountRepositoryError,
  DbAddAccountResult,
  HasherError
} from './db-add-account-usecase-result'

export class DbAddAccountUseCase
  implements AddAccountUseCase<DbAddAccountResult>
{
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<DbAddAccountResult> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    const hashedPassword = await this.hashPassword(accountData.password)

    if (hashedPassword.isFailure()) return failure(hashedPassword.error)

    const accountCreated = await this.saveAccount({
      ...accountData,
      password: hashedPassword.data
    })

    if (accountCreated.isFailure()) return failure(accountCreated.error)

    return success(accountCreated.data)
  }

  private async saveAccount(
    accountData: AddAccountModel
  ): Promise<Either<AccountModel, AddAccountRepositoryError>> {
    try {
      const accountCreated = await this.addAccountRepository.add(accountData)
      return success(accountCreated)
    } catch (error) {
      return failure(new AddAccountRepositoryError(error))
    }
  }

  private async hashPassword(
    password: string
  ): Promise<Either<string, HasherError>> {
    try {
      const hashedPassword = await this.hasher.hash(password)
      return success(hashedPassword)
    } catch (error) {
      return failure(new HasherError(error))
    }
  }
}
