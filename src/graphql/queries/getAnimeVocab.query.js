import { gql } from '@apollo/client'

export default gql`
  query GetAnimeVocab($animeName: String!) {
    getAnimeVocab(animeName: $animeName) {
      _id
      animeName
      words {
        kanji
        reading
        romaji
        meaning
        frequency
        langFrequency
        alreadyInApp
        inTop2000
      }
      wordCount
      createdAt
    }
  }
`
