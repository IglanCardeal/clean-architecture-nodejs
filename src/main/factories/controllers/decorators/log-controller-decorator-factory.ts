import { UUIDGeneratorAdapter } from '@src/infra/crypto/uuid/uuid-generator-adapter'
import { LogMongoRepository } from '@src/infra/db/mongodb'
import { LogControllerDecorator } from '@src/main/decorators/log-controller-decorator'
import { Controller } from '@src/presentation/protocols'

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  return new LogControllerDecorator(
    controller,
    new LogMongoRepository(),
    new UUIDGeneratorAdapter()
  )
}
