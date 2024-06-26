import { AccountModel } from '@src/domain/models/account'
import { LoadAccountByTokenUseCaseProps } from '@src/domain/usecases/account'

export const makeRawAccountData = () => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

export const mockAccount = (): AccountModel => ({
  id: 'any_id',
  ...makeRawAccountData()
})

export const mockAccountModel = () => ({
  ...mockAccount(),
  accessToken: 'valid_access_token'
})

export const mockProps = (): LoadAccountByTokenUseCaseProps => ({
  accessToken: 'any_token',
  role: 'user'
})
