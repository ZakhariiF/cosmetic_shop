import {gql} from '@apollo/client';

export const storeCollectionQuery = (storeType = 'Drybar Shop') => gql`
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
        arrivalInformation
        slug
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
        marketingComponentsCollection {
          items {
            ... on MarketingImage {
              desktopMedia {
                url
              }
              mobileMedia {
                url
              }
            }
            ... on MarketingCard {
              sys {
                id
              }
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

export const screenPrivacyPolicy = (id = '3M4G7zZEh7x6gdjhOOTKVA') => gql`
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

export const screenExtensionPolicy = () => gql`
  {
    screenCollection(where: {slug: "extension-policy"}) {
      items {
        title
        description {
          json
        }
      }
    }
  }
`;

const id = '3Aw4uPJ7h8eRHBavDxoh0t';

export const screenBarfly = () => gql`
  {
    barfly(id: "3Aw4uPJ7h8eRHBavDxoh0t") {
      membershipsCollection(limit: 2) {
        items {
          title
          subtitle
          price
          benefitsCollection(limit: 10) {
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

export const productInformationCollection = (productID) => gql`{
    productCollection(where: {productId: "${productID}"}) {
        items {
          type
          productId
          title
          serviceTime
          price
          description {
            json
          }
          bestFor
          imagesCollection(limit: 10) {
            items {
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
`;

export const productionInformationByReference = (bookerReference) => gql`
  {
    productCollection(where: {bookerReference: "${bookerReference}"}) {
        items {
          type
          productId
          title
          serviceTime
          price
          description {
            json
          }
          bestFor
          imagesCollection(limit: 10) {
            items {
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
`;

export const bannerQuery = () => gql`
  {
    screenCollection(where: {slug: "booking-confirmation-mobile"}) {
      items {
        title
        description {
          json
        }
        metadata {
          sys {
            id
          }
        }
        marketingComponentsCollection(limit: 10) {
          items {
            ... on MarketingImage {
              mobileMedia {
                url
              }
            }
          }
        }
      }
    }
  }
`;
