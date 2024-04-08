import { SurveyModel } from '@src/domain/models/survey'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey'

const anyDate = new Date()

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    { answer: 'other_answer', image: 'any_image' }
  ],
  date: anyDate
})

export const mockSurveys = (): SurveyModel[] => [{ ...mockSurveyModel() }]

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: '65ff2accfc779e823a1d8860',
  accountId: '65863135d1fc4836501c3786',
  answer: 'any_answer',
  date: anyDate
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  date: anyDate,
  answers: [
    {
      answer: 'any_answer',
      image: 'any_url',
      count: 1,
      percent: 50
    },
    {
      answer: 'other_answer',
      image: 'other_url',
      count: 1,
      percent: 50
    }
  ]
})

export const mockSurveyResultModelWithCountZero = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  date: anyDate,
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 0,
      percent: 0
    },
    {
      answer: 'other_answer',
      image: 'any_image',
      count: 0,
      percent: 0
    }
  ]
})
