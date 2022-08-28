import { UUIDGeneratorAdapter } from './uuid-generator-adapter'

jest.mock('crypto', () => ({
  randomUUID(): string {
    return 'unique_id'
  }
}))

const makeSut = () => new UUIDGeneratorAdapter()

describe('UUID Generator Adapter', () => {
  it('Should return a UUID string on success', () => {
    const sut = makeSut()
    const uuid = sut.generate()
    expect(uuid).toBe('unique_id')
  })
})
