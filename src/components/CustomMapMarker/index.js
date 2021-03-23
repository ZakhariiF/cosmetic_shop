import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Images} from 'constant';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {get} from 'lodash';
import rootStyle from 'rootStyle';
import {useDispatch} from 'react-redux';
import {setLocation} from 'screens/Dashboard/Booking/thunks';
import {openMaps, call} from 'utils';
import {distance} from 'utils/RadarHelper';
import MapView from 'react-native-maps';

const CustomMapMarker = ({
  selected,
  item,
  navigation,
  currentLocation,
  onClose,
  onPress,
  coordinate,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dis, setDis] = useState(null);
  useEffect(() => {
    if (currentLocation && selected) {
      getDistance();
    }
  }, [currentLocation, selected]);
  const getDistance = async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };
  const phoneNumber = get(item, 'contact.phoneNumber');
  const isBookable =
    item.bookerLocationId &&
    item.type === 'Drybar Shop' &&
    get(item, 'settings.bookable', false);

  const icon = open
    ? Images.gray_pin
    : item.type === 'Retail Store'
    ? Images.fav_marker
    : Images.yellow_pin;

  const onCalloutPress = (e) => {
    if (Platform.OS === 'android') {
      navigation.navigate('Book', {
        screen: 'ShopDetail',
        params: {item},
      })
    }
  }

  return (
    <MapView.Marker
      coordinate={coordinate}
      animation={true}
      image={icon}
      onSelect={() => {
        setOpen(true);
        onPress();
      }}
      onDeselect={() => {
        setOpen(false);
        onClose();
      }}>
      <MapView.Callout onPress={onCalloutPress}>
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
                <Text>
                  <Image source={Images.loc} />
                </Text>
            </View>
          </View>

          <Text style={styles.location}>
            {get(item, 'contact.street1')}
            {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
            {get(item, 'contact.postalCode')}
          </Text>

          <View style={styles.nameContainer}>
            <View>
              {dis && (
                <Text style={styles.miles}>
                  {dis.status === 'SUCCESS' ? dis.routes.car.distance.text : ''}
                </Text>
              )}
              {!!phoneNumber && (
                <View onTouchStart={() => call(phoneNumber)}>
                  <Text style={styles.contactNo}>
                    <Image
                      source={Images.phone}
                      style={{tintColor: Colors.header_title}}
                    />
                    {'  '}
                    {phoneNumber}
                  </Text>
                </View>
              )}
            </View>
            {isBookable && (
              <View
                onTouchStart={() => {
                  dispatch(setLocation(item));
                  navigation.navigate('Book', {screen: 'Coming'});
                }}
                style={styles.buttonContainer}>
                <Text style={styles.selectText}>Select</Text>
              </View>
            )}
          </View>
        </View>
      </MapView.Callout>
    </MapView.Marker>    
  );
};

export default CustomMapMarker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
    // position: 'absolute',
    // left: -10,
    // bottom: 40,
    // zIndex: 102,
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

  innerContainer: {
    padding: 20,
  },
  contactNo: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.primary,
    fontFamily: Fonts.AvenirNextRegular,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
