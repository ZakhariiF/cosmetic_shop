export const globalConfigQuery = () => `
  {
    channelResourceCollection(where: {slug: "resource-global"}) {
      items {
        sys {
          id
        }
        configuration
      }
    }
  }
`;
