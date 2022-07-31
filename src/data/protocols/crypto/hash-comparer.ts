export interface HashComparer {
  compare(password: string, hash: string): Promise<boolean>
}
