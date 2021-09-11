import { DbAddAccount } from './db-add-account'

class EncrypterStub {
  async encrypt (password: string): Promise<string> {
    password
    return 'hashed password'
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const encryptStub = new EncrypterStub()
    const sut = new DbAddAccount(encryptStub)
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const accountData = {
      name: 'valid name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
