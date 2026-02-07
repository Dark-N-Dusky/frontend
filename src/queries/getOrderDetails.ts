import { gql } from '@apollo/client';

export const GET_ORDER_DETAILS = gql`
  query User($pid: String!) {
    product(pid: $pid) {
      name
      offer_price
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query Product($uid: String!) {
    user(uid: $uid) {
      name
      email
      number
      addressDetails {
        name
        line1
        line2
        city
        state
        country
        code
        number
        alternate_number
        type
        weekend_availability
      }
    }
  }
`;
