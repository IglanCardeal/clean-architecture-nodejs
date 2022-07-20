import bcrypt from 'bcrypt'

import { Hasher } from '@src/data/protocols/hasher'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt)
  }
}