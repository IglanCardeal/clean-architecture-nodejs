export interface SurveyAnswer {
  image: string
  answer: string
}

export interface SurveyModel {
  question: string
  answers: SurveyAnswer[]
  date: Date
}
