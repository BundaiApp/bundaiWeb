import { gql } from '@apollo/client'

export default gql`
  query getKanjiByName($kanjiName: String!) {
    getKanjiByName(kanjiName: $kanjiName) {
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
