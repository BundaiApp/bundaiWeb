import { gql } from "@apollo/client";

export default gql`
  mutation CalculateSoundNextReviewDate($userId: String, $id: ID, $rating: Int) {
    calculateSoundNextReviewDate(userId: $userId, id: $id, rating: $rating) {
      _id
      kanji
      nextReview
      rating
      burned
    }
  }
`;
