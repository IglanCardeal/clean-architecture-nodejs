export class SignUpController {
  public handle (httpRequest: unknown): any {
    (httpRequest)
    return {
      statusCode: 400,
      body: new Error('Missing param: name')
    }
  }
}
