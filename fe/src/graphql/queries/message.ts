import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages($recipientId: ID!) {
    messages(recipientId: $recipientId) {
      id
      sender
      recipient
      text
      file
    }
  }
`;
