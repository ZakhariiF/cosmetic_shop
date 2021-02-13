import React from 'react';
import {Image, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import rootStyle from 'rootStyle';
import Header from 'components/Header/Header';
import {Images} from 'constant';
import styles from './styles';
import Button from 'components/Button';
import {get} from 'lodash';
import {openMaps} from 'utils';
import {useDispatch} from 'react-redux';
import { setLocation, setmemberCount } from '../thunks';

const ShopDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    params: {item, fromFindLoc},
  } = route;

  const onBook = () => {
    if (fromFindLoc) {
      navigation.navigate('Book', {
        screen: 'Coming',
        initial: false,
      });
    } else navigation.navigate('Coming');
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
              <Text style={styles.shopLoc}>
                {get(item, 'contact.street1')}
                {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
                {get(item, 'contact.postalCode')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openMaps(
                    get(item, 'title'),
                    get(item, 'contact.coordinates[0]', 34.1434376),
                    get(item, 'contact.coordinates[1]', 34.1434376),
                  )
                }>
                <Image source={Images.loc} />
              </TouchableOpacity>
            </View>

            <Text style={styles.shopMiles}>3.8 miles away</Text>
            <View style={rootStyle.seprator} />
            <Text style={styles.desc}>{get(item, 'information')}</Text>
          </View>

          <View style={styles.phoneContainer}>
            <Text style={rootStyle.commonText}>
              {get(item, 'contact.phoneNumber')}
            </Text>
            <Image style={styles.callIcon} source={Images.call} />
          </View>
          <View style={[styles.phoneContainer, {marginVertical: 0}]}>
            <Text style={rootStyle.commonText}>
              {get(item, 'contact.social.instagram')}
            </Text>
            <Image source={Images.insta} />
          </View>

          <Text style={styles.hour}>Hours</Text>
          <View style={styles.hourContainer}>
            <View style={styles.weekContainer}>
              <Text style={styles.weekDay}>Saturday</Text>
              <Text style={styles.weekDay}>8:00am to 8:00pm</Text>
            </View>

            <View style={styles.weekContainer}>
              <Text style={styles.weekDay}>Sunday</Text>
              <Text style={styles.weekDay}>8:00am to 8:00pm</Text>
            </View>
          </View>

          <Button name="Book an Appointment" onButtonPress={onBook} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopDetail;
