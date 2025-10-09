import { gql } from "@apollo/client";

export default gql`
  mutation AddBulkFlashCards($userId: String, $kanjis: [CardData]) {
    addBulkFlashCards(userId: $userId, kanjis: $kanjis) {
      userId
    }
  }
`;
