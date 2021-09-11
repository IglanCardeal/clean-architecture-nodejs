import bcrypt from 'bcrypt'

import { Encrypter } from '@src/data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
