import gql from "graphql-tag";

export const SUBSCRIPTION_ACCOUNT = gql`
  subscription getAccount($shopId: String!) {
    accountUpgraded(shopId: $shopId) {
      shop_id
      plan
    }
  }
`;
