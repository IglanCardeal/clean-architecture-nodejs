export class AccessDeniedError extends Error {
  constructor() {
    super(`Access Denied! Missing or invalid access token`)
    this.name = 'AccessDeniedError'
  }
}
