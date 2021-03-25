import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Images} from 'constant';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {get} from 'lodash';
import rootStyle from 'rootStyle';
import {useDispatch} from 'react-redux';
import {setLocation} from 'screens/Dashboard/Booking/thunks';
import {openMaps, call} from 'utils';
import {distance} from 'utils/RadarHelper';
import MapView from 'react-native-maps';

const window = Dimensions.get('window');
const {width, height} = window;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AndroidMapMarker = ({
  selected,
  item,
  navigation,
  currentLocation,
  onClose,
  onPress,
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

  const icon = selected
    ? Images.gray_pin
    : item.type === 'Retail Store'
    ? Images.fav_marker
    : Images.yellow_pin;

  return (
    <MapView.Marker
      coordinate={{
        latitude: Number(get(item, 'contact.coordinates[0]', 34.1434376)),
        longitude: Number(get(item, 'contact.coordinates[1]', -118.2580306)),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      animation
      onPress={(e) => {
        onPress(item, e);
      }}
    >
    <View>
      {selected ? (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.locName}>{get(item, 'title')}</Text>
              <View
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('onTouchStart:');
                  openMaps(
                    get(item, 'title'),
                    get(item, 'contact.coordinates[0]', 34.1434376),
                    get(item, 'contact.coordinates[1]', 34.1434376),
                  )
                }}
                accessible
                accessibilityLabel={get(item, 'title')}
                accessibilityRole="link">
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
                {dis && (
                  <Text style={styles.miles}>
                    {dis.status === 'SUCCESS'
                      ? dis.routes.car.distance.text
                      : ''}
                  </Text>
                )}
                <TouchableOpacity onTouchStart={() => call(phoneNumber)}>
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
          <View style={styles.triangle} />
        </View>
      ) : null}
      <Image
        source={icon}
        resizeMode="contain"
      />
    </View>
  </MapView.Marker>
  );
};

export default AndroidMapMarker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
    // position: 'absolute',
    // bottom: 40,
    // left: -10,
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