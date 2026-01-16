import { gql } from "@apollo/client";

export default gql`
  query GetFlashCardsByLevel($userId: String!, $level: Int!) {
    getFlashCardsByLevel(userId: $userId, level: $level) {
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
      level
      source
      burned
    }
  }
`;
