import jwt from 'jsonwebtoken'

import { TokenGenerator } from '@src/data/protocols/crypto'

export class TokenGeneratorAdapter implements TokenGenerator {
  constructor(private readonly jwtSecret: string) {}

  async generate(accountId: string): Promise<string> {
    return jwt.sign({ accountId }, this.jwtSecret)
  }
}
