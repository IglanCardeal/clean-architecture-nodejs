export interface UpdateAccessTokenRepository {
  update(userId: string, acessToken: string): Promise<void>
}
