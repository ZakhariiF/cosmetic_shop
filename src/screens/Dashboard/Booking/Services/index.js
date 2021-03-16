import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import MParticle from 'react-native-mparticle';
import {useQuery} from '@apollo/client';
import Header from 'components/Header/Header';
import rootStyle from 'rootStyle';
import CheckBox from 'components/Checkbox';
import {Colors, Fonts} from 'constant';
import {productInformationCollection, productionInformationByReference} from 'constant/query';
import GuestTab from 'components/GuestTab';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import { getServices, setActiveGuestTab, setmemberCount } from "../thunks";
import {get} from 'lodash';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import Indicator from 'components/Indicator';
import ServiceInfoModal from 'components/ServiceInfoModal';
import BookingHeader from "components/BookingHeader";

const Services = ({navigation}) => {
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const activeUser = useSelector((state) => state.booking.activeGuestTab);
  const data = useSelector((state) => state.booking.services);
  const isLoading = useSelector((state) => state.booking.serviceLoading);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const [isChecked, setChecked] = useState(false);
  const [isInfo, setInfo] = useState(false);
  const [infoItem, setinfoItem] = useState({});

  useEffect(() => {
    if (selectedLocation && selectedLocation.bookerLocationId) {
      getData();
    } else {
      navigation.navigate('Book', {
        Screen: 'Location',
      });
    }
  }, [selectedLocation]);

  const getData = useCallback(() => {
    const selectedLocationId = get(selectedLocation, 'bookerLocationId', '');
    if (selectedLocationId) {
      dispatch(getServices(selectedLocationId));
    }
  }, [selectedLocation]);

  const onServiceList = (item) => {
    MParticle.logEvent('Select Service', MParticle.EventType.Other, {
      'Source Page': 'Select Service',
      'Service Name': get(item, 'Name'),
    });
    let tempArr = [...totalGuests];

    if (!isChecked) {
      tempArr = tempArr.map((user) => ({
        ...user,
        services: item,
      }));
    } else {
      tempArr[activeUser].services = item;
    }

    dispatch(setmemberCount(tempArr));
    // onNext(tempArr);
  };

  const onNext = useCallback(() => {
    let isServices = totalGuests.every((e) => e.services);
    if (isServices) {
      dispatch(setActiveGuestTab(0));
      navigation.navigate('Addons');
    } else {
      Alert.alert('Warning', 'Please make selection for all guests.');
    }
  }, [totalGuests]);

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <BookingHeader
        title="WHAT SERVICE?"
        safeBackColor={Colors.bg}
        isNext
        onNext={onNext}
      />
      <View style={rootStyle.innerContainer}>
        <FlatList
          style={{marginBottom: '20%'}}
          contentContainerStyle={styles.flatContainer}
          data={data}
          renderItem={(e) => (
            <ServiceItem
              {...e}
              totalGuests={totalGuests}
              onService={onServiceList}
              activeUser={activeUser}
              onInfo={(item) => {
                setInfo(true);
                setinfoItem(item);
              }}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <>
              {totalGuests.length > 1 ? (
                <CheckBox
                  isChecked={isChecked}
                  onPressed={() => setChecked(!isChecked)}
                  title="My guests and I will be will be getting different services"
                />
              ) : null}

              {isChecked && totalGuests.length > 1 ? (
                <GuestTab routeName="Services" />
              ) : null}

              {!isChecked && totalGuests.length > 1 ? (
                <View style={[styles.seprator, {marginBottom: 20}]} />
              ) : null}
            </>
          )}
        />
      </View>

      <LocationModal />

      {isLoading ? <Indicator /> : null}
      {isInfo ? (
        <ServiceInfoModal
          visible={isInfo}
          item={infoItem}
          onRequestClose={() => setInfo(false)}
        />
      ) : null}
    </View>
  );
};

export default Services;

const ServiceItem = ({
  item,
  index,
  totalGuests,
  onService,
  activeUser,
  onInfo,
}) => {
  const PRODUCT_INFO_QUERY = productionInformationByReference(item.Name);
  const {data, error, loading} = useQuery(PRODUCT_INFO_QUERY);

  const isExist = (item) => {
    let isActive = false;

    if (get(totalGuests[activeUser], 'services')) {
      let guest = totalGuests[activeUser];
      if (get(guest?.services, 'ID') === item.ID) {
        isActive = true;
      }
    }

    return isActive;
  };

  const information = get(data, 'productCollection.items', []);

  return (
    <View style={styles.listContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={20}
        style={
          information.length > 0
            ? styles.noticeIcon
            : [styles.noticeIcon, {opacity: 0}]
        }
        color={Colors.header_title}
        onPress={() => {
          if (information.length > 0) {
            onInfo({
              content: information[0],
              service: item,
            });
          }
        }}
      />

      <TouchableOpacity
        style={[
          styles.listButton,
          rootStyle.shadow,
          isExist(item) && styles.activeListTab,
        ]}
        onPress={() => onService(item)}>
        <Text style={[styles.itemName, isExist(item) && styles.activeName]}>
          {item.Name}
        </Text>
        <Text style={styles.itemPrice}>${get(item, 'Price.Amount', 0)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  seprator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.seprator,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  listButton: {
    minHeight: 60,
    width: '88%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  noticeIcon: {
    transform: [{rotate: '180deg'}],
  },
  itemName: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  activeListTab: {
    backgroundColor: Colors.yellow,
  },
  activeName: {
    fontFamily: Fonts.AvenirNextMedium,
  },
  flatContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
