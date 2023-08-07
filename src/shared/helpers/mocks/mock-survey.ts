import { SurveyModel } from '@src/domain/models/survey'
import { SurveyResultModel } from '@src/domain/models/survey-result'

const anyDate = new Date()

export const mockSurveyData = (): SurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: anyDate
})

export const mockSurveyModel = (): SurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: anyDate
})

export const mockSurveys = (): SurveyModel[] => [
  {
    answers: [
      {
        answer: 'any',
        image: 'any'
      }
    ],
    date: anyDate,
    question: 'any'
  }
]

export const mockSaveSurveyResultModel = (): Omit<SurveyResultModel, 'id'> => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: anyDate
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  ...mockSaveSurveyResultModel(),
  id: 'any_id'
})
