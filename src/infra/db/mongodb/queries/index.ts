import { ObjectId } from 'mongodb'
import { QueryBuilder } from '../helpers'

const getLoadBySurveyIdQuery = (surveyId: string) => {
  return new QueryBuilder()
    .match({
      surveyId: new ObjectId(surveyId)
    })
    .group({
      _id: 0,
      data: {
        $push: '$$ROOT'
      },
      count: {
        $sum: 1
      }
    })
    .unwind({
      path: '$data'
    })
    .lookup({
      from: 'surveys',
      localField: 'data.surveyId',
      foreignField: '_id',
      as: 'survey'
    })
    .unwind({
      path: '$survey'
    })
    .group({
      _id: {
        surveyId: '$survey._id',
        question: '$survey.question',
        date: '$survey.date',
        total: '$count',
        answer: {
          $filter: {
            input: '$survey.answers',
            as: 'item',
            cond: {
              $eq: ['$$item.answer', '$data.answer']
            }
          }
        }
      },
      count: {
        $sum: 1
      }
    })
    .unwind({
      path: '$_id.answer'
    })
    .addFields({
      '_id.answer.count': '$count',
      '_id.answer.percent': {
        $round: [
          {
            $multiply: [
              {
                $divide: ['$count', '$_id.total']
              },
              100
            ]
          },
          2
        ]
      }
    })
    .group({
      _id: {
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date'
      },
      answers: {
        $push: '$_id.answer'
      }
    })
    .project({
      _id: 0,
      surveyId: '$_id.surveyId',
      question: '$_id.question',
      date: '$_id.date',
      answers: '$answers'
    })
    .build()
}

export { getLoadBySurveyIdQuery }
