export interface UpdateAccessTokenRepository {
  updateAccessToken(accountId: string, accessToken: string): Promise<void>
}
