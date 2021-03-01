import React, {useState, useEffect} from 'react';
import Header from 'components/Header/Header';
import {Images} from 'constant';

import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import HtmlView from 'react-native-htmlview';

import rootStyle from 'rootStyle';
import {gqlLoadEvents} from 'constant/contentfulEventActions';

import styles from './styles';
import {get} from 'lodash';
import Slick from 'react-native-slick';
import HTMLView from 'react-native-htmlview';
import {documentToHtmlString} from '@contentful/rich-text-html-renderer';

import EventDetail from 'components/EventDetail';
import {Colors, Fonts} from 'constant';
import {getFieldValues} from 'services';
import Indicator from 'components/Indicator';

const dividerImages = [Images.devider1, Images.devider2, Images.devider3];

const Events = () => {
  const [eventData, setEventData] = useState(null);

  const [preferredShopChoices, setPreferredShopChoices] = useState([]);
  const [preferredDateChoices, setPreferredDateChoices] = useState([]);
  const [preferredStartTimeChoices, setPreferredStartTimeChoices] = useState(
    [],
  );
  const [partySizeChoices, setPpartySizeChoices] = useState([]);
  const [occasions, setOccasions] = useState([]);

  const getAllFields = async () => {
    const data = await getFieldValues();
    const fields = data?.Fields || [];

    let locArr = [],
      occaArr = [],
      timeArr = [],
      sizeArr = [];

    fields.forEach((field) => {
      if (field.Title === 'Preferred Shop') {
        field.Choices.forEach((e) => {
          locArr.push({label: e.Label, value: e.Label});
        });
      } else if (field.Title === 'Time') {
        field.Choices.forEach((e) => {
          timeArr.push({label: e.Label, value: e.Label});
        });
      } else if (field.Title === 'Party Size') {
        field.Choices.forEach((e) => {
          sizeArr.push({label: e.Label, value: e.Label});
        });
      } else if (field.Title === 'Occasion') {
        field.Choices.forEach((e) => {
          occaArr.push({label: e.Label, value: e.Label});
        });
      }
    });

    setPreferredShopChoices(locArr);
    setPreferredStartTimeChoices(timeArr);
    setPpartySizeChoices(sizeArr);
    setOccasions(occaArr);
  };

  const getData = async () => {
    const data = await gqlLoadEvents();
    console.log('Event Data:', data);
    setEventData(data);
  };

  useEffect(() => {
    getData();
    getAllFields();
  }, []);

  const events = get(eventData, 'events', []);

  return (
    <View style={rootStyle.container}>
      <Header title="EVENTS" isTab isBack />
      {eventData ? (
        <ScrollView>
          <Image
            resizeMode="cover"
            style={styles.topImage}
            source={{
              uri:
                get(eventData, 'heroImage.mobile') ||
                get(eventData, 'heroImage.desktop'),
            }}
          />
          <View style={rootStyle.innerContainer}>
            <Text style={styles.topText}>{get(eventData, 'title', '').toUpperCase()}</Text>

            <HtmlView
              value={`<p>${get(eventData, 'subtitle')}</p>`}
              stylesheet={PageDescriptionStyle}
            />
            <View style={{marginTop: 50}}>
              <Slick showsButtons={true} containerStyle={styles.eventSlickWrapper}>
                {events.map((e, i) => {
                  const desc = documentToHtmlString(get(e, 'description.json'));

                  return (
                    <View key={i}>
                      <Image
                        source={{uri: e.image}}
                        style={styles.imageStyle}
                      />
                      <Text style={styles.swiperTextStyle}>{e.title}</Text>
                      <View style={{paddingBottom: 30, marginTop: 22}}>
                        <Text style={styles.slickText}>
                          {get(e, 'subtitle')}
                        </Text>
                      </View>

                    </View>
                  );
                })}
              </Slick>
            </View>
            <View>
              {events.map((e, i) => (
                <EventDetail
                  {...e}
                  dividerIcon={dividerImages[i % 3]}
                  preferredShopChoices={preferredShopChoices}
                  preferredDateChoices={preferredDateChoices}
                  preferredStartTimeChoices={preferredStartTimeChoices}
                  partySizeChoices={partySizeChoices}
                  occasions={occasions}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <Indicator />
      )}
    </View>
  );
};

export default Events;

const PageDescriptionStyle = StyleSheet.create({
  b: {
    fontSize: 18,
    lineHeight: 21,
    color: Colors.input_text,
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: Fonts.AvenirNextBold,
  },
  p: {
    fontSize: 15,
    lineHeight: 27,
    color: Colors.input_text,
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 0,
  },
});
