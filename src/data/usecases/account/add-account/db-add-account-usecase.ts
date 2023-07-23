import { EmailAlreadyInUseError } from '@src/domain/errors'
import { failure, success, Either } from '@src/shared/either'
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
  HasherError,
  LoadAccountByEmailRepositoryError
} from './db-add-account-usecase-result'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-usecase-protocols'

export class DbAddAccountUseCase
  implements AddAccountUseCase<DbAddAccountResult>
{
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<DbAddAccountResult> {
    const verifyEmailAlreadyInUseResult = await this.verifyEmailAlreadyInUse(
      accountData.email
    )

    if (verifyEmailAlreadyInUseResult.isFailure())
      return failure(verifyEmailAlreadyInUseResult.error)

    const hashAccountPasswordResult = await this.hashAccountPassword(
      accountData.password
    )

    if (hashAccountPasswordResult.isFailure())
      return failure(hashAccountPasswordResult.error)

    const createNewAccountResult = await this.createNewAccount({
      ...accountData,
      password: hashAccountPasswordResult.data
    })

    if (createNewAccountResult.isFailure())
      return failure(createNewAccountResult.error)

    return success(createNewAccountResult.data)
  }

  private async verifyEmailAlreadyInUse(
    email: string
  ): Promise<
    Either<'ok', EmailAlreadyInUseError | LoadAccountByEmailRepositoryError>
  > {
    try {
      const emailAlreadyInUse =
        await this.loadAccountByEmailRepository.loadByEmail(email)
      if (emailAlreadyInUse) {
        return failure(new EmailAlreadyInUseError())
      }
      return success('ok')
    } catch (error: any) {
      return failure(new LoadAccountByEmailRepositoryError(error.stack))
    }
  }

  private async hashAccountPassword(
    password: string
  ): Promise<Either<string, HasherError>> {
    try {
      const hashedPassword = await this.hasher.hash(password)
      return success(hashedPassword)
    } catch (error: any) {
      return failure(new HasherError(error.stack))
    }
  }

  private async createNewAccount(
    accountData: AddAccountModel
  ): Promise<Either<AccountModel, AddAccountRepositoryError>> {
    try {
      const accountCreated = await this.addAccountRepository.add(accountData)
      return success(accountCreated)
    } catch (error: any) {
      return failure(new AddAccountRepositoryError(error.stack))
    }
  }
}
