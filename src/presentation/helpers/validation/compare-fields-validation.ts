import { InvalidParamError } from '@src/presentation/errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompare: string
  ) {}

  validate<T extends Record<string, string>>(input: T): void | Error {
    if (input[this.fieldName].length !== input[this.fieldToCompare].length) {
      return new InvalidParamError(this.fieldToCompare)
    }
    if (this.fieldName !== this.fieldToCompare) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
