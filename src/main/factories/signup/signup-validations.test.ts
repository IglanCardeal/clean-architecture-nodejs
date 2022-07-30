import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@src/presentation/helpers/validations'
import { Validation } from '@src/presentation/protocols'
import { EmailValidator } from '@src/presentation/protocols'
import { makeSignUpValidations } from './signup-validations'

jest.mock('@src/presentation/helpers/validations/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidations()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
