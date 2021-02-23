import {get} from 'lodash';
import {
  eventsCollectionQuery,
  eventsQuery,
  marketingSectionQuery,
} from './contentfulEventQueries';
import {doQuery} from 'services/Contentful';

const parseEventsCollection = (data) => {
  let eventsCollectionData = {
    title: '',
    subtitle: '',
    id: '',
    marketingSectionId: '',
  };
  try {
    const items = data.screenEventsCollection?.items || [];
    if (items.length > 0) {
      eventsCollectionData.title = items[0].title || '';
      eventsCollectionData.subtitle = items[0].subtitle || '';
      eventsCollectionData.id = items[0].sys?.id || '';
      eventsCollectionData.marketingSectionId =
        items[0].marketingComponentsCollection?.items[0].sys?.id || '';
    }
  } catch (err) {
    console.error(err);
  }
  return eventsCollectionData;
};

const parseMarketingSection = (data) => {
  let heroImage = {};

  try {
    heroImage = {
      desktop: get(
        data,
        'marketingSection.marketingComponentsCollection.items[0].image.desktopMedia.url',
      ),
      mobile: get(
        data,
        'marketingSection.marketingComponentsCollection.items[0].image.mobileMedia.url',
      ),
    };
  } catch (err) {
    console.error(err);
  }
  return heroImage;
};

const parseEvents = (data) => {
  let eventsData = [];
  try {
    const items = data.screenEvents?.eventsCollection?.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let eventData = {};
      eventData.title = item.title;
      eventData.subtitle = item.subtitle;
      eventData.image = get(item , 'image.desktopMedia.url') || get(item , 'image.desktopMedia.url');
      eventData.action = {
        title: item.actionsCollection?.items[0].title,
        link: item.actionsCollection?.items[0].linkToUrl,
      };

      eventData.description = item.description;
      eventsData.push(eventData);
    }
  } catch (err) {
    console.error(err);
  }
  return eventsData;
};

export const gqlLoadEvents = async () => {
  let eventsSectionData = {
    title: '',
    subtitle: '',
    events: [],
    heroImage: {},
  };

  let data = await doQuery(eventsCollectionQuery());

  const eventsCollectionData = parseEventsCollection(data);
  eventsSectionData.title = eventsCollectionData.title;
  eventsSectionData.subtitle = eventsCollectionData.subtitle;

  if (eventsCollectionData.marketingSectionId) {
    data = await doQuery(
      marketingSectionQuery(eventsCollectionData.marketingSectionId),
    );
    eventsSectionData.heroImage = parseMarketingSection(data);
  }

  if (eventsCollectionData.id) {
    data = await doQuery(eventsQuery(eventsCollectionData.id));
    eventsSectionData.events = parseEvents(data);
  }
  return eventsSectionData;
};
