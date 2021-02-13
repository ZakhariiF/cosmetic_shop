import React, { useEffect, useState, useRef, useCallback } from "react";
import {useDispatch, useSelector} from 'react-redux';
import MapView from 'react-native-maps';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import { findStoresFromPointWithTitle, isEmptyString } from "utils";
import {FlatList, View, StyleSheet} from 'react-native';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import {Colors, Fonts} from 'constant';
import Header from 'components/Header/Header';
import LocationItem from 'components/LocationItem';
import EmptyContainer from 'components/EmptyContainer';
import rootStyle from 'rootStyle';
import SearchBar from 'components/SearchBar';
import { getLocations, setFavoriteLocation } from "screens/Dashboard/Booking/thunks";
import {setFavoriteStore} from 'screens/Auth/thunks';
import {types} from 'screens/Dashboard/Booking/ducks';
import CustomMapMarker from "components/CustomMapMarker";
import { geolocateSearchLocation } from "services/Google";

var arrayHolder = [];

const FindLocation = ({navigation}) => {
  const dispatch = useDispatch();
  const [searchVal, setSearch] = useState('');
  const [locationItems, setLocationItems] = useState([]);
  const customerInfo = useSelector((state) => state.auth.customerInfo);
  const isFavLoad = useSelector((state) => state.booking.isFavLoading);
  const favItem = useSelector((state) => state.auth.favItem);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);
  const mapRef = useRef(null);
  const [markerIndex, setMarker] = useState(-1);

  const [coords, setCoords] = useState({
    latitude: 34.070528,
    longitude: -84.2795478,
    latitudeDelta: 0.015 * 8,
    longitudeDelta: 0.0121 * 8,
  });

  if (error) {
    // return AlertHelper.showError('Server error');
  }

  useEffect(() => {
    if (isEmptyString(searchVal)) {
      setLocationItems(arrayHolder);
    }
  }, [searchVal]);

  React.useMemo(() => {
    if (loading || error) return null;

    arrayHolder = get(data, 'storeCollection.items', []);

    setLocationItems(arrayHolder);

    return data;
  }, [loading, error, data]);


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

  const searchFilterFunction = useCallback(async () => {

    const geolocatedPoints = await geolocateSearchLocation(searchVal)

    const {data: newData} = findStoresFromPointWithTitle(arrayHolder, geolocatedPoints, searchVal)
    setLocationItems(newData)

    if (newData.length) {
      setCoords({
        latitude: Number(get(newData, '[0].contact.coordinates[0]', 34.1434376)),
        longitude: Number(get(newData, '[0].contact.coordinates[1]', -118.2580306)),
        latitudeDelta: 0.015 * 8,
        longitudeDelta: 0.0121 * 8,
      });
    }

  }, [searchVal, arrayHolder]);

  const onFav = (item) => {
    const obj = {
      userId: get(userInfo, 'profile.bookerId', ''),
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
        // customMapStyle={mapStyle}
        // provider={PROVIDER_GOOGLE}
        provider={null}
        ref={mapRef}
        style={{
          flex: 1,
        }}
        initialRegion={coords}
        region={coords}>
        {arrayHolder.map((e, i) => (
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
        ))}
      </MapView>
      <View style={rootStyle.innerContainer}>
        <SearchBar
          value={searchVal}
          onChangeText={(i) => setSearch(i)}
          onSearch={searchFilterFunction}
        />
        <FlatList
          data={locationItems}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
          renderItem={(e) => (
            <LocationItem
              {...e}
              isViewMode
              fromFindLoc
              navigation={navigation}
              customerInfo={customerInfo}
              onFavIcon={onFav}
              isFav={get(e, 'item.bookerLocationId') == favItem}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={() => (
            <EmptyContainer emptyText="No Data Found" />
          )}
          extraData={[locationItems, searchVal]}
        />
      </View>
      {loading || isFavLoad ? <Indicator /> : null}
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
