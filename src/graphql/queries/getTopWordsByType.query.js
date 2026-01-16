import { gql } from '@apollo/client'

export default gql`
  query getTopWordsByType($type: String!, $jlptLevel: String!, $count: Int!) {
    getTopWordsByType(type: $type, jlptLevel: $jlptLevel, count: $count) {
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
