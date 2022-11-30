export interface TokenGenerator {
  generate(accountId: string): Promise<string>
}
