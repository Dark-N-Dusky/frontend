import { gql } from '@apollo/client';

export const GET_PRODUCT = gql`
  query Product($pid: String!) {
    product(pid: $pid) {
      category
      name
      media
      description
      price
      offer_price
      details
      sizes
      top_points
      gallery {
        image_url
      }
    }
  }
`;
