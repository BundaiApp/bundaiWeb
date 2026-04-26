import gql from "graphql-tag"

export default gql`
  mutation CheckAndUnlockNextLevel($userId: String!, $currentLevel: Int!) {
    checkAndUnlockNextLevel(userId: $userId, currentLevel: $currentLevel) {
      unlocked
      newLevel
      mastery
      message
    }
  }
`
