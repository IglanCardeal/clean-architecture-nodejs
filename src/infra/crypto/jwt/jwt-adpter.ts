import jwt from 'jsonwebtoken'

import { Decrypter, TokenGenerator } from '@src/data/protocols/crypto'

export class TokenGeneratorAdapter implements TokenGenerator, Decrypter {
  constructor(private readonly jwtSecret: string) {}

  async generate(accountId: string): Promise<string> {
    return jwt.sign({ accountId }, this.jwtSecret)
  }

  async decrypt(token: string): Promise<string> {
    const { accountId } = jwt.verify(token, this.jwtSecret) as Record<
      string,
      string
    >
    return accountId
  }
}
