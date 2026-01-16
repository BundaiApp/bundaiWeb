import { gql } from '@apollo/client'

export default gql`
  query getKanjiByGrade($grade: Int!) {
    getKanjiByGrade(grade: $grade) {
      kanjiName
      strokes
      grade
      freq
      meanings
      on
      kun
      jlpt
      quizAnswers
      similars {
        kanji
        meaning
        reading
        romaji
      }
      usedIn {
        kanji
        jlptLevel
        meaning
        reading
        type
        easyType
        frequency
        quizAnswers
      }
      quizAnswersOn
      quizAnswersKun
    }
  }
`
