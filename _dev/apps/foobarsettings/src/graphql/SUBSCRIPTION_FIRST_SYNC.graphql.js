import gql from "graphql-tag";

export const SUBSCRIPTION_FIRST_SYNC = gql`
  subscription getAccount($shopId: String!) {
    accountFirstSync(shopId: $shopId) {
      shop_id
      first_sync_asked_at
    }
  }
`;
