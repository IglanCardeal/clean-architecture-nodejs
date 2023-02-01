export interface LoadAccountByTokenUseCaseProps {
  accessToken: string
  role?: string
}

export interface LoadAccountByTokenUseCase<T> {
  load(props: LoadAccountByTokenUseCaseProps): Promise<T> | T
}
