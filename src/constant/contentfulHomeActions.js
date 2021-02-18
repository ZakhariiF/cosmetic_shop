import {
  doQuery,
  extractIdsFromSecondLevel,
  extractIdsFromTopLevel,
} from 'services/Contentful';
import {
  queryMarketingCardInMarketingCollection,
  homeSecondLevelQuery,
  homeTopLevelQuery,
  querySocialInMarketingCollection,
  queryMarketingStyles,
  queryCard,
  queryProducts,
} from './contentfulHomeQueries';
import {get} from 'lodash';
// import {doQuery, extractIdsFromSecondLevel, extractIdsFromTopLevel} from "../../state/utils/contentful";

const parseMarketingCollectionWithMarketingCards = (data) => {
  let marketingCollectionData = {
    title: '',
    items: [],
  };
  try {
    marketingCollectionData.title = data.marketingCollection?.title || '';
    const items =
      data.marketingCollection?.marketingComponentsCollection?.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item) {
        continue;
      }
      marketingCollectionData.items.push({
        title: item.title,
        subtitle: item.subtitle,
        avatar: item.avatar?.url || '',
        icon: item.icon?.url || '',
        image: item.image?.desktopMedia?.url || '',
        action: {
          title: item.actionsCollection?.items[0].title || '',
          link: item.actionsCollection?.items[0].linkToUrl || '',
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
  return marketingCollectionData;
};

const parseMarketingStyles = (data) => {
  let marketingStylesData = {
    title: '',
    subtitle: '',
    action: {
      title: '',
      link: '',
    },
    items: [],
  };

  try {
    marketingStylesData.title = data.marketingStyles?.title || '';
    marketingStylesData.subtitle = data.marketingStyles?.subtitle || '';
    const actions = data.marketingStyles?.actionsCollection?.items || [];
    if (actions.length > 0) {
      marketingStylesData.action.title = actions[0].title;
      marketingStylesData.action.link = actions[0].linkToUrl;
    }

    const items = data.marketingStyles?.stylesCollection?.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      marketingStylesData.items.push({
        title: item.title,
        subtitle: item.subtitle,
        image: item.featuredImage?.desktopMedia?.url || '',
      });
    }
  } catch (err) {
    console.error(err);
  }
  return marketingStylesData;
};

const parseSocialInMarketingCollection = (data) => {
  let socialData = {
    title: '',
    hashtag: '',
    handle: '',
  };
  try {
    const items =
      data.marketingSection?.marketingComponentsCollection?.items || [];
    if (items.length > 0) {
      socialData.title = items[0].title || '';
      socialData.hashtag = items[0].hashtag || '';
      socialData.handle = items[0].handle || '';
    }
  } catch (err) {
    console.error(err);
  }
  return socialData;
};

export const gqlLoadHome = async () => {
  let homeSectionData = [];

  let data = await doQuery(homeTopLevelQuery());

  let graphqlRequests = get(
    data,
    'marketingSection.marketingComponentsCollection.items',
    [],
  )
    .filter((item) => !!item)
    .map((item) => {
      if (item.__typename === 'MarketingCard') {
        return doQuery(queryCard(item.sys.id));
      } else if (item.__typename === 'MarketingProducts') {
        return doQuery(queryProducts(item.sys.id));
      } else if (item.__typename === 'MarketingStyles') {
        return doQuery(queryMarketingStyles(item.sys.id));
      }
    });

  homeSectionData = await Promise.all(graphqlRequests);

  return homeSectionData;
};
