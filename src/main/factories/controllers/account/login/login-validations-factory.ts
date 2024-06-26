import { EmailValidatorAdapter } from '@src/infra/validators/email-validator-adapter'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@src/validations/validators'
import { Validation } from '@src/presentation/protocols'

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
