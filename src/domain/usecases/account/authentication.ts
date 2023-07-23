import { AccountModel } from '../../models/account'

export type AuthModel = Omit<AccountModel, 'name' | 'id'>

export interface AuthenticationUseCase<T> {
  auth(authModel: AuthModel): Promise<T> | T
}
