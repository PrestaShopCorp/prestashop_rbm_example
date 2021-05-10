import gql from "graphql-tag";

export const SUBSCRIPTION_LAST_SYNC = gql`
  subscription getAccount($shopId: String!) {
    accountFirstSync(shopId: $shopId) {
      shop_id
      last_sync_at
    }
  }
`;
