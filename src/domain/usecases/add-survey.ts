export interface AddSurveyUseCase<T> {
  add<S>(data: S): Promise<T>
}
