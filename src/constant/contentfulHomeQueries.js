/**
 * Load screenHomeCollection and its children's id
 * @returns {DocumentNode}
 */
const homeTopLevelQuery = () =>
  `{
      marketingSection(id: "5YjyIexuoz8hWe7vkPbpTE") {
          title
          marketingComponentsCollection {
            items {
              __typename
              ... on MarketingStyles {
                sys {
                  id
                }
              }
              ... on MarketingProducts {
                sys {
                  id
                }
              }
              ... on MarketingCard {
                sys {
                  id
                }
              }
            }
          }
        }
      
    }
    `;

/**
 * Load second level ids
 * @param marketingSectionId
 * @returns {DocumentNode}
 */
const homeSecondLevelQuery = (marketingSectionId) =>
  `{
      marketingSection(id: "${marketingSectionId}") {
        marketingComponentsCollection {
          items {
            __typename
            ... on MarketingCollection {
              sys {
                id
              }
            }
            ... on MarketingStyles {
              sys {
                id
              }
            }
          }
        }
      }
    }
    `;

const queryMarketingCardInMarketingCollection = (marketingCollectionId) =>
  `{
      marketingCollection(id: "${marketingCollectionId}") {
        title
        marketingComponentsCollection {
          items {
            ... on MarketingCard {
              title
              subtitle
              actionsCollection {
                items {
                  title
                  linkToUrl
                }
              }
              image {
                desktopMedia {
                  url
                }
              }
              avatar {
                url
              }
              icon {
                url
              }
            }
          }
        }
      }
    }
    `;

const queryMarketingStyles = (marketingStylesId) =>
  `{
      marketingStyles(id: "${marketingStylesId}") {
        title
        subtitle
        actionsCollection {
          items {
            title
            linkToUrl
          }
        }
        stylesCollection {
          items {
            title
            subtitle
            featuredImage {
              desktopMedia {
                url
              }
            }
          }
        }
      }
    }
    `;

const queryCard = (marketingCardId) => `{
    marketingCard(id: "${marketingCardId}") {
        title
        image {
            desktopMedia {
                url
            }
            mobileMedia {
                url
            }
        }
    }
  }`;

const queryProducts = (collectionId) =>
  `{
     productCollection(where: {sys: {id: "${collectionId}"}}) {
      items {
        title
        price
        imagesCollection(limit: 3) {
          items {
            desktopMedia {
              url
            }
            mobileMedia {
              url
            }
          }
        }
        bestFor
        serviceTime
      }
    }
 }`;

const querySocialInMarketingCollection = (marketingCollectionId) =>
  `{
      marketingSection(id: "${marketingCollectionId}") {
        marketingComponentsCollection {
          items {
            ... on MarketingSocialInstagram {
              title
              hashtag
              handle
            }
          }
        }
      }
    }
    `;

export {
  homeTopLevelQuery,
  homeSecondLevelQuery,
  queryMarketingCardInMarketingCollection,
  queryMarketingStyles,
  querySocialInMarketingCollection,
  queryCard,
  queryProducts,
};
