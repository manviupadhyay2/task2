import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      isOnline
      avatarUrl
      lastSeen
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      isOnline
      avatarUrl
      lastSeen
    }
  }
`;