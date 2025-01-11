import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($recipientId: ID!, $text: String!, $file: Upload) {
    sendMessage(recipientId: $recipientId, text: $text, file: $file) {
      id
      sender
      recipient
      text
      file
    }
  }
`;