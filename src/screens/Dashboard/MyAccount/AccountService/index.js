import {useQuery} from '@apollo/client';
import AccountServiceItem from 'components/AccountServiceItem';

import DottedView from 'components/DottedView';
import Header from 'components/Header/Header';
import Indicator from 'components/Indicator';
import Button from 'components/Button';

import {screenAddOnsCollections, storeCollectionQuery} from 'constant/query';
import {get} from 'lodash';
import React, {useCallback, useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import rootStyle from 'rootStyle';
import styles from './styles';
import SearchBar from 'components/SearchBar';
import {geolocateSearchLocation} from 'services/Google';
import {findStoresFromPointWithTitle, openMaps} from 'utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from 'constant';
import {useNavigation} from '@react-navigation/native';
import {getServices} from 'services';
import { AlertHelper } from "utils/AlertHelper";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
const {height} = Dimensions.get('window');

const LocationItem = ({item, onSelect}) => {
  const operatingMessage = get(item, 'settings.operatingMessage', '');
  return (
    <View style={styles.storeItemWrapper}>
      <View style={styles.storeTitleWrapper}>
        <View style={{flexDirection: 'row', maxWidth: '50%'}}>
          <Text style={styles.storeTitle}>{get(item, 'title')}</Text>
        </View>
        <Button
          containerStyle={styles.storeSelectButtonContainer}
          titleStyle={styles.storeSelectButtonTitle}
          name="Select"
          onButtonPress={() => {
            onSelect(item);
            AlertHelper.showSuccess(
              'You have selected the shop successfully',
            );
          }}
        />
      </View>
      <View style={styles.storeDec}>
        <View style={styles.storeAddressWrapper}>
          <EvilIcons name="location" size={26} />
          <View>
            <Text>{get(item, 'contact.street1')}</Text>
            <Text style={styles.storeAddress}>
              {get(item, 'contact.city')}, {get(item, 'contact.state')}{' '}
              {get(item, 'contact.postalCode')}
            </Text>
          </View>
        </View>
        {!!operatingMessage && operatingMessage != '' && (
          <View style={styles.information}>
            <Text style={styles.inforText}>{operatingMessage}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const AccountService = ({navigation}) => {
  const SERVICE_QUERY = screenAddOnsCollections();
  const {data, error, loading} = useQuery(SERVICE_QUERY);
  const [searchVal, setSearch] = useState('');
  const LOCATION_QUERY = storeCollectionQuery();
  const {data: locationData} = useQuery(LOCATION_QUERY);
  const [modalData, setModalData] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);

  let topImage = get(
    data,
    'screenProductCollection.items[0].marketingComponentsCollection.items[0]',
  );

  if (get(topImage, 'image')) {
    topImage = topImage.image;
  }
  let bottomImage = get(
    data,
    'screenProductCollection.items[0].marketingComponentsCollection.items[1]',
  );

  if (get(bottomImage, 'image')) {
    bottomImage = bottomImage.image;
  }

  const searchFilterFunction = useCallback(async () => {
    const geolocatedPoints = await geolocateSearchLocation(searchVal);
    const {data: newData} = findStoresFromPointWithTitle(
      get(locationData, 'storeCollection.items', []),
      geolocatedPoints,
      searchVal,
    );
    if (newData.length) {
      setModalData(newData);
      setShowLocationModal(true);
    }
  }, [searchVal, locationData]);

  const getServiceData = useCallback(async () => {
    try {
      const res = await getServices(selectedStore.bookerLocationId);
      const services = res.Treatments;

      const bookerServiceNames = services.map((s) =>
        (s.Name || '').toLowerCase().trim(),
      );
      const bookerServiceIds = services.map((s) => '' + s.ID);

      setUpdatedData(
        get(
          data,
          'screenProductCollection.items[0].productsCollection.items',
          [],
        ).map((item) => {
          let idx = bookerServiceNames.indexOf(
            (item.title || '').toLowerCase().trim(),
          );
          if (idx < 0) {
            idx = bookerServiceIds.indexOf(item.productId);
          }

          if (idx >= 0) {
            return {
              ...item,
              price: services[idx].Price?.Amount || item.price,
              serviceTime: services[idx].TotalDuration || item.serviceTime,
            };
          }

          return item;
        }),
      );
    } catch (e) {}
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore && selectedStore.bookerLocationId) {
      getServiceData();
    }
  }, [selectedStore]);

  return (
    <View style={rootStyle.container}>
      <Header title="SERVICES" isTab isBack />
      <ScrollView>
        <Image
          resizeMode="contain"
          style={styles.topImage}
          source={{
            uri:
              get(topImage, 'mobileMedia.url') ||
              get(topImage, 'desktopMedia.url'),
          }}
        />
        <View style={rootStyle.innerContainer}>
          <Text style={[styles.headingText, {marginTop: 25, marginBottom: 25}]}>
            Select your shop below. Prices vary by location.
          </Text>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.selectedStoreLabel}>Shop Selected:</Text>
              {selectedStore && (
                <Text style={styles.selectedStore}>
                  {get(selectedStore, 'title')}
                </Text>
              )}
            </View>
            <SearchBar
              value={searchVal}
              onChangeText={(i) => setSearch(i)}
              onSearch={searchFilterFunction}
            />
          </View>
          <View style={styles.topContainer}>
            <Text style={styles.headingText}>
              {get(
                data,
                'screenProductCollection.items[0].description.json.content[0].content[0].value',
              )}
            </Text>
            <Text style={styles.descText}>
              {get(
                data,
                'screenProductCollection.items[0].description.json.content[0].content[1].value',
              )}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {(
              updatedData ||
              get(
                data,
                'screenProductCollection.items[0].productsCollection.items',
                [],
              )
            ).map((e, i) => {
              return (
                <AccountServiceItem
                  key={i}
                  item={e}
                  isService
                  navigation={navigation}
                />
              );
            })}
          </View>

          <DottedView number={250} />

          <TouchableOpacity
            onPress={() => navigation.navigate('Book')}
            accessible
            accessibilityLabel="Book"
            accessibilityRole="link">
            <View style={styles.bottomImg}>
              <Image
                style={styles.bottomIcon}
                source={{
                  uri:
                    get(bottomImage, 'mobileMedia.url') ||
                    get(bottomImage, 'desktopMedia.url'),
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading ? <Indicator /> : null}
      <Modal visible={showLocationModal}>
        <View
          style={{
            backgroundColor: Colors.modal_bg,
            height,
            justifyContent: 'center',
            display: 'flex',
          }}>
          <View
            style={{
              marginHorizontal: 40,
              backgroundColor: Colors.bg,
              padding: 10,
              height: 'auto',
              maxHeight: height - 80,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text style={[rootStyle.commonHeader, {fontSize: 25, paddingVertical: 10, lineHeight: 25}]}>
                Select Preferred Shop
              </Text>
              <MaterialCommunityIcons
                name="close"
                size={25}
                style={{marginBottom: 8}}
                color={Colors.header_title}
                onPress={() => setShowLocationModal(false)}
              />
            </View>
            <ScrollView>
              <View>
                <FlatList
                  data={modalData}
                  renderItem={(e) => (
                    <LocationItem
                      {...e}
                      onSelect={(item) => {
                        setShowLocationModal(false);
                        setSelectedStore(item);
                      }}
                    />
                  )}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AccountService;
