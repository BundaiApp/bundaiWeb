import gql from "graphql-tag"

export default gql`
  mutation UpdateCurrentLevel($userId: String!, $currentLevel: Int!) {
    updateCurrentLevel(userId: $userId, currentLevel: $currentLevel) {
      _id
      currentLevel
    }
  }
`
