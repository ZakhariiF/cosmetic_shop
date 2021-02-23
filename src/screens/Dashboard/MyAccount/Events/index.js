import React, {useState, useEffect} from 'react';
import Header from 'components/Header/Header';
import {Images} from 'constant';
import axios from 'axios';
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
import styles from 'screens/Dashboard/MyAccount/AccountStyle/styles';
import {get} from 'lodash';
import Slick from 'react-native-slick';
import HTMLView from 'react-native-htmlview';
import {documentToHtmlString} from '@contentful/rich-text-html-renderer';
import appConfig from 'constant/config.js';
import EventDetail from 'components/EventDetail';
import {Colors} from 'constant';

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

  useEffect(() => {
    axios
      .post(
        'https://209v02rl78.execute-api.us-west-1.amazonaws.com/dev/getForms',
        {
          subDomain: appConfig.wufoo.subDomain,
          formId: appConfig.wufoo.genericPartyFormId,
          key: btoa(appConfig.wufoo.apiKey + ':password'),
        },
      )
      .then((res) => {
        const {data} = res;
        const fields = data?.Fields || [];
        fields.forEach((field) => {
          if (field.Title === 'Preferred Shop') {
            setPreferredShopChoices(
              field.Choices.map((choice) => choice.Label || ''),
            );
          } else if (field.Title === 'Date') {
            setPreferredDateChoices(
              field.Choices.map((choice) => choice.Label || ''),
            );
          } else if (field.Title === 'Time') {
            setPreferredStartTimeChoices(
              field.Choices.map((choice) => choice.Label || ''),
            );
          } else if (field.Title === 'Party Size') {
            setPpartySizeChoices(
              field.Choices.map((choice) => choice.Label || ''),
            );
          } else if (field.Title === 'Occasion') {
            setOccasions(field.Choices.map((choice) => choice.Label || ''));
          }
        });
      })
      .catch((error) => console.log('error in wufoo api ', error));
  }, []);

  const getData = async () => {
    const data = await gqlLoadEvents();
    console.log('Event Data:', data);
    setEventData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const events = get(eventData, 'events', []);

  return (
    <View style={rootStyle.container}>
      <Header title="EVENTS" isTab isBack />
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
          <Text style={styles.topText}>{get(eventData, 'title')}</Text>

          <HtmlView
            value={get(eventData, 'subtitle')}
            stylesheet={PageDescriptionStyle}
          />
          <View style={{marginTop: 25}}>
            <Slick showsButtons={true} containerStyle={styles.eventSlickWrapper}>
              {events.map((e, i) => {
                return (
                  <View key={i} style={styles.eventSlickItem}>
                    <Image source={{uri: e.image}} style={styles.imageStyle} />
                    <Text style={styles.swiperTextStyle}>{e.title}</Text>
                    <View style={styles.slickDesc}>
                      <HTMLView
                        value={documentToHtmlString(get(e, 'description.json'))}
                        stylesheet={EventDescriptionStyle}
                      />
                    </View>
                  </View>
                );
              })}
            </Slick>
          </View>
          <View>
            {events.map((e, i) =>
              <EventDetail
                {...e}
                dividerIcon={dividerImages[i % 3]}
                preferredShopChoices={preferredShopChoices}
                preferredDateChoices={preferredDateChoices}
                preferredStartTimeChoices={preferredStartTimeChoices}
                partySizeChoices={partySizeChoices}
                occasions={occasions}
              />
            )}
          </View>
        </View>
      </ScrollView>

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
  },
});

const EventDescriptionStyle = StyleSheet.create({
  p: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.light_gray,
    textAlign: 'center',
    width: '100%',
  },
});
