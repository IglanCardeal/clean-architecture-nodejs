import { InvalidParamError } from '@src/presentation/errors'
import { Validation } from '@src/presentation/protocols'

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompare: string
  ) {}

  validate<T extends Record<string, string>>(input: T): void | Error {
    if (input[this.fieldName].length !== input[this.fieldToCompare].length) {
      return new InvalidParamError(this.fieldToCompare)
    }
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
