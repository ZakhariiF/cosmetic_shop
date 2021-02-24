import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import {get} from 'lodash';
import {call} from 'utils';
import {distance} from 'utils/RadarHelper';

const FavoriteSearchItem = ({item, onFavIcon, isFav, currentLocation}) => {
  const [dis, setDis] = useState(null);
  useEffect(() => {
    if (currentLocation) {
      getDistance();
    }
  }, []);
  const getDistance = async () => {
    const _dis = await distance(
      {
        latitude: Number(currentLocation.latitude),
        longitude: Number(currentLocation.longitude),
      },
      {
        latitude: Number(get(item, 'contact.coordinates[0]')),
        longitude: Number(get(item, 'contact.coordinates[1]'))
      }
    );
    setDis(_dis);
  }
  return (
    <View style={styles.container}>
      <Image source={Images.notice} style={styles.noticeIcon} />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <View style={styles.leftContainer}>
            <Text style={styles.loc}>{get(item, 'title')}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onFavIcon(item)}
            style={styles.favIcon}>
            <Image
              resizeMode="contain"
              source={isFav ? Images.fav : Images.fav_trans}
              style={styles.favIcon}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.loc,
            {marginTop: 12, fontFamily: Fonts.AvenirNextRegular},
          ]}>
          {get(item, 'contact.street1')}
          {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
          {get(item, 'contact.postalCode')}
        </Text>

        <View style={styles.bottomContainer}>
          {
            dis && (
              <Text style={styles.miles}>
                {dis.status === "SUCCESS" ?
                  dis.routes.car.distance.text
                :
                  ""
                }
              </Text>
            )
          }

          <View
            style={[styles.row, {alignItems: 'center'}]}
            onTouchStart={() => call(get(item, 'contact.phoneNumber', ''))}>
            <Image source={Images.phone} />
            <Text style={styles.contactNo}>
              {get(item, 'contact.phoneNumber')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FavoriteSearchItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopButton: {
    backgroundColor: Colors.yellow,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  shopText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  row: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    paddingRight: 15,
  },
  loc: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  miles: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.light_gray,
  },
  contactNo: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
    marginLeft: 10,
  },
  favIcon: {
    alignSelf: 'center',
    height: 18,
    width: 18,
  },
  noticeIcon: {
    marginTop: 3,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 12,
  },
});
