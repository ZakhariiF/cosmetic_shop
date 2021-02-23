

export const eventsCollectionQuery = () => `
  {
    screenEventsCollection(where: {slug: "events"}) {
      items {
        metadata {
          sys {
            id
          }
        }
        title
        subtitle
        sys {
          id
        }
        marketingComponentsCollection {
          items {
            ... on MarketingSection {
              sys {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const eventsQuery = (screenEventId) => (
  `{
      screenEvents(id: "${screenEventId}") {
        eventsCollection {
          items {
            title
            subtitle
            description {
              json
            }
            image {
              desktopMedia {
                url
              }
              mobileMedia {
                url
              }
            }
            actionsCollection {
              items {
                linkToUrl
                title
              }
            }
          }
        }
      }
    }
    `
);

export const marketingSectionQuery = (marketingSectionId) => (
  `{
      marketingSection(id:"${marketingSectionId}") {
        marketingComponentsCollection {
          items {
            ... on MarketingCard {
              image {
                desktopMedia {
                  url
                }
                mobileMedia {
                  url
                }
              }
            }
          }
        }
      }
    }
    `
);
