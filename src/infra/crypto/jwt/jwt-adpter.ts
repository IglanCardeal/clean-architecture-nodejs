import jwt from 'jsonwebtoken'

import { Decrypter, TokenGenerator } from '@src/data/protocols/crypto'

export class TokenGeneratorAdapter implements TokenGenerator, Decrypter {
  constructor(private readonly jwtSecret: string) {}

  async generate(accountId: string): Promise<string> {
    return jwt.sign({ accountId }, this.jwtSecret)
  }

  async decrypt(token: string): Promise<string> {
    jwt.verify(token, this.jwtSecret)
    return ''
  }
}
