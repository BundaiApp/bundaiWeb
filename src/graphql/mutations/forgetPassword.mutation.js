import gql from "graphql-tag";

export default gql`
  mutation forgetPassword($email: String!) {
    forgetPassword(email: $email) {
      token
      errorMessage
      user {
        _id
        email
        name
      }
    }
  }
`;
