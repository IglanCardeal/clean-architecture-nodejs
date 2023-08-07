import { AccountModel } from '../../models/account'

export type AuthParams = Omit<AccountModel, 'name' | 'id'>

export interface AuthenticationUseCase<T> {
  auth(authModel: AuthParams): Promise<T> | T
}
