import {gql} from '@apollo/client';

export const storeCollectionQuery = (storeType='Drybar Shop') => gql`
  {
    storeCollection(skip: 0, limit: 1000, where:{AND: [{type: "${storeType}"}]}) {
      items {
        title
        number
        bookerLocationId
        type
        information
        contact
        settings
      }
    }
  }
`;

export const screenAddOnsCollections = () => gql`
  {
    screenProductCollection(limit: 2) {
      items {
        title
        description {
          json
        }
        productsCollection {
          items {
            title
            subtitle
            price
            description {
              json
            }
            bestFor
            imagesCollection(limit: 3) {
              items {
                desktopMedia {
                  url
                }
              }
            }
            serviceTime
          }
        }
      }
    }
  }
`;

export const screenPrivacyPolicy = (id="3M4G7zZEh7x6gdjhOOTKVA") => gql`
  {
    screen(id: "${id}") {
      title
      description {
        json
      }
      marketingComponentsCollection {
        items {
          ... on MarketingCollection {
            marketingComponentsCollection {
              items {
                ... on MarketingQuestionAnswer {
                  question
                  answer {
                    json
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const id = '3Aw4uPJ7h8eRHBavDxoh0t'

export const screenBarfly = () => gql`{
  barfly(id: "3Aw4uPJ7h8eRHBavDxoh0t") {
      membershipsCollection(limit: 2) {
        items {
          title
          subtitle
          price
          benefitsCollection(limit: 3) {
            items {
              ... on BarflyBenefits {
                name
                value
              }
            }
          }
        }
      }
      finePrint {
        json
      }
      thankYou {
        json
      }
      marketingComponentsCollection(limit: 1) {
        items {
          __typename
          ... on MarketingSection {
            internalName
            marketingComponentsCollection(limit: 1) {
              items {
                __typename
                ... on MarketingCard {
                  image {
                    desktopMedia {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
}
`;
