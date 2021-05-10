import gql from "graphql-tag";

export const ACCOUNT = gql`
  query getAccount($shopId: String!) {
    account(shopId: $shopId) {
      shop_id
      plan
      shop_url
      email_account
      last_sync_at
      first_sync_asked_at
      start_sync_at
    }
  }
`;
