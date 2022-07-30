import { EmailValidation } from '@src/presentation/helpers/validation/email-validation'
import { RequiredFieldValidation } from '@src/presentation/helpers/validation/required-field-validation'
import { Validation } from '@src/presentation/helpers/validation/validation'
import { ValidationComposite } from '@src/presentation/helpers/validation/validation-composite'
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
