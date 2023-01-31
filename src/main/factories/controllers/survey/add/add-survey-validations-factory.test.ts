import {
  RequiredFieldValidation,
  ValidationComposite
} from '@src/validations/validators'
import { Validation } from '@src/presentation/protocols'
import { makeAddSurveyValidation } from './add-survey-validations-factory'

jest.mock('@src/validations/validators/validation-composite')

describe('AddSurvey Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
