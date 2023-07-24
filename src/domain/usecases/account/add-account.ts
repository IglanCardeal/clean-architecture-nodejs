export type AddAccountModel = {
  name: string
  email: string
  password: string
}

export interface AddAccountUseCase<T> {
  add(account: AddAccountModel): Promise<T> | T
}
