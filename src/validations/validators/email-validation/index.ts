import { InvalidParamError } from '@src/presentation/errors'
import { EmailValidator } from '@src/validations/protocols'
import { Validation } from '@src/presentation/protocols'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate<T extends Record<string, string>>(input: T): void | Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
