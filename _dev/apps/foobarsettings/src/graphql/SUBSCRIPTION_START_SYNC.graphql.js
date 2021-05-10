import gql from "graphql-tag";

export const SUBSCRIPTION_START_SYNC = gql`
  subscription getAccount($shopId: String!) {
    accountStartSync(shopId: $shopId) {
      shop_id
      start_sync_at
    }
  }
`;
