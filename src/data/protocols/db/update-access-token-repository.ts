export interface UpdateAccessTokenRepository {
  update(accountId: string, accessToken: string): Promise<void>
}
