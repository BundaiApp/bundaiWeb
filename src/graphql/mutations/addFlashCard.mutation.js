import { gql } from "@apollo/client";

export default gql`
  mutation AddFlashCard(
    $userId: String
    $kanjiName: String
    $hiragana: String
    $meanings: [String]
    $quizAnswers: [String]
    $level: Int
    $source: String
  ) {
    addFlashCard(
      userId: $userId
      kanjiName: $kanjiName
      hiragana: $hiragana
      meanings: $meanings
      quizAnswers: $quizAnswers
      level: $level
      source: $source
    ) {
      _id
      userId
      kanjiName
      hiragana
      meanings
      quizAnswers
      level
      source
    }
  }
`;
