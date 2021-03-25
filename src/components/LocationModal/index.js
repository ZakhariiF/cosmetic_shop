import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import SearchBar from 'components/SearchBar';
import {Colors, Fonts, Images} from 'constant';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Keyboard,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import rootStyle from 'rootStyle';
import LocationItem from 'components/LocationItem';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import {
  setFavoriteLocation,
  setLocation,
  setmemberCount,
} from 'screens/Dashboard/Booking/thunks';
import {setFavoriteStore} from 'screens/Auth/thunks';
import EmptyContainer from 'components/EmptyContainer';
import ReviewPopup from 'components/ReviewPopup';
import {types} from 'screens/Dashboard/Booking/ducks';
import MParticle from 'react-native-mparticle';
import CheckBox from 'components/Checkbox';
import {requestUserLocationLocation} from 'utils';
import {setCurrentLocation} from 'screens/Dashboard/thunks';

// import Location from 'screens/Dashboard/Booking/Location';

const window = Dimensions.get('window');
const {width, height} = window;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LocationModal = forwardRef((props, ref) => {
  const {
    selectedIndex,
    onSearch,
    onChangeText,
    searchVal,
    locationData,
    onSelect,
    setUseCurrentLocation,
    useCurrentLocation,
    onCollapse,
  } = props;
  const dispatch = useDispatch();
  const routes = useNavigationState((state) => state.routes);
  const searchRef = useRef(null);
  const flatRef = useRef(null);
  const navigation = useNavigation();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const data = useSelector((state) => state.booking.locations);
  const currentLocation = useSelector((state) => state.home.currentLocation);

  const radarPermission = useSelector((state) => state.home.radarPermission);
  useEffect(() => {
    if (!currentLocation) {
      getUserLocation();
    }
  }, [currentLocation]);

  const getUserLocation = async () => {
    try {
      const position = await requestUserLocationLocation();
      const latitude = get(position, 'latitude');
      const longitude = get(position, 'longitude');

      dispatch(
        setCurrentLocation({
          latitude,
          longitude,
        }),
      );
    } catch (e) {
      console.log('Can not get the current user location');
    }
  };

  const route = useRoute();
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const favStore = useSelector((state) => state.auth.favItem);
  const currentRoute = routes[routes.length - 1].name || 'Location';

  const customerInfo = useSelector((state) => state.auth.customerInfo);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [activeTab, setactiveTab] = useState(0);
  const [updatedHeight, setHight] = useState(
    currentRoute === 'Location' ? '50%' : '10%',
  );

  const extensionAddon = useSelector((state) => state.booking.extensionAddon);

  const [min, setMin] = useState(currentRoute !== 'Location');

  const [favItem, setFavItem] = useState(favStore || '');

  let showReview = currentRoute !== 'Location';

  useEffect(() => {
    MParticle.logEvent('Set store locator', MParticle.EventType.Other, {
      'Source Page': 'Booking Location',
      Filter: activeTab === 0 ? 'Closest' : 'Favorite',
    });
  }, [activeTab]);

  useEffect(() => {
    if (onCollapse) {
      onCollapse(min);
    }
  }, [min, onCollapse]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
    };
  }, []);

  useEffect(() => {
    if (favStore) {
      setFavItem(favStore);
    }
  }, [favStore]);

  const _keyboardDidShow = () => {
    if (currentRoute === 'Notes') {
      return;
    }
    collapse();
    setHight('60%');

    searchRef.current?.focus();
    console.log('keyboard show');
  };

  const _keyboardDidHide = () => {
    collapse();
    setHight('50%');
  };

  const collapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const onMin = () => {
    collapse();

    if (min && showReview) {
      setHight('80%');
    } else if (min && !showReview) {
      setHight('50%');
    } else {
      setHight('10%');
    }
    setMin(!min);
  };

  const calculateTotal = () => {
    const totalPrice = totalGuests.reduce((acc, e) => {
      let addonPrice = 0;
      if (get(e, 'addons')) {
        addonPrice = e.addons.reduce(
          (val, item) => get(item, 'PriceInfo.Amount', 0) + val,
          0,
        );
      }
      if (e.extension && e.extension.name === 'Yes' && extensionAddon) {
        addonPrice += get(extensionAddon, 'Price.Amount', 0);
      }
      return acc + get(e, 'services.Price.Amount', 0) + addonPrice;
    }, 0);

    return totalPrice;
  };

  const onBook = (item = get(data, '[0]', {})) => {
    MParticle.logEvent(
      'Select Location for Booking',
      MParticle.EventType.Other,
      {
        'Source Page': route.name,
        'Location Id': `${item.bookerLocationId}`,
        'Location Address': `${get(item, 'contact.street1')} ${get(
          item,
          'contact.city',
        )}, ${get(item, 'contact.state')} ${get(item, 'contact.postalCode')}`,
        'Selection Mode': 'List',
        'User Location': '',
        Distance: '0',
      },
    );
    dispatch(setLocation(item));
    dispatch(setmemberCount([]));
    navigation.navigate('Coming');
  };

  const onFav = (item) => {
    const obj = {
      userId: get(userInfo, 'bookerID', ''),
      locId: get(item, 'bookerLocationId', '1639'),
    };

    dispatch(setFavoriteLocation(obj)).then((response) => {
      if (response.type == types.SET_FAVORITES_SUCCESS) {
        setFavItem(item.bookerLocationId);
        dispatch(setFavoriteStore(item.bookerLocationId));
      }
    });
  };

  return (
    <View style={[styles.container, {height: updatedHeight}]}>
      <TouchableOpacity
        onPress={onMin}
        accessible
        accessibilityLabel="Toggle Detail"
        accessibilityRole="button">
        <Image
          source={Images.down_arrow}
          style={[styles.downIcon, min && {transform: [{rotate: '180deg'}]}]}
        />
      </TouchableOpacity>

      {showReview && !min ? (
        <>
          <View style={styles.minContainer}>
            <Text style={styles.locText}>
              {get(
                selectedLocation,
                'title',
                'Drybar Huntington Beach in Pacific City',
              )}
            </Text>
            <Text style={styles.price}>${calculateTotal()}</Text>
          </View>
          <ReviewPopup />
        </>
      ) : min ? (
        <View style={styles.minContainer}>
          <Text style={styles.locText}>
            {get(
              selectedLocation,
              'title',
              'Drybar Huntington Beach in Pacific City',
            )}
          </Text>
          <Text style={styles.price}>${calculateTotal()}</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Text style={styles.title}>Select a Drybar Shop</Text>
          <View style={styles.innerContainer}>
            <View style={{alignItems: 'center'}}>
              <CheckBox
                title={'Use Current Location'}
                isChecked={useCurrentLocation}
                onPressed={setUseCurrentLocation}
                containerStyle={{marginVertical: 10}}
              />
            </View>

            {activeTab === 0 ? (
              <SearchBar
                ref={searchRef}
                isButton={false}
                placeholder="City, State or Zip"
                onChangeText={onChangeText}
                value={searchVal}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  _keyboardDidHide();
                  onSearch();
                }}
              />
            ) : null}

            <FlatList
              ref={flatRef}
              initialScrollIndex={selectedIndex > -1 ? selectedIndex : 0}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  selectedIndex > -1 &&
                    flatRef.current?.scrollToIndex({
                      index: selectedIndex,
                      animated: true,
                    });
                });
              }}
              data={
                activeTab == 0
                  ? data
                  : (locationData || data).filter(
                      (e) => e.bookerLocationId == favItem,
                    )
                // miles
              }
              contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
              renderItem={(e) => (
                <LocationItem
                  {...e}
                  navigation={navigation}
                  onBook={onBook}
                  customerInfo={customerInfo}
                  onFavIcon={onFav}
                  isFav={get(e, 'item.bookerLocationId') == favItem}
                  onSelect={onSelect}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              ListHeaderComponent={() => (
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.scrollContainer}>
                  {['Nearby', 'Favorite'].map((e, i) => {
                    return (
                      <TouchableOpacity
                        onPress={() => setactiveTab(i)}
                        key={i}
                        style={[
                          styles.listContainer,
                          activeTab == i && styles.activeTab,
                        ]}
                        accessible
                        accessibilityLabel={e}
                        accessibilityRole="tab">
                        <Text
                          style={[
                            styles.listText,
                            activeTab == i && styles.activeText,
                          ]}>
                          {e}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
              ListEmptyComponent={() => (
                <EmptyContainer emptyText="No Data Found" />
              )}
              extraData={[favItem]}
            />
          </View>
        </View>
      )}
    </View>
  );
});

export default LocationModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  downIcon: {
    alignSelf: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 18,
    ...rootStyle.commonText,
    alignSelf: 'center',
    marginTop: 10,
  },
  innerContainer: {
    paddingHorizontal: 15,
  },
  listContainer: {
    backgroundColor: Colors.dimGray,
    minWidth: '50%',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 38,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dimGray,
  },
  listText: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  activeTab: {
    backgroundColor: Colors.white,
    borderTopWidth: 5,
    borderTopColor: Colors.yellow,
  },
  activeText: {
    fontFamily: Fonts.AvenirNextMedium,
    bottom: 1.1,
  },
  scrollContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },

  minContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  locText: {
    flex: 1,
    ...rootStyle.commonText,
  },
  price: {
    fontSize: 20,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
});
