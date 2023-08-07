import { AccountModel } from '@src/domain/models/account'

export type AddAccountParams = Omit<AccountModel, 'id'>

export interface AddAccountUseCase<T> {
  add(account: AddAccountParams): Promise<T> | T
}
