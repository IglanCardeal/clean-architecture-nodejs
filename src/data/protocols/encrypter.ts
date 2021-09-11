export interface Encrypter {
  encrypt: (password: string) => Promise<string>
}
