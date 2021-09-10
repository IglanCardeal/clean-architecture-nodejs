import { EmailValidator } from "@src/presentation/protocols"

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    (email)
    return false
  }
}