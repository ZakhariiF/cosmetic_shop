import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import {get} from 'lodash';

const FavoriteItem = ({item, showHeart, onFavIcon, isFav}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftContainer}>
          <Text style={styles.loc}>{get(item, 'title')}</Text>
          <Text
            style={[
              styles.loc,
              {marginTop: 12, fontFamily: Fonts.AvenirNextRegular},
            ]}>
            {get(item, 'contact.street1')}
            {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
            {get(item, 'contact.postalCode')}
          </Text>
        </View>

        {showHeart ? (
          <TouchableOpacity
            onPress={() => onFavIcon(item)}
            style={styles.favIcon}>
            <Image
              resizeMode="contain"
              source={isFav ? Images.fav : Images.fav_trans}
              style={styles.favIcon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopText}>View Shop</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.miles}>3.8 miles away</Text>

        <View style={[styles.row, {alignItems: 'center'}]}>
          <Image source={Images.phone} />
          <Text style={styles.contactNo}>
            {get(item, 'contact.phoneNumber')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FavoriteItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    marginVertical: 10,
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
    marginRight: '6%',
    height: 18,
    width: 18,
  },
});
