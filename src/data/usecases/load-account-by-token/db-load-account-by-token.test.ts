import { DbLoadAccountByTokenUsecase } from './db-load-account-by-token'
import {
  Decrypter,
  LoadAccountByTokenUseCaseProps
} from './db-load-account-by-token-protocols'

class DecrypterStub implements Decrypter {
  async decrypt(_value: string): Promise<string> {
    return 'account_id'
  }
}

const makeSut = () => {
  const decrypterStub = new DecrypterStub()
  return {
    sut: new DbLoadAccountByTokenUsecase(decrypterStub),
    decrypterStub
  }
}
const makeFakeProps = (): LoadAccountByTokenUseCaseProps => ({
  accessToken: 'any_token',
  role: 'user'
})

describe('DbLoadAccountByToken Usecase', () => {
  const { decrypterStub, sut } = makeSut()
  const props = makeFakeProps()

  it('Should call Decrypter with correct values', async () => {
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(props)
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
