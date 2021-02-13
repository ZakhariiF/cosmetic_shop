import {createHttpLink} from 'apollo-link-http';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import config from 'constant/config';

export const GraphQLClient = () => {
  const link = createHttpLink({
    uri: `https://graphql.contentful.com/content/v1/spaces/${config.spaceId}`,
    headers: {
      Authorization: `Bearer ${config.graphToken}`,
    },
  });

  const cache = new InMemoryCache();
  const apolloClient = new ApolloClient({
    link,
    cache,
  });
  return {apolloClient};
};
