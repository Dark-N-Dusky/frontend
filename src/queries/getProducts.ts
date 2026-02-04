import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      name
      pid
      media
      description
      price
      offer_price
      category
      sizes
    }
  }
`;
