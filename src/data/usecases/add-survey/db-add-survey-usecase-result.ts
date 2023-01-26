import { ApplicationError, Either } from '@src/shared'

export class AddSurveyRepositoryError
  extends Error
  implements ApplicationError
{
  readonly message: string

  constructor(readonly stack?: string) {
    super('AddSurveyRepositoryError')
    this.message = 'A repository error ocurred'
    this.stack = stack
  }
}

export type DbAddAccountResult = Either<void, AddSurveyRepositoryError>
