export {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@src/data/protocols/db'
export { HashComparer, TokenGenerator } from '@src/data/protocols/crypto'
export * from '@src/domain/models/account'

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
