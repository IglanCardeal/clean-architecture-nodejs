import { EmailValidatorAdapter } from '@src/infra/validators/email-validator-adapter'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@src/validations/validators'
import { Validation } from '@src/presentation/protocols'

const emailValidatorAdapter = new EmailValidatorAdapter()

export const makeSignUpValidations = (): Validation => {
  const validations: Validation[] = []
  const fields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  validations.push(new EmailValidation('email', emailValidatorAdapter))

  return new ValidationComposite(validations)
}
