import { CompareFieldsValidation } from '@src/presentation/helpers/validation/compare-fields-validation'
import { RequiredFieldValidation } from '@src/presentation/helpers/validation/required-field-validation'
import { Validation } from '@src/presentation/helpers/validation/validation'
import { ValidationComposite } from '@src/presentation/helpers/validation/validation-composite'

export const makeSignUpValidations = (): Validation => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  return new ValidationComposite(validations)
}
