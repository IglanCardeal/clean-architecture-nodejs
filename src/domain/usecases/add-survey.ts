export interface AddSurveyModel {
  question: string
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image: string
  answer: string
}

export interface AddSurveyUseCase<T> {
  add(data: AddSurveyModel): Promise<T>
}