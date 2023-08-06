export class DomainError extends Error {
  constructor() {
    super()
  }
}

export class InvalidCredentialsError extends DomainError {
  readonly message: string

  constructor() {
    super()
    this.name = 'InvalidCredentialsError'
    this.message = 'E-mail or password is invalid'
  }
}

export class EmailAlreadyInUseError extends DomainError {
  readonly message: string

  constructor() {
    super()
    this.name = 'EmailAlreadyInUseError'
    this.message = 'E-mail address already in use'
  }
}

export class InvalidAccountTokenOrRoleError
  extends Error
  implements DomainError
{
  readonly message: string

  constructor() {
    super()
    this.name = 'InvalidAccountTokenOrRoleError'
    this.message = 'The account token or role is invalid'
  }
}

export class MissingSurveyId extends DomainError {
  readonly message: string

  constructor() {
    super()
    this.name = 'MissingSurveyId'
    this.message = 'Missing survey id'
  }
}
