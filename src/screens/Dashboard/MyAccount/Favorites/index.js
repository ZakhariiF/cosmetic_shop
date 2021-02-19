import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList} from 'react-native';
import Header from 'components/Header/Header';
import SearchBar from 'components/SearchBar';
import rootStyle from 'rootStyle';
import FavoriteItem from './FavoriteItem';
import styles from './styles';
import {useQuery} from '@apollo/client';
import {storeCollectionQuery} from 'constant/query';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import Indicator from 'components/Indicator';
import {setFavoriteStore} from 'screens/Auth/thunks';
import FavoriteSearchItem from './FavoriteSearchItem';
import {setFavoriteLocation} from 'screens/Dashboard/Booking/thunks';
import {types} from 'screens/Dashboard/Booking/ducks';
import {requestUserLocationLocation, findStoresFromPointWithTitle} from 'utils';
import {geolocateSearchLocation} from 'services/Google';

var arrayHolder = [];

const Favorites = () => {
  const dispatch = useDispatch();
  const favStore = useSelector((state) => state.auth.favItem);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isFavLoad = useSelector((state) => state.booking.isFavLoading);
  const [locData, setLocData] = useState([]);
  const [selectedFav, setSelectedFav] = useState(null);
  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);
  const [currentLocation, setCurrentLocation] = useState(null);

  const getUserLocation = async () => {
    try {
      const position = await requestUserLocationLocation();
      const latitude = get(position, 'coords.latitude');
      const longitude = get(position, 'coords.longitude');

      setCurrentLocation({
        latitude,
        longitude,
      });
    } catch (e) {
      console.log('Can not get the current user location');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (search.length && count > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setCount(0);
    }
  }, [search, count]);

  useEffect(() => {
    if (favStore && arrayHolder.length) {
      let filterItem = arrayHolder.find((e) => e.bookerLocationId == favStore);
      setSelectedFav(filterItem);
    }
  }, [favStore]);

  if (error) {
  }

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }

    arrayHolder = get(data, 'storeCollection.items', []);

    setLocData(get(data, 'storeCollection.items', []));

    if (favStore && arrayHolder.length) {
      let filterItem = arrayHolder.find((e) => e.bookerLocationId == favStore);
      setSelectedFav(filterItem);
    }
  }, [loading, error, data]);

  const searchFilterFunction = useCallback(async () => {
    if (search.length) {
      const geopositions = await geolocateSearchLocation(search);
      const {data: newData} = findStoresFromPointWithTitle(
        arrayHolder,
        geopositions,
        search,
      );
      setLocData(newData);
      setCount(count + 1);
    }
  }, [arrayHolder, search]);

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
    <View style={rootStyle.container}>
      <Header title="FAVORITE SHOP" isTab />

      <View style={rootStyle.innerContainer}>
        <Text style={styles.headerTitle}>YOUR FAVORITE SHOP</Text>

        {selectedFav ? (
          <FavoriteItem item={selectedFav} currentLocation={currentLocation} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You have not selected a favorite Drybar Shop.
            </Text>
          </View>
        )}

        <Text style={styles.favShop}>CHANGE FAVORITE SHOP</Text>
        <SearchBar
          value={search}
          onChangeText={(e) => setSearch(e)}
          onSearch={searchFilterFunction}
        />

        {isVisible ? (
          <FlatList
            data={locData}
            renderItem={({item}) => (
              <FavoriteSearchItem
                item={item}
                onFavIcon={onFav}
                isFav={get(item, 'bookerLocationId') == favStore}
                currentLocation={currentLocation}
              />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        ) : null}
      </View>
      {loading || isFavLoad ? <Indicator /> : null}
    </View>
  );
};

export default Favorites;
