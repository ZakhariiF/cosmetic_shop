import React, {useState, useEffect, useCallback, useRef} from 'react';
import Header from 'components/Header/Header';
import {Images} from 'constant';

import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import HtmlView from 'react-native-htmlview';

import rootStyle from 'rootStyle';
import {gqlLoadEvents} from 'constant/contentfulEventActions';

import styles from './styles';
import {get} from 'lodash';
import Slick from 'react-native-slick';

import EventDetail from 'components/EventDetail';
import {Colors, Fonts} from 'constant';
import {getFieldValues} from 'services';
import Indicator from 'components/Indicator';
const dividerImages = [Images.devider1, Images.devider2, Images.devider3];

const Events = () => {
  const [eventData, setEventData] = useState(null);

  const [heights, setHeights] = useState([]);
  const [staticHeight, setStaticHeight] = useState(0);

  const [preferredShopChoices, setPreferredShopChoices] = useState([]);
  const [preferredDateChoices, setPreferredDateChoices] = useState([]);
  const [preferredStartTimeChoices, setPreferredStartTimeChoices] = useState(
    [],
  );
  const [partySizeChoices, setPpartySizeChoices] = useState([]);
  const [occasions, setOccasions] = useState([]);

  const scrollView = useRef();

  const onChangeHeight = useCallback(
    (height, idx) => {
      const tempHeights = [...heights];
      tempHeights[idx] = height;
      setHeights(tempHeights);
    },
    [heights],
  );

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
          if (e.Label !== "") {
            locArr.push({label: e.Label, value: e.Label});
          }
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
          if (e.Label !== "") {
            occaArr.push({label: e.Label, value: e.Label});
          }
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
        <ScrollView ref={scrollView}>
          <Image
            resizeMode="cover"
            style={styles.topImage}
            source={{
              uri:
                get(eventData, 'heroImage.mobile') ||
                get(eventData, 'heroImage.desktop'),
            }}
          />
          <View style={[rootStyle.innerContainer, {marginTop: 30}]}>
            <View
              onLayout={({nativeEvent}) => {
                setStaticHeight(nativeEvent.layout.height);
              }}>
              {/* <Text style={styles.topText}>
                {get(eventData, 'title', '').toUpperCase()}
              </Text> */}

              <HtmlView
                value={`<p>${get(eventData, 'subtitle')}</p>`}
                stylesheet={PageDescriptionStyle}
              />
              <View style={{marginTop: 50}}>
                <Slick
                  showsButtons={true}
                  containerStyle={styles.eventSlickWrapper}
                  dotStyle={{backgroundColor: 'transparent'}}
                  activeDotStyle={{backgroundColor: 'transparent'}}
                  nextButton={
                    <Image
                      source={Images.right_arrow}
                      style={styles.slickCtrlBtnImage}
                    />
                  }
                  prevButton={
                    <Image
                      source={Images.right_arrow}
                      style={[
                        {transform: [{rotate: '180deg'}]},
                        styles.slickCtrlBtnImage,
                      ]}
                    />
                  }
                  buttonWrapperStyle={{
                    alignItems: 'flex-start',
                    top: 370,
                  }}>
                  {events.map((e, i) => {
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
                        <TouchableOpacity
                          onPress={() => {
                            scrollView.current.scrollTo({
                              x: 0,
                              y:
                                staticHeight +
                                heights.slice(0, i).reduce((s, c) => s + c, 0),
                              animated: true,
                            });
                          }}
                          style={styles.slickButton}
                          accessible
                          accessibilityLabel={get(e, 'action.title')}
                          accessibilityRole="button">
                          <Text style={styles.slickButtonTitle}>
                            {get(e, 'action.title')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </Slick>
              </View>
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
                  setHeight={(height) => onChangeHeight(height, i)}
                  key={i}
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
    ...rootStyle.commonHeader,
    textAlign: 'center',
    marginBottom: 0,
    textTransform: 'uppercase',
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
