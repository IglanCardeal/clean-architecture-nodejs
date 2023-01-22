import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@src/validations/validators'
import { Validation } from '@src/presentation/protocols'
import { EmailValidator } from '@src/validations/protocols'
import { makeLoginValidations } from './login-validations-factory'

jest.mock('@src/validations/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidations()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
