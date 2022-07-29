import { CompareFieldsValidation } from '@src/presentation/helpers/validation/compare-fields-validation'
import { RequiredFieldValidation } from '@src/presentation/helpers/validation/required-field-validation'
import { Validation } from '@src/presentation/helpers/validation/validation'
import { ValidationComposite } from '@src/presentation/helpers/validation/validation-composite'
import { makeSignUpValidations } from './signup-validations'

jest.mock('@src/presentation/helpers/validation/validation-composite')

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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
