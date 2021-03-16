import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MapView from 'react-native-maps';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import {findStoresFromPointWithTitle, requestUserLocationLocation} from 'utils';
import {FlatList, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import {Colors, Fonts} from 'constant';
import Header from 'components/Header/Header';
import LocationItem from 'components/LocationItem';
import EmptyContainer from 'components/EmptyContainer';
import rootStyle from 'rootStyle';
import SearchBar from 'components/SearchBar';
import {
  setFavoriteLocation,
  setLocation,
  setmemberCount,
} from 'screens/Dashboard/Booking/thunks';
import {setFavoriteStore} from 'screens/Auth/thunks';
import {types} from 'screens/Dashboard/Booking/ducks';
import CustomMapMarker from 'components/CustomMapMarker';
import {geolocateSearchLocation} from 'services/Google';
import CheckBox from 'components/Checkbox';
import { setCurrentLocation, setUseCurrentLocation } from "screens/Dashboard/thunks";
import { current } from "@reduxjs/toolkit";

const window = Dimensions.get('window');
const {width, height} = window;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var arrayHolder = [];

const defaultPoint = {
  latitude: 34.0577908,
  longitude: -118.3622365,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const FindLocation = ({navigation}) => {
  const dispatch = useDispatch();
  const [searchVal, setSearch] = useState('');
  const [locationItems, setLocationItems] = useState([]);
  const customerInfo = useSelector((state) => state.auth.customerInfo);
  const isFavLoad = useSelector((state) => state.booking.isFavLoading);
  const favItem = useSelector((state) => state.auth.favItem);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [storeIdx, setStoreIdx] = useState(0);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);
  const {data: retailStores} = useQuery(storeCollectionQuery('Retail Store'));
  const mapRef = useRef(null);
  const [selectedLocationIndex, setSelectedLocation] = useState(-1);

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

  const useCurrentLocation = useSelector(
    (state) => state.home.useCurrentLocation,
  );
  const [coords, setCoords] = useState(
    useCurrentLocation && currentLocation
      ? {...defaultPoint, ...currentLocation}
      : defaultPoint,
  );

  if (error) {
    // return AlertHelper.showError('Server error');
  }

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }

    arrayHolder = get(data, 'storeCollection.items', []);

    setLocationItems(arrayHolder);

    return data;
  }, [loading, error, data]);

  const onMarker = (item, idx) => {
    // childRef.current.onMin();
    setCoords({
      latitude: Number(get(item, 'contact.coordinates[0]', 34.1434376)),
      longitude: Number(get(item, 'contact.coordinates[1]', -118.2580306)),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });

    if (selectedLocationIndex === idx) {
      setSelectedLocation(-1);
    } else {
      setSelectedLocation(idx);
    }
  };

  const setCenter = (item) => {
    setCoords({
      latitude: Number(get(item, 'contact.coordinates[0]', 34.1434376)),
      longitude: Number(get(item, 'contact.coordinates[1]', -118.2580306)),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const searchFilterFunction = useCallback(
    async (centerPoint = null) => {
      const geolocatedPoints =
        searchVal.length && !centerPoint
          ? await geolocateSearchLocation(searchVal)
          : null;

      let {data: newData} = findStoresFromPointWithTitle(
        arrayHolder,
        geolocatedPoints,
        searchVal,
        centerPoint
          ? {
              lat: centerPoint.latitude,
              lng: centerPoint.longitude,
            }
          : {
              lat: coords.latitude,
              lng: coords.longitude,
            },
      );

      if (storeIdx === 1) {
        const {data: retailStoreData} = findStoresFromPointWithTitle(
          get(retailStores, 'storeCollection.items', []),
          geolocatedPoints,
          searchVal,
          {
            lat: coords.latitude,
            lng: coords.longitude,
          },
        );
        newData = newData.concat(retailStoreData);
      }
      setLocationItems(newData);

      if (newData.length) {
        setCoords({
          latitude: Number(
            get(newData, '[0].contact.coordinates[0]', 34.1434376),
          ),
          longitude: Number(
            get(newData, '[0].contact.coordinates[1]', -118.2580306),
          ),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    },
    [searchVal, arrayHolder, storeIdx, currentLocation, coords],
  );

  useEffect(() => {
    searchFilterFunction();
  }, [storeIdx]);

  useEffect(() => {
    if (useCurrentLocation && searchVal === '' && currentLocation) {
      setCoords({
        ...coords,
        ...currentLocation,
      });
      searchFilterFunction(currentLocation);
    } else if (!useCurrentLocation && searchVal === '') {
      setCoords(defaultPoint);
      searchFilterFunction(defaultPoint);
    }
  }, [useCurrentLocation, searchVal, currentLocation]);

  const onFav = (item) => {
    const obj = {
      userId: get(userInfo, 'bookerID', ''),
      locId: get(item, 'bookerLocationId', '1639'),
    };

    dispatch(setFavoriteLocation(obj)).then((response) => {
      if (response.type == types.SET_FAVORITES_SUCCESS) {
        dispatch(setFavoriteStore(item.bookerLocationId));
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="FIND LOCATION" isTab isBack />

      <MapView
        showsUserLocation
        provider={null}
        ref={mapRef}
        style={{
          flex: 0.8,
        }}
        initialRegion={coords}
        region={coords}>
        {locationItems.map((e, i) => (
          <MapView.Marker
            coordinate={{
              latitude: Number(get(e, 'contact.coordinates[0]', 34.1434376)),
              longitude: Number(get(e, 'contact.coordinates[1]', -118.2580306)),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            animation
            onPress={() => onMarker(e, i)}>
            <CustomMapMarker
              selected={selectedLocationIndex === i}
              item={e}
              navigation={navigation}
              currentLocation={currentLocation}
              onClose={() => setSelectedLocation(-1)}
              onPress={() => onMarker(e, i)}
            />
          </MapView.Marker>
        ))}
      </MapView>
      <View style={rootStyle.innerContainer}>
        <View style={{alignItems: 'center'}}>
          <CheckBox
            title={'Use Current Location'}
            isChecked={useCurrentLocation}
            onPressed={() =>
              dispatch(setUseCurrentLocation(!useCurrentLocation))
            }
            containerStyle={{marginVertical: 10}}
          />
        </View>
        <SearchBar
          value={searchVal}
          onChangeText={(i) => setSearch(i)}
          onSearch={() => searchFilterFunction()}
        />
        <CheckBox
          isChecked={storeIdx}
          onPressed={() => setStoreIdx(1 - storeIdx)}
          title="Retail Locations"
        />
        <FlatList
          data={locationItems}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
          renderItem={(e) => (
            <LocationItem
              {...e}
              fromFindLoc
              navigation={navigation}
              customerInfo={customerInfo}
              onFavIcon={onFav}
              isFav={get(e, 'item.bookerLocationId') == favItem}
              onSelect={(item) => setCenter(item)}
              currentLocation={currentLocation}
              onBook={(item) => {
                dispatch(setLocation(item));
                dispatch(setmemberCount([]));
                navigation.navigate('Book', {screen: 'Coming'});
              }}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={() => (
            <EmptyContainer emptyText="No Data Found" />
          )}
          extraData={[locationItems, searchVal]}
        />
        {loading || isFavLoad ? <Indicator /> : null}
      </View>
    </View>
  );
};

export default FindLocation;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
