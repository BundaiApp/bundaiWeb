import { gql } from "@apollo/client"

const addToWaitlistMutation = gql`
  mutation AddToWaitlist($email: String!, $platform: String!) {
    addToWaitlist(email: $email, platform: $platform) {
      success
      message
    }
  }
`

export default addToWaitlistMutation
