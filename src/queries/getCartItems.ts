import { gql } from '@apollo/client';

export const GET_CART_ITEMS = gql`
  query GetUser($uid: String!) {
    user(uid: $uid) {
      cart {
        product_id
        quantity
        sizeSelected
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query Product($pid: String!) {
    product(pid: $pid) {
      name
      media
      price
      offer_price
      description
    }
  }
`;

export const GET_PRODUCT_PRICE = gql`
  query Product($pid: String!) {
    product(pid: $pid) {
      offer_price
      price
    }
  }
`;
