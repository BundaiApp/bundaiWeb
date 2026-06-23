import gql from "graphql-tag";

export default gql`
  mutation deleteAccount($userId: ID!) {
    deleteAccount(userId: $userId) {
      success
      errorMessage
    }
  }
`;
