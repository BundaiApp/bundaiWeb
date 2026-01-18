import { gql } from "@apollo/client";

export default gql`
  query GetPendingSoundFlashCards($userId: String!) {
    getPendingSoundFlashCards(userId: $userId) {
      _id
      userId
      kanji
      reading
      meaning
      image
      category
      quizAnswers {
        kanji
        reading
        romaji
      }
      rating
      burned
      firstSeen
      lastSeen
      nextReview
    }
  }
`;
