// import {doQuery} from '../../state/utils/contentful';
import {doQuery} from 'services/Contentful';
import {get} from 'lodash';
import {
  queryGallery,
  queryMarketingSection,
  queryStylesCollection,
  queryStylesExceptGallery,
  queryStylesIds,
} from './contentfulTheStylesQueries';

const parseStylesCollection = (data) => {
  let stylesCollectionData = {
    title: '',
    description: '',
    id: '',
    marketingSectionId: '',
  };
  try {
    const items = data.stylesCollection?.items || [];
    if (items.length > 0) {
      stylesCollectionData.id = items[0].sys?.id || '';
      stylesCollectionData.title = items[0].title || '';
      stylesCollectionData.description =
        items[0].description?.json?.content[0]?.content[0]?.value || '';
      stylesCollectionData.marketingSectionId =
        items[0].marketingComponentsCollection?.items[0].sys?.id || '';
    }
  } catch (err) {
    console.error('step 1', err);
  }
  return stylesCollectionData;
};

const parseMarketingSection = (data) => {
  let heroImage = '';

  console.log('ParseMarketingSection: ', data);

  try {
    heroImage =
      get(
        data,
        'marketingSection.marketingComponentsCollection.items[0].image.mobileMedia.url',
      ) ||
      get(
        data,
        'marketingSection.marketingComponentsCollection.items[0].image.desktopMedia.url',
        '',
      );
  } catch (err) {
    console.error('step 2', err);
  }
  return heroImage;
};

const parseStylesExceptGallery = (data) => {
  let stylesData = [];
  try {
    const items = data.styles?.stylesCollection?.items || [];
    items.forEach((item) => {
      let styleData = {
        title: item.title,
        subtitle: item.subtitle,
        featuredVideo: item.featuredVideo?.desktopUrl || '',
        featuredImage:
          get(item, 'featuredImage.mobileMedia.url') ||
          get(item, 'featuredImage.desktopMedia.url', ''),
        galleryCollectionIds: (item.galleryCollection?.items || [])
          .filter((item) => item?.sys?.id)
          .map((item) => item?.sys?.id),
      };
      stylesData.push(styleData);
    });
  } catch (err) {
    console.error('step 3', err);
  }
  return stylesData;
};

const parseGallery = (data) => {
  let galleryData = {
    title: '',
    video: '',
    images: [],
  };

  console.log('ParseGallery:', data);

  try {
    if (data && data.styleGallery) {
      galleryData.title = data.styleGallery?.title;
      galleryData.video = data.styleGallery?.video?.desktopUrl;
      galleryData.images = (
        data.styleGallery?.imagesCollection?.items || []
      ).map((item) => item?.mobileMedia?.url || item?.desktopMedia?.url || '');
    }
  } catch (err) {
    console.error('styleGallery err', err);
  }
  return galleryData;
};

export const gqlLoadTheStyles = async () => {
  let theStylesSectionData = {
    title: '',
    description: '',
    heroImage: '',
    styles: [],
  };

  let data = await doQuery(queryStylesCollection());
  const stylesCollectionData = parseStylesCollection(data);
  theStylesSectionData.title = stylesCollectionData.title;
  theStylesSectionData.description = stylesCollectionData.description;

  if (stylesCollectionData.marketingSectionId) {
    data = await doQuery(
      queryMarketingSection(stylesCollectionData.marketingSectionId),
    );
    theStylesSectionData.heroImage = parseMarketingSection(data);
  }

  if (stylesCollectionData.id) {
    data = await doQuery(queryStylesExceptGallery(stylesCollectionData.id));

    let stylesData = parseStylesExceptGallery(data);
    for (let i = 0; i < stylesData.length; i++) {
      data = stylesData[i].galleryCollectionIds.map((item) =>
        doQuery(queryGallery(item)),
      );
      data = await Promise.all(data);
      stylesData[i].gallery = data.map(datum => parseGallery(datum));
    }
    theStylesSectionData.styles = stylesData;
  }
  return theStylesSectionData;
};
