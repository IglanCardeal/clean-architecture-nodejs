import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@src/presentation/helpers/validations'
import { Validation } from '@src/presentation/protocols'
import { EmailValidatorAdapter } from '@src/utils/email-validator-adapter'

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
