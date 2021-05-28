import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from 'components/Header/Header';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import {useDispatch, useSelector} from 'react-redux';
import {
  findAddons,
  getAddons,
  setActiveGuestTab,
  setExtensionType,
  setmemberCount,
} from '../thunks';
import GuestTab from 'components/GuestTab';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import Extensions from '../Extensions';
import {get} from 'lodash';
import Indicator from 'components/Indicator';
import ServiceInfoModal from 'components/ServiceInfoModal';
import {productionInformationByReference} from 'constant/query';
import {useQuery} from '@apollo/client';

const Addons = ({navigation}) => {
  const [isVisible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const activeTab = useSelector((state) => state.booking.activeGuestTab);
  const isExtension = useSelector((state) => state.booking.isExtension);
  const data = useSelector((state) => state.booking.addons);
  const isLoading = useSelector((state) => state.booking.addonsLoading);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );

  const [totalAddon, setTotaladdons] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [infoItem, setinfoItem] = useState({});

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    calculateAddon();
    if (!totalGuests.find((s) => s.services.Name !== 'Dry Styling')) {
      dispatch(setExtensionType(true));
    }
  }, [totalGuests]);

  const getData = useCallback(() => {
    const locationId = get(selectedLocation, 'bookerLocationId');
    if (locationId) {
      dispatch(findAddons(locationId));
    } else {
      navigation.navigate('Book', {
        screen: 'Location',
      });
    }
  }, [selectedLocation]);

  const calculateAddon = () => {
    let addonARR = get(totalGuests, `[${activeTab}].addons`) || [];
    let totalPrice = addonARR.reduce(
      (acc, e) => acc + get(e, 'PriceInfo.Amount', 0),
      0,
    );
    setTotaladdons(addonARR.length);
    setTotalPrice(totalPrice);
  };

  const isExist = (item) => {
    let isActive = false;

    if (totalGuests[activeTab].addons && totalGuests[activeTab].addons.length) {
      totalGuests[activeTab].addons.forEach((element) => {
        if (element.ServiceID === item.ServiceID) {
          isActive = true;
        }
      });
    }

    return isActive;
  };

  const addonPress = (item, index) => {
    let tempArr = [...totalGuests];

    if (!tempArr[activeTab].addons) {
      tempArr[activeTab].addons = [];
    }

    if (isExist(item)) {
      let addonARR = tempArr[activeTab].addons;
      addonARR = addonARR.filter((e) => e.ServiceID !== item.ServiceID);
      tempArr[activeTab].addons = addonARR;
    } else {
      tempArr[activeTab].addons.push(item);
    }

    dispatch(setmemberCount(tempArr));
  };

  const onSkip = () => {
    let tempArr = totalGuests.map((g) => ({
      ...g,
      addons: undefined,
    }));
    dispatch(setmemberCount(tempArr));
    dispatch(setExtensionType(true));
  };

  const onBackPress = () => {
    if (isExtension) {
      dispatch(setExtensionType(false));
    } else {
      navigation.navigate('Book', {screen: 'Services'});
    }
  };

  const onNext = () => {
    if (!isExtension) {
      dispatch(setActiveGuestTab(0));
      dispatch(setExtensionType(true));
    } else {
      navigation.navigate('DateTime');
      dispatch(setExtensionType(false));
    }
  };

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <Header
        title={
          isExtension && totalGuests.length > 1
            ? 'DO YOU OR ANY OF YOUR \n GUESTS HAVE EXTENSIONS?'
            : isExtension
            ? 'DO YOU HAVE EXTENSIONS?'
            : 'ADD-ONS'
        }
        safeBackColor={Colors.bg}
        onBackPress={onBackPress}
        isNext={!isExtension}
        onNext={onNext}
      />

      {isExtension ? (
        <Extensions navigation={navigation} onNext={onNext} />
      ) : (
        <View style={rootStyle.innerContainer}>
          <TouchableOpacity
            style={styles.skipContainer}
            onPress={onSkip}
            accessible
            accessibilityLabel="Skip Add-Ons"
            accessibilityRole="button">
            <Text style={styles.skip}>Skip Add-Ons</Text>
          </TouchableOpacity>
          {totalGuests.length > 1 ? (
            <Text style={styles.selectedaddOns}>Add one or add many</Text>
          ) : totalAddon ? (
            <Text style={styles.selectedaddOns}>
              You selected <Text style={styles.selectedText}>{totalAddon}</Text>{' '}
              add-ons for a total of ${totalPrice}
            </Text>
          ) : null}

          {totalGuests.length > 1 ? (
            <View>
              <GuestTab routeName="addons" />
            </View>
          ) : null}
          {get(totalGuests[activeTab], 'services.Name') === 'Dry Styling' ? (
            <Text style={styles.doesnotOfferText}>
              Dry Styling does not offer any add-ons.
            </Text>
          ) : (
            <FlatList
              style={{marginTop: 20, marginBottom: '20%'}}
              data={data}
              renderItem={(e) => (
                <AddonItem
                  {...e}
                  totalGuests={totalGuests}
                  onAddon={addonPress}
                  active={(totalGuests[activeTab]?.addons || []).find(
                    (a) => a.ServiceID === e.item.ServiceID,
                  )}
                  onInfoPress={(itemz) => {
                    setVisible(true);
                    setinfoItem(itemz);
                  }}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          )}
        </View>
      )}

      <LocationModal />

      {isVisible && (
        <ServiceInfoModal
          visible={isVisible}
          item={infoItem}
          onRequestClose={() => setVisible(false)}
        />
      )}

      {isLoading && !isExtension ? <Indicator /> : null}
    </View>
  );
};

