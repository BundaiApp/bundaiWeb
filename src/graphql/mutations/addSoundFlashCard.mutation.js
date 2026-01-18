import { gql } from "@apollo/client";

export default gql`
  mutation AddSoundFlashCard($userId: String, $card: SoundCardInput) {
    addSoundFlashCard(userId: $userId, card: $card) {
      _id
      kanji
    }
  }
`;
