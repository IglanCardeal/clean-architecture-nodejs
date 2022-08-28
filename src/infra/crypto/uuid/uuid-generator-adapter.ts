import crypto from 'crypto'
import { UUIDGenerator } from '@src/presentation/protocols'

export class UUIDGeneratorAdapter implements UUIDGenerator {
  generate(): string {
    try {
      return crypto.randomUUID()
    } catch (error) {
      const temporaryId = Date.now() * Math.random()
      return `${temporaryId}`
    }
  }
}