export default Addons;

const AddonItem = ({
  item,
  index,
  totalGuests,
  onAddon,
  active,
  onInfoPress,
}) => {
  const PRODUCT_INFO_QUERY = productionInformationByReference(
    item.ServiceName.trim(),
  );
  const {data, error, loading} = useQuery(PRODUCT_INFO_QUERY);

  const information = get(data, 'productCollection.items', []);

  return (
    <View style={styles.listContainer}>
      <TouchableOpacity
        onPress={() => {
          if (information.length) {
            if (information.length > 0) {
              onInfoPress({
                content: information[0],
                service: item,
              });
            }
          }
        }}
        accessible={!!onInfoPress}
        accessibilityLabel={'View Detail'}
        accessibilityRole="button"
        hitSlop={{
          top: 10,
          bottom: 10,
          right: 10,
          left: 10,
        }}>
        <Image
          source={Images.notice}
          style={{opacity: information.length ? 1 : 0}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.listButton, rootStyle.shadow]}
        onPress={() => onAddon(item, index)}
        accessible
        accessibilityLabel={`Toggle ${item.ServiceName} Add-on`}
        accessibilityRole="button">
        <View style={{flex: 1, paddingRight: 15}}>
          <Text style={styles.itemName}>{item.ServiceName}</Text>
          <Text style={styles.itemDesc}>{item.Description}</Text>

          <Text style={styles.price}>${get(item, 'PriceInfo.Amount', 0)}</Text>
        </View>

        <View
          style={[styles.circle, active && {backgroundColor: Colors.primary}]}>
          <Image source={Images.tick} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedaddOns: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    alignSelf: 'center',
    marginBottom: 20,
  },
  selectedText: {
    fontFamily: Fonts.AvenirNextBold,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  listButton: {
    width: '89%',
    backgroundColor: Colors.white,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  itemDesc: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 3,
  },
  circle: {
    height: 26,
    width: 26,
    borderWidth: 1,
    borderColor: Colors.header_title,
    borderRadius: 26 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  price: {
    fontFamily: Fonts.AvenirNextMedium,
    fontSize: 18,
    color: Colors.header_title,
    marginTop: 2,
  },
  skipContainer: {
    width: '85%',
    borderWidth: 1,
    borderColor: Colors.dimGray,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: '11%',
    marginBottom: 20,
  },
  skip: {
    ...rootStyle.commonText,
    fontSize: 18,
  },
  doesnotOfferText: {
    ...rootStyle.commonText,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
});
