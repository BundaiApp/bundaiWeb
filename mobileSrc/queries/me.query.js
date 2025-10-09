import { gql } from "@apollo/client";

export default gql`
  query me($_id: String!) {
    me(_id: $_id) {
      _id
      createdAt
    }
  }
`;
