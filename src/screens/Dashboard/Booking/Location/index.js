import React, {useEffect, useRef, useState, useCallback} from 'react';
import MapView from 'react-native-maps';

import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import CustomMapMarker from 'components/CustomMapMarker';
import {useDispatch, useSelector} from 'react-redux';
import {getLocations, setLocation} from '../thunks';
import {
  setUseCurrentLocation,
  setCurrentLocation,
} from 'screens/Dashboard/thunks';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import {requestUserLocationLocation, findStoresFromPointWithTitle} from 'utils';
import {geolocateSearchLocation} from 'services/Google';
import {Dimensions, Platform} from 'react-native';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';
import {hasRadarPermission} from 'utils/RadarHelper';
import AndroidMapMarker from 'components/AndroidMapMarker';
// import { getDistance, getPreciseDistance } from 'geolib'
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

const Location = ({navigation}) => {
  const dispatch = useDispatch();
  const childRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedLocationId, setSelectedLocation] = useState(-1);
  const [searchVal, setSearch] = useState('');
  const allLocations = useSelector((state) => state.booking.locations);
  const isFavLoad = useSelector((state) => state.booking.isFavLoading);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);
  const currentLocation = useSelector((state) => state.home.currentLocation);
  const [collapsed, setCollapsed] = useState(false);

  const useCurrentLocation = useSelector(
    (state) => state.home.useCurrentLocation,
  );

  const [coords, setCoords] = useState(
    useCurrentLocation && currentLocation
      ? {...defaultPoint, ...currentLocation}
      : defaultPoint,
  );

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

  useEffect(() => {
    if (!currentLocation) {
      getUserLocation();
    }
  }, [currentLocation]);

  const getUserLocation = async () => {
    try {
      const position = await requestUserLocationLocation();

      console.log('Position from Radar:', position);
      const latitude = get(position, 'latitude');
      const longitude = get(position, 'longitude');

      dispatch(
        setCurrentLocation({
          latitude,
          longitude,
        }),
      );
    } catch (e) {
      console.log('Can not get the current user location:', e);
    }
  };

  if (error) {
    // return AlertHelper.showError('Server error');
  }

  const searchFilterFunction = useCallback(
    async (centerPoint = null) => {
      const geolocatedPoints =
        searchVal.length && !centerPoint
          ? await geolocateSearchLocation(searchVal)
          : null;

      const {data: newData} = findStoresFromPointWithTitle(
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
      dispatch(getLocations(newData));

      if (newData.length) {
        setCoords({
          ...coords,
          latitude: Number(newData[0].contact.coordinates[0]),
          longitude: Number(newData[0].contact.coordinates[1]),
        });
      }
    },
    [searchVal, arrayHolder],
  );

  useEffect(() => {
    searchFilterFunction();
  }, [searchVal]);

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }

    arrayHolder = get(data, 'storeCollection.items', []);

    return data;
  }, [loading, error, data]);

  const onMarker = (item) => {
    console.log('Item:', item);
    setCoords({
      latitude: Number(get(item, 'contact.coordinates[0]', 34.1434376)),
      longitude: Number(get(item, 'contact.coordinates[1]', -118.2580306)),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    if (item.bookerLocationId) {
      if (selectedLocationId === item.bookerLocationId) {
        setSelectedLocation(-1);
      } else {
        setSelectedLocation(item.bookerLocationId);
      }
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

  return (
    <>
      <BookingTab />
      <MapView
        showsUserLocation
        ref={mapRef}
        initialRegion={coords}
        region={coords}
        style={{
          width,
          height: collapsed ? height : height / 2,
        }}>
        {(allLocations || []).map((e, i) => (
          <CustomMapMarker
            key={i}
            coordinate={{
              latitude: Number(get(e, 'contact.coordinates[0]', 34.1434376)),
              longitude: Number(get(e, 'contact.coordinates[1]', -118.2580306)),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            selected={selectedLocationId === e.bookerLocationId}
            item={e}
            navigation={navigation}
            onClose={() => setSelectedLocation(-1)}
            onPress={() => onMarker(e)}
          />
        ))}
      </MapView>
      {/* )} */}

      {get(data, 'storeCollection') ? (
        <LocationModal
          ref={childRef}
          onSearch={() => searchFilterFunction()}
          onChangeText={(e) => setSearch(e)}
          searchVal={searchVal}
          locationData={arrayHolder}
          onSelect={(item) => setCenter(item)}
          currentLocation={currentLocation}
          setUseCurrentLocation={() =>
            dispatch(setUseCurrentLocation(!useCurrentLocation))
          }
          useCurrentLocation={useCurrentLocation}
          onCollapse={(c) => setCollapsed(c)}
        />
      ) : null}

      {loading || isFavLoad ? <Indicator /> : null}
    </>
  );
};

export default Location;
const styles = StyleSheet.create({
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
