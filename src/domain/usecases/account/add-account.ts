import { AccountModel } from '@src/domain/models/account'

export type AddAccountModel = Omit<AccountModel, 'id'>

export interface AddAccountUseCase<T> {
  add(account: AddAccountModel): Promise<T> | T
}
