import { gql } from "@apollo/client";

export default gql`
  mutation CalculateNextReviewDate($userId: String, $kanjiName: String, $rating: Int) {
    calculateNextReviewDate(userId: $userId, kanjiName: $kanjiName, rating: $rating) {
      _id
      kanjiName
      nextReview
      rating
    }
  }
`;
