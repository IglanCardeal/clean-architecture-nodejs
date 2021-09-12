import validator from 'validator'

import { EmailValidator } from '@src/presentation/ports'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
