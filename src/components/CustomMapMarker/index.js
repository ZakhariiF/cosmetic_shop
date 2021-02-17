import React from 'react';
import {Colors, Fonts, Images} from 'constant';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {get} from 'lodash';
import rootStyle from 'rootStyle';
import {useDispatch} from 'react-redux';
import {setLocation} from 'screens/Dashboard/Booking/thunks';
import {openMaps, distance, call} from 'utils';

const {width} = Dimensions.get('window');

const CustomMapMarker = ({selected, item, navigation, currentLocation}) => {
  const dispatch = useDispatch();

  const phoneNumber = get(item, 'contact.phoneNumber');
  const isBookable =
    item.type === 'Drybar Shop' && get(item, 'settings.bookable', false);

  return (
    <View>
      {selected ? (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.locName}>{get(item, 'title')}</Text>
              <View
                onTouchStart={() =>
                  openMaps(
                    get(item, 'title'),
                    get(item, 'contact.coordinates[0]', 34.1434376),
                    get(item, 'contact.coordinates[1]', 34.1434376),
                  )
                }>
                <Image source={Images.loc} />
              </View>
            </View>

            <Text style={styles.location}>
              {get(item, 'contact.street1')}
              {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
              {get(item, 'contact.postalCode')}
            </Text>

            <View style={styles.nameContainer}>
              <View>
                {currentLocation && (
                  <Text style={styles.miles}>
                    {Math.round(
                      distance(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        get(item, 'contact.coordinates[0]', 34.1434376),
                        get(item, 'contact.coordinates[1]', 34.1434376),
                      ),
                    )}{' '}
                    miles away
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => call(phoneNumber)}>
                  <Text style={styles.contactNo}>
                    <Image
                      source={Images.phone}
                      style={{tintColor: Colors.header_title}}
                    />

                    {'  '}
                    {phoneNumber}
                  </Text>
                </TouchableOpacity>
              </View>
              {
                isBookable && <View
                  onTouchStart={() => {
                    dispatch(setLocation(item));
                    navigation.navigate('Book', {screen: 'Coming'});
                  }}
                  style={styles.buttonContainer}>
                  <Text style={styles.selectText}>Select</Text>
                </View>
              }
            </View>
          </View>
          <View style={styles.triangle} />
        </View>
      ) : null}
      <Image
        source={
          selected
            ? Images.gray_pin
            : item.type === 'Retail Store'
            ? Images.fav_marker
            : Images.yellow_pin
        }
        resizeMode="contain"
      />
    </View>
  );
};

export default CustomMapMarker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
  },
  miles: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.light_gray,
  },
  buttonContainer: {
    height: 36,
    width: 80,
    backgroundColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  locName: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextMedium,
    flexBasis: '80%',
  },
  location: {
    ...rootStyle.commonText,
    marginVertical: 8,
  },
  triangle: {
    transform: [{rotateZ: '45deg'}],
    width: 15,
    height: 15,
    backgroundColor: Colors.white,
    marginTop: -8,
    marginLeft: '5%',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: Colors.dimGray,
    borderRightColor: Colors.dimGray,
  },
  innerContainer: {
    width: width * 0.85,
    backgroundColor: Colors.white,
    flex: 1,
    padding: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.dimGray,
    ...rootStyle.shadow,
  },
  contactNo: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.primary,
    fontFamily: Fonts.AvenirNextRegular,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
