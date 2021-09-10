import validator from 'validator'

import { EmailValidator } from '@src/presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
