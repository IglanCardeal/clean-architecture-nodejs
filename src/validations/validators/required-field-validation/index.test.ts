import { MissingParamError } from '@src/presentation/errors'
import { RequiredFieldValidation } from '.'

const makeSut = () => new RequiredFieldValidation('any_field')

describe('Required Field Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const result = sut.validate({})
    expect(result).toEqual(new MissingParamError('any_field'))
  })

  it('Should not return a MissingParamError if validation succeeds', () => {
    const sut = makeSut()
    const result = sut.validate({ any_field: 'any_value' })
    expect(result).toBeFalsy()
  })
})
