import { gql } from '@apollo/client'

export default gql`
  query getSimilarKanji($kanjiName: String!) {
    getSimilarKanji(kanjiName: $kanjiName) {
      kanji
      meaning
      reading
      romaji
    }
  }
`
