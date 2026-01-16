import { gql } from '@apollo/client'

export default gql`
  query getWordsByJLPT($jlptLevel: String!, $type: String!, $limit: Int) {
    getWordsByJLPT(jlptLevel: $jlptLevel, type: $type, limit: $limit) {
      kanji
      jlptLevel
      meaning
      reading
      type
      easyType
      frequency
      quizAnswers
    }
  }
`
