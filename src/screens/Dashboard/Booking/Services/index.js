import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Header from 'components/Header/Header';
import rootStyle from 'rootStyle';
import CheckBox from 'components/Checkbox';
import {Colors, Fonts} from 'constant';
import GuestTab from 'components/GuestTab';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {getServices, setmemberCount} from '../thunks';
import {get} from 'lodash';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import Indicator from 'components/Indicator';
import ServiceInfoModal from 'components/ServiceInfoModal';
import MParticle from "react-native-mparticle";

const Services = ({navigation}) => {
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const activeUser = useSelector((state) => state.booking.activeGuestTab);
  const data = useSelector((state) => state.booking.services);
  const isLoading = useSelector((state) => state.booking.serviceLoading);
  const extensionAddon = useSelector((state) => state.booking.extensionAddon);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const [isChecked, setChecked] = useState(true);
  const [isInfo, setInfo] = useState(false);
  const [infoItem, setinfoItem] = useState({});

  useEffect(() => {
    // alert(JSON.stringify(selectedLocation));
    getData();
  }, []);

  const getData = () => {
    dispatch(getServices(get(selectedLocation, 'bookerLocationId', '')));
    // dispatch(getServices(get(selectedLocation, 'bookerLocationId', '')));
  };

  const onServiceList = (item) => {
    MParticle.logEvent('Select Service', MParticle.EventType.Other, {
      'Source Page': 'Select Service',
      'Service Name': get(item, 'Name'),
    });
    let tempArr = [...totalGuests];

    if (!isChecked) {
      tempArr = tempArr.map((user) => ({
        ...user,
        services: item
      }))
    } else {
      tempArr[activeUser].services = item;
    }

    dispatch(setmemberCount(tempArr));
    onNext(tempArr);
  };

  const onNext = (tempArr) => {
    let isServices = tempArr.every((e) => e.services);
    if (isServices) {
      navigation.navigate('Addons');
    }
  };

  // console.log('data>>>>.', data);

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <Header
        title="WHAT SERVICE?"
        safeBackColor={Colors.bg}
        // isNext
        // onNext={onNext}
      />
      <View style={rootStyle.innerContainer}>
        <FlatList
          style={{marginBottom: '20%'}}
          contentContainerStyle={styles.flatContainer}
          data={data}
          renderItem={(e) => (
            <ServiceItem
              {...e}
              isInto={!isChecked && totalGuests.length > 1}
              totalGuests={totalGuests}
              onService={onServiceList}
              activeUser={activeUser}
              onInfo={(item) => {
                console.log('onSelect:', item)
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
                  titile="My guests and I will be will be getting different services"
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
  isInto,
  totalGuests,
  onService,
  activeUser,
  onInfo,
}) => {
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

  return (
    <View style={styles.listContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={20}
        style={styles.noticeIcon}
        color={Colors.header_title}
        onPress={() => onInfo(item)}
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
        {isInto ? (
          <Text style={styles.itemPrice}>
            ${get(item, 'Price.Amount', 0)} x {totalGuests.length} = $
            {get(item, 'Price.Amount', 0) * totalGuests.length}
          </Text>
        ) : (
          <Text style={styles.itemPrice}>${get(item, 'Price.Amount', 0)}</Text>
        )}
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
