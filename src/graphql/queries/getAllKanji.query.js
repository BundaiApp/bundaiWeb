import { gql } from '@apollo/client'

export default gql`
  query getAllKanji {
    getAllKanji {
      kanjiName
      meanings
      kun
      similars {
        kanji
        meaning
        reading
        romaji
      }
      usedIn {
        kanji
        meaning
        reading
      }
    }
  }
`
