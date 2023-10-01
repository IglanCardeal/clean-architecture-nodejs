import {
  Decrypter,
  HashComparer,
  Hasher,
  TokenGenerator
} from '@src/data/protocols/crypto'
import { UUIDGenerator } from '@src/presentation/protocols'

export const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(_password: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

export const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_password: string, _hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

export const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(_id: string): Promise<string> {
      return 'access_token'
    }
  }
  return new TokenGeneratorStub()
}

export const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(_value: string): Promise<string> {
      return 'account_id'
    }
  }
  return new DecrypterStub()
}

export const mockUuidGenerator = () => {
  class UUIDGeneratorStub implements UUIDGenerator {
    generate(): string {
      return 'unique_id'
    }
  }
  return new UUIDGeneratorStub()
}
