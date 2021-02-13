import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Header from 'components/Header/Header';
import PromoInput from 'components/PromoInput';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import moment from 'moment';
import BookingTab from 'components/BookingTab';
import {
  applyPromoCode,
  createAppointment,
  createGuestAppointment,
} from '../thunks';
import Indicator from 'components/Indicator';
import {getAppointments} from 'screens/Dashboard/thunks';
import { cancelItinerary, cancelAppt } from 'services';

const Review = ({navigation, route}) => {
  const [isChecked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const isLoading = useSelector((state) => state.booking.bookingLoading);
  const isPromo = useSelector((state) => state.booking.isPromoLoad);
  const fromEdit = useSelector((state) => state.booking.fromEdit);
  const promoInfo = useSelector((state) => state.booking.promoData);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [estimateTotal, setTotal] = useState(0);
  const [isAddon, setisAddOn] = useState(false);

  console.log('TotalGuests:', totalGuests);

  useEffect(() => {
    calculateTotal();
    checkAddonData();
    if (totalGuests.length > 1) {
      guestList();
    }
  }, []);

  const checkAddonData = () => {
    let isAddon = totalGuests.some((e) => e.addons && e.addons.length);
    setisAddOn(isAddon);
  };

  const calculateTotal = () => {
    const totalPrice = totalGuests.reduce((acc, e) => {
      let addonPrice = 0;
      if (get(e, 'addons')) {
        addonPrice = e.addons.reduce(
          (val, item) => get(item, 'Price.Amount', 0) + val,
          0,
        );
      }

      return acc + get(e.services, 'Price.Amount', 0) + addonPrice;
    }, 0);

    setTotal(totalPrice);
  };

  const bookAppt = () => {

    const startTime = get(totalGuests, '[0].date.time.startDateTime', '')
    const timezone = get(totalGuests, '[0].date.time.timezone', '')
    const endTime = moment(startTime).add(get(totalGuests, '[0].services.TotalDuration', 45), 'minutes').utcOffset(timezone).format('YYYY-MM-DDTHH:mm:ssZ')

    let obj = {
      AppointmentDateOffset: get(totalGuests, '[0].date.time.startDateTime', ''),
      AppointmentTreatmentDTOs: [
        {
          EmployeeID: get(totalGuests, '[0].employees', ''),
          StartTimeOffset: startTime,
          EndTimeOffset: endTime,
          TreatmentID: get(totalGuests, '[0].services.ID'),
          RoomID: get(totalGuests, '[0].rooms'),
        },
      ],
      Customer: {
        FirstName: get(userInfo, 'profile.firstName', ''),
        LastName: get(userInfo, 'profile.lastName', ''),
        Email: get(userInfo, 'profile.email', ''),
        HomePhone: get(userInfo, 'profile.mobilePhone', ''),
        ID: get(userInfo, 'profile.bookerId', ''),
        SendEmail: true
      },
      // AppointmentPayment: {
      //   CouponCode: get(promoInfo, 'CouponCode', ''),
      // },
      ResourceTypeID: 1,
      LocationID: get(selectedLocation, 'bookerLocationId', ''),
      // LocationID:'1639',
      Notes: route.params.Notes || ''
    };

    console.log('apt obj>>>>>', obj);

    dispatch(createAppointment(obj)).then((res) => {
      if (res.payload && res.payload.IsSuccess) {
        dispatch(getAppointments(get(userInfo, 'profile.bookerId', '')));
        navigation.navigate('Confirmation', {
          apptInfo: res.payload.Appointment,
        });
      }
    });
  };

  const guestList = () => {
    const guestData = []
    for (let i = 0; i < totalGuests.length; i++) {
      const startTime = totalGuests[i]?.date.time.startDateTime;
      const timezone = totalGuests[i]?.date.time.timezone;
      const endTime = moment(startTime).add(totalGuests[i]?.services.TotalDuration, 'minutes').utcOffset(timezone).format('YYYY-MM-DDTHH:mm:ssZ')
      const guestObj = {
        EmployeeID: totalGuests[i]?.employees,
        RoomID: totalGuests[i]?.rooms,
        StartDateTimeOffset: startTime,
        EndDateTimeOffset: endTime,
        TreatmentID: totalGuests[i]?.services.ID,
        Guest: {
          FirstName: get(userInfo, 'profile.firstName', ''),
          LastName: get(userInfo, 'profile.lastName', ''),
          Email: get(userInfo, 'profile.email', ''),
          HomePhone: get(userInfo, 'profile.mobilePhone', ''),
          ID: get(userInfo, 'profile.bookerId', ''),
        },
        AppointmentNotes: totalGuests[i].extension && totalGuests[i].extension.name === 'Yes' ? `Extensions added. ${route.params.Notes || ''}` : route.params.Notes || '',
      };
      guestData.push(guestObj);
    }
    return guestData
  };

  const bookApptGuest = () => {
    let obj = {
      LocationID: get(selectedLocation, 'bookerLocationId', ''),
      GroupName: `${get(userInfo, 'profile.firstName', '')}'s friends`,
      ItineraryItems: guestList(),
    };

    dispatch(createGuestAppointment(obj)).then((res) => {
      if (res.payload && res.payload.IsSuccess) {
        dispatch(getAppointments(get(userInfo, 'profile.bookerId', '')));
        navigation.navigate('Confirmation', {
          apptInfo: res.payload.Appointment,
        });
      }
    });
  };

  const editAppt = async () => {
    if (!fromEdit.group) {
      await cancelAppt(fromEdit.appointment);
    } else {
      await cancelItinerary(fromEdit.group, fromEdit.oldLocation);
    }

    if (totalGuests.length === 1) {
      bookAppt();
    } else {
      bookApptGuest();
    }

  };

  const onApply = (code) => {
    dispatch(
      applyPromoCode(get(selectedLocation, 'bookerLocationId', ''), code),
    );
  };

  // console.log('selectedLocation', selectedLocation);
  // console.log('CouponCode', promoInfo);

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <Header title="REVIEW" safeBackColor={Colors.bg} />

      <View style={rootStyle.innerContainer}>
        <ScrollView>
          <View style={styles.locContainer}>
            <Text style={styles.headerText}>Location</Text>

            <Text style={styles.titleText}>{selectedLocation.title}</Text>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => navigation.popToTop()}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Service</Text>
            {totalGuests.map((e, i, arr) => (
              <View key={i} style={styles.flexContainer}>
                {arr.length > 1 ? (
                  <Text style={[styles.titleText, styles.basisContainer]}>
                    {get(e, 'userType')}
                  </Text>
                ) : null}

                <Text
                  style={[
                    styles.titleText,
                    {width: arr.length > 1 ? '68%' : '85%'},
                  ]}>
                  {get(e.services, 'Name', '')}{' '}
                  <Text style={styles.price}>
                    (${get(e.services, 'Price.Amount', '')})
                  </Text>
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => navigation.navigate('Services')}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Add-ons</Text>

            {!isAddon ? (
              <Text style={styles.titleText}>Empty </Text>
            ) : (
              totalGuests.map((e, i, arr) => {
                if (get(e, 'addons')) {
                  return e.addons.map((item, index) => (
                    <View key={index} style={styles.flexContainer}>
                      {arr.length > 1 ? (
                        <Text style={[styles.titleText, styles.basisContainer]}>
                          {get(e, 'userType')}
                        </Text>
                      ) : null}

                      <Text
                        style={[
                          styles.titleText,
                          {width: arr.length > 1 ? '70%' : '85%'},
                        ]}>
                        {get(item, 'Name', '')}{' '}
                        <Text style={styles.price}>
                          (${get(item, 'Price.Amount', '')})
                        </Text>
                      </Text>
                    </View>
                  ));
                }
              })
            )}

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => navigation.navigate('Addons')}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Date & Time</Text>

            {totalGuests.length > 1 ? (
              <Text style={styles.titleText}>
                {moment(get(totalGuests, '[0].date.time.startDateTime')).utcOffset(get(totalGuests, '[0].date.time.timezone')).format(
                  'MMMM DD, YYYY',
                )}
              </Text>
            ) : null}

            {totalGuests.map((e, i, arr) =>
              arr.length > 1 ? (
                <>
                  <View style={[styles.flexContainer, {marginTop: 10}]}>
                    <Text style={[styles.titleText, styles.basisContainer]}>
                      {get(e, 'userType')}
                    </Text>
                    <Text style={styles.titleText}>
                      {moment(e.date.time.startDateTime).utcOffset(e.date.time.timezone).format('h:mm a')}
                    </Text>
                  </View>
                </>
              ) : (
                <Text key={i} style={styles.titleText}>
                  {moment(e.date.time.startDateTime).utcOffset(e.date.time.timezone).format('MMMM DD, YYYY')} at{' '}
                  {moment(e.date.time.startDateTime).utcOffset(e.date.time.timezone).format('h:mm a')}
                </Text>
              ),
            )}
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => navigation.navigate('DateTime')}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <PromoInput onApply={onApply} />

          <View style={styles.totalContainer}>
            <Text style={styles.titleText}>Estimated Total *</Text>
            <Text style={[styles.headerText, styles.price, {fontSize: 18}]}>
              ${estimateTotal - get(promoInfo, 'DiscountAmount', 0)}
            </Text>
          </View>

          <View style={styles.cancelContainer}>
            <Entypo
              name="circle-with-minus"
              color={Colors.header_title}
              size={20}
            />
            <Text style={styles.cancelText}>Cancellation & No-Show Policy</Text>
          </View>

          <Text style={styles.notice}>
            You may cancel up to 2 hours before the start of your appointment...
          </Text>

          <CheckBox
            isChecked={isChecked}
            onPressed={() => setChecked(!isChecked)}
            titile="Yes, I understand this policy"
          />

          <Button
            disabled={!isChecked}
            name={
              fromEdit ? 'Update this Appointment' : 'Book this Appointment'
            }
            containerStyle={{marginTop: 10}}
            onButtonPress={() => {
              fromEdit
                ? editAppt()
                : totalGuests.length > 1
                ? bookApptGuest()
                : bookAppt();
            }}
          />

          <Text style={styles.notice}>
            You will not be charged until after your appointment
          </Text>

          <View style={styles.bottomContainer}>
            <Text style={styles.notice}>*</Text>
            <Text style={[styles.notice, {marginLeft: 10}]}>
              If you are a BarFly member then we would communicate things
              related to that here. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Aenean euismod bibendum laoreet.
            </Text>
          </View>
        </ScrollView>
      </View>

      {isLoading || isPromo ? <Indicator /> : null}
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  locContainer: {
    minHeight: 90,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    ...rootStyle.shadow,
  },
  headerText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  titleText: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 2,
  },
  boxContainer: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 8,
    minHeight: 90,
    ...rootStyle.shadow,
    paddingVertical: 10,
  },
  price: {
    fontFamily: Fonts.AvenirNextMedium,
  },
  totalContainer: {
    height: 68,
    backgroundColor: Colors.dimGray,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 5,
  },
  cancelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  cancelText: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
    marginLeft: 10,
  },
  notice: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 30,
  },
  editContainer: {
    position: 'absolute',
    right: 10,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  basisContainer: {
    flexBasis: '30%',
  },
});
