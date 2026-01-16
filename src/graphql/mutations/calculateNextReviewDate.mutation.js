import { gql } from "@apollo/client";

export default gql`
  mutation CalculateNextReviewDate($userId: String, $id: ID, $rating: Int) {
    calculateNextReviewDate(userId: $userId, id: $id, rating: $rating) {
      _id
      kanjiName
      nextReview
      rating
    }
  }
`;
