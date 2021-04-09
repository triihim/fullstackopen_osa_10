import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          id
          fullName
          reviewCount
          stargazersCount
          forksCount
          ratingAverage
          language
          ownerAvatarUrl
          description
        }
      }
    }
  }
`;

export const GET_AUTHORIZED_USER = gql`
  query {
    authorizedUser {
      id
      username
    }
  }
`;