import { gql } from "@apollo/client";

export default gql`
  mutation AddFlashCard(
    $userId: String
    $kanjiName: String
    $hiragana: String
    $meanings: [String]
    $quizAnswers: [String]
  ) {
    addFlashCard(
      userId: $userId
      kanjiName: $kanjiName
      hiragana: $hiragana
      meanings: $meanings
      quizAnswers: $quizAnswers
    ) {
      userId
      kanjiName
      hiragana
      meanings
      quizAnswers
    }
  }
`;
