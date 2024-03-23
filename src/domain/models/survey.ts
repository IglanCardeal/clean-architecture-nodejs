export type SurveyAnswer = {
  image: string
  answer: string
}

export type SurveyModel = {
  id?: string
  question: string
  answers: SurveyAnswer[]
  date: Date
}
