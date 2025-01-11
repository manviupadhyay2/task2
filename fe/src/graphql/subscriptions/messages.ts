import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageReceived($recipientId: ID!) {
    messageReceived(recipientId: $recipientId) {
      id
      sender
      recipient
      text
      file
    }
  }
`;