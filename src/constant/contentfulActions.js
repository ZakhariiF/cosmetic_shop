import {get} from 'lodash';
import {
  globalConfigQuery,
} from './contentfulQueries';
import {doQuery} from 'services/Contentful';

export const getGlobalConfig = async () => {
  let data = await doQuery(globalConfigQuery());

  return get(data, 'channelResourceCollection.items[0].configuration');

};
