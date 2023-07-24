export type SurveyAnswer = {
  image: string
  answer: string
}

export type SurveyModel = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}
