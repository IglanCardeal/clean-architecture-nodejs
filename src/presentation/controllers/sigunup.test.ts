import { SignUpController } from './signup.controller'

describe('SignUp Controller', () => {
  it('should return 400 if no name was provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: '',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
