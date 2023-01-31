import {
  RequiredFieldValidation,
  ValidationComposite
} from '@src/validations/validators'
import { Validation } from '@src/presentation/protocols'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = []
  const fields = ['question', 'answers']

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
