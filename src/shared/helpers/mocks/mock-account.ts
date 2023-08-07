import { AccountModel } from '@src/domain/models/account'
import { LoadAccountByTokenUseCaseProps } from '@src/domain/usecases/account'

export const mockAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

export const mockAccountData = (): Omit<AccountModel, 'id'> => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

export const mockProps = (): LoadAccountByTokenUseCaseProps => ({
  accessToken: 'any_token',
  role: 'user'
})
