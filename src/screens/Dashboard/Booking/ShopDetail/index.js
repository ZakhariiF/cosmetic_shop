import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import rootStyle from 'rootStyle';
import Header from 'components/Header/Header';
import {Images} from 'constant';
import styles from './styles';
import Button from 'components/Button';
import {get} from 'lodash';
import {call, openMaps, requestUserLocationLocation} from 'utils';
import {distance} from 'utils/RadarHelper';
import {useDispatch} from 'react-redux';
import {setLocation, setmemberCount} from '../thunks';

const ShopDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    params: {item, fromFindLoc},
  } = route;
  const operatingMessage = get(item, 'settings.operatingMessage', '');
  const arrivalInformation = get(item, 'arrivalInformation', '');
  const socialData = get(item, 'contact.social.instagram');

  const [currentLocation, setCurrentLocation] = useState(null);

  const [dis, setDis] = useState(null);
  useEffect(() => {
    if (currentLocation) {
      getDistance();
    }
  }, [currentLocation]);

  const getDistance = useCallback(async () => {
    const _dis = await distance(
      {
        latitude: Number(currentLocation.latitude),
        longitude: Number(currentLocation.longitude),
      },
      {
        latitude: Number(get(item, 'contact.coordinates[0]')),
        longitude: Number(get(item, 'contact.coordinates[1]')),
      },
    );
    setDis(_dis);
  }, [currentLocation]);

  const getUserLocation = async () => {
    try {
      const position = await requestUserLocationLocation();
      const latitude = get(position, 'latitude');
      const longitude = get(position, 'longitude');

      setCurrentLocation({
        latitude,
        longitude,
      });
    } catch (e) {
      console.log('Can not get the current user location:', e);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const onBook = () => {
    if (fromFindLoc) {
      navigation.navigate('Book', {
        screen: 'Coming',
        initial: false,
      });
    } else {
      navigation.navigate('Coming');
    }
    dispatch(setLocation(item));
    dispatch(setmemberCount([]));
  };

  return (
    <View style={rootStyle.container}>
      <Header isTab title="SHOP DETAIL" />
      <Image resizeMode="cover" source={Images.salon} style={styles.salonImg} />
      <ScrollView>
        <View style={rootStyle.innerContainer}>
          <Text style={styles.shopName}>{get(item, 'title')}</Text>

          <View style={styles.addressContainer}>
            <View style={styles.rowContainer}>
              <View>
                <Text style={styles.shopLoc}>
                  {get(item, 'contact.street1')}
                </Text>
                <Text style={styles.shopLoc}>
                  {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
                  {get(item, 'contact.postalCode')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  openMaps(
                    get(item, 'title'),
                    get(item, 'contact.coordinates[0]', 34.1434376),
                    get(item, 'contact.coordinates[1]', 34.1434376),
                    `${get(item, 'contact.street1')} ${get(
                      item,
                      'contact.city',
                    )} ${get(item, 'contact.state')} ${get(
                      item,
                      'contact.postalCode',
                    )}`,
                  )
                }
                accessible
                accessibilityLabel="Open Map"
                accessibilityRole="link">
                <Image source={Images.loc} />
              </TouchableOpacity>
            </View>

            {dis && (
              <Text style={styles.shopMiles}>
                {dis.status === 'SUCCESS'
                  ? `${dis.routes.car.distance.text} away`
                  : ''}
              </Text>
            )}

            <View style={rootStyle.seprator} />
            <Text style={styles.desc}>{get(item, 'information')}</Text>
          </View>

          <View style={styles.phoneContainer}>
            <TouchableOpacity
              accessible
              accessibilityLabel="Contact us"
              accessibilityRole="button"
              onPress={() => {
                call(get(item, 'contact.phoneNumber'));
              }}>
              <Text style={rootStyle.commonText}>
                {get(item, 'contact.phoneNumber')}
              </Text>
            </TouchableOpacity>
            <Image style={styles.callIcon} source={Images.call} />
          </View>
          {(socialData || '') !== '' && (
            <TouchableOpacity
              accessible
              accessibilityLabel="Check instagram"
              accessibilityRole="link"
              onPress={() => {
                Linking.openURL(
                  `https://www.instagram.com/${socialData.replace(/@/gi, '')}`,
                );
              }}>
              <View style={[styles.phoneContainer, {marginVertical: 0}]}>
                <Text style={rootStyle.commonText}>{socialData}</Text>
                <Image source={Images.insta} />
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.hour}>Hours</Text>

          <View style={styles.hourContainer}>
            {get(item, 'settings.operatingHours', []).map((d, idx) => (
              <View style={styles.weekContainer} key={idx}>
                <Text style={styles.weekDay}>{d[0]}</Text>
                <Text style={styles.weekDay}>{d[1]}</Text>
              </View>
            ))}
          </View>

          {(operatingMessage || '') !== '' && (
            <>
              <Text style={styles.hour}>Operating Message</Text>
              <View style={styles.hourContainer}>
                <Text style={styles.weekDay}>{operatingMessage}</Text>
              </View>
            </>
          )}

          {(arrivalInformation || '') !== '' && (
            <>
              <Text style={styles.hour}>Parking Information</Text>
              <View style={styles.hourContainer}>
                <Text style={styles.weekDay}>{arrivalInformation}</Text>
              </View>
            </>
          )}

          <Button name="Book an Appointment" onButtonPress={onBook} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopDetail;
