import {Colors, Fonts, Images} from 'constant';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import rootStyle from 'rootStyle';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {get} from 'lodash';
import {openMaps} from 'utils';
import {distance} from 'utils/RadarHelper';
import {useSelector} from 'react-redux';

const LocationItem = ({
  navigation,
  item,
  index,
  onBook,
  customerInfo,
  onFavIcon,
  isFav = false,
  isViewMode,
  fromFindLoc = false,
  onSelect,
}) => {
  const [dis, setDis] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const currentLocation = useSelector((state) => state.home.currentLocation);

  useEffect(() => {
    if (currentLocation && index < 10) {
      getDistance();
    }
  }, [currentLocation, index, item]);

  const getDistance = useCallback(async () => {
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
      setDis(_dis.routes.car.distance.text);
    } catch (e) {
      console.log('Get Distance Issue:', e);
    }
  }, [currentLocation, item]);

  const window = Dimensions.get('window');
  const {width, height} = window;
  const ASPECT_RATIO = width / height;

  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const distanceCal = item.contact !== null ? item.contact : '';
  const contactsCal =
    distanceCal.coordinates !== undefined
      ? distanceCal.coordinates
      : {lat: 0, long: 0};

  var obj = [];
  for (var i = 0; i < contactsCal.length; i++) {
    obj[i] = {
      lat:
        typeof contactsCal[i][0] !== 'undefined'
          ? contactsCal[i][0]
          : Number(0),
      long:
        typeof contactsCal[i][1] !== 'undefined'
          ? contactsCal[i][1]
          : Number(0),
    };
  }

  const operatingMessage = get(item, 'settings.operatingMessage', '');
  const arrivalInformation = get(item, 'arrivalInformation', '');

  // console.log("PROPS?????????", distanceMiles[0])
  const isBookable =
    item.bookerLocationId &&
    item.type === 'Drybar Shop' &&
    get(item, 'settings.bookable', false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (onSelect) {
          onSelect(item);
        }
      }}
      accessible={!!onSelect}
      accessibilityLabel="Next"
      accessibilityRole="button">
      <View style={styles.container}>
        {/*  */}
        <View style={styles.flexContainer}>
          <View style={styles.rowContainer}>
            {isBookable && (
              <TouchableOpacity
                accessible
                accessibilityLabel="Shop Detail"
                accessibilityRole="link"
                onPress={() =>
                  navigation.navigate('ShopDetail', {item, fromFindLoc})
                }
                style={styles.favIcon}>
                <Image source={Images.notice} />
              </TouchableOpacity>
            )}
            <Text style={styles.locName}>{get(item, 'title')}</Text>
          </View>
          {isBookable && (
            <TouchableOpacity
              style={styles.buttonContainer}
              accessible
              accessibilityLabel={isViewMode ? 'Shop Detail' : 'Book'}
              accessibilityRole="link"
              onPress={() => {
                if (isViewMode) {
                  navigation.navigate('ShopDetail', {item, fromFindLoc});
                } else {
                  onBook(item);
                }
              }}>
              <Text style={styles.selectText}>
                {isViewMode ? 'View Shop' : 'Book'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.flexContainer, {marginTop: 10}]}>
          <View style={styles.rowContainer}>
            <EvilIcons name="location" size={26} />
            <View>
              <Text style={styles.location}>
                {/* 21016 Pacific Coast Hwy Suite D104 Huntington Beach, CA 92648 */}
                {get(item, 'contact.street1')}, {get(item, 'contact.city')}
              </Text>
              <Text style={styles.location}>
                {get(item, 'contact.state')} {get(item, 'contact.postalCode')}
              </Text>
            </View>
          </View>
          {get(item, 'bookerLocationId') && (
            <TouchableOpacity
              onPress={() => onFavIcon(item)}
              accessible
              accessibilityLabel="Favorite Shop"
              accessibilityRole="button"
              style={styles.favIcon}>
              <Image
                resizeMode="contain"
                source={isFav ? Images.fav : Images.fav_trans}
                style={styles.favIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.flexContainer, {marginTop: 10, marginLeft: 35}]}>
          {dis && (
            <Text style={styles.miles}>
              {dis}
            </Text>
          )}

          <TouchableOpacity
            accessible
            accessibilityLabel="View Map"
            accessibilityRole="link"
            onPress={() =>
              openMaps(
                get(item, 'title'),
                get(item, 'contact.coordinates[0]', 34.1434376),
                get(item, 'contact.coordinates[1]', 34.1434376),
              )
            }
            hitSlop={{top: 20, bottom: 20}}>
            <Text style={styles.direction}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {((operatingMessage && operatingMessage != '') ||
          (arrivalInformation && arrivalInformation !== '')) && (
          <View style={styles.information}>
            {operatingMessage !== '' && (
              <Text style={styles.inforText}>{operatingMessage}</Text>
            )}
            {arrivalInformation !== '' && (
              <Text style={styles.inforText}>{arrivalInformation}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LocationItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: Colors.bg,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    paddingVertical: 12,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  locName: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
    marginLeft: 10,
    flexBasis: '60%',
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
  location: {
    ...rootStyle.commonText,
    marginLeft: 10,
    flexBasis: '70%',
  },
  favIcon: {
    alignSelf: 'center',
    marginRight: '6%',
    height: 18,
    width: 18,
  },
  miles: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.light_gray,
  },
  direction: {
    ...rootStyle.commonText,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  information: {
    borderTopWidth: 2,
    borderTopColor: Colors.seprator,
    borderStyle: 'solid',
    backgroundColor: Colors.bg,
    marginTop: 10,
    padding: 10,
  },
  inforText: {
    color: Colors.light_gray,
    marginBottom: 10,
  },
});
