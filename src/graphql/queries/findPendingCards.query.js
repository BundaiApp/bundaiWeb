import { gql } from "@apollo/client";

export default gql`
  query GetPendingFlashcards($userId: String!) {
    getPendingFlashCards(userId: $userId) {
      _id
      userId
      kanjiName
      hiragana
      meanings
      quizAnswers
      firstSeen
      lastSeen
      nextReview
      rating
    }
  }
`;

