export interface UpdateAccessTokenRepository {
  update(userId: string, accessToken: string): Promise<void>
}
