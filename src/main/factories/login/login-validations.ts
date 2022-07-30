import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@src/presentation/helpers/validations'
import { Validation } from '@src/presentation/protocols'
import { EmailValidatorAdapter } from '@src/utils/email-validator-adapter'

const emailValidatorAdapter = new EmailValidatorAdapter()

export const makeLoginValidations = (): Validation => {
  const validations: Validation[] = []
  const fields = ['email', 'password']

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', emailValidatorAdapter))

  return new ValidationComposite(validations)
}
