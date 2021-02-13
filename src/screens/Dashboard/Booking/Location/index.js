import React, {useEffect, useRef, useState, useCallback} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {mapStyle} from 'constant/Mapstyle';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import CustomMapMarker from 'components/CustomMapMarker';
import {useDispatch, useSelector} from 'react-redux';
import {getLocations, setLocation} from '../thunks';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import {requestUserLocationLocation, findStoresFromPointWithTitle} from 'utils';
import {geolocateSearchLocation} from 'services/Google';
import {Dimensions} from 'react-native';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';
// import { getDistance, getPreciseDistance } from 'geolib'
const window = Dimensions.get('window');
const {width, height} = window;

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var arrayHolder = [];

const Location = ({navigation}) => {
  const [coords, setCoords] = useState({
    latitude: 40.7374255,
    longitude: -73.9933342812529,
    latitudeDelta: 0.015 * 8,
    longitudeDelta: 0.0121 * 8,
  });

  const dispatch = useDispatch();
  const childRef = useRef(null);
  const mapRef = useRef(null);
  const [markerIndex, setMarker] = useState(-1);
  const [searchVal, setSearch] = useState('');
  const allLocations = useSelector((state) => state.booking.locations);
  const isFavLoad = useSelector((state) => state.booking.isFavLoading);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);

  useEffect(() => {
    getUserLocation();
  }, []);

  if (error) {
    // return AlertHelper.showError('Server error');
  }

  const searchFilterFunction = useCallback(async () => {
    const geolocatedPoints = await geolocateSearchLocation(searchVal);

    const {data: newData} = findStoresFromPointWithTitle(
      arrayHolder,
      geolocatedPoints,
      searchVal,
      {
        lat: coords.latitude,
        lng: coords.longitude,
      },
    );
    dispatch(getLocations(newData));

    if (newData.length) {
      setCoords({
        ...coords,
        latitude: newData[0].contact.coordinates[0],
        longitude: newData[0].contact.coordinates[1],
      });
    }
  }, [searchVal, arrayHolder]);

  useEffect(() => {
    searchFilterFunction();
  }, [searchVal, searchFilterFunction]);

  const cachedMutatedData = React.useMemo(() => {
    if (loading || error) {
      return null;
    }

    arrayHolder = get(data, 'storeCollection.items', []);

    dispatch(getLocations(data.storeCollection.items));
    return data;
  }, [loading, error, data]);

  const getUserLocation = async () => {
    try {
      const position = await requestUserLocationLocation();
      const latitude = get(position, 'coords.latitude');
      const longitude = get(position, 'coords.longitude');
      setCoords({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } catch (e) {
      console.log('Can not get the current user location');
    }
  };

  const onMarker = (item, i) => {
    // childRef.current.onMin();
    setCoords({
      latitude: Number(get(item, 'contact.coordinates[0]', 34.1434376)),
      longitude: Number(get(item, 'contact.coordinates[1]', -118.2580306)),
      latitudeDelta: 0.015 * 8,
      longitudeDelta: 0.0121 * 8,
    });

    if (markerIndex === i) {
      setMarker(-1);
    } else {
      setMarker(i);
    }
  };

  return (
    <>
      <BookingTab />
      <MapView
        showsUserLocation
        // customMapStyle={mapStyle}
        // provider={PROVIDER_GOOGLE}
        provider={null}
        ref={mapRef}
        style={{
          flex: 1,
        }}
        initialRegion={coords}
        region={coords}>
        {get(data, 'storeCollection')
          ? allLocations.map((e, i) => (
              <MapView.Marker
                key={i}
                coordinate={{
                  latitude: Number(
                    get(e, 'contact.coordinates[0]', 34.1434376),
                  ),
                  longitude: Number(
                    get(e, 'contact.coordinates[1]', -118.2580306),
                  ),
                  latitudeDelta: 0.015 * 8,
                  longitudeDelta: 0.0121 * 8,
                }}
                animation
                onPress={() => onMarker(e, i)}>
                <CustomMapMarker
                  selected={markerIndex === i}
                  item={e}
                  navigation={navigation}
                />
              </MapView.Marker>
            ))
          : null}
      </MapView>

      {get(data, 'storeCollection') ? (
        <LocationModal
          ref={childRef}
          selectedIndex={markerIndex}
          onSearch={() => searchFilterFunction()}
          onChangeText={(e) => setSearch(e)}
          searchVal={searchVal}
          locationData={arrayHolder}
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
