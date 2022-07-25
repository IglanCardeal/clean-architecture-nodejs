import { AccountModel } from '../add-account/db-add-account-protocols'

export interface FindUserByEmailRepository {
  find(email: string): Promise<AccountModel>
}

export interface CompareData {
  password: string
  hash: string
}

export interface Hasher {
  compare(compareData: CompareData): Promise<boolean>
}

export interface TokenEncryptData {
  accountId: string
}

export interface TokenEncrypter {
  encrypt(tokenEncryptData: TokenEncryptData): Promise<string>
}
