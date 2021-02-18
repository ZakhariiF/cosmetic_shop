import React, {useState, useEffect} from 'react';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from '@apollo/client';
import Dialog from 'react-native-dialog';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Header from 'components/Header/Header';
import Button from 'components/Button';
import {Colors, Images} from 'constant';
import {geolocateSearchLocation} from 'services/Google';
import {findStoresFromPointWithTitle} from 'utils';
import {screenBarfly, storeCollectionQuery} from 'constant/query';
import Indicator from 'components/Indicator';
import SearchBar from 'components/SearchBar';
import {getCustomerMembership} from '../thunks';
import {accountActions} from '../ducks';
import rootStyle from 'rootStyle';
import * as API from 'services';

import styles from './styles';

const BarflyMembership = ({navigation}) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const customerMembership = useSelector((state) => state.account.membership);
  const customerLocation = useSelector((state) => state.account.location);

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
  const [selectedMembership, setSelectedMembership] = useState(null);
  const dispatch = useDispatch();

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }
    setMembershipData(get(data, 'barfly.membershipsCollection.items', []));
  }, [loading, error, data]);

  console.log('Membership Data:', data);

  useEffect(() => {
    const customerId = get(userInfo, 'profile.bookerId');
    const locationId = get(customerLocation, 'bookerLocationId');
    if (locationId && customerId) {
      dispatch(getCustomerMembership(customerId, locationId));
    }
  }, [userInfo, customerLocation]);

  useEffect(() => {
    const locationId = get(customerLocation, 'bookerLocationId');
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
  }, [customerLocation, setMembershipDataByLocation]);

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
      setSearchedLocations(newData);
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
    <View>
      <View style={styles.storeTitleWrapper}>
        <Text style={styles.storeTitle}>{get(item, 'title')}</Text>
        <Button
          containerStyle={styles.storeSelectButtonContainer}
          titleStyle={styles.storeSelectButtonTitle}
          name="Select"
          onButtonPress={() => onSelectLocation(item)}
        />
      </View>
      <View style={styles.storeAddress}>
        <EvilIcons name="location" size={26} />
        <View>
          <Text>
            {get(item, 'contact.city')}, {get(item, 'contact.state')},{' '}
            {get(item, 'contact.postalCode')}
          </Text>
          <Text>{get(item, 'contact.street1')}</Text>
        </View>
      </View>
    </View>
  );

  const upgradeMembership = (item) => {
    navigation.navigate('BarflyMembershipEnrollment', {
      membership: item,
      thankMessage: get(data, 'barfly.thankYou'),
    });
  };

  return (
    <View style={rootStyle.container}>
      <Header isTab title="BARFLY MEMBERSHIP" />

      <ScrollView>
        <View style={rootStyle.innerContainer}>
          <View>
            {customerLocation && (
              <Text>{`Selected: ${get(customerLocation, 'title')}`}</Text>
            )}
            <SearchBar
              value={search}
              onChangeText={setSearchKey}
              onSearch={searchFilterFunction}
            />

            <View>
              <Dialog.Container
                visible={searchedLocations && searchedLocations.length > 0}>
                <Dialog.Title>Select Preferred Store</Dialog.Title>
                <ScrollView>
                  <View>
                    <FlatList
                      data={searchedLocations}
                      contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
                      renderItem={({item}) => (
                        <LocationItem item={item} key={item.bookerLocationId} />
                      )}
                    />
                  </View>
                </ScrollView>
                <Dialog.Button
                  color="black"
                  label="Close"
                  onPress={closeSelectionLocationDialog}
                />
                {/* <Dialog.Button label="" onPress={handleDelete} /> */}
              </Dialog.Container>
            </View>
          </View>

          <View style={styles.barflyContainer}>
            <Text style={styles.barfly}>Barfly Membership Options</Text>
          </View>

          <View
            style={[
              styles.topContainer,
            ]}>

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
              <Button
                name="Select"
                containerStyle={styles.buttonContainer}
                disabled={
                  customerMembership &&
                  customerMembership.ID ===
                    get(membershipDataByLocation, '[0].ID')
                }
                onButtonPress={() => upgradeMembership(get(membershipDataByLocation, '[0]'))}
              />
            </View>
          </View>

          <View style={rootStyle.seprator} />

          <View
            style={[
              styles.topContainer,
              {marginTop: 15},
            ]}>

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

              <Button
                name="Select"
                containerStyle={styles.buttonContainer}
                disabled={
                  customerMembership &&
                  customerMembership.ID ===
                    get(membershipDataByLocation, '[1].ID')
                }
                onButtonPress={() => upgradeMembership(get(membershipDataByLocation, '[1]'))}
              />
            </View>
          </View>

          {/*<Button*/}
          {/*  name="Upgrade to Premium"*/}
          {/*  containerStyle={styles.buttonContainer}*/}
          {/*  disabled={!selectedMembership}*/}
          {/*  onButtonPress={upgradeMembership}*/}
          {/*/>*/}

          <Text style={styles.cancelMembership}>Cancel Membership</Text>
        </View>
      </ScrollView>

      {loading || locationLoading ? <Indicator /> : null}
    </View>
  );
};

export default BarflyMembership;
