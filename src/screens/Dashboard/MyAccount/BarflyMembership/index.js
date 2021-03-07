import React, {useState, useEffect} from 'react';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {
  ScrollView,
  View,
  Image,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useQuery} from '@apollo/client';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Header from 'components/Header/Header';
import Button from 'components/Button';
import {Colors, Images} from 'constant';
import {geolocateSearchLocation} from 'services/Google';
import {findStoresFromPointWithTitle, openMaps} from 'utils';
import {screenBarfly, storeCollectionQuery} from 'constant/query';
import Indicator from 'components/Indicator';
import SearchBar from 'components/SearchBar';
import {getCustomerMembership} from '../thunks';
import {accountActions} from '../ducks';
import rootStyle from 'rootStyle';
import * as API from 'services';

import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AlertHelper} from 'utils/AlertHelper';

const BarflyMembership = ({navigation}) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const customerMembership = useSelector((state) => state.account.membership);
  const customerMembershipLocation = useSelector(
    (state) => state.account.location,
  );

  const BARFLY_QUERY = screenBarfly();
  const {data, error, loading} = useQuery(BARFLY_QUERY);

  const LOCATION_QUERY = storeCollectionQuery();
  const {
    data: locationData,
    error: locationError,
    loading: locationLoading,
  } = useQuery(LOCATION_QUERY);

  const [membershipData, setMembershipData] = useState([]);
  const [membershipDataByLocation, setMembershipDataByLocation] = useState([]);
  const [search, setSearch] = useState('');
  const [searchedLocations, setSearchedLocations] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const dispatch = useDispatch();

  const customerMembershipLevelId = get(
    customerMembership,
    'MembershipBenefit.MembershipLevelID',
  );

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }
    setMembershipData(get(data, 'barfly.membershipsCollection.items', []));
  }, [loading, error, data]);

  useEffect(() => {
    const customerId = get(userInfo, 'bookerID');
    const locationId = get(
      locationData,
      'storeCollection.items[0].bookerLocationId',
    );
    if (locationId && customerId) {
      dispatch(getCustomerMembership(customerId, locationId));
    }
  }, [userInfo, locationData]);

  useEffect(() => {
    const locationId = get(customerMembershipLocation, 'bookerLocationId');
    if (locationId) {
      API.findMembershipByLocation(locationId).then(
        ({data: membershipsData}) => {
          const memberships = membershipsData.Results.sort(
            (a, b) =>
              get(a, 'MembershipBillableItem.Price.Amount', 0) -
              get(b, 'MembershipBillableItem.Price.Amount', 0),
          );
          setMembershipDataByLocation(memberships);
        },
      );
    }
  }, [customerMembershipLocation, setMembershipDataByLocation]);

  const setSearchKey = (e) => {
    setSearch(e);
  };

  const searchFilterFunction = async () => {
    const locationArray = get(locationData, 'storeCollection.items', []);
    if (locationArray.length) {
      const geolocatedPoints = await geolocateSearchLocation(search);
      const {data: newData} = findStoresFromPointWithTitle(
        locationArray,
        geolocatedPoints,
        search,
      );

      if (newData.length) {
        setShowLocationModal(true);
        setSearchedLocations(newData);
      }
    }
  };

  const closeSelectionLocationDialog = () => {
    setSearchedLocations([]);
  };

  const onSelectLocation = (item) => {
    closeSelectionLocationDialog();
    dispatch(accountActions.setMembershipLocation(item));
  };

  const LocationItem = ({item}) => (
    <View style={styles.storeItemWrapper}>
      <View style={styles.storeTitleWrapper}>
        <View>
          <TouchableOpacity
            onPress={() => {
              setShowLocationModal(false);
              navigation.navigate('ShopDetail', {item});
            }}
            style={styles.favIcon}>
            <Image source={Images.notice} />
          </TouchableOpacity>
        </View>
        <Text style={styles.storeTitle}>{get(item, 'title')}</Text>
        <Button
          containerStyle={styles.storeSelectButtonContainer}
          titleStyle={styles.storeSelectButtonTitle}
          name="Select"
          onButtonPress={() => onSelectLocation(item)}
        />
      </View>
      <View style={styles.storeDec}>
        <View style={styles.storeAddressWrapper}>
          <EvilIcons name="location" size={26} />
          <View>
            <Text style={styles.storeAddress}>
              {get(item, 'contact.city')}, {get(item, 'contact.state')},{' '}
              {get(item, 'contact.postalCode')}
            </Text>
            <Text>{get(item, 'contact.street1')}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            openMaps(
              get(item, 'title'),
              get(item, 'contact.coordinates[0]'),
              get(item, 'contact.contact.coordinates[1]'),
            )
          }>
          <Text style={styles.storeDirection}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const upgradeMembership = (item) => {
    if (customerMembershipLocation) {
      navigation.navigate('BarflyMembershipEnrollment', {
        membership: item,
        thankMessage: get(data, 'barfly.thankYou'),
      });
    } else {
      AlertHelper.showError(
        'Please select a store first, prices vary by location.',
      );
    }
  };

  return (
    <View style={rootStyle.container}>
      <Header isTab title="BARFLY MEMBERSHIP" />

      <ScrollView>
        <View style={rootStyle.innerContainer}>
          <View>
            {customerMembershipLocation && (
              <Text>{`Selected: ${get(
                customerMembershipLocation,
                'title',
              )}`}</Text>
            )}
            <SearchBar
              value={search}
              onChangeText={setSearchKey}
              onSearch={searchFilterFunction}
            />

            <Modal visible={showLocationModal}>
              <View style={{backgroundColor: Colors.modal_bg}}>
                <View
                  style={{margin: 40, backgroundColor: Colors.bg, padding: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      Select Preferred Store
                    </Text>
                    <MaterialCommunityIcons
                      name="close"
                      size={25}
                      color={Colors.header_title}
                      onPress={() => setShowLocationModal(false)}
                    />
                  </View>
                  <ScrollView>
                    <View>
                      <FlatList
                        data={searchedLocations}
                        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
                        renderItem={({item}) => (
                          <LocationItem
                            item={item}
                            key={item.bookerLocationId}
                          />
                        )}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>

          {customerMembership && (
            <View>
              <View style={styles.barflyContainer}>
                <Text style={styles.barfly}>Your Membership</Text>

                <Text style={styles.customerMembershipTitle}>
                  {customerMembershipLevelId === 53809
                    ? 'The Signature'
                    : 'The Premium'}
                </Text>

                <View style={styles.billContainer}>
                  <Text>
                    Next bill date:
                    {moment(
                      get(customerMembership, 'NextChargeDateOffset'),
                    ).format('MM/DD/YYYY')}
                  </Text>
                  <Text>
                    Last bill date:
                    {moment(
                      get(customerMembership, 'LastChargeDateOffset'),
                    ).format('MM/DD/YYYY')}
                  </Text>
                </View>
              </View>
              <View style={styles.barflyContainer}>
                <Text style={styles.barfly}>
                  {get(customerMembership, 'AvailableQuantity')} Barfly
                  Membership Benefits Available
                </Text>
              </View>
            </View>
          )}

          <View style={styles.barflyContainer}>
            <Text style={styles.barfly}>Barfly Membership Options</Text>
          </View>

          <View style={[styles.topContainer]}>
            <Image style={styles.heart} source={Images.square_heart} />
            <View style={styles.headerContainer}>
              <View style={styles.dottBorderContainer}>
                <Text style={styles.headingText}>
                  {get(membershipData, '[0].title', '')}
                </Text>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <ImageBackground
                resizeMode="contain"
                source={Images.tip_img}
                style={styles.tipImg}>
                <Text style={styles.blowText}>
                  {get(membershipData, '[0].subtitle', '')}
                </Text>
              </ImageBackground>

              <Text style={styles.plus}>- PLUS -</Text>

              {get(membershipData, '[0].benefitsCollection.items', []).map(
                (e, i) => {
                  return (
                    <View key={i} style={styles.plusContainer}>
                      <Text style={styles.percentageText}>{e.name}</Text>
                      <Text style={styles.desc}>{e.value}</Text>
                    </View>
                  );
                },
              )}

              <Text style={styles.price}>
                $
                {get(
                  membershipDataByLocation,
                  '[0].MembershipBillableItem.Price.Amount',
                ) || get(membershipData, '[0].price', '')}{' '}
                <Text style={styles.monthText}> / month</Text>
              </Text>
              <Text style={styles.tax}>+ tax (where applicable)</Text>
              {![53809, 102304].includes(customerMembershipLevelId) && (
                <Button
                  name="Select"
                  containerStyle={styles.buttonContainer}
                  onButtonPress={() =>
                    upgradeMembership(get(membershipDataByLocation, '[0]'))
                  }
                />
              )}

              {customerMembershipLevelId === 53809 && (
                <Text style={{marginVertical: 15, paddingVertical: 10}}>
                  Your Current Plan
                </Text>
              )}
            </View>
          </View>

          <View style={rootStyle.seprator} />

          <View style={[styles.topContainer, {marginTop: 15}]}>
            <Image style={styles.heart} source={Images.black_heart} />
            <View
              style={[
                styles.headerContainer,
                {backgroundColor: Colors.header_title},
              ]}>
              <View style={styles.dottBorderContainer}>
                <Text style={[styles.headingText, {color: Colors.white}]}>
                  {get(membershipData, '[1].title', '')}
                </Text>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <ImageBackground
                resizeMode="contain"
                source={Images.tip_img}
                style={styles.tipImg}>
                <Text style={styles.blowText}>
                  {get(membershipData, '[1].subtitle', '')}H
                </Text>
              </ImageBackground>

              <Text style={styles.plus}>- PLUS -</Text>

              {get(membershipData, '[1].benefitsCollection.items', []).map(
                (e, i) => {
                  return (
                    <View key={i} style={styles.plusContainer}>
                      <Text style={styles.percentageText}>{e.name}</Text>
                      <Text style={styles.desc}>{e.value}</Text>
                    </View>
                  );
                },
              )}

              <Text style={styles.price}>
                $
                {get(
                  membershipDataByLocation,
                  '[1].MembershipBillableItem.Price.Amount',
                ) || get(membershipData, '[1].price', '')}{' '}
                <Text style={styles.monthText}> / month</Text>
              </Text>
              <Text style={styles.tax}>+ tax (where applicable)</Text>
              {customerMembershipLevelId !== 112304 ? (
                <Button
                  name={
                    customerMembershipLevelId === 53809
                      ? 'Upgrade to Premium'
                      : 'Select'
                  }
                  containerStyle={styles.buttonContainer}
                  onButtonPress={() =>
                    upgradeMembership(get(membershipDataByLocation, '[1]'))
                  }
                />
              ) : (
                <Text style={{marginVertical: 15, paddingVertical: 10}}>
                  Your Current Plan
                </Text>
              )}
            </View>
          </View>

          {/*<Button*/}
          {/*  name="Upgrade to Premium"*/}
          {/*  containerStyle={styles.buttonContainer}*/}
          {/*  disabled={!selectedMembership}*/}
          {/*  onButtonPress={upgradeMembership}*/}
          {/*/>*/}
          {customerMembershipLevelId && (
            <Text style={styles.cancelMembership}>Cancel Membership</Text>
          )}
        </View>
      </ScrollView>

      {loading || locationLoading ? <Indicator /> : null}
    </View>
  );
};

export default BarflyMembership;
